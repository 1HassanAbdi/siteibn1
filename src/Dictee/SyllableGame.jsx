import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Scissors, Sparkles } from 'lucide-react';

const SyllableGame = ({ selectedLevel, activeWeek, onCorrect, onWrong, onFinish, onSetTotal, onBack }) => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [builtWord, setBuiltWord] = useState([]);
  const [shuffledSyllables, setShuffledSyllables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const speakWord = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const cleanWord = text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, "").replace(/\s+/g, "_");
    const audioPath = `/audio/${selectedLevel}A/semaine${activeWeek}/${cleanWord}.mp3`;
    const audio = new Audio(audioPath);
    audio.play().catch(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR'; utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
   const loadSyllables = async () => {
  try {
    const response = await fetch(`/data/syllables${selectedLevel}A.json`);
    const data = await response.json();
    
    // Ajout d'une vérification de sécurité (Optional Chaining)
    const weekData = data?.weeks_syllables?.find(w => w.week_id === activeWeek);
    
    if (weekData && weekData.words) {
      setWords([...weekData.words].sort(() => Math.random() - 0.5));
      if (onSetTotal) onSetTotal(weekData.words.length);
    } else {
      console.error("Données de semaine introuvables pour l'ID:", activeWeek);
    }
    setLoading(false);
  } catch (err) { 
    console.error("Erreur de chargement du fichier JSON", err);
    setLoading(false);
  }
};
    loadSyllables();
  }, [selectedLevel, activeWeek]);

  useEffect(() => {
    if (words.length > 0 && currentIndex < words.length) {
      setBuiltWord([]);
      setShuffledSyllables([...words[currentIndex].parts].sort(() => Math.random() - 0.5));
      setFeedback(null);
      setIsTransitioning(false);
    }
  }, [words, currentIndex]);

  const handleSyllableClick = (syllable) => {
    if (isTransitioning || feedback) return;
    const nextSyllableNeeded = words[currentIndex].parts[builtWord.length];
    if (syllable === nextSyllableNeeded) {
      const newBuilt = [...builtWord, syllable];
      setBuiltWord(newBuilt);
      if (newBuilt.length === words[currentIndex].parts.length) {
        setIsTransitioning(true);
        setFeedback('correct');
        onCorrect();
        speakWord(words[currentIndex].word);
        setTimeout(() => {
          if (currentIndex < words.length - 1) setCurrentIndex(prev => prev + 1);
          else onFinish(currentIndex + 1, words.length);
        }, 1800);
      }
    } else {
      setFeedback('error');
      onWrong();
      setIsTransitioning(true);
      setTimeout(() => { setFeedback(null); setIsTransitioning(false); }, 700);
    }
  };

  if (loading) return <div className="p-10 text-center font-black text-[#0d6e52]">Chargement...</div>;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-4 px-2 overflow-hidden">
      
      {/* HEADER DESIGN - PLUS PETIT */}
      <div className="flex items-center gap-3 bg-white/60 px-6 py-2 rounded-full border-2 border-white shadow-sm scale-90">
        <Sparkles size={20} className="text-yellow-500" />
        <h2 className="text-xl font-black text-[#0d6e52] uppercase tracking-tighter">Assemble les morceaux !</h2>
      </div>

      {/* ZONE CENTRALE DESIGN (MOT) - TAILLE 4XL */}
      <div className={`relative flex flex-wrap gap-3 min-h-[110px] items-center justify-center w-full rounded-[2.5rem] p-6 border-b-[6px] transition-all duration-300 shadow-xl
        ${feedback === 'correct' ? 'bg-green-100 border-green-500 scale-105' : 'bg-white border-white/80'}`}>
        
        <AnimatePresence mode="popLayout">
          {builtWord.map((s, i) => (
            <motion.div
              key={`built-${currentIndex}-${i}`}
              initial={{ scale: 0, y: 15 }} animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-b from-[#0d6e52] to-[#0a523d] text-white px-8 py-4 rounded-2xl font-black text-4xl shadow-[0_6px_0_#063628] flex items-center justify-center"
            >
              {s}
            </motion.div>
          ))}
          {words[currentIndex]?.parts.slice(builtWord.length).map((_, i) => (
            <div key={`empty-${i}`} className="w-16 h-14 border-4 border-dashed border-[#0d6e52]/10 rounded-2xl bg-[#e2f1ed]/30 animate-pulse" />
          ))}
        </AnimatePresence>

        {feedback === 'correct' && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-4 -top-4 bg-yellow-400 p-3 rounded-full shadow-lg border-4 border-white text-white">
            <Volume2 size={24} fill="currentColor" />
          </motion.div>
        )}
      </div>

      {/* SYLLABES À CLIQUER - DESIGN 3D + CENTRÉ + TEXT-4XL */}
      <div className="flex flex-wrap justify-center gap-3 w-full pt-2">
        {shuffledSyllables.map((s, i) => {
          const isUsed = builtWord.filter(x => x === s).length >= words[currentIndex].parts.filter(x => x === s).length;
          return (
            <motion.button
              key={`syllable-${currentIndex}-${i}`}
              whileTap={!isUsed && !isTransitioning ? { scale: 0.92 } : {}}
              animate={feedback === 'error' && !isUsed ? { x: [-8, 8, -8, 8, 0] } : {}}
              onClick={() => handleSyllableClick(s)}
              disabled={isUsed || isTransitioning}
              className={`
                min-w-[110px] px-6 py-5 rounded-[2rem] font-black text-4xl transition-all duration-200
                ${isUsed 
                  ? 'opacity-0 scale-50 pointer-events-none' 
                  : 'bg-white border-b-[8px] border-blue-600 border-x-2 border-t-2 border-blue-100 text-blue-700 active:border-b-0 active:translate-y-[6px] shadow-lg hover:bg-blue-50'}
                ${feedback === 'error' && !isUsed ? 'border-red-600 text-red-600 bg-red-50' : ''}
              `}
            >
              {s}
            </motion.button>
          );
        })}
      </div>

      {/* BARRE DE PROGRESSION DESIGN MAIS COMPACTE */}
      <div className="w-full max-w-xs pt-4 flex flex-col items-center gap-2">
        <div className="w-full h-4 bg-white rounded-full p-1 shadow-inner border border-[#0d6e52]/10">
          <motion.div 
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-sm"
            animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
        <span className="text-[#0d6e52] font-black text-sm uppercase bg-white/80 px-4 py-0.5 rounded-full shadow-sm">
          {currentIndex + 1} / {words.length}
        </span>
      </div>

    </div>
  );
};

export default SyllableGame;