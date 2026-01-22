import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Star, Lightbulb, Music, Volume2 } from 'lucide-react';

const SyllableGame = ({ selectedLevel, activeWeek, onCorrect, onWrong, onFinish, onSetTotal }) => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [builtWord, setBuiltWord] = useState([]);
  const [shuffledSyllables, setShuffledSyllables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);// Ajoutez cet état pour suivre le score localement sans erreur
const [localScore, setLocalScore] = useState(0);


  // --- FONCTION DE LECTURE (Intégrée) ---
  const speakWord = (text) => {
    if (!text) return;
    
    // Normalisation pour le chemin du fichier audio (même logique que votre handleSpeak)
    const cleanWord = text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, "")
      .replace(/\s+/g, "_");

    const audioPath = `/audio/${selectedLevel}A/semaine${activeWeek}/${cleanWord}.mp3`;
    const audio = new Audio(audioPath);

    audio.play().catch(() => {
      // Fallback si le fichier MP3 n'existe pas
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    });
  };

  // Chargement des données
  useEffect(() => {
    const loadSyllables = async () => {
      try {
        const response = await fetch(`/data/syllables${selectedLevel}A.json`);
        const data = await response.json();
        const weekData = data.weeks_syllables.find(w => w.week_id === activeWeek);
        if (weekData) {
          setWords(weekData.words.sort(() => Math.random() - 0.5));
        if (onSetTotal) onSetTotal(weekData.words.length); // <--- AJOUTER CETTE LIGNE
        }
        setLoading(false);
      } catch (err) {
        console.error("Erreur de chargement des syllabes", err);
      }
    };
    loadSyllables();
  }, [selectedLevel, activeWeek]);

  // Préparer le mot actuel
  useEffect(() => {
    if (words.length > 0 && currentIndex < words.length) {
      const currentWord = words[currentIndex];
      setBuiltWord([]);
      setShuffledSyllables([...currentWord.parts].sort(() => Math.random() - 0.5));
    }
  }, [words, currentIndex]);

  const handleSyllableClick = (syllable, index) => {
    if (feedback) return;
    const currentWord = words[currentIndex];
    const nextSyllableNeeded = currentWord.parts[builtWord.length];

    if (syllable === nextSyllableNeeded) {
      const newBuilt = [...builtWord, syllable];
      setBuiltWord(newBuilt);

     
if (newBuilt.length === currentWord.parts.length) {
  setFeedback('correct');
  
  const updatedScore = localScore + 1; // Calcule le nouveau score
  setLocalScore(updatedScore);
  onCorrect(); 
  
  speakWord(currentWord.word);

  setTimeout(() => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(i => i + 1);
      setFeedback(null);
    } else {
      // ENVOIE LE SCORE ET LE TOTAL EXACTS AU PARENT
      onFinish(updatedScore, words.length); 
    }
  }, 1500);
}
    } else {
      setFeedback('error');
      onWrong();
      setTimeout(() => setFeedback(null), 800);
    }
  };

  if (loading) return <div className="p-10 text-center font-black uppercase">Découpage des mots...</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
      <div className="text-center">
        <div className="flex justify-center gap-2 mb-2 text-emerald-600">
           <Scissors className="animate-bounce" />
           <span className="font-black uppercase tracking-tighter">La Syllabe Perdue</span>
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase">Reconstruis le mot dans le bon ordre</p>
      </div>

      {/* Zone d'affichage du mot */}
      <div className={`flex gap-3 min-h-[90px] items-center justify-center w-full max-w-xl rounded-[2rem] p-4 border-2 transition-all ${feedback === 'correct' ? 'bg-green-50 border-green-200' : 'bg-white/50 border-dashed border-emerald-200'}`}>
        <AnimatePresence>
          {builtWord.map((s, i) => (
            <motion.div
              key={`${s}-${i}`}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-2xl shadow-lg border-b-4 border-emerald-700 flex items-center gap-2"
            >
              {s}
            </motion.div>
          ))}
          {words[currentIndex]?.parts.slice(builtWord.length).map((_, i) => (
            <div key={`empty-${i}`} className="w-16 h-12 border-2 border-emerald-100 rounded-2xl bg-white/30" />
          ))}
        </AnimatePresence>
        
        {/* Petit indicateur visuel de lecture quand le mot est fini */}
        {feedback === 'correct' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-4 text-emerald-600">
            <Volume2 className="animate-pulse" />
          </motion.div>
        )}
      </div>

      {/* Syllabes à cliquer */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {shuffledSyllables.map((s, i) => {
          const countInBuilt = builtWord.filter(x => x === s).length;
          const countInOriginal = words[currentIndex].parts.filter(x => x === s).length;
          const isUsed = countInBuilt >= countInOriginal;

          return (
            <motion.button
              key={`${s}-${i}`}
              whileHover={!isUsed ? { scale: 1.05 } : {}}
              whileTap={!isUsed ? { scale: 0.95 } : {}}
              onClick={() => !isUsed && handleSyllableClick(s, i)}
              disabled={isUsed}
              className={`
                px-8 py-5 rounded-[2rem] font-black text-2xl shadow-xl transition-all border-b-8
                ${isUsed ? 'opacity-0 pointer-events-none' : 'bg-white border-slate-200 text-[#0d6e52] hover:border-emerald-300'}
                ${feedback === 'error' && !isUsed ? 'shake-anim border-red-500 text-red-500' : ''}
              `}
            >
              {s}
            </motion.button>
          );
        })}
      </div>

      <div className="text-slate-300 font-black text-[10px] uppercase">
        Mot {currentIndex + 1} / {words.length}
      </div>

      <style jsx>{`
        .shake-anim { animation: shake 0.5s ease-in-out; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default SyllableGame;