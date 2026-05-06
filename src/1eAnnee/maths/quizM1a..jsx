import React, { useState, useEffect } from "react";
import { BookOpen, Award, Loader2, Star, Rocket, PartyPopper, ChevronRight, ChevronLeft } from "lucide-react";
import confetti from 'canvas-confetti';

import data from "./data.json"; 

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwargP49tJyzbPaLaRSX5KT8Fb4v6C3gUnsLO8GKtzA7oS0IFMFSPJ1QGvVHdETP1RSMQ/exec";

const estUneImage = (texte) => {
  return typeof texte === 'string' && /\.(png|jpe?g|gif|svg|webp)$/i.test(texte);
};

export default function MathematiqueJunior() {
  const [etape, setEtape] = useState("login");
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [partieActive, setPartieActive] = useState(1);
  const [resultats, setResultats] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  // RÉCUPÉRATION DYNAMIQUE DES THÈMES
  const themesKeys = Object.keys(data.themes); 
  const totalThemes = themesKeys.length;

  const [reponses, setReponses] = useState(() => {
    const init = {};
    themesKeys.forEach(key => init[key] = {});
    return init;
  });

  const [score, setScore] = useState({});

  // --- FONCTIONS UTILITAIRES ---
  
  // Cette fonction manquait dans le code précédent
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

  // Effet de confettis pour la victoire
  useEffect(() => {
    if (resultats) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF69B4', '#00CED1', '#ADFF2F']
      });
    }
  }, [resultats]);

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
          email, eleve: nom, date: dateStr,
          matiere: data.matiere, domaine: key,
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
      <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-8 border-b-8 border-sky-400 text-center">
          <div className="bg-sky-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto -mt-16 border-4 border-white shadow-lg">
            <Rocket className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-sky-600 mt-6 mb-2">{data.matiere}</h1>
          <p className="text-gray-500 font-medium mb-8">Prêt pour l'aventure ?</p>
          <div className="space-y-4">
            <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Ton Prénom" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-sky-400 outline-none transition-all text-lg font-bold" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ton Email" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-sky-400 outline-none transition-all font-bold" />
            <button onClick={() => setEtape("quiz")} disabled={!nom || !email} className="w-full py-5 rounded-2xl font-black text-xl text-white bg-orange-400 hover:bg-orange-500 transform transition active:scale-95 disabled:bg-gray-300 shadow-[0_6px_0_rgb(234,145,51)] active:shadow-none">
              C'EST PARTI !
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
      <div className="min-h-screen bg-yellow-50 p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-t-8 border-yellow-400 text-center max-w-lg w-full relative overflow-hidden">
          <PartyPopper className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-black text-gray-800 mb-2">BRAVO {nom} !</h1>
          <p className="text-xl text-gray-500 mb-8">Tu as terminé tes exercices !</p>
          <div className="grid grid-cols-1 gap-3 mb-8">
            {themesKeys.map(key => (
              <div key={key} className="flex items-center bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
                <Star className="text-yellow-400 mr-3 fill-yellow-400" />
                <span className="flex-1 text-left font-bold text-gray-600">{data.themes[key].domaine}</span>
                <span className="bg-sky-100 text-sky-600 px-4 py-1 rounded-full font-black">{score[key]} / {data.themes[key].questions.length}</span>
              </div>
            ))}
          </div>
          <div className="bg-green-100 p-6 rounded-3xl border-b-8 border-green-200">
            <p className="text-green-600 font-bold uppercase text-sm">Score Total</p>
            <div className="text-5xl font-black text-green-700">{score.total} <span className="text-2xl text-green-500">/ {totalQuestions}</span></div>
          </div>
        </div>
        {envoiEnCours && <div className="mt-8 flex items-center gap-3 text-sky-500 font-bold"><Loader2 className="animate-spin" /> Enregistrement...</div>}
      </div>
    );
  }

  // --- ÉCRAN QUIZ ---
  return (
    <div className="min-h-screen bg-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* PROGRESS BAR */}
        <div className="bg-white p-4 rounded-3xl shadow-sm mb-6 flex items-center gap-4">
          <div className="flex-1 bg-gray-100 h-4 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${(partieActive / totalThemes) * 100}%` }}></div>
          </div>
          <span className="font-black text-indigo-600">{partieActive} / {totalThemes}</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
          <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
            <div>
              <p className="text-indigo-200 font-bold uppercase text-xs mb-1">Activité</p>
              <h2 className="text-3xl font-black">{data.themes[themesKeys[partieActive - 1]].domaine}</h2>
            </div>
            <BookOpen className="w-10 h-10 opacity-50" />
          </div>

          <div className="p-6 md:p-10">
            <div className="space-y-12">
              {getQuestions(partieActive).map((q, i) => (
                <div key={i} className="relative">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="bg-orange-100 text-orange-500 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="font-bold text-2xl text-gray-800 pt-1">{q.q}</p>
                  </div>
                  
                  {q.image && (
                    <div className="mb-6 flex justify-center p-4 bg-gray-50 rounded-3xl border-4 border-dashed border-gray-100">
                      <img src={q.image} alt="Exercice" className="max-w-full h-auto rounded-2xl" style={{ maxHeight: "300px" }} />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, j) => {
                      const estSelectionne = reponses[themesKeys[partieActive - 1]][i] === j;
                      return (
                        <button
                          key={j}
                          onClick={() => handleReponse(partieActive, i, j)}
                          className={`p-6 text-left rounded-3xl border-4 transition-all ${
                            estSelectionne 
                            ? "bg-indigo-600 border-indigo-700 text-white shadow-[0_8px_0_0_rgba(67,56,202,1)] -translate-y-1" 
                            : "bg-white border-gray-100 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${estSelectionne ? "bg-indigo-400 text-white" : "bg-gray-100 text-gray-400"}`}>
                              {String.fromCharCode(65 + j)}
                            </div>
                            <div className="flex-1">
                              {estUneImage(opt) ? (
                                <img src={opt} alt="Option" className="max-w-full h-auto max-h-24 mx-auto rounded-lg" />
                              ) : (
                                <span className="text-xl font-bold">{opt}</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 flex items-center justify-between">
              <button 
                disabled={partieActive === 1} 
                onClick={() => setPartieActive(partieActive - 1)} 
                className="flex items-center gap-2 px-6 py-4 font-bold text-gray-400 hover:text-indigo-600 disabled:opacity-0"
              >
                <ChevronLeft /> Retour
              </button>
              
              {partieActive < totalThemes ? (
                <button 
                  disabled={!partieComplete(partieActive)} 
                  onClick={() => setPartieActive(partieActive + 1)}
                  className={`px-12 py-5 rounded-2xl font-black text-xl text-white transition-all ${
                    partieComplete(partieActive) 
                    ? "bg-green-500 shadow-[0_8px_0_0_rgb(34,197,94)] active:shadow-none active:translate-y-1" 
                    : "bg-gray-200 cursor-not-allowed"
                  }`}
                >
                  SUIVANT <ChevronRight className="inline" />
                </button>
              ) : (
                <button 
                  disabled={!partieComplete(totalThemes)} 
                  onClick={terminerQuiz}
                  className={`px-12 py-5 rounded-2xl font-black text-xl text-white transition-all ${
                    partieComplete(totalThemes) 
                    ? "bg-orange-500 shadow-[0_8px_0_0_rgb(249,115,22)] active:shadow-none active:translate-y-1" 
                    : "bg-gray-200 cursor-not-allowed"
                  }`}
                >
                  VOIR MES ÉTOILES !
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}