import React, { useState, useEffect } from "react";
import { 
  BookOpen, Award, Loader2, ChevronLeft, ChevronRight, X, 
  ImageIcon, GraduationCap, User, Lock, 
  Star, Trophy, Sparkles, AlertCircle, CheckCircle2 // Ajouté CheckCircle2 ici
} from "lucide-react";
import data from "./prmiereNation.json"; 

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyks0iY9k2hNeuR1Lxyzn_MzBNNcYjPMv3Rxx2Ccj-vyr7wQAEGWT7FvYZRA_PUWFUxXQ/exec";

const SECRET_HASH = "MjIyMg=="; // Code: 2222

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function QuizOQREFinal5a() {
  const [etape, setEtape] = useState("login");
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [niveau, setNiveau] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [partieActive, setPartieActive] = useState(1);
  const [resultats, setResultats] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [ordresOptions, setOrdresOptions] = useState({});
  const [showTexte, setShowTexte] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const themesKeys = Object.keys(data.themes); 
  const totalThemes = themesKeys.length;
  const currentThemeKey = themesKeys[partieActive - 1];

  const [reponses, setReponses] = useState(() => {
    const init = {};
    themesKeys.forEach(key => init[key] = {});
    return init;
  });

  useEffect(() => {
    if (etape === "quiz") {
      const nouvelOrdre = {};
      themesKeys.forEach(key => {
        nouvelOrdre[key] = data.themes[key].questions.map(q => 
          shuffleArray(q.options.map((opt, idx) => ({ opt, idx })))
        );
      });
      setOrdresOptions(nouvelOrdre);
    }
  }, [etape]);

  const handleReponse = (themeKey, indexQuestion, valOriginale) => {
    setReponses(prev => ({
      ...prev,
      [themeKey]: { ...prev[themeKey], [indexQuestion]: valOriginale }
    }));
  };

  const envoyerResultats = async () => {
    setEnvoiEnCours(true);

    const domainesEnvoi = themesKeys.map((key) => {
      const questions = data.themes[key].questions;
      const reponsesTheme = reponses[key];
      const details = questions.map((q, i) => (reponsesTheme[i] === q.r ? 1 : 0));
      const points = details.reduce((a, b) => a + b, 0);

      return {
        domaine: key,
        partie: data.themes[key].domaine,
        note: points * 2,
        details: details
      };
    });

    const payload = {
      email: email,
      eleve: nom,
      niveau: niveau,
      date: new Date().toLocaleDateString(),
      titre: data.titre,
      matiere: data.matiere,
      groupage: true,
      domaines: domainesEnvoi
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Erreur d'envoi", e);
    } finally {
      setEnvoiEnCours(false);
      setResultats(true); // Active l'écran bilan
    }
  };

  const questionsActuelles = data.themes[currentThemeKey].questions;
  const nombreReponsesDonnees = Object.keys(reponses[currentThemeKey] || {}).length;
  const toutEstRepondu = nombreReponsesDonnees === questionsActuelles.length;
  const progressionPartie = (nombreReponsesDonnees / questionsActuelles.length) * 100;

  // --- LOGIN ---
  if (etape === "login") {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center p-4 font-sans text-white">
        <div className="max-w-md w-full bg-[#161b2c] rounded-[2.5rem] p-8 shadow-2xl border border-white/10 text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg animate-pulse">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-3xl font-black mb-2 text-indigo-300 uppercase">{data.matiere}</h1>
          <p className="text-slate-400 font-bold mb-8 italic">"{data.titre}"</p>
          
          <div className="space-y-4 text-left">
            <div className="relative">
              <User size={18} className="absolute left-4 top-4 text-indigo-400"/>
              <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Ton Nom et Prénom" className="w-full pl-12 pr-6 py-4 bg-[#1f263d] border border-white/5 rounded-2xl outline-none focus:border-indigo-500 text-white" />
            </div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (Parents ou École)" className="w-full px-6 py-4 bg-[#1f263d] border border-white/5 rounded-2xl outline-none focus:border-indigo-500 text-white" />
            <select value={niveau} onChange={e => setNiveau(e.target.value)} className="w-full px-6 py-4 bg-[#1f263d] border border-white/5 rounded-2xl outline-none focus:border-indigo-500 text-white appearance-none">
              <option value="">Choisis ta classe</option>
              <option value="3E">3e année</option>
              <option value="4E">4e année</option>
            </select>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-4 text-indigo-400"/>
              <input type="password" value={accessCode} onChange={e => setAccessCode(e.target.value)} placeholder="Code secret" className="w-full pl-12 pr-6 py-4 bg-[#1f263d] border border-white/5 rounded-2xl outline-none focus:border-indigo-500 text-white text-center tracking-widest" />
            </div>
            <button onClick={() => setEtape("quiz")} disabled={!nom || !email || !niveau || accessCode !== window.atob(SECRET_HASH)} className="w-full mt-4 py-5 rounded-2xl font-black text-xl text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 transition-all shadow-lg shadow-indigo-500/20">LANCER LE QUIZ 🚀</button>
          </div>
        </div>
      </div>
    );
  }

  // --- BILAN DÉTAILLÉ (CORRIGÉ) ---
  if (resultats) {
    const bilanDetaille = themesKeys.map(key => {
      const questions = data.themes[key].questions;
      const reponsesTheme = reponses[key];
      const points = questions.reduce((acc, q, i) => (reponsesTheme[i] === q.r ? acc + 1 : acc), 0);
      const totalPartie = questions.length;
      return {
        nom: data.themes[key].domaine,
        score: points * 2,
        max: totalPartie * 2,
        pourcentage: (points / totalPartie) * 100
      };
    });

    const scoreTotalGlobal = bilanDetaille.reduce((a, b) => a + b.score, 0);
    const maxGlobal = bilanDetaille.reduce((a, b) => a + b.max, 0);

    return (
      <div className="min-h-screen bg-[#0b0f1a] p-4 md:p-8 flex flex-col items-center font-sans text-white">
        <div className="max-w-2xl w-full bg-[#161b2c] rounded-[3rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <Sparkles className="absolute top-10 right-10 text-yellow-400 opacity-20" size={100} />
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
          <h1 className="text-3xl md:text-4xl font-black text-center mb-2">Ton Bilan, {nom} !</h1>
          <p className="text-indigo-400 text-center font-bold mb-8 uppercase tracking-widest text-sm">Exploration Terminée 🚩</p>

          <div className="space-y-4 mb-10">
            {bilanDetaille.map((item, idx) => (
              <div key={idx} className="bg-[#1f263d] p-5 rounded-3xl border border-white/5 shadow-inner">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-black">{idx + 1}</div>
                    <span className="font-bold text-lg">{item.nom}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">{item.score}</span>
                    <span className="text-slate-500 font-bold"> / {item.max}</span>
                  </div>
                </div>
                <div className="w-full bg-[#0b0f1a] h-3 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${item.pourcentage >= 80 ? 'bg-emerald-500' : item.pourcentage >= 50 ? 'bg-yellow-500' : 'bg-rose-500'}`} style={{ width: `${item.pourcentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-center shadow-xl mb-8">
            <p className="text-indigo-100 font-black uppercase tracking-widest text-xs mb-2">Score Total de l'aventure</p>
            <div className="text-7xl font-black text-white flex items-center justify-center gap-2">
              {scoreTotalGlobal}<span className="text-2xl opacity-40">/ {maxGlobal}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            {envoiEnCours ? (
              <div className="flex items-center gap-3 text-indigo-400 font-bold animate-pulse"><Loader2 className="animate-spin" /> Envoi en cours...</div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/20"><CheckCircle2 size={18} /> Résultats enregistrés !</div>
            )}
            <button onClick={() => window.location.reload()} className="mt-4 bg-white text-indigo-950 px-12 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all active:scale-95 shadow-lg">QUITTER LA SESSION</button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ (RESTE INCHANGÉ) ---
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-[#161b2c]/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex gap-3">
          <button onClick={() => setShowTexte(true)} className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg">
            <BookOpen size={18} /> LIRE LE TEXTE
          </button>
          <button onClick={() => setShowImage(true)} className="bg-purple-600 text-white px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-purple-500 transition-all shadow-lg">
            <ImageIcon size={18} /> IMAGE
          </button>
        </div>
        <div className="text-right">
          <div className="text-white font-black text-sm">{nom}</div>
          <div className="text-indigo-400 font-bold text-[10px] uppercase">{niveau}</div>
        </div>
      </header>

      <div className="w-full bg-[#161b2c] px-6 py-3 border-b border-white/5">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div className="bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Partie {partieActive} / {totalThemes}</div>
          <div className="flex-grow h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700" style={{ width: `${progressionPartie}%` }}></div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl w-full mx-auto p-6 flex-grow">
        <h2 className="text-2xl font-black text-indigo-300 mb-8 mt-4 flex items-center gap-3">
          <Sparkles size={24} /> {data.themes[currentThemeKey].domaine}
        </h2>
        
        <div className="space-y-8">
          {questionsActuelles.map((q, i) => {
            const options = ordresOptions[currentThemeKey]?.[i] || [];
            const reponseSelectionnee = reponses[currentThemeKey][i];

            return (
              <div key={i} className={`bg-[#161b2c] rounded-[2.5rem] p-8 shadow-xl border-2 transition-all duration-300 ${reponseSelectionnee !== undefined ? 'border-indigo-500/40 shadow-indigo-500/10' : 'border-transparent'}`}>
                <div className="flex items-start gap-5 mb-8">
                  <span className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${reponseSelectionnee !== undefined ? 'bg-indigo-500 text-white' : 'bg-[#1f263d] text-indigo-400 border border-white/10'}`}>
                    {i + 1}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{q.q}</h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {options.map((item, j) => (
                    <button 
                      key={j} 
                      onClick={() => handleReponse(currentThemeKey, i, item.idx)}
                      className={`p-5 text-left rounded-2xl border-2 font-bold text-lg transition-all flex justify-between items-center group ${
                        reponseSelectionnee === item.idx 
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-lg" 
                        : "bg-[#1f263d] border-transparent text-slate-400 hover:bg-[#2a3352]"
                      }`}
                    >
                      <span>{item.opt}</span>
                      <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${reponseSelectionnee === item.idx ? 'bg-white border-white' : 'border-slate-600 group-hover:border-indigo-400'}`}>
                        {reponseSelectionnee === item.idx && <Star size={14} className="text-indigo-600 fill-indigo-600" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="bg-[#161b2c] p-6 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-3xl mx-auto w-full flex justify-between items-center">
          <button 
            disabled={partieActive === 1} 
            onClick={() => { setPartieActive(partieActive - 1); window.scrollTo(0,0); }} 
            className="font-black text-slate-500 hover:text-indigo-400 disabled:opacity-0 transition-colors uppercase text-xs"
          >
            <ChevronLeft className="inline mb-1" /> Précédent
          </button>
          
          <button 
            disabled={!toutEstRepondu || envoiEnCours} 
            onClick={partieActive < totalThemes ? () => { setPartieActive(partieActive + 1); window.scrollTo(0,0); } : envoyerResultats} 
            className={`px-12 py-5 rounded-3xl font-black text-lg text-white shadow-xl transition-all active:scale-95 disabled:grayscale disabled:opacity-20 ${partieActive < totalThemes ? "bg-indigo-600" : "bg-emerald-600 shadow-emerald-500/20"}`}
          >
            {envoiEnCours ? <Loader2 className="animate-spin" /> : (partieActive < totalThemes ? "Suivant ➔" : "Terminer et Envoyer 🏁")}
          </button>
        </div>
      </footer>

      {/* MODALE TEXTE */}
      {showTexte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#161b2c] w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/10">
            <div className="p-6 bg-[#1f263d] flex justify-between items-center border-b border-white/10">
              <span className="font-black text-white uppercase flex items-center gap-2"><BookOpen size={20} className="text-indigo-400"/> Lecture : {data.titre}</span>
              <button onClick={() => setShowTexte(false)} className="bg-white text-black p-2 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><X size={20} /></button>
            </div>
            <div className="p-8 overflow-y-auto space-y-8">
              {data.texte_integral.map((para, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <span className="text-indigo-500 font-black text-xs bg-indigo-500/10 px-2 py-1 rounded h-fit">¶{para.p}</span>
                  <p className="text-xl text-slate-200 leading-relaxed font-medium">{para.contenu}</p>
                </div>
              ))}
            </div>
            <div className="p-6 bg-[#1f263d] text-center border-t border-white/10">
              <button onClick={() => setShowTexte(false)} className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black uppercase shadow-lg">J'ai fini de lire 👍</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE IMAGE */}
      {showImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="bg-[#161b2c] w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col relative">
            <button onClick={() => setShowImage(false)} className="absolute top-6 right-6 z-[70] bg-white text-black p-3 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-xl">
              <X size={30} strokeWidth={3} />
            </button>
            <div className="p-6 bg-[#1f263d] border-b border-white/10 text-white font-black uppercase flex items-center gap-3">
              <ImageIcon className="text-purple-400" /> Support Visuel
            </div>
            <div className="p-4 bg-[#0b0f1a] flex items-center justify-center min-h-[300px]">
              <img 
                src={data.image_illustration} 
                alt="Support" 
                className="max-w-full max-h-[60vh] rounded-2xl shadow-2xl object-contain border-2 border-white/10"
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `<div class="text-center text-slate-500 p-10"><AlertCircle size={48} class="mx-auto mb-2 text-rose-500" /> <p>L'image n'est pas chargée.</p></div>`;
                }}
              />
            </div>
            <div className="p-6 bg-[#1f263d] text-center">
              <button onClick={() => setShowImage(false)} className="bg-purple-600 text-white px-12 py-4 rounded-2xl font-black uppercase shadow-lg shadow-purple-500/20">Fermer l'image</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}