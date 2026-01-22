import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, FileQuestion, BookOpen, Trophy, ArrowRight, Star, GraduationCap } from 'lucide-react';

const DefinitionGame = ({ selectedLevel }) => {
  const [weeksData, setWeeksData] = useState(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [step, setStep] = useState(0); // 0: Start, 1: Learning, 2: Quiz
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger le JSON dynamiquement selon l'année choisie
  useEffect(() => {
    const loadLevelData = async () => {
      setLoading(true);
      setError(null);
      setWeeksData(null);
      
      const fileName = `/data/definitions${selectedLevel}A1.json`;
      
      try {
        const response = await fetch(fileName);
        if (!response.ok) throw new Error(`Dictionnaire ${selectedLevel}A introuvable.`);
        
        const data = await response.json();
        if (data && data.weeks_definitions) {
          setWeeksData(data.weeks_definitions);
        } else {
          throw new Error("Format de données invalide.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLevelData();
  }, [selectedLevel]);

  const resetGame = () => {
    setStep(0);
    setQuizIndex(0);
    setScore(0);
    setShowResult(false);
  };

  const handleNextQuiz = (isCorrect) => {
    if (isCorrect) setScore(s => s + 1);
    if (quizIndex < words.length - 1) {
      setQuizIndex(i => i + 1);
    } else {
      setShowResult(true);
    }
  };

  // --- Écrans d'état (Loading & Error) ---
  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[3rem] shadow-xl border-4 border-indigo-50">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
        <Brain className="text-indigo-600" size={60} />
      </motion.div>
      <p className="mt-6 font-black text-indigo-900 uppercase tracking-tighter text-xl">Ouverture du dictionnaire...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] shadow-xl border-4 border-orange-100 border-dashed">
      <FileQuestion size={80} className="text-orange-400 mb-4" />
      <h3 className="text-2xl font-black text-indigo-900 uppercase">Fichier non trouvé</h3>
      <p className="text-slate-500 font-bold mt-2 text-center max-w-sm">
        Le dictionnaire pour la <b>{selectedLevel}e année</b> n'est pas encore dans le dossier <i>public</i>.
      </p>
      <div className="mt-6 px-4 py-2 bg-slate-50 rounded-xl text-xs font-mono text-slate-400">
        Attendu: public/data/definitions{selectedLevel}A.json
      </div>
    </div>
  );

  const activeWeek = weeksData[currentWeekIndex];
  const words = activeWeek?.words_data || [];

  // Générateur de mauvaises réponses pour le Quiz
  const generateChoices = () => {
    const correct = words[quizIndex].word;
    const others = words
      .filter(w => w.word !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.word);
    return [correct, ...others].sort();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gradient-to-b from-indigo-50 to-white rounded-[3rem] shadow-2xl border-8 border-white overflow-hidden">
      
      {/* Sélecteur de Semaines */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-4 scrollbar-hide no-scrollbar">
        {weeksData.map((w, idx) => (
          <button
            key={idx}
            onClick={() => { setCurrentWeekIndex(idx); resetGame(); }}
            className={`px-5 py-2 rounded-2xl font-black text-sm whitespace-nowrap transition-all ${
              currentWeekIndex === idx 
              ? 'bg-indigo-600 text-white shadow-lg scale-110' 
              : 'bg-white text-indigo-300 hover:text-indigo-600 border-2 border-indigo-50'
            }`}
          >
            S{w.week_id}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ÉCRAN ACCUEIL */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="text-center py-10">
            <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full mb-6 shadow-md">
                <GraduationCap size={20} />
                <span className="font-black uppercase tracking-widest text-sm italic">{selectedLevel}e Année</span>
            </div>
            <h2 className="text-5xl font-black text-indigo-900 mb-4 tracking-tighter">GÉNIE DES MOTS</h2>
            <p className="text-slate-500 font-bold text-lg mb-10 italic underline decoration-yellow-400 decoration-4">S{activeWeek.week_id} : {words.length} mots à découvrir</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button onClick={() => setStep(1)} className="group bg-white border-b-8 border-indigo-200 text-indigo-600 px-10 py-5 rounded-3xl font-black text-xl hover:translate-y-1 hover:border-b-4 transition-all flex items-center gap-3 justify-center">
                <BookOpen className="group-hover:rotate-12 transition-transform" /> RÉVISER
              </button>
              <button onClick={() => setStep(2)} className="group bg-yellow-400 border-b-8 border-yellow-600 text-yellow-900 px-10 py-5 rounded-3xl font-black text-xl hover:translate-y-1 hover:border-b-4 transition-all flex items-center gap-3 justify-center">
                DÉFI QUIZ 🚀
              </button>
            </div>
          </motion.div>
        )}

        {/* ÉCRAN APPRENTISSAGE */}
        {step === 1 && (
          <motion.div key="step1" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {words.map((item, idx) => (
              <motion.div whileHover={{ scale: 1.02 }} key={idx} className="bg-white p-5 rounded-[2rem] shadow-sm border-2 border-indigo-50">
                <h4 className="text-indigo-600 font-black text-xl mb-1 uppercase tracking-tight">{item.word}</h4>
                <p className="text-slate-600 font-medium leading-tight">{item.definition}</p>
              </motion.div>
            ))}
            <div className="col-span-full mt-10">
               <button onClick={() => setStep(2)} className="w-full bg-indigo-900 text-white py-6 rounded-3xl font-black text-2xl shadow-xl hover:bg-black transition-all uppercase tracking-widest">
                 Démarrer le Quiz !
               </button>
            </div>
          </motion.div>
        )}

        {/* ÉCRAN QUIZ */}
        {step === 2 && !showResult && (
          <motion.div key="step2" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-10">
               <div className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full font-black text-xs uppercase">Question {quizIndex + 1} / {words.length}</div>
               <div className="flex items-center gap-2 text-yellow-500 font-black"><Star fill="currentColor" size={18} /> {score}</div>
            </div>
            
            <div className="text-center mb-12">
               <h3 className="text-3xl font-black text-indigo-900 leading-tight italic">"{words[quizIndex].definition}"</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {generateChoices().map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleNextQuiz(choice === words[quizIndex].word)}
                  className="bg-white border-4 border-indigo-50 p-6 rounded-[2rem] text-2xl font-black text-indigo-800 hover:border-indigo-600 hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
                >
                  {choice}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ÉCRAN RÉSULTAT */}
        {showResult && (
          <motion.div key="result" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
            <Trophy size={120} className="mx-auto text-yellow-500 mb-6 drop-shadow-lg" />
            <h2 className="text-6xl font-black text-indigo-900 mb-2 uppercase tracking-tighter">SUCCÈS !</h2>
            <p className="text-3xl font-bold text-indigo-500 mb-10">Score : {score} sur {words.length}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <button onClick={resetGame} className="bg-slate-200 text-slate-700 px-10 py-5 rounded-3xl font-black text-xl uppercase transition-all hover:bg-slate-300">Recommencer</button>
               <button 
                 onClick={() => { if(currentWeekIndex < weeksData.length -1) { setCurrentWeekIndex(i => i+1); resetGame(); } }}
                 className="bg-green-500 text-white px-10 py-5 rounded-3xl font-black text-xl uppercase shadow-lg transition-all hover:bg-green-600 flex items-center gap-2"
               >
                 Suivant <ArrowRight />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DefinitionGame;