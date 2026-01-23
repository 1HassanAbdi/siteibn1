import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, BookOpen, Zap, Target, ChevronRight } from 'lucide-react';

const DefinitionGame = ({ selectedLevel, activeWeek, onCorrect, onWrong, onFinish, onSetTotal }) => { // <--- AJOUTEZ ICI
  const [weeksData, setWeeksData] = useState(null);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [step, setStep] = useState(0); 
  const [quizIndex, setQuizIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [localScore, setLocalScore] = useState(0); 
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isCorrectLocal, setIsCorrectLocal] = useState(null);

  // Chargement des données
  useEffect(() => {
    const loadLevelData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/data/cka/definitions${selectedLevel}A.json`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setWeeksData(data.weeks_definitions);
      } catch (err) {
        setError(`Erreur de chargement du dictionnaire.`);
      } finally {
        setLoading(false);
      }
    };
    loadLevelData();
  }, [selectedLevel]);

  // Initialisation du jeu
  const initGame = useCallback(() => {
    if (!weeksData) return;
    const weekContent = weeksData.find(w => Number(w.week_id) === Number(activeWeek));
    if (weekContent) {
      // On prend exactement les mots du JSON
      const wordsFromJson = [...weekContent.words_data];
       // --- AJOUTEZ CETTE LIGNE ICI ---
    if (onSetTotal) onSetTotal(wordsFromJson.length); 
      setShuffledWords(wordsFromJson.sort(() => Math.random() - 0.5));
      setStep(0);
      setQuizIndex(0);
      setLocalScore(0);
      setSelectedChoice(null);
      setIsCorrectLocal(null);
    }
  }, [weeksData, activeWeek]);

  useEffect(() => { initGame(); }, [initGame]);

  const handleChoice = (choice) => {
    if (selectedChoice !== null) return;
    
    const correctWord = shuffledWords[quizIndex].word;
    const isRight = choice === correctWord;
    
    setSelectedChoice(choice);
    setIsCorrectLocal(isRight);

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
        // --- LOGIQUE CRITIQUE ICI ---
        // On envoie le score final ET la longueur exacte du tableau JSON
        onFinish(updatedScore, shuffledWords.length);
      }
    }, 800);
  };

  const choices = useMemo(() => {
    if (!shuffledWords[quizIndex] || !weeksData) return [];
    const correct = shuffledWords[quizIndex].word;
    const weekContent = weeksData.find(w => Number(w.week_id) === Number(activeWeek));
    
    const others = weekContent.words_data
      .filter(w => w.word !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.word);
      
    return [correct, ...others].sort();
  }, [quizIndex, shuffledWords, weeksData, activeWeek]);

  if (loading) return <div className="p-20 text-center animate-pulse text-emerald-600 font-black">Chargement...</div>;
  if (error) return <div className="p-20 text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="flex flex-col h-full font-['Poppins']">
      <div className="p-4 md:p-6 flex-1">
        <AnimatePresence mode="wait">
          
          {step === 0 && (
            <motion.div key="intro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
              <Brain size={80} className="text-emerald-500 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-[#0d6e52] mb-4 uppercase italic">DÉFI DÉFINITIONS</h2>
              <p className="text-slate-500 font-bold mb-10">Mots à trouver : {shuffledWords.length}</p>
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button onClick={() => setStep(1)} className="bg-white border-b-8 border-slate-200 p-5 rounded-3xl font-black text-[#0d6e52]">RÉVISER</button>
                <button onClick={() => setStep(2)} className="bg-emerald-500 border-b-8 border-emerald-700 p-5 rounded-3xl font-black text-white text-2xl uppercase">JOUER 🚀</button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h3 className="text-center text-[#0d6e52] font-black text-2xl mb-4">Mémorise les {shuffledWords.length} mots</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto p-2">
                  {shuffledWords.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border-l-4 border-emerald-500 shadow-sm">
                      <h4 className="text-emerald-600 font-black capitalize">{item.word}</h4>
                      <p className="text-slate-600 text-sm italic">{item.definition}</p>
                  </div>
                  ))}
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase shadow-lg">Continuer</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto w-full">
              <div className="text-center mb-8 bg-white p-8 rounded-[2rem] shadow-xl border-4 border-emerald-50">
                  <p className="text-slate-400 font-black text-[10px] mb-2 uppercase tracking-widest">Définition :</p>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 italic">
                      "{shuffledWords[quizIndex]?.definition}"
                  </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {choices.map((choice, i) => {
                  const isSelected = selectedChoice === choice;
                  let btnClass = "bg-white border-b-8 border-slate-200 text-slate-700";
                  if (isSelected) {
                      btnClass = isCorrectLocal ? "bg-green-500 border-green-700 text-white" : "bg-red-500 border-red-700 text-white shake-anim";
                  }
                  return (
                    <motion.button key={i} whileTap={{ scale: 0.98 }} onClick={() => handleChoice(choice)} className={`${btnClass} p-5 rounded-2xl text-xl font-black transition-all capitalize`}>
                      {choice}
                    </motion.button>
                  );
                })}
              </div>
              <p className="text-center mt-8 text-slate-400 font-black text-xs uppercase">
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

export default DefinitionGame;