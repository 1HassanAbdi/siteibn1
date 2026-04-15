
import React, { useState } from "react";
import { BookOpen, Award, Loader2, CheckCircle, Calculator } from "lucide-react";
import francaisData from "./francais1.json"; 
import mathData from "./mathematique1.json";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyoLtJ-7-t60l_WMJC7pzosnhezkfJRBfvECEIKQFmDHr0vwTtK3UGv11JAV6G8XIkM/exec";

// 1. Configuration des examens
const EXAMENS_CONFIG = {
  "francais": {
    label: "Français",
    data: francaisData,
    color: "#2563eb",
    bg: "bg-blue-50",
    icon: <BookOpen />,
    gradient: "from-blue-600 to-indigo-700"
  },
  "mathematique": {
    label: "Mathématiques",
    data: mathData,
    color: "#059669",
    bg: "bg-emerald-50",
    icon: <Calculator />,
    gradient: "from-emerald-600 to-teal-700"
  }
};

export default function QuizOQRE() {
  // États de l'examen
  const [matiereActive, setMatiereActive] = useState("francais");
  const [etape, setEtape] = useState("login");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  
  // Accès dynamique aux données selon la matière
  const config = EXAMENS_CONFIG[matiereActive];
  const data = config.data;

  // États du Quiz
  const [partieActive, setPartieActive] = useState(1);
  const [resultats, setResultats] = useState(false);
  const [texteOuvert, setTexteOuvert] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const themesKeys = ["COMPREHENSION", "VOCABULAIRE", "CONJUGAISON", "GRAMMAIRE"];
  
  const [reponses, setReponses] = useState({
    COMPREHENSION: {}, VOCABULAIRE: {}, CONJUGAISON: {}, GRAMMAIRE: {}, redaction: ""
  });

  const [score, setScore] = useState({
    COMPREHENSION: 0, VOCABULAIRE: 0, CONJUGAISON: 0, GRAMMAIRE: 0, total: 0
  });

  // --- LOGIQUE ---
  const getQuestions = (indexPartie) => {
    const themeKey = themesKeys[indexPartie - 1];
    return data.themes[themeKey]?.questions || [];
  };

  const partieComplete = (indexPartie) => {
    const questions = getQuestions(indexPartie);
    if (questions.length === 0) return false;
    return questions.every((_, i) => 
      reponses[themesKeys[indexPartie - 1]][i] !== undefined
    );
  };

  const handleReponse = (indexPartie, indexQuestion, val) => {
    const themeKey = themesKeys[indexPartie - 1];
    setReponses(prev => ({
      ...prev,
      [themeKey]: { ...prev[themeKey], [indexQuestion]: val }
    }));
  };

  const calculerScoreTheme = (themeKey) => {
    let pts = 0;
    const qs = data.themes[themeKey].questions;
    qs.forEach((q, i) => {
      if (reponses[themeKey][i] === q.r) pts++;
    });
    return pts;
  };

  const envoyerEnArrierePlan = async (scoresFinaux, reponsesEleve) => {
    setEnvoiEnCours(true);
    const maintenant = new Date();
    const dateStr = `${maintenant.getDate().toString().padStart(2, '0')}/${(maintenant.getMonth() + 1).toString().padStart(2, '0')}/${maintenant.getFullYear()}`;

    const envois = themesKeys.map(key => {
      const s = scoresFinaux[key];
      const questions = data.themes[key].questions;
      const detailsQuestions = questions.map((q, index) => {
        return reponsesEleve[key][index] === q.r ? 1 : 0;
      });

      const payload = {
        email: email,
        eleve: nom,
        date: dateStr,
        matiere: config.label, // Dynamique !
        domaine: key,
        partie: data.themes[key].domaine,
        note: Math.round((s / questions.length) * 20),
        details: detailsQuestions
      };

      return fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
    });

    try {
      await Promise.all(envois);
      setEnvoiEnCours(false);
    } catch (e) {
      console.error("Erreur d'envoi:", e);
      setEnvoiEnCours(false);
    }
  };

  const terminerQuiz = () => {
    const nouveauxScores = {
      COMPREHENSION: calculerScoreTheme("COMPREHENSION"),
      VOCABULAIRE: calculerScoreTheme("VOCABULAIRE"),
      CONJUGAISON: calculerScoreTheme("CONJUGAISON"),
      GRAMMAIRE: calculerScoreTheme("GRAMMAIRE"),
    };
    const totalPoints = Object.values(nouveauxScores).reduce((a, b) => a + b, 0);
    setScore({ ...nouveauxScores, total: totalPoints });
    setResultats(true);
    envoyerEnArrierePlan(nouveauxScores, reponses);
  };

  // --- RENDU : ECRAN CONNEXION ---
  if (etape === "login") {
    return (
      <div className={`min-h-screen ${config.bg} flex items-center justify-center p-6 transition-all duration-500`}>
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8" style={{ borderColor: config.color }}>
          <div className={`p-8 bg-gradient-to-br ${config.gradient} text-white text-center`}>
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              {React.cloneElement(config.icon, { size: 32 })}
            </div>
            <h1 className="text-2xl font-black italic">EXAMEN OQRE 2026</h1>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Choisir la matière</label>
              <select 
                value={matiereActive}
                onChange={(e) => setMatiereActive(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-indigo-500 transition-all cursor-pointer"
              >
                {Object.keys(EXAMENS_CONFIG).map((key) => (
                  <option key={key} value={key}>{EXAMENS_CONFIG[key].label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <input type="text" placeholder="Nom de l'élève" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-400 outline-none transition-all" value={nom} onChange={(e) => setNom(e.target.value)} />
              <input type="email" placeholder="Email institutionnel" className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-400 outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <button 
              onClick={() => setEtape("quiz")} 
              disabled={!nom || !email}
              className={`w-full py-5 rounded-2xl font-black text-white shadow-lg transform active:scale-95 transition-all ${!nom || !email ? "bg-gray-200" : `bg-gradient-to-r ${config.gradient} hover:shadow-xl`}`}
            >
              COMMENCER LE TEST
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDU : ECRAN RESULTATS ---
  if (resultats) {
    const totalQuestions = themesKeys.reduce((acc, key) => acc + data.themes[key].questions.length, 0);
    return (
      <div className={`min-h-screen ${config.bg} p-8 flex flex-col items-center justify-center`}>
        <Award className="w-20 h-20 text-yellow-500 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-6 text-center">Bravo {nom} !</h1>
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
          {themesKeys.map(key => (
            <div key={key} className="flex justify-between border-b py-2 italic">
              <span>{key} :</span>
              <span className="font-bold" style={{ color: config.color }}>{score[key]} / {data.themes[key].questions.length}</span>
            </div>
          ))}
          <div className="text-center text-2xl font-bold pt-4 text-green-700">
            Total : {score.total} / {totalQuestions}
          </div>
        </div>
        {envoiEnCours && (
          <div className="mt-6 flex items-center gap-2 text-blue-600 font-medium italic">
            <Loader2 className="animate-spin" /> Enregistrement des notes...
          </div>
        )}
      </div>
    );
  }

  // --- RENDU : ECRAN QUIZ ---
  return (
    <div className={`min-h-screen ${config.bg} p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg border-t-4" style={{ borderColor: config.color }}>
        
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {themesKeys.map((key, i) => (
            <button
              key={key}
              onClick={() => (i === 0 || partieComplete(i)) && setPartieActive(i + 1)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition font-bold ${partieActive === i + 1 ? "text-white shadow-md" : "bg-gray-200 text-gray-500"}`}
              style={{ backgroundColor: partieActive === i + 1 ? config.color : "" }}
            >
              {partieComplete(i+1) && "✓ "} {key}
            </button>
          ))}
        </div>

        {data.texte && (
          <div className="mb-6">
            <button onClick={() => setTexteOuvert(!texteOuvert)} className="flex items-center gap-2 font-bold hover:underline" style={{ color: config.color }}>
              <BookOpen size={18} /> {texteOuvert ? "Cacher le texte" : "Afficher le texte de lecture"}
            </button>
            {texteOuvert && (
              <div className="mt-4 p-5 bg-white rounded-xl text-sm md:text-base leading-relaxed border-l-4 shadow-sm italic text-gray-800" style={{ borderColor: config.color }}>
                {data.texte}
              </div>
            )}
          </div>
        )}

        <div className="space-y-8">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-2xl font-black tracking-tight" style={{ color: config.color }}>{themesKeys[partieActive - 1]}</h2>
            <span className="text-sm font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600">Partie {partieActive} / 4</span>
          </div>
          
          {getQuestions(partieActive).map((q, i) => (
            <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="font-bold text-lg mb-4 text-gray-800">{i + 1}. {q.q}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt, j) => (
                  <button
                    key={j}
                    onClick={() => handleReponse(partieActive, i, j)}
                    className={`p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      reponses[themesKeys[partieActive - 1]][i] === j 
                      ? "text-white shadow-md transform scale-[1.02]" 
                      : "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                    style={{ 
                      backgroundColor: reponses[themesKeys[partieActive - 1]][i] === j ? config.color : "",
                      borderColor: reponses[themesKeys[partieActive - 1]][i] === j ? config.color : ""
                    }}
                  >
                    <span className="font-medium">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-between items-center border-t pt-6">
          <button disabled={partieActive === 1} onClick={() => setPartieActive(partieActive - 1)} className="px-6 py-2 font-bold text-gray-400 disabled:opacity-0">Précédent</button>
          {partieActive < 4 ? (
            <button 
              disabled={!partieComplete(partieActive)} 
              onClick={() => setPartieActive(partieActive + 1)}
              className={`px-10 py-4 rounded-2xl font-black text-white transition-all ${!partieComplete(partieActive) ? "bg-gray-300" : "hover:opacity-90 shadow-lg"}`}
              style={{ backgroundColor: partieComplete(partieActive) ? config.color : "" }}
            >
              THÈME SUIVANT
            </button>
          ) : (
            <button 
              disabled={!partieComplete(4)} 
              onClick={terminerQuiz}
              className={`px-10 py-4 rounded-2xl font-black text-white transition-all ${!partieComplete(4) ? "bg-gray-300" : "hover:opacity-90 shadow-lg"}`}
              style={{ backgroundColor: partieComplete(4) ? config.color : "" }}
            >
              TERMINER LE QUIZ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}