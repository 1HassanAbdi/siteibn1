import React, { useState } from "react";
import { BookOpen, Award, Loader2, CheckCircle } from "lucide-react";
import data from "./francais.json"; 

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyoLtJ-7-t60l_WMJC7pzosnhezkfJRBfvECEIKQFmDHr0vwTtK3UGv11JAV6G8XIkM/exec";

export default function QuizOQRE() {
  const [etape, setEtape] = useState("login");
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [partieActive, setPartieActive] = useState(1);
  const [resultats, setResultats] = useState(false);
  const [texteOuvert, setTexteOuvert] = useState(true);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  // Clés des thèmes basées sur votre JSON
  const themesKeys = ["COMPREHENSION", "VOCABULAIRE", "CONJUGAISON", "GRAMMAIRE"];
  
  const [reponses, setReponses] = useState({
    COMPREHENSION: {},
    VOCABULAIRE: {},
    CONJUGAISON: {},
    GRAMMAIRE: {},
    redaction: ""
  });

  const [score, setScore] = useState({
    COMPREHENSION: 0,
    VOCABULAIRE: 0,
    CONJUGAISON: 0,
    GRAMMAIRE: 0,
    total: 0
  });

  // 🔧 UTILS
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

  // 📡 ENVOI VERS GOOGLE SHEET
 // 🔥 VERSION OPTIMISÉE : Envoi en parallèle et arrière-plan
  const envoyerEnArrierePlan = async (scoresFinaux, reponsesEleve) => {
    const maintenant = new Date();
    const dateStr = `${maintenant.getDate().toString().padStart(2, '0')}/${(maintenant.getMonth() + 1).toString().padStart(2, '0')}/${maintenant.getFullYear()}`;

    // On prépare les 4 promesses d'envoi simultanées
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
        matiere: "Français",
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
      // 🚀 Envoie tout en même temps !
      await Promise.all(envois);
      console.log("Tous les thèmes ont été enregistrés.");
    } catch (e) {
      console.error("Erreur lors de l'enregistrement discret:", e);
    }
  };

  const terminerQuiz = () => {
    // 1. Calcul immédiat
    const nouveauxScores = {
      COMPREHENSION: calculerScoreTheme("COMPREHENSION"),
      VOCABULAIRE: calculerScoreTheme("VOCABULAIRE"),
      CONJUGAISON: calculerScoreTheme("CONJUGAISON"),
      GRAMMAIRE: calculerScoreTheme("GRAMMAIRE"),
    };
    const totalPoints = Object.values(nouveauxScores).reduce((a, b) => a + b, 0);
    
    setScore({ ...nouveauxScores, total: totalPoints });

    // 2. ON CHANGE L'ÉCRAN TOUT DE SUITE (L'élève ne voit pas d'attente)
    setResultats(true);

    // 3. ON ENVOIE EN SILENCE (Promise.all)
    envoyerEnArrierePlan(nouveauxScores, reponses);
  };

  // 1. ÉTAPE LOGIN
  if (etape === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <BookOpen className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-center mb-6">Connexion</h1>
          <div className="space-y-4">
            <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom de l'élève" className="w-full p-3 border-2 rounded-xl outline-none focus:border-amber-500" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email " className="w-full p-3 border-2 rounded-xl outline-none focus:border-amber-500" />
            <button onClick={() => setEtape("lecture")} disabled={!nom || !email} className="w-full py-4 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition disabled:bg-gray-300">
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ÉTAPE RÉSULTATS
  if (resultats) {
    const totalQuestions = themesKeys.reduce((acc, key) => acc + data.themes[key].questions.length, 0);
    return (
      <div className="min-h-screen bg-green-50 p-8 flex flex-col items-center justify-center">
        <Award className="w-20 h-20 text-yellow-500 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-6 text-center">Bravo {nom} !</h1>
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
          {themesKeys.map(key => (
            <div key={key} className="flex justify-between border-b py-2 italic">
              <span>{key} :</span>
              <span className="font-bold text-indigo-600">{score[key]} / {data.themes[key].questions.length}</span>
            </div>
          ))}
          <div className="text-center text-2xl font-bold pt-4 text-green-700">
            Total : {score.total} / {totalQuestions}
          </div>
        </div>
        {envoiEnCours && (
          <div className="mt-6 flex items-center gap-2 text-blue-600 font-medium">
            <Loader2 className="animate-spin" /> Envoi au professeur...
          </div>
        )}
      </div>
    );
  }

  // 3. ÉTAPE LECTURE / QUIZ
  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        
        {/* Navigation entre les thèmes */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {themesKeys.map((key, i) => (
            <button
              key={key}
              onClick={() => (i === 0 || partieComplete(i)) && setPartieActive(i + 1)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition font-medium ${partieActive === i + 1 ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-600"}`}
            >
              {partieComplete(i+1) && "✓ "} {key}
            </button>
          ))}
        </div>

        {/* Bloc Texte */}
        <div className="mb-6">
           <button onClick={() => setTexteOuvert(!texteOuvert)} className="flex items-center gap-2 text-amber-700 font-bold hover:underline">
             <BookOpen size={18} /> {texteOuvert ? "Cacher le texte" : "Afficher le texte de lecture"}
           </button>
           {texteOuvert && (
             <div className="mt-4 p-5 bg-amber-50 rounded-xl text-sm md:text-base leading-relaxed border-l-4 border-amber-400 shadow-sm italic text-gray-800">
               {data.texte}
             </div>
           )}
        </div>

        {/* Questions du thème actif */}
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-2xl font-black text-indigo-800 tracking-tight">{themesKeys[partieActive - 1]}</h2>
            <span className="text-sm font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
              Partie {partieActive} / 4
            </span>
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
                      ? "bg-blue-500 text-white border-blue-600 shadow-md transform scale-[1.02]" 
                      : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <span className="font-medium">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions bas de page */}
        <div className="mt-12 flex justify-between items-center border-t pt-6">
          <button 
            disabled={partieActive === 1}
            onClick={() => setPartieActive(partieActive - 1)}
            className="px-6 py-2 font-bold text-gray-500 disabled:opacity-0"
          >
            Précédent
          </button>

          {partieActive < 4 ? (
            <button 
              disabled={!partieComplete(partieActive)}
              onClick={() => setPartieActive(partieActive + 1)}
              className={`px-10 py-4 rounded-2xl font-black text-white transition-all ${partieComplete(partieActive) ? "bg-green-500 hover:bg-green-600 shadow-lg" : "bg-gray-300 cursor-not-allowed"}`}
            >
              THÈME SUIVANT
            </button>
          ) : (
            <button 
              disabled={!partieComplete(4)}
              onClick={terminerQuiz}
              className={`px-10 py-4 rounded-2xl font-black text-white transition-all ${partieComplete(4) ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg" : "bg-gray-300 cursor-not-allowed"}`}
            >
              TERMINER LE QUIZ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}