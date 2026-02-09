import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Send, Trophy, ShieldCheck, GraduationCap, Lock, KeyRound, AlertCircle } from 'lucide-react';

const EvaluationGame = ({ words, selectedLevel, activeWeek, onBack }) => {
  const [step, setStep] = useState('lock'); 
  const [secretInput, setSecretInput] = useState('');
  const [student, setStudent] = useState({ nom: '', email: '' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState({ score: 0, errors: [] });
  const [isSending, setIsSending] = useState(false);

  const CODE_SECRET = "2026"; 
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwlrUgHicxK4tCCmkiW-DBK0HQDtd5qnec8B1EU1Bt6ePghPrnzyfLPIN6iae6CPsEM4Q/exec";
  const accents = ['à', 'â', 'æ', 'ç', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'œ', 'ù', 'û', 'ü'];

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (secretInput === CODE_SECRET) setStep('login');
    else { alert("Code incorrect !"); setSecretInput(''); }
  };

  // --- FONCTION AUDIO CORRIGÉE ---
  const handleSpeak = () => {
    // On récupère le mot actuel dans la liste des mots reçus en props
    const text = words[currentIndex];
    if (!text) return;

    // Nettoyage du mot pour correspondre au nom du fichier MP3
    const cleanWord = text
      .toLowerCase()
      .trim()
      .normalize("NFD") // Sépare les accents des lettres
      .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .replace(/[’']/g, "") // Supprime les apostrophes
      .replace(/\s+/g, "_"); // Remplace les espaces par des underscores

    // Construction du chemin vers le dossier public
    const audioPath = `/audio/cka/${selectedLevel}A/Semaine_${activeWeek}/${cleanWord}.mp3`;
    
    const audio = new Audio(audioPath);
    audio.play().catch((err) => {
      console.warn("Fichier audio introuvable, lecture par synthèse vocale.");
      // Secours : Synthèse vocale si le MP3 n'existe pas
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR'; 
      utterance.rate = 0.8;
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
        await finishAndSend(isCorrect, typed);
      }
    }, 800);
  };

  const finishAndSend = async (lastIsCorrect, lastTyped) => {
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

  // --- VUES (LOCK, LOGIN, PLAYING, FINISHED) ---
  if (step === 'lock') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto bg-slate-900 p-10 rounded-[40px] shadow-2xl border-b-8 border-amber-500 text-white text-center">
        <Lock size={50} className="mx-auto mb-6 text-amber-500" />
        <h2 className="text-2xl font-black uppercase mb-4">Accès Protégé</h2>
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

  if (step === 'login') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto bg-[#1e1b4b] p-10 rounded-[40px] shadow-2xl border-t-8 border-violet-500 text-white">
        <ShieldCheck size={40} className="mx-auto mb-4 text-violet-400" />
        <h2 className="text-2xl font-black mb-6 text-center uppercase tracking-widest">Examen Officiel</h2>
        <form onSubmit={(e) => { e.preventDefault(); setStep('playing'); }} className="space-y-4">
          <input className="w-full p-4 bg-[#312e81] rounded-2xl border-2 border-transparent focus:border-violet-400 outline-none font-bold placeholder-violet-300" placeholder="Nom et Prénom" required value={student.nom} onChange={e => setStudent({...student, nom: e.target.value})} />
          <input className="w-full p-4 bg-[#312e81] rounded-2xl border-2 border-transparent focus:border-violet-400 outline-none font-bold placeholder-violet-300" type="email" placeholder="Email scolaire" required value={student.email} onChange={e => setStudent({...student, email: e.target.value})} />
          <button className="w-full bg-violet-600 hover:bg-violet-500 text-white py-5 rounded-2xl font-black uppercase shadow-lg transition-all">Valider l'inscription</button>
        </form>
      </motion.div>
    );
  }

  if (step === 'playing') {
    return (
      <div className="max-w-2xl mx-auto text-center p-4">
        <div className="mb-8 flex justify-between items-center bg-[#1e1b4b] text-white p-6 rounded-3xl shadow-2xl border-b-4 border-violet-500">
          <div className="text-left">
            <div className="flex items-center gap-2 text-violet-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
              <AlertCircle size={12} /> Session d'évaluation
            </div>
            <p className="font-black text-lg">{student.nom}</p>
          </div>
          <div className="bg-violet-600 px-6 py-2 rounded-2xl font-mono text-2xl font-black border-2 border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            {currentIndex + 1} / {words.length}
          </div>
        </div>
        
        <button 
          type="button"
          onClick={handleSpeak} 
          className="bg-white w-32 h-32 rounded-full text-violet-700 shadow-[0_10px_40px_rgba(0,0,0,0.2)] mb-10 hover:scale-105 transition-transform flex items-center justify-center mx-auto border-[10px] border-violet-100"
        >
            <Volume2 size={56} />
        </button>

        <form onSubmit={handleCheck} className="space-y-8">
          <input 
            className={`w-full text-center text-4xl font-black p-10 rounded-[45px] border-4 outline-none transition-all shadow-2xl
              ${feedback === 'correct' ? 'border-green-400 bg-green-50 text-green-600' : 
                feedback === 'incorrect' ? 'border-red-400 bg-red-50 text-red-600' : 
                'border-violet-200 focus:border-violet-600 bg-white'}`}
            autoFocus 
            value={userInput} 
            onChange={e => setUserInput(e.target.value)} 
            disabled={feedback !== null} 
            placeholder="..."
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

  return (
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-12 bg-white rounded-[60px] shadow-2xl border-b-[15px] border-violet-800 max-w-lg mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500"></div>
      <Trophy size={80} className="text-amber-500 mx-auto mb-6 drop-shadow-md" />
      <h2 className="text-4xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">Examen Terminé</h2>
      <p className="text-slate-400 font-bold mb-8">Tes réponses ont été envoyées au professeur.</p>
      
      <div className="text-8xl font-black text-violet-700 mb-10 tabular-nums bg-violet-50 py-10 rounded-[40px] border-2 border-violet-100 shadow-inner">
        {results.score}<span className="text-violet-300 text-3xl"> / {words.length}</span>
      </div>

      {isSending ? (
        <div className="bg-violet-900 text-white p-6 rounded-3xl flex items-center justify-center gap-4 font-black animate-pulse">
           <Send size={24} /> TRANSMISSION SÉCURISÉE...
        </div>
      ) : (
        <button onClick={onBack} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase hover:bg-black transition-all shadow-xl">Retourner au menu</button>
      )}
    </motion.div>
  );
};

export default EvaluationGame;