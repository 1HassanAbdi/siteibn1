import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Volume2, Send, Trophy, ShieldCheck, Lock, AlertTriangle, Ban } from 'lucide-react';

const EvaluationGame = ({ words, selectedLevel, activeWeek, onBack }) => {
  const [step, setStep] = useState('lock'); 
  const [secretInput, setSecretInput] = useState('');
  const [student, setStudent] = useState({ nom: '', email: '' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState({ score: 0, errors: [] });
  const [isSending, setIsSending] = useState(false);
  const [cheatingDetected, setCheatingDetected] = useState(false);

  // Pour éviter d'envoyer 2 fois si l'élève panique et change d'onglet vite
  const hasSentCheatRef = useRef(false);

  // --- CONFIGURATION DES CODES ---
  const codesSecrets = {
    "1": "1000", "2": "2000", "5": "5000",
    "6": "2024", "7": "2026eib", "8": "20ibn", "9": "cka", "10": "2030",
    "11": "ibncka", "12": "2026", "13": "20", "14": "2ibn", "15": "4cka",
    "16": "2024", "17": "2024", "18": "8888",
  };
  const weekKey = activeWeek.toString();
  const CODE_SECRET = codesSecrets[weekKey] || "2026";
  
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwlrUgHicxK4tCCmkiW-DBK0HQDtd5qnec8B1EU1Bt6ePghPrnzyfLPIN6iae6CPsEM4Q/exec";
  const accents = ['à', 'â', 'æ', 'ç', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'œ', 'ù', 'û', 'ü'];

  // --- FONCTION SPECIALE TRICHE ---
  // Cette fonction envoie les données actuelles et bloque tout
  const handleCheatAndSend = async () => {
    if (hasSentCheatRef.current) return; // Déjà envoyé ? On arrête.
    hasSentCheatRef.current = true;
    setCheatingDetected(true);
    setIsSending(true);

    // On prépare la liste des erreurs et on ajoute un GROS avertissement pour le prof
    let finalErrorsArray = results.errors.map(e => `${e.word} (${e.typed})`);
    finalErrorsArray.push("⚠️ INTERRUPTION: FENÊTRE QUITTÉE (TRICHE)");

    const payload = {
      nom: student.nom, 
      email: student.email, 
      niveau: selectedLevel,
      semaine: activeWeek, 
      score: results.score, // On garde le score actuel (incomplet)
      total: words.length, 
      errorList: finalErrorsArray
    };

    try {
      // On utilise 'keepalive: true' pour que l'envoi se fasse même si la page se ferme
      await fetch(GOOGLE_SCRIPT_URL, { 
        method: 'POST', 
        mode: 'no-cors', 
        body: JSON.stringify(payload),
        keepalive: true 
      });
    } catch (e) { console.error(e); }
    setIsSending(false);
  };

  // --- ECOUTEUR D'EVENEMENTS (Anti-Triche) ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Si on est en jeu et qu'on quitte l'onglet -> ENVOI IMMEDIAT
      if (document.hidden && step === 'playing') {
        handleCheatAndSend();
      }
    };

    const handleBlur = () => {
      // Si on perd le focus (clic ailleurs) -> ENVOI IMMEDIAT
      if (step === 'playing') {
        handleCheatAndSend();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [step, results, student]); // Dépendances pour avoir les données à jour

  // --- LE RESTE DU CODE (Similaire) ---

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (secretInput === CODE_SECRET) setStep('login');
    else { alert(`Code incorrect !`); setSecretInput(''); }
  };

  const handleSpeak = () => {
    const text = words[currentIndex];
    if (!text) return;
    const cleanWord = text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, "").replace(/\s+/g, "_");
    
    const audioPath = `/audio/cka/${selectedLevel}A/Semaine_${activeWeek}/${cleanWord}.mp3`;
    
    const audio = new Audio(audioPath);
    audio.play().catch(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR'; utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleCheck = (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || feedback) return;

    const correct = words[currentIndex].trim();
    const typed = userInput.trim();
    const isCorrect = typed.toLowerCase() === correct.toLowerCase();

    if (isCorrect) {
      setFeedback('correct');
      setResults(prev => ({ ...prev, score: prev.score + 1 }));
    } else {
      setFeedback('incorrect');
      setResults(prev => ({ ...prev, errors: [...prev.errors, { word: correct, typed: typed }] }));
    }

    setTimeout(async () => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setUserInput('');
        setFeedback(null);
      } else {
        await finishAndSendNormal(isCorrect, typed);
      }
    }, 800);
  };

  // Fonction de fin NORMALE (quand l'élève finit tout sagement)
  const finishAndSendNormal = async (lastIsCorrect, lastTyped) => {
    setStep('finished');
    setIsSending(true);
    const finalScore = results.score + (lastIsCorrect ? 1 : 0);
    let finalErrorsArray = results.errors.map(e => `${e.word} (${e.typed})`);
    if (!lastIsCorrect && lastTyped !== "") finalErrorsArray.push(`${words[currentIndex]} (${lastTyped})`);

    const payload = {
      nom: student.nom, email: student.email, niveau: selectedLevel,
      semaine: activeWeek, score: finalScore, total: words.length, errorList: finalErrorsArray
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
    } catch (e) { console.error(e); }
    setIsSending(false);
  };

  // --- ECRAN DE TRICHE (Bloquant) ---
  if (cheatingDetected) {
    return (
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-lg mx-auto bg-red-600 p-12 rounded-[40px] shadow-2xl border-8 border-red-800 text-white text-center mt-10">
        <Ban size={80} className="mx-auto mb-6 text-red-950 animate-pulse" />
        <h2 className="text-4xl font-black uppercase mb-4 tracking-tighter">Examen Interrompu</h2>
        <p className="text-xl font-bold mb-8">
  You have left the window. <br/>
  Your partial results have been <span className="underline decoration-4 decoration-red-950">sent immediately</span> to the teacher.
</p>

        <div className="bg-red-800 p-4 rounded-xl mb-8 text-sm font-mono text-left">
  Status: SENT <br/>
  Student: {student.nom} <br/>
  Reason: Window change
</div>

        <button 
          onClick={onBack}
          className="w-full bg-white text-red-700 py-4 rounded-2xl font-black uppercase hover:bg-gray-100 transition-all shadow-lg"
        >
          Retour au menu
        </button>
      </motion.div>
    );
  }

  // --- VUE 0 : LOCK ---
  if (step === 'lock') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto bg-slate-900 p-10 rounded-[40px] shadow-2xl border-b-8 border-amber-500 text-white text-center">
        <Lock size={50} className="mx-auto mb-6 text-amber-500" />
        <h2 className="text-2xl font-black uppercase mb-4">Accès Protégé</h2>
        <p className="text-slate-500 text-sm mb-4">Semaine {activeWeek}</p>
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <input 
            type="password" 
            className="w-full p-4 bg-slate-800 rounded-2xl border-2 border-slate-700 outline-none focus:border-amber-500 text-center text-2xl tracking-widest font-black"
            placeholder="CODE" value={secretInput} onChange={e => setSecretInput(e.target.value)} autoFocus
          />
          <button className="w-full bg-amber-500 text-slate-900 py-4 rounded-2xl font-black uppercase hover:bg-amber-400 transition-all">Débloquer</button>
          <button type="button" onClick={onBack} className="text-slate-500 text-xs font-bold uppercase mt-2">Retour</button>
        </form>
      </motion.div>
    );
  }

  // --- VUE 1 : LOGIN ---
  if (step === 'login') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto bg-[#1e1b4b] p-10 rounded-[40px] shadow-2xl border-t-8 border-violet-500 text-white">
        <ShieldCheck size={40} className="mx-auto mb-4 text-violet-400" />
        <h2 className="text-2xl font-black mb-2 text-center uppercase tracking-widest">Examen Officiel</h2>
        
        <div className="bg-red-500/20 border border-red-500 p-3 rounded-xl mb-6 flex items-start gap-3">
            <AlertTriangle className="text-red-400 shrink-0" size={20} />
            <p className="text-xs text-red-100 text-left leading-relaxed font-bold">
               ATTENTION : Any change of window will result in the immediate submission of your work, even if it is incomplete..
            </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setStep('playing'); }} className="space-y-4">
          <input className="w-full p-4 bg-[#312e81] rounded-2xl border-2 border-transparent focus:border-violet-400 outline-none font-bold placeholder-violet-300" placeholder="Nom et Prénom" required value={student.nom} onChange={e => setStudent({...student, nom: e.target.value})} />
          <input className="w-full p-4 bg-[#312e81] rounded-2xl border-2 border-transparent focus:border-violet-400 outline-none font-bold placeholder-violet-300" type="email" placeholder="Email scolaire" required value={student.email} onChange={e => setStudent({...student, email: e.target.value})} />
          <button className="w-full bg-violet-600 hover:bg-violet-500 text-white py-5 rounded-2xl font-black uppercase shadow-lg transition-all">Je suis prêt(e)</button>
        </form>
      </motion.div>
    );
  }

  // --- VUE 2 : PLAYING ---
  if (step === 'playing') {
    return (
      <div className="max-w-2xl mx-auto text-center p-4">
        <div className="mb-8 flex justify-between items-center bg-[#1e1b4b] text-white p-6 rounded-3xl shadow-2xl border-b-4 border-violet-500">
          <div className="text-left">
            <div className="flex items-center gap-2 text-violet-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
              <ShieldCheck size={12} /> Mode Strict
            </div>
            <p className="font-black text-lg">{student.nom}</p>
          </div>
          <div className="bg-violet-600 px-6 py-2 rounded-2xl font-mono text-2xl font-black border-2 border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            {currentIndex + 1} / {words.length}
          </div>
        </div>
        
        <button onClick={handleSpeak} className="bg-white w-32 h-32 rounded-full text-violet-700 shadow-[0_10px_40px_rgba(0,0,0,0.2)] mb-10 hover:scale-105 transition-transform flex items-center justify-center mx-auto border-[10px] border-violet-100">
            <Volume2 size={56} />
        </button>

        <form onSubmit={handleCheck} className="space-y-8">
          <input 
            className={`w-full text-center text-4xl font-black p-10 rounded-[45px] border-4 outline-none transition-all shadow-2xl
              ${feedback === 'correct' ? 'border-green-400 bg-green-50 text-green-600' : 
                feedback === 'incorrect' ? 'border-red-400 bg-red-50 text-red-600' : 
                'border-violet-200 focus:border-violet-600 bg-white'}`}
            autoFocus value={userInput} onChange={e => setUserInput(e.target.value)} disabled={feedback !== null} placeholder="..."
          />
          <div className="flex flex-wrap justify-center gap-2 bg-violet-50 p-6 rounded-[35px] border-2 border-violet-100">
            {accents.map(a => (
              <button key={a} type="button" onClick={() => setUserInput(userInput + a)} className="w-12 h-12 bg-white rounded-xl font-bold text-violet-700 hover:bg-violet-600 hover:text-white transition-all shadow-sm border border-violet-100">{a}</button>
            ))}
          </div>
        </form>
      </div>
    );
  }

  // --- VUE 3 : FINISHED (NORMAL) ---
  return (
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-12 bg-white rounded-[60px] shadow-2xl border-b-[15px] border-violet-800 max-w-lg mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500"></div>
      <Trophy size={80} className="text-amber-500 mx-auto mb-6 drop-shadow-md" />
      <h2 className="text-4xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">Examen Terminé</h2>
      <p className="text-slate-400 font-bold mb-8">Bravo ! Tes réponses ont été envoyées.</p>
      
      <div className="text-8xl font-black text-violet-700 mb-10 tabular-nums bg-violet-50 py-10 rounded-[40px] border-2 border-violet-100 shadow-inner">
        {results.score}<span className="text-violet-300 text-3xl"> / {words.length}</span>
      </div>

      {isSending ? (
        <div className="bg-violet-900 text-white p-6 rounded-3xl flex items-center justify-center gap-4 font-black animate-pulse">
           <Send size={24} /> ENVOI EN COURS...
        </div>
      ) : (
        <button onClick={onBack} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase hover:bg-black transition-all shadow-xl">Retourner au menu</button>
      )}
    </motion.div>
  );
};

export default EvaluationGame;