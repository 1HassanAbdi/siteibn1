import React, { useState, useEffect, useCallback } from "react";
import { Award, Loader2, CheckCircle, ChevronLeft, X } from "lucide-react";
import indexData from "./index.json";

// --- CONFIGURATION ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbytYvoJ4Rg7RP9UqhgWChoa0S1A-jr0GvmiIAY7XmnHmayLZ7ymAQJRsK5ARYLt3oWJqQ/exec";

// Utilitaire pour formater le chemin des images
const formatImagePath = (path) => {
  if (!path) return "";
  // Si c'est un lien externe (http) ou déjà à la racine (/), on laisse tel quel
  if (path.startsWith('http') || path.startsWith('/')) return path;
  // Sinon, on ajoute un / devant pour viser le dossier public
  return `/${path}`;
};

// --- COMPOSANT DE RENDU DES OPTIONS (IMAGES OU TEXTE) ---
const RenderOptionContent = ({ opt }) => {
  if (!opt) return null;
  const isImage = (typeof opt === 'object' && opt.image) || (typeof opt === 'string' && /\.(png|jpe?g|gif|svg|webp)$/i.test(opt));
  const imgSrc = typeof opt === 'object' ? opt.image : opt;

  if (isImage) {
    return (
      <div className="w-full flex items-center justify-center overflow-hidden">
        <img 
          src={formatImagePath(imgSrc)} 
          alt="Option" 
          className="w-full h-auto max-h-48 object-contain rounded-md block" 
        />
      </div>
    );
  }
  const isSymbol = typeof opt === 'string' && opt.length <= 2 && ["+", "-", "x", "÷", "×", "−", "=", "<", ">"].includes(opt);
  return <span className={`${isSymbol ? 'text-3xl' : 'text-lg'} font-bold text-center w-full block px-2`} dangerouslySetInnerHTML={{ __html: opt }} />;
};

// Préparation du chargement des fichiers JSON (Vite)
const jsonModules = import.meta.glob("./*.json");

export default function QuizOQRE3e6e() {
  const [niveau, setNiveau] = useState("");
  const [fichier, setFichier] = useState("");
  const [data, setData] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [error, setError] = useState(null);

  const [etape, setEtape] = useState("login");
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [partieActive, setPartieActive] = useState(1);
  const [resultats, setResultats] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [reponses, setReponses] = useState({});
  const [score, setScore] = useState({});

  // --- CHARGEMENT DYNAMIQUE ---
  const chargerData = useCallback(async () => {
    if (!fichier) return;
    setChargement(true);
    setError(null);

    try {
      // On cherche le fichier dans les modules chargés par glob
      const path = `./${fichier}`;
      if (!jsonModules[path]) {
        throw new Error(`Fichier ${fichier} introuvable.`);
      }
      const module = await jsonModules[path]();
      setData(module.default);
      return module.default; // Retourne les données pour usage immédiat
    } catch (err) {
      console.error("Erreur chargement JSON :", err);
      setError("Erreur : Fichier JSON introuvable dans le dossier.");
      return null;
    } finally {
      setChargement(false);
    }
  }, [fichier]);

  // --- LOGIQUE DE VALIDATION ---
  const themesKeys = data ? Object.keys(data.themes || {}) : [];
  const themeActuel = themesKeys[partieActive - 1] || "";
  const questionsActuelles = data?.themes?.[themeActuel]?.questions || [];

  const verifierExactitude = (q, rep) => {
    if (rep === undefined || rep === null) return false;
    if (q.type === "glisser_deposer" && typeof q.r === 'object' && !Array.isArray(q.r)) {
      const keys = Object.keys(q.r);
      return keys.every(key => rep[key] === q.r[key]);
    }
    if (Array.isArray(q.r)) {
      if (!Array.isArray(rep)) return false;
      if (q.type === "choix_multiple_multiple") {
        return rep.length === q.r.length && rep.every(val => q.r.includes(val));
      }
      return JSON.stringify(rep) === JSON.stringify(q.r);
    }
    if (typeof q.r === 'number') return rep === q.r;
    const optionChoisie = q.options[rep];
    const valeurChoisie = (typeof optionChoisie === 'object') ? optionChoisie.image : optionChoisie;
    return valeurChoisie === q.r;
  };

  const questionEstRepondue = (q, rep) => {
    if (rep === 0) return true;
    if (!rep) return false;
    if (q.type === "choix_multiple_multiple") return Array.isArray(rep) && rep.length > 0;
    if (q.type === "glisser_deposer" && typeof q.r === 'object' && !Array.isArray(q.r)) {
      return Object.keys(q.r).every(key => rep[key] && rep[key] !== "");
    }
    if (Array.isArray(q.r)) return Array.isArray(rep) && rep.length === q.r.length;
    return rep !== "";
  };

  const themeEstComplet = (indexPartie) => {
    const key = themesKeys[indexPartie - 1];
    if (!data?.themes[key]) return false;
    return data.themes[key].questions.every((q, i) => questionEstRepondue(q, reponses[key]?.[i]));
  };

  const handleChangementReponse = (indexQ, val) => {
    setReponses(prev => ({ ...prev, [themeActuel]: { ...prev[themeActuel], [indexQ]: val } }));
  };

  const toggleMultiSelect = (indexQ, optionIdx) => {
    const currentRep = reponses[themeActuel]?.[indexQ] || [];
    const newRep = currentRep.includes(optionIdx) ? currentRep.filter(i => i !== optionIdx) : [...currentRep, optionIdx];
    handleChangementReponse(indexQ, newRep);
  };

  const terminerQuiz = async () => {
    setEnvoiEnCours(true);
    let nouveauxScores = { total: 0 };
    let globalPoints = 0, globalTotalQs = 0;
    const dateStr = new Date().toLocaleString("fr-FR");

    themesKeys.forEach(key => {
      let ptsTheme = 0;
      data.themes[key].questions.forEach((q, i) => {
        if (verifierExactitude(q, reponses[key]?.[i])) ptsTheme++;
      });
      nouveauxScores[key] = ptsTheme;
      globalPoints += ptsTheme;
      globalTotalQs += data.themes[key].questions.length;
    });

    setScore({ ...nouveauxScores, total: globalPoints, max: globalTotalQs });

    try {
      const envois = themesKeys.map(key => {
        const detailsQuestions = data.themes[key].questions.map((q, index) => verifierExactitude(q, reponses[key]?.[index]) ? 1 : 0);
        return fetch(GOOGLE_SCRIPT_URL, {
          method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, eleve: nom, date: dateStr, matiere: data.matiere, domaine: key, partie: data.themes[key].domaine, note: nouveauxScores[key], totalGlobal: `${globalPoints} / ${globalTotalQs}`, details: detailsQuestions })
        });
      });
      await Promise.all(envois);
      setResultats(true);
    } catch (err) { alert("Erreur d'envoi."); } finally { setEnvoiEnCours(false); }
  };

  // ======================
  // 🔹 ÉCRAN DE LOGIN
  // ======================
  if (etape === "login") {
    return (
      <div className="min-h-screen bg-amber-50 p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border-t-8 border-amber-500">
          <h1 className="text-2xl font-black text-center mb-6">Préparation à l'OQRE</h1>
          <input type="text" placeholder="Nom de l'élève" value={nom} onChange={(e) => setNom(e.target.value)} className="w-full p-4 border-2 rounded-xl mb-4" />
          <select value={niveau} onChange={(e) => { setNiveau(e.target.value); setFichier(""); }} className="w-full p-4 border-2 rounded-xl mb-4">
            <option value="">Choisir un niveau</option>
            {Object.keys(indexData).map((niv) => <option key={niv} value={niv}>{niv.toUpperCase()}</option>)}
          </select>
          {niveau && (
            <select value={fichier} onChange={(e) => setFichier(e.target.value)} className="w-full p-4 border-2 rounded-xl mb-4">
              <option value="">Choisir un test</option>
              {indexData[niveau].map((file) => <option key={file} value={file}>{file.replace(".json", "").toUpperCase()}</option>)}
            </select>
          )}
          <input type="email" placeholder="Email (optionnel)" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 border-2 rounded-xl mb-6" />
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <button
            onClick={async () => {
              if (!nom.trim() || !niveau || !fichier|| !email) {
                setError("Veuillez remplir tous les champs.");
                return;
              }
              const loadedData = await chargerData();
              if (loadedData) setEtape("quiz");
            }}
            disabled={chargement}
            className="w-full py-4 rounded-xl font-bold text-white bg-amber-500 disabled:bg-gray-300 flex items-center justify-center gap-2"
          >
            {chargement ? <Loader2 className="animate-spin" /> : "COMMENCER"}
          </button>
        </div>
      </div>
    );
  }

  // ======================
  // 🔹 ÉCRAN DES RÉSULTATS
  // ======================
  if (resultats) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
        <Award size={100} className="text-yellow-500 mb-4 animate-bounce" />
        <h2 className="text-4xl font-black mb-6">Bravo, {nom} !</h2>
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border-t-8 border-green-500">
          <p className="text-3xl font-bold text-indigo-600 mb-6">{score.total} / {score.max}</p>
          <div className="space-y-4 text-left">
            {themesKeys.map(key => (
              <div key={key} className="flex justify-between items-center py-2 border-b">
                <span>{data.themes[key].domaine.split('.')[0]}</span>
                <span className="font-black text-green-600">{score[key]} / {data.themes[key].questions.length}</span>
              </div>
            ))}
          </div>
          <button onClick={() => window.location.reload()} className="mt-8 text-blue-500 font-bold underline">Recommencer</button>
        </div>
      </div>
    );
  }

  // ======================
  // 🔹 ÉCRAN DU QUIZ
  // ======================
  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-2xl overflow-hidden">
        <div className="bg-slate-800 p-4 flex gap-2 overflow-x-auto">
          {themesKeys.map((key, i) => (
            <button
              key={key}
              disabled={i > 0 && !themeEstComplet(i)}
              onClick={() => setPartieActive(i + 1)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${partieActive === i + 1 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 disabled:opacity-30'}`}
            >
              {themeEstComplet(i + 1) ? "✓ " : ""}{data.themes[key].domaine.split('.')[0]}
            </button>
          ))}
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-black text-slate-800 mb-8 border-l-8 border-blue-500 pl-4">{data.themes[themeActuel]?.domaine}</h2>
          <div className="space-y-16">
            {questionsActuelles.map((q, idx) => {
              const userRep = reponses[themeActuel]?.[idx];
              return (
                <div key={idx} className="border-b pb-12 last:border-0">
                  <div className="flex gap-4 mb-6">
                    <span className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-black shrink-0">{idx + 1}</span>
                    <h3 className="text-xl font-bold text-gray-800">{q.q}</h3>
                  </div>

                  {q.image && (
                    <div className="mb-8 w-full flex justify-center">
                      <img src={formatImagePath(q.image)} className="max-h-72 object-contain rounded-xl shadow-sm border" alt="exercice" />
                    </div>
                  )}

                  {q.type === "glisser_deposer" ? (
                    <div className="space-y-8">
                      <div className="flex flex-wrap gap-3 justify-center bg-blue-50 p-6 rounded-2xl border-2 border-dashed border-blue-200">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} draggable onDragStart={(e) => e.dataTransfer.setData("text", typeof opt === 'object' ? opt.image : opt)} className="bg-white border-2 border-blue-400 px-6 py-3 rounded-xl shadow-md font-bold cursor-grab">
                            <RenderOptionContent opt={opt} />
                          </div>
                        ))}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {(Array.isArray(q.r) ? q.r : Object.keys(q.r)).map((keyLabel, tIdx) => {
                          const targetKey = Array.isArray(q.r) ? tIdx : keyLabel;
                          const currentVal = userRep?.[targetKey];
                          return (
                            <div key={tIdx} className="bg-white p-4 rounded-2xl border-2 shadow-sm">
                              <div className="font-bold mb-2">{Array.isArray(q.r) ? `Choix ${tIdx + 1}` : keyLabel}</div>
                              <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
                                const val = e.dataTransfer.getData("text");
                                const newRep = Array.isArray(q.r) ? [...(userRep || [])] : { ...(userRep || {}) };
                                Array.isArray(q.r) ? (newRep[tIdx] = val) : (newRep[keyLabel] = val);
                                handleChangementReponse(idx, newRep);
                              }} className={`min-h-[70px] border-4 border-dashed rounded-xl flex items-center justify-between px-6 ${currentVal ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                                {currentVal ? <><RenderOptionContent opt={currentVal} /><X className="text-red-500 cursor-pointer" onClick={() => {
                                  const newRep = Array.isArray(userRep) ? [...userRep] : { ...userRep };
                                  Array.isArray(userRep) ? (newRep[tIdx] = "") : delete newRep[targetKey];
                                  handleChangementReponse(idx, newRep);
                                }} /></> : <span className="text-gray-300">Déposer ici</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = q.type === "choix_multiple_multiple" ? userRep?.includes(oIdx) : userRep === oIdx;
                        return (
                          <button key={oIdx} onClick={() => q.type === "choix_multiple_multiple" ? toggleMultiSelect(idx, oIdx) : handleChangementReponse(idx, oIdx)} className={`p-4 min-h-[100px] border-4 rounded-2xl flex items-center gap-4 transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'}`}>
                            <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center font-black ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                              {q.type === "choix_multiple_multiple" ? (isSelected ? "✓" : "") : String.fromCharCode(65 + oIdx)}
                            </div>
                            <RenderOptionContent opt={opt} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-16 pt-8 border-t-4">
            <button disabled={partieActive === 1} onClick={() => setPartieActive(p => p - 1)} className="font-black text-gray-400 disabled:opacity-0 flex items-center"><ChevronLeft size={30} /> PRÉCÉDENT</button>
            {partieActive < themesKeys.length ? (
              <button disabled={!themeEstComplet(partieActive)} onClick={() => setPartieActive(p => p + 1)} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl disabled:bg-gray-200">SUIVANT</button>
            ) : (
              <button disabled={!themeEstComplet(partieActive) || envoiEnCours} onClick={terminerQuiz} className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl disabled:bg-gray-200 flex items-center gap-2">
                {envoiEnCours ? <Loader2 className="animate-spin" /> : <CheckCircle size={30} />} TERMINER
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}