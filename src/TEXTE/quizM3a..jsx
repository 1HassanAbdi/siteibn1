import React, { useState } from "react";
import { BookOpen, Award, Loader2, CheckCircle } from "lucide-react";

import data from "./3E/Revision1 copy 4.json"; 

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLZp0igZS7YoitOLP_HzojLbUOplOla2d_GoLny-EPAZKfa-5sbwi_7dOynkHNGw91vw/exec";

// Petite fonction pour vérifier si une chaîne de caractères est un lien d'image
const estUneImage = (texte) => {
  return typeof texte === 'string' && /\.(png|jpe?g|gif|svg|webp)$/i.test(texte);
};

export default function QuizOQREM3a() {
  const [etape, setEtape] = useState("login");
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [partieActive, setPartieActive] = useState(1);
  const [resultats, setResultats] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  // RÉCUPÉRATION DYNAMIQUE DES THÈMES
  const themesKeys = Object.keys(data.themes); 
  const totalThemes = themesKeys.length;

  // Initialisation dynamique des réponses
  const [reponses, setReponses] = useState(() => {
    const init = {};
    themesKeys.forEach(key => init[key] = {});
    return init;
  });

  const [score, setScore] = useState({});

  // 🔧 UTILS
  const getQuestions = (indexPartie) => {
    const themeKey = themesKeys[indexPartie - 1];
    return data.themes[themeKey]?.questions || [];
  };

  const partieComplete = (indexPartie) => {
    const themeKey = themesKeys[indexPartie - 1];
    const questions = getQuestions(indexPartie);
    if (questions.length === 0) return false;
    return questions.every((_, i) => reponses[themeKey][i] !== undefined);
  };

  const handleReponse = (indexPartie, indexQuestion, val) => {
    const themeKey = themesKeys[indexPartie - 1];
    setReponses(prev => ({
      ...prev,
      [themeKey]: { ...prev[themeKey], [indexQuestion]: val }
    }));
  };

  // 📡 ENVOI VERS GOOGLE SHEET
  const envoyerEnArrierePlan = async (scoresFinaux, reponsesEleve) => {
    setEnvoiEnCours(true);
    const maintenant = new Date();
    const dateStr = `${maintenant.getDate().toString().padStart(2, '0')}/${(maintenant.getMonth() + 1).toString().padStart(2, '0')}/${maintenant.getFullYear()}`;

    const envois = themesKeys.map(key => {
      const questions = data.themes[key].questions;
      const s = scoresFinaux[key];
      const detailsQuestions = questions.map((q, index) => reponsesEleve[key][index] === q.r ? 1 : 0);

      return fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          email: email,
          eleve: nom,
          date: dateStr,
          matiere: data.matiere,
          domaine: key,
          partie: data.themes[key].domaine,
          note: Math.round((s / questions.length) * 20),
          details: detailsQuestions
        })
      });
    });

    await Promise.all(envois);
    setEnvoiEnCours(false);
  };

  const terminerQuiz = () => {
    const nouveauxScores = {};
    themesKeys.forEach(key => {
      let pts = 0;
      data.themes[key].questions.forEach((q, i) => {
        if (reponses[key][i] === q.r) pts++;
      });
      nouveauxScores[key] = pts;
    });

    const totalPoints = Object.values(nouveauxScores).reduce((a, b) => a + b, 0);
    setScore({ ...nouveauxScores, total: totalPoints });
    setResultats(true);
    envoyerEnArrierePlan(nouveauxScores, reponses);
  };

  // --- ÉCRAN LOGIN ---
  if (etape === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border-t-8 border-amber-500">
          <h1 className="text-2xl font-bold text-center mb-6">{data.matiere}</h1>
          <div className="space-y-4">
            <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom de l'élève" className="w-full p-3 border-2 rounded-xl" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email institutionnel" className="w-full p-3 border-2 rounded-xl" />
            <button onClick={() => setEtape("quiz")} disabled={!nom || !email} className="w-full py-4 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition disabled:bg-gray-300">
              Commencer le quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ÉCRAN RÉSULTATS ---
  if (resultats) {
    const totalQuestions = themesKeys.reduce((acc, key) => acc + data.themes[key].questions.length, 0);
    return (
      <div className="min-h-screen bg-green-50 p-8 flex flex-col items-center justify-center">
        <Award className="w-20 h-20 text-yellow-500 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-6 text-center">Félicitations, {nom} !</h1>
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
          {themesKeys.map(key => (
            <div key={key} className="flex justify-between border-b py-2">
              <span className="font-medium text-gray-600">{data.themes[key].domaine} :</span>
              <span className="font-bold text-indigo-600">{score[key]} / {data.themes[key].questions.length}</span>
            </div>
          ))}
          <div className="text-center text-2xl font-bold pt-4 text-green-700 border-t">
            Score Total : {score.total} / {totalQuestions}
          </div>
        </div>
        {envoiEnCours && <div className="mt-4 flex items-center gap-2 text-blue-500"><Loader2 className="animate-spin" /> Enregistrement des résultats...</div>}
      </div>
    );
  }

  // --- ÉCRAN QUIZ (PRINCIPAL) ---
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600">
        
        {/* NAVIGATION DES THÈMES */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {themesKeys.map((key, i) => (
            <button
              key={key}
              onClick={() => (i === 0 || partieComplete(i)) && setPartieActive(i + 1)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition font-bold ${partieActive === i + 1 ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-500"}`}
            >
              {partieComplete(i+1) && "✓ "} {key.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* BLOC INSTRUCTIONS */}
        <div className="mb-8 p-5 bg-amber-50 rounded-xl border-l-4 border-amber-400 italic text-gray-800">
          <h3 className="font-bold not-italic mb-2 flex items-center gap-2"><BookOpen size={20}/> Instructions</h3>
          {data.texte}
        </div>

        {/* QUESTIONS DU THÈME ACTIF */}
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-2xl font-black text-indigo-900">{data.themes[themesKeys[partieActive - 1]].domaine}</h2>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">
              {partieActive} / {totalThemes}
            </span>
          </div>
          
          {getQuestions(partieActive).map((q, i) => (
            <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="font-bold text-lg mb-4 text-gray-800">{i + 1}. {q.q}</p>
              
              {/* AFFICHAGE DE L'IMAGE (Si elle existe dans le JSON) */}
              {q.image && (
                <div className="mb-6 flex justify-center">
                  <img 
                    src={q.image} 
                    alt={`Illustration question ${i+1}`}
                    className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
                    style={{ maxHeight: "250px" }}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt, j) => (
                  <button
                    key={j}
                    onClick={() => handleReponse(partieActive, i, j)}
                    className={`p-4 text-left rounded-xl border-2 transition-all flex items-center ${
                      reponses[themesKeys[partieActive - 1]][i] === j 
                      ? "bg-blue-600 text-white border-blue-700 shadow-md transform scale-[1.01]" 
                      : "bg-white text-gray-800 border-gray-200 hover:border-blue-300 shadow-sm"
                    }`}
                  >
                    <span className="inline-block flex-shrink-0 w-8 h-8 mr-3 text-center leading-8 rounded-full bg-black bg-opacity-10 text-sm font-bold">
                      {String.fromCharCode(65 + j)}
                    </span>
                    
                    {/* VÉRIFICATION ICI : IMAGE OU TEXTE */}
                    {estUneImage(opt) ? (
                      <div className="flex-1 bg-white p-1 rounded-lg">
                        <img 
                          src={opt} 
                          alt={`Option ${String.fromCharCode(65 + j)}`} 
                          className="max-w-full h-auto max-h-32 object-contain rounded"
                        style={{ maxHeight: "250px" }}
                       />
                      </div>
                    ) : (
                      <span>{opt}</span>
                    )}

                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* NAVIGATION BAS DE PAGE */}
        <div className="mt-12 flex justify-between border-t pt-6">
          <button 
            disabled={partieActive === 1} 
            onClick={() => setPartieActive(partieActive - 1)} 
            className="px-6 py-2 font-bold text-gray-400 hover:text-gray-600 disabled:opacity-0 transition"
          >
            ← Précédent
          </button>
          
          {partieActive < totalThemes ? (
            <button 
              disabled={!partieComplete(partieActive)} 
              onClick={() => setPartieActive(partieActive + 1)}
              className={`px-10 py-4 rounded-xl font-black text-white transition ${partieComplete(partieActive) ? "bg-blue-600 hover:bg-blue-700 shadow-lg" : "bg-gray-300 cursor-not-allowed"}`}
            >
              THÈME SUIVANT →
            </button>
          ) : (
            <button 
              disabled={!partieComplete(totalThemes)} 
              onClick={terminerQuiz}
              className={`px-10 py-4 rounded-xl font-black text-white transition ${partieComplete(totalThemes) ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg" : "bg-gray-300 cursor-not-allowed"}`}
            >
              TERMINER LE QUIZ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}