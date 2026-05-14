import React, { useState } from "react";
import { Award, Loader2, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import data from "./3E/oqre.json";

// --- CONFIGURATION ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbytYvoJ4Rg7RP9UqhgWChoa0S1A-jr0GvmiIAY7XmnHmayLZ7ymAQJRsK5ARYLt3oWJqQ/exec";

const RenderOptionContent = ({ opt }) => {
  if (opt && typeof opt === 'object' && opt.image) {
    return <img src={opt.image} alt="Option" className="max-h-60 w-auto object-contain mx-auto rounded-lg" />;
  }
  if (typeof opt === 'string' && /\.(png|jpe?g|gif|svg|webp)$/i.test(opt)) {
    return <img src={opt} alt="Option" className="max-h-32 w-auto object-contain mx-auto rounded-lg" />;
  }
  return (
    <span className="text-xl font-bold text-center w-full block" dangerouslySetInnerHTML={{ __html: opt }} />
  );
};

export default function QuizOQRE() {
  const [etape, setEtape] = useState("login"); 
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [partieActive, setPartieActive] = useState(1);
  const [resultats, setResultats] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [reponses, setReponses] = useState({}); 
  const [score, setScore] = useState({});

  const themesKeys = Object.keys(data.themes);
  const themeActuel = themesKeys[partieActive - 1];
  const questionsActuelles = data.themes[themeActuel]?.questions || [];

  // --- LOGIQUE DE VALIDATION CORRIGÉE (1 POINT PAR QUESTION) ---

  const verifierExactitude = (q, rep) => {
    // FIX : On vérifie si la réponse existe vraiment (ne pas utiliser !rep car 0 est valide)
    if (rep === undefined || rep === null || rep === "") return false;

    // 1. Cas Association (Objet) - ex: Q23
    if (typeof q.r === 'object' && !Array.isArray(q.r)) {
      const keys = Object.keys(q.r);
      return keys.every(key => q.r[key] === rep[key]);
    }

    // 2. Cas Séquence ou Multi-sélection (Tableau) - ex: Q11, Q16, Q22
    if (Array.isArray(q.r)) {
      // On convertit les index choisis par l'élève en valeurs réelles (A, B, C...) si le JSON utilise des valeurs
      const repValues = rep.map(val => (typeof val === 'number' ? q.options[val] : val));
      
      // On trie les deux tableaux pour comparer le contenu sans se soucier de l'ordre du clic
      const rTrié = [...q.r].sort();
      const repTriée = repValues.map(v => (typeof v === 'object' ? JSON.stringify(v) : v)).sort();
      
      return JSON.stringify(rTrié) === JSON.stringify(repTriée);
    }

    // 3. Cas QCM Classique
    // On compare la valeur (ex: "A") ou l'index
    const finalRep = (typeof q.r === 'string' && typeof rep === 'number') ? q.options[rep] : rep;
    return finalRep === q.r;
  };

  const questionEstRepondue = (q, rep) => {
    if (rep === undefined || rep === null) return false;
    if (q.type === "glisser_deposer" && typeof q.r === 'object' && !Array.isArray(q.r)) {
      return Object.keys(rep).length === Object.keys(q.r).length;
    }
    if (Array.isArray(q.r)) {
      return Array.isArray(rep) && rep.length === q.r.length;
    }
    return rep !== "";
  };

  const themeEstComplet = (indexPartie) => {
    const key = themesKeys[indexPartie - 1];
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
    let globalPoints = 0;
    let globalTotalQs = 0;
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
        const questions = data.themes[key].questions;
        const detailsQuestions = questions.map((q, index) => verifierExactitude(q, reponses[key]?.[index]) ? 1 : 0);

        return fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            eleve: nom,
            date: dateStr,
            matiere: data.matiere,
            domaine: key, 
            partie: data.themes[key].domaine,
            note: nouveauxScores[key],
            totalGlobal: `${globalPoints} / ${globalTotalQs}`,
            details: detailsQuestions
          })
        });
      });

      await Promise.all(envois);
      setResultats(true);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setEnvoiEnCours(false);
    }
  };

  if (etape === "login") {
    return (
      <div className="min-h-screen bg-amber-50 p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border-t-8 border-amber-500">
          <h1 className="text-2xl font-black text-center mb-6">{data.matiere}</h1>
          <div className="space-y-4">
            <input type="text" placeholder="Prénom et Nom" className="w-full p-4 border-2 rounded-xl outline-none focus:border-amber-500" onChange={e => setNom(e.target.value)} />
            <input type="email" placeholder="Email" className="w-full p-4 border-2 rounded-xl outline-none focus:border-amber-500" onChange={e => setEmail(e.target.value)} />
            <button disabled={!nom || !email} onClick={() => setEtape("quiz")} className="w-full py-4 rounded-xl font-bold text-white bg-amber-500 disabled:bg-gray-300">COMMENCER</button>
          </div>
        </div>
      </div>
    );
  }

  if (resultats) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
        <Award size={100} className="text-yellow-500 mb-4 animate-bounce" />
        <h2 className="text-4xl font-black mb-6">Bravo, {nom} !</h2>
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border-t-8 border-green-500">
          <p className="text-3xl font-bold text-indigo-600 mb-6">Score Total : {score.total} / {score.max}</p>
          <div className="space-y-4">
            {themesKeys.map(key => (
              <div key={key} className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-gray-700">{data.themes[key].domaine}</span>
                <span className="font-black text-green-600 px-3 py-1 bg-green-50 rounded-full">{score[key]} / {data.themes[key].questions.length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-2xl overflow-hidden">
        <div className="bg-slate-800 p-4 flex gap-2 overflow-x-auto no-scrollbar">
          {themesKeys.map((key, i) => (
            <button key={key} disabled={i > 0 && !themeEstComplet(i)} onClick={() => setPartieActive(i + 1)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${partieActive === i + 1 ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 disabled:opacity-30'}`}>
              {themeEstComplet(i+1) ? "✓ " : ""}{data.themes[key].domaine}
            </button>
          ))}
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-black text-slate-800 mb-8 border-l-8 border-blue-500 pl-4">{data.themes[themeActuel].domaine}</h2>
          
          <div className="space-y-16">
            {questionsActuelles.map((q, idx) => {
              const userRep = reponses[themeActuel]?.[idx];
              
              return (
                <div key={idx} className="border-b pb-12 last:border-0">
                  <div className="flex gap-4 mb-6">
                    <span className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-black shrink-0">{idx + 1}</span>
                    <h3 className="text-xl font-bold text-gray-800 leading-tight">{q.q}</h3>
                  </div>
                  
                  {q.image && <img src={q.image} className="mb-8 max-h-64 mx-auto rounded-xl shadow-sm border" alt="illustration" />}

                  {/* RENDU DES RÉPONSES ASSOCIATION (EXERCICE 23) */}
                  {q.type === "glisser_deposer" && typeof q.r === 'object' && !Array.isArray(q.r) ? (
                    <div className="space-y-8">
                      <div className="flex flex-wrap gap-4 justify-center bg-gray-50 p-6 rounded-2xl border-2 border-dashed">
                        {[...new Set(Object.values(q.r))].map((label, dIdx) => (
                          <div key={dIdx} draggable onDragStart={(e) => e.dataTransfer.setData("text", label)}
                            className="bg-white border-2 border-blue-200 px-6 py-3 rounded-xl shadow-md cursor-grab font-bold hover:bg-blue-50 text-blue-700">
                            {label}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        {Object.keys(q.r).map((expression, tIdx) => (
                          <div key={tIdx} className="flex flex-row items-center gap-6 bg-white p-4 rounded-[24px] border-2 border-slate-100 shadow-sm">
                            <div className="font-black text-xl text-slate-800 w-1/3 break-words">{expression}</div>
                            <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
                                const val = e.dataTransfer.getData("text");
                                handleChangementReponse(idx, { ...(userRep || {}), [expression]: val });
                              }} className={`flex-1 min-h-[120px] border-4 border-dashed rounded-2xl flex items-center justify-center p-6 transition-all ${userRep?.[expression] ? 'border-blue-500 bg-blue-50 text-blue-800 font-bold' : 'border-gray-300 bg-gray-50 text-gray-400 italic'}`}>
                              {userRep?.[expression] ? <span className="text-center text-lg">{userRep[expression]}</span> : "Dépose ici"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : q.type === "glisser_deposer" && Array.isArray(q.r) ? (
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} draggable onDragStart={(e) => e.dataTransfer.setData("text", opt)}
                            className="bg-white border-2 border-amber-300 px-4 py-2 rounded-lg cursor-grab font-bold shadow-sm">
                            {opt}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        {q.r.map((_, sIdx) => (
                          <div key={sIdx} onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
                              const val = e.dataTransfer.getData("text");
                              const newSeq = [...(userRep || Array(q.r.length).fill(""))];
                              newSeq[sIdx] = val;
                              handleChangementReponse(idx, newSeq);
                            }} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border-2 border-dashed">
                            <span className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold">{sIdx + 1}</span>
                            <div className="flex-1 h-12 bg-white rounded-lg border flex items-center px-4 font-bold text-blue-600">
                              {userRep?.[sIdx] || <span className="text-gray-300 italic">Dépose ici...</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* QCM ET MULTI-SÉLECTION (RÉPARE LE BUG DU POINT 0) */
                    <div className="grid md:grid-cols-2 gap-4">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = Array.isArray(q.r) ? userRep?.includes(oIdx) : userRep === oIdx;
                        return (
                          <button key={oIdx} onClick={() => Array.isArray(q.r) ? toggleMultiSelect(idx, oIdx) : handleChangementReponse(idx, oIdx)}
                            className={`p-6 border-4 rounded-2xl text-left transition-all flex items-center gap-4 ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' : 'border-gray-100 bg-white hover:border-blue-200'}`}>
                            <span className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center font-black ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
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

          <div className="flex justify-between mt-16 pt-8 border-t-4 border-gray-50">
            <button disabled={partieActive === 1} onClick={() => setPartieActive(p => p - 1)} 
              className="flex items-center gap-2 font-black text-gray-400 hover:text-gray-600 transition-all disabled:opacity-0">
              <ChevronLeft size={30} /> PRÉCÉDENT
            </button>
            {partieActive < themesKeys.length ? (
              <button disabled={!themeEstComplet(partieActive)} onClick={() => setPartieActive(p => p + 1)} 
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xl shadow-xl hover:bg-blue-700 disabled:bg-gray-200 flex items-center gap-2 transition-all">
                SUIVANT <ChevronRight size={30} />
              </button>
            ) : (
              <button disabled={!themeEstComplet(partieActive) || envoiEnCours} onClick={terminerQuiz} 
                className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-xl shadow-xl hover:bg-green-700 disabled:bg-gray-200 flex items-center gap-2 transition-all">
                {envoiEnCours ? <Loader2 className="animate-spin" /> : <CheckCircle size={30} />} TERMINER
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}