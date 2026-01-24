import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dna, Sparkles, Trophy, Zap, Target, HelpCircle, GraduationCap
} from 'lucide-react';

const WordTypeGame = ({ selectedLevel, activeWeek, onCorrect, onWrong, onFinish, onSetTotal }) => {
  const [weeksData, setWeeksData] = useState(null);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [step, setStep] = useState(0); 
  const [quizIndex, setQuizIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- AJOUT DES ÉTATS DE SCORE ---
  const [localScore, setLocalScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isCorrectLocal, setIsCorrectLocal] = useState(null);

  // Catégories
  // Catégories traduites
const categories = ["Noun", "Verb", "Adjective", "Others"];

  useEffect(() => {
    const loadLevelData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/data/cka/wordTypes${selectedLevel}A.json`);
        if (!response.ok) throw new Error("Fichier non trouvé");
        const data = await response.json();
        const dataKey = data.weeks_types || data.weeks_definitions;
        if (!dataKey) throw new Error("Structure JSON incorrecte");
        setWeeksData(dataKey);
      } catch (err) {
        setError(`Erreur: Vérifiez le fichier /data/cka/wordTypes${selectedLevel}A.json`);
      } finally {
        setLoading(false);
      }
    };
    loadLevelData();
  }, [selectedLevel]);

  const initGame = useCallback(() => {
    if (!weeksData) return;
    const weekContent = weeksData.find(w => Number(w.week_id) === Number(activeWeek));
    
    if (weekContent && weekContent.words_data) {
      const wordsToPlay = [...weekContent.words_data];
      setShuffledWords(wordsToPlay.sort(() => Math.random() - 0.5));
      
      // --- SYNCHRONISATION DU TOTAL ---
      if (onSetTotal) onSetTotal(wordsToPlay.length); 
      
      
      setQuizIndex(0);
      setLocalScore(0); 
      setSelectedChoice(null);
      setIsCorrectLocal(null);
    }
  }, [weeksData, activeWeek]);

  // Reset l'écran au début seulement quand la semaine change
  useEffect(() => {
    setStep(0);
    initGame();
  }, [activeWeek, selectedLevel, initGame]);

  const handleChoice = (choice) => {
    if (selectedChoice !== null) return;
    
    const correctType = shuffledWords[quizIndex].type;
    const isRight = choice.toLowerCase() === correctType.toLowerCase();
    
    setSelectedChoice(choice);
    setIsCorrectLocal(isRight);

    // --- CALCUL DU SCORE EXACT ---
    let updatedScore = localScore;
    if (isRight) {
      updatedScore = localScore + 1;
      setLocalScore(updatedScore);
      onCorrect();
    } else {
      onWrong();
    }

    setTimeout(() => {
      if (quizIndex < shuffledWords.length - 1) {
        setQuizIndex(i => i + 1);
        setSelectedChoice(null);
        setIsCorrectLocal(null);
      } else {
        // --- ENVOI DU RÉSULTAT FINAL ---
        onFinish(updatedScore, shuffledWords.length);
      }
    }, 800);
  };

  
if (loading) return <div className="p-20 text-center animate-pulse text-blue-600 font-black uppercase tracking-widest">Analyzing grammar...</div>;
if (error) return <div className="p-20 text-center text-red-500 font-bold bg-white rounded-3xl shadow-lg">{error}</div>;
  return (
    <div className="flex flex-col h-full font-['Poppins']">
      <div className="p-6 flex-1">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="intro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center py-10">
              <div className="relative inline-block mb-6">
                  <GraduationCap size={100} className="text-blue-500" />
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-2 -right-2 text-yellow-400">
                      <Sparkles fill="currentColor" size={40} />
                  </motion.div>
              </div>
              <h2 className="text-5xl font-black text-[#0d6e52] mb-4 uppercase italic">TRIO-GRAMMAIRE</h2>
              <p className="text-slate-500 font-bold text-lg mb-12">Sais-tu reconnaître la nature des mots ?</p>
              
              <button onClick={() => setStep(1)} className="bg-gradient-to-r from-blue-500 to-indigo-600 border-b-8 border-indigo-800 text-white p-6 rounded-[2rem] font-black text-3xl shadow-xl hover:translate-y-1 transition-all uppercase px-12">
                Commencer ! 🚀
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto w-full pt-4">
              <div className="text-center mb-10 min-h-[160px] flex flex-col items-center justify-center bg-white p-8 rounded-[3rem] shadow-xl border-4 border-blue-50 relative">
                  <Dna className="absolute -top-8 text-blue-100 opacity-50" size={100} />
                  <p className="text-slate-400 font-black uppercase text-[10px] mb-4 tracking-widest">Quelle est la nature du mot :</p>
                  <h3 className="text-5xl md:text-6xl font-black text-slate-800 leading-tight capitalize tracking-tighter">
                    {shuffledWords[quizIndex]?.word}
                  </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {categories.map((choice, i) => {
                  const isSelected = selectedChoice === choice;
                  let btnClass = "bg-white border-b-8 border-slate-200 text-slate-700 hover:bg-blue-50";
                  
                  if (isSelected) {
                      btnClass = isCorrectLocal ? "bg-green-500 border-green-700 text-white" : "bg-red-500 border-red-700 text-white shake-anim";
                  }

                  return (
                    <motion.button 
                      key={i} 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleChoice(choice)} 
                      className={`${btnClass} p-6 rounded-3xl text-xl md:text-2xl font-black transition-all shadow-lg border-x border-t border-slate-50`}
                    >
                      {choice}
                    </motion.button>
                  );
                })}
              </div>
              
              <p className="text-center mt-12 text-slate-400 font-black text-sm uppercase tracking-widest">
                Mot {quizIndex + 1} / {shuffledWords.length}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .shake-anim { animation: shake 0.5s ease-in-out; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default WordTypeGame;