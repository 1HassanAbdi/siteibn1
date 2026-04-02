import React, { useState, useEffect } from "react";
import { BookOpen, Award, Loader2, CheckCircle, ChevronLeft } from "lucide-react";
import data from "./francais1.json"; 

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwM8Sekow_oXbgbnV0_TCGLTFdjL2ukBQzdH5Wb4OJt2OcknkqA6FS2syLjv8BYZgAD/exec";

// Fonction utilitaire pour mélanger un tableau
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function QuizOQREF() {
  const [etape, setEtape] = useState("login");
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [partieActive, setPartieActive] = useState(1);
  const [resultats, setResultats] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  
  // ✨ État pour stocker l'ordre aléatoire des options
  const [ordresOptions, setOrdresOptions] = useState({});

  const themesKeys = Object.keys(data.themes); 
  const totalThemes = themesKeys.length;

  const [reponses, setReponses] = useState(() => {
    const init = {};
    themesKeys.forEach(key => init[key] = {});
    return init;
  });

  const [score, setScore] = useState({});

  // 🎲 GÉNÉRATION DE L'ORDRE ALÉATOIRE AU LANCEMENT DU QUIZ
  useEffect(() => {
    if (etape === "quiz") {
      const nouvelOrdre = {};
      themesKeys.forEach(key => {
        nouvelOrdre[key] = data.themes[key].questions.map(q => 
          // On crée des objets { texte, indexOriginal } puis on mélange
          shuffleArray(q.options.map((opt, idx) => ({ opt, idx })))
        );
      });
      setOrdresOptions(nouvelOrdre);
    }
  }, [etape]);

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

  const handleReponse = (indexPartie, indexQuestion, valOriginale) => {
    const themeKey = themesKeys[indexPartie - 1];
    setReponses(prev => ({
      ...prev,
      [themeKey]: { ...prev[themeKey], [indexQuestion]: valOriginale }
    }));
  };

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

  if (etape === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-amber-500 transform transition-all">
          <div className="flex justify-center mb-4 text-amber-500"><BookOpen size={48}/></div>
          <h1 className="text-3xl font-black text-center mb-2 text-slate-800 tracking-tight uppercase italic">{data.matiere}</h1>
          <p className="text-center text-slate-400 text-xs font-bold uppercase mb-8 tracking-widest">Portail Élève - Ecole Ibn Batouta</p>
          
          <div className="space-y-4">
            <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Ton Nom et Prénom" className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-amber-400 outline-none transition-all font-bold" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email institutionnel" className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-amber-400 outline-none transition-all font-bold" />
            <button 
              onClick={() => setEtape("quiz")} 
              disabled={!nom || !email} 
              className="w-full py-5 rounded-2xl font-black text-white bg-amber-500 hover:bg-amber-600 shadow-lg hover:shadow-amber-200/50 transition-all disabled:bg-slate-200 uppercase"
            >
              C'est parti !
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (resultats) {
    const totalQuestions = themesKeys.reduce((acc, key) => acc + data.themes[key].questions.length, 0);
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-xl text-center border-b-[12px] border-green-500">
            <Award className="w-24 h-24 text-yellow-400 mx-auto mb-4 animate-bounce" />
           <h1 className="text-4xl font-black mb-2 text-slate-800 italic uppercase">Bravo !</h1>
            <p className="text-slate-400 font-bold uppercase text-sm mb-8">{nom}</p>
            
            <div className="space-y-3 mb-10">
              {themesKeys.map(key => (
                <div key={key} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="font-black text-slate-500 uppercase text-xs tracking-tighter">{key}</span>
                  <span className="font-black text-indigo-600 text-lg">{score[key]} / {data.themes[key].questions.length}</span>
                </div>
              ))}
            </div>

            <div className="bg-green-600 text-white p-6 rounded-3xl shadow-xl shadow-green-200">
                <p className="text-xs font-bold uppercase opacity-80 mb-1">Score Final</p>
                <div className="text-5xl font-black italic">{score.total} <span className="text-xl opacity-60">/ {totalQuestions}</span></div>
            </div>

            {envoiEnCours && (
                <div className="mt-8 flex items-center justify-center gap-2 text-blue-500 font-black text-xs uppercase tracking-widest animate-pulse">
                    <Loader2 className="animate-spin" size={16} /> Synchronisation Cloud...
                </div>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 relative overflow-hidden">
        
        {/* Barre de Progression Visuelle */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
          {themesKeys.map((key, i) => (
            <button
              key={key}
              onClick={() => (i === 0 || partieComplete(i)) && setPartieActive(i + 1)}
              className={`px-5 py-2.5 rounded-2xl whitespace-nowrap transition-all font-black text-[10px] uppercase tracking-widest ${
                partieActive === i + 1 
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105" 
                : partieComplete(i + 1) ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
              }`}
            >
              {partieComplete(i+1) && "✓ "} {key}
            </button>
          ))}
        </div>

        <div className="mb-10 p-6 bg-blue-50 rounded-[30px] border-2 border-blue-100/50 italic text-slate-700 relative">
          <div className="absolute -top-3 left-6 bg-blue-600 text-white p-1 rounded-lg"><BookOpen size={16}/></div>
          <p className="text-sm font-bold leading-relaxed pt-2">{data.texte}</p>
        </div>

        <div className="space-y-10">
          <div className="flex justify-between items-end border-b-2 border-slate-50 pb-4">
            <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">{themesKeys[partieActive - 1]}</h2>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              Section {partieActive} de {totalThemes}
            </span>
          </div>
          
          {getQuestions(partieActive).map((q, i) => {
            const currentThemeKey = themesKeys[partieActive - 1];
            // On récupère l'ordre mélangé spécifique à cette question
            const optionsMelangees = ordresOptions[currentThemeKey]?.[i] || [];

            return (
              <div key={i} className="group">
                <div className="flex items-center gap-4 mb-5">
                    <span className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-black italic shadow-lg">{i + 1}</span>
                    <p className="font-bold text-xl text-slate-800">{q.q}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-14">
                  {optionsMelangees.map((item, j) => (
                    <button
                      key={j}
                      // On utilise item.idx (l'index original du JSON) pour la réponse
                      onClick={() => handleReponse(partieActive, i, item.idx)}
                      className={`p-5 text-left rounded-[25px] border-2 transition-all font-bold text-sm ${
                        reponses[currentThemeKey][i] === item.idx 
                        ? "bg-indigo-600 text-white border-indigo-700 shadow-xl shadow-indigo-100 scale-[1.02]" 
                        : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                      }`}
                    >
                      {item.opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-between items-center bg-slate-50 -mx-8 -mb-8 p-8 border-t border-slate-100">
          <button 
            disabled={partieActive === 1} 
            onClick={() => setPartieActive(partieActive - 1)} 
            className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-colors"
          >
            <ChevronLeft size={16}/> Précédent
          </button>
          
          {partieActive < totalThemes ? (
            <button 
              disabled={!partieComplete(partieActive)} 
              onClick={() => setPartieActive(partieActive + 1)}
              className={`px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all ${
                partieComplete(partieActive) 
                ? "bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Thème Suivant
            </button>
          ) : (
            <button 
              disabled={!partieComplete(totalThemes)} 
              onClick={terminerQuiz}
              className={`px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all ${
                partieComplete(totalThemes) 
                ? "bg-green-600 hover:bg-green-700 shadow-xl shadow-green-200" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Terminer le Quiz
            </button>
          )}
        </div>
      </div>
      <p className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Ecole Ibn Batouta • 2026</p>
    </div>
  );
}