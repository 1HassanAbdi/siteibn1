import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Heart, ShieldCheck, Timer, XCircle, ArrowLeft, Star } from 'lucide-react';

// AJOUT de blocTitle dans les props pour recevoir le nom avec la difficulté
const EvaluationGame = ({ words = [], onFinish, selectedLevel, onBack, blocTitle }) => {
  // --- ÉTATS ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);
  const [combo, setCombo] = useState(0);

  const accents = ['à', 'â', 'æ', 'ç', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'œ', 'ù', 'û', 'ü'];
  const PALIER_SIZE = 20;

  // --- LOGIQUE DE DONNÉES ---
  const currentWordObj = words[currentIndex] || {};
  const currentWordText = currentWordObj.text || "";
  const currentWeekId = currentWordObj.weekId;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // --- FONCTION DE SAUVEGARDE FINALE CORRIGÉE ---
  const handleFinalSave = (finalScore) => {
    const history = JSON.parse(localStorage.getItem('concours_history') || '[]');
    
    // CORRECTION ICI : On utilise blocTitle qui vient du parent 
    // et qui contient déjà la difficulté (ex: "Semaines 1-2-3 (40 mots)")
    const concoursFinalName = blocTitle || `Semaines ${words[0]?.weekId} à ${words[words.length-1]?.weekId} (${words.length} mots)`;

    const newResult = {
      date: new Date().toLocaleString('fr-FR', { 
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      }),
      niveau: selectedLevel || "Niveau Inconnu",
      concours: concoursFinalName, // Utilisation du titre complet
      score: `${finalScore}/${words.length}`,
      vies: lives,
      erreurs: errors,
      temps: formatTime(seconds)
    };

    localStorage.setItem('concours_history', JSON.stringify([newResult, ...history]));
    
    onFinish({
        score: finalScore,
        total: words.length,
        errors: errors,
        temps: formatTime(seconds)
    });
  };

  const handleSpeak = () => {
    if (!currentWordText) return;
    window.speechSynthesis.cancel();
    
    const cleanWord = currentWordText.toLowerCase().trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, "").replace(/\s+/g, "_");
    
    const audioPath = `/audio/${selectedLevel}A/semaine${currentWeekId}/${cleanWord}.mp3`;
    
    const audio = new Audio(audioPath);
    audio.play().catch(() => {
      const utterance = new SpeechSynthesisUtterance(currentWordText);
      utterance.lang = 'fr-FR'; 
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    });
  };

  const checkWord = (e) => {
    e.preventDefault();
    if (showFeedback || !userInput.trim()) return;

    const isCorrect = userInput.trim().toLowerCase() === currentWordText.toLowerCase();
    let currentScore = score;
    let currentErrors = errors;

    if (isCorrect) {
      setShowFeedback('correct');
      currentScore += 1;
      setScore(currentScore);
      setCombo(prev => prev + 1);
      if (combo + 1 >= 5 && lives < 5) setLives(l => l + 1);
    } else {
      setShowFeedback('error');
      currentErrors += 1;
      setErrors(currentErrors);
      setLives(l => l - 1);
      setCombo(0);
    }

    setTimeout(() => {
      setShowFeedback(null);
      setUserInput('');

      if (lives <= 1 && !isCorrect) {
        const startOfPalier = Math.floor(currentIndex / PALIER_SIZE) * PALIER_SIZE;
        setCurrentIndex(startOfPalier);
        setLives(5);
        alert(`Oups ! Plus de vies. Retour au début du palier : Mot ${startOfPalier + 1}`);
      } 
      else if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } 
      else {
        handleFinalSave(currentScore);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 font-['Poppins'] flex flex-col items-center">
      
      {/* HEADER STATS */}
      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-800 rounded-[2rem] p-4 mb-6 flex justify-between items-center shadow-2xl backdrop-blur-xl">
        <button onClick={onBack} className="p-3 hover:bg-slate-800 rounded-2xl transition-all text-slate-400">
          <ArrowLeft size={24} />
        </button>

        <div className="flex gap-8 items-center">
          <StatBox icon={<ShieldCheck className="text-green-400" />} label="SCORE" value={score} />
          <StatBox icon={<XCircle className="text-red-400" />} label="ERREURS" value={errors} />
          <StatBox icon={<Timer className="text-cyan-400" />} label="TEMPS" value={formatTime(seconds)} />
          
          <div className="flex flex-col items-center px-4 border-l border-slate-800">
            <span className="text-[10px] font-black text-slate-500 uppercase italic">Énergie</span>
            <div className="flex gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Heart key={i} size={16} className={`${i < lives ? 'fill-orange-500 text-orange-500' : 'text-slate-700'} transition-all`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ZONE DE JEU */}
      <div className="w-full max-w-4xl bg-slate-900/40 border-2 border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-3xl relative overflow-hidden flex flex-col items-center">
        
        {/* BARRE PROGRESSION */}
        <div className="w-full mb-12 relative h-6 bg-slate-950 rounded-full border border-slate-800 p-1">
          <motion.div 
            className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
          {[1/3, 2/3].map((p, i) => (
            <div key={i} className="absolute top-1/2 -translate-y-1/2 w-1 h-full bg-slate-800" style={{ left: `${p * 100}%` }}>
              <Star size={12} className={`absolute -top-5 -left-[4px] ${currentIndex > words.length * p ? 'text-orange-500' : 'text-slate-800'}`} />
            </div>
          ))}
        </div>

        {/* AUDIO */}
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleSpeak}
          className="w-28 h-28 bg-orange-500 rounded-[2.5rem] flex items-center justify-center shadow-[0_8px_0_0_#9a3412] mb-10 group relative"
        >
          <Volume2 size={40} className="text-white group-hover:animate-pulse" />
          {combo >= 3 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
              COMBO X{combo}
            </span>
          )}
        </motion.button>

        {/* INPUT */}
        <form onSubmit={checkWord} className="w-full max-w-md">
          <input
            type="text" value={userInput} 
            onChange={(e) => setUserInput(e.target.value)}
            disabled={showFeedback !== null}
            autoFocus
            className={`w-full bg-transparent border-b-4 p-4 text-4xl font-black text-center outline-none transition-all ${
              showFeedback === 'correct' ? 'border-green-500 text-green-400' : 
              showFeedback === 'error' ? 'border-red-500 text-red-400' : 'border-slate-700 focus:border-orange-500 text-white'
            }`}
            placeholder="Tape le mot..."
            autoComplete="off"
            spellCheck="false"
          />
        </form>

        {/* ACCENTS */}
        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {accents.map(char => (
            <button
              key={char} 
              type="button"
              onClick={() => setUserInput(prev => prev + char)}
              className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-lg border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 transition-all"
            >
              {char}
            </button>
          ))}
        </div>

        {/* FEEDBACK TEXTE */}
        <div className="mt-8 h-8">
          <AnimatePresence mode="wait">
            {showFeedback && (
              <motion.div 
                key={showFeedback}
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className={`font-black uppercase tracking-widest text-sm ${showFeedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}
              >
                {showFeedback === 'correct' ? "✓ Bien joué !" : `Correction : ${currentWordText}`}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-6 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
        Progression : {currentIndex + 1} / {words.length} mots
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
    <div className="flex items-center gap-2 text-lg font-black italic">
      {icon} {value}
    </div>
  </div>
);

export default EvaluationGame;