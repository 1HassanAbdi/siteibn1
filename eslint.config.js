import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Play, ArrowLeft, CheckCircle, XCircle, 
  Trophy, RefreshCw, Volume2, Star, BookOpen, Layers, MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const LexiqueExpert2A = () => {
  const [weeks, setWeeks] = useState([]);
  const [activeWeek, setActiveWeek] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [exerciseType, setExerciseType] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  // Données JSON intégrées (ou fetch)
  useEffect(() => {
    // Simuler le chargement du JSON fourni
    const data = { /* Ton JSON ici */ }; 
    // Pour l'exemple, on suppose que weeks est chargé via le fetch
    fetch('/2A/lexique.json').then(res => res.json()).then(d => setWeeks(d.weeks));
  }, []);

  const currentWeekData = weeks.find(w => w.id === activeWeek);
  const currentWord = currentWeekData?.data[currentStep];

  const handleAnswer = (answer) => {
    if (feedback) return;
    const correctValue = (exerciseType === 2) ? currentWord.article : (exerciseType === 4 ? currentWord.category : currentWord.word);
    const isCorrect = answer.toLowerCase().trim() === correctValue.toLowerCase().trim();

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(s => s + 1);
    setResults([...results, { word: currentWord.word, emoji: currentWord.emoji, success: isCorrect }]);

    setTimeout(() => {
      if (currentStep < currentWeekData.data.length - 1) {
        setCurrentStep(s => s + 1);
        setFeedback(null);
      } else {
        setIsFinished(true);
      }
    }, 1000);
  };

  const navItems = [
    { id: 1, label: "Mots", icon: <MousePointer2 size={18}/> },
    { id: 2, label: "Articles", icon: <Layers size={18}/> },
    { id: 3, label: "Phrases", icon: <BookOpen size={18}/> },
    { id: 4, label: "Catégories", icon: <Star size={18}/> },
    { id: 5, label: "Dictée", icon: <Play size={18}/> }
  ];

  if (!weeks.length) return null;

  return (
    <div className="min-h-screen bg-[#dee6e4] font-['Poppins'] pb-12">
      {/* HEADER */}
      <header className="bg-gradient-to-br from-[#0d6e52] to-[#15a278] pt-12 pb-28 text-center text-white rounded-b-[60px] shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-black mb-2 flex items-center justify-center gap-3 tracking-tight uppercase">
          <Sparkles className="text-yellow-300" /> LEXIQUE 2A
        </h1>
        <p className="opacity-90 font-medium">Apprendre l'orthographe en s'amusant</p>
      </header>

      <div className="max-w-5xl mx-auto px-4 -mt-20">
        <AnimatePresence mode="wait">
          {!activeWeek ? (
            /* --- SELECTION DES SEMAINES --- */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/90 backdrop-blur-md rounded-[50px] p-10 shadow-2xl border border-white">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                {weeks.map(w => (
                  <button key={w.id} onClick={() => {setActiveWeek(w.id); setIsFinished(false); setCurrentStep(0); setResults([]);}} 
                    className="group bg-slate-50 border-2 border-slate-100 p-6 rounded-[40px] hover:border-[#15a278] hover:bg-white hover:shadow-xl transition-all">
                    <span className="block text-[10px] font-black text-slate-400 mb-1">SEMAINE</span>
                    <span className="text-4xl font-black text-slate-800 group-hover:text-[#15a278]">{w.id}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* --- ZONE DE JEU --- */
            <div className="space-y-6">
              {/* BARRE DE NAVIGATION HAUTE (FIXE ET VISIBLE) */}
              <div className="flex flex-wrap justify-center gap-2 bg-white/90 p-2 rounded-[30px] shadow-lg border border-white sticky top-4 z-30">
                <button onClick={() => setActiveWeek(null)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-500 mr-2 border-r pr-4">
                  <ArrowLeft size={20} />
                </button>
                {navItems.map(item => (
                  <button key={item.id} onClick={() => {setExerciseType(item.id); setCurrentStep(0); setResults([]); setIsFinished(false);}}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all ${exerciseType === item.id ? 'bg-[#0d6e52] text-white shadow-lg' : 'text-slate-500 hover:bg-emerald-50'}`}>
                    {item.icon} <span className="hidden sm:inline">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* CARTE PRINCIPALE */}
              <div className="bg-[#fdfcf0] rounded-[60px] shadow-2xl border-4 border-white min-h-[550px] relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-12">
                {!isFinished ? (
                  <div className="w-full h-full flex flex-col items-center">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                      <motion.div className="h-full bg-emerald-500" initial={{width: 0}} animate={{width: `${((currentStep+1)/currentWeekData.data.length)*100}%`}} />
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={currentStep} initial={{scale: 0.9, opacity: 0}} animate={{scale: 1, opacity: 1}} className="w-full flex flex-col items-center">
                        
                        {/* Zone Image/Mot */}
                        <div className="mb-12 text-center">
                          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-7xl shadow-inner border-4 border-emerald-50 mb-4 mx-auto">
                            {currentWord.emoji}
                          </div>
                          {exerciseType !== 2 && exerciseType !== 3 && (
                            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-widest">{currentWord.word}</h2>
                          )}
                        </div>

                        {/* Organisation des choix (Uniforme) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                          {exerciseType === 1 && [currentWord.word, "soleil", "ballon", "maison"].slice(0, 4).sort().map(w => (
                            <button key={w} onClick={() => handleAnswer(w)} className="bg-white h-20 border-b-4 border-slate-200 hover:border-emerald-500 rounded-3xl text-xl font-black text-slate-700 hover:text-emerald-600 transition-all uppercase shadow-sm">
                              {w}
                            </button>
                          ))}

                          {exerciseType === 2 && ["un", "une", "le", "la", "des"].map(art => (
                            <button key={art} onClick={() => handleAnswer(art)} className="bg-white h-20 border-b-4 border-orange-200 hover:border-orange-500 rounded-3xl text-2xl font-black text-orange-600 transition-all uppercase shadow-sm">
                              {art}
                            </button>
                          ))}

                          {exerciseType === 4 && ["animal", "nature", "objet", "nourriture", "famille", "vêtement"].map(cat => (
                            <button key={cat} onClick={() => handleAnswer(cat)} className="bg-white h-16 border-b-4 border-blue-100 hover:border-blue-500 rounded-2xl text-sm font-black text-slate-500 hover:text-blue-600 transition-all uppercase shadow-sm">
                              {cat}
                            </button>
                          ))}
                        </div>

                        {/* Cas Spécial Phrase (Exercise 3) */}
                        {exerciseType === 3 && (
                          <div className="bg-white p-8 rounded-[40px] shadow-xl border-2 border-emerald-50 max-w-2xl text-center">
                            <p className="text-2xl font-bold text-slate-700 leading-relaxed mb-8">
                              {currentWord.sentence.replace('___', ' ❓ ')}
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                              {[currentWord.word, "petit", "grand"].map(opt => (
                                <button key={opt} onClick={() => handleAnswer(opt)} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black uppercase shadow-lg hover:bg-black transition-all">
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ) : (
                  <Bilan score={score} total={currentWeekData.data.length} results={results} onRetry={() => {setCurrentStep(0); setResults([]); setIsFinished(false); setScore(0);}} />
                )}

                {/* Feedback Overlay */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div initial={{opacity: 0, scale: 0.5}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0}} className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                      <div className={`${feedback === 'correct' ? 'bg-emerald-500' : 'bg-red-500'} p-12 rounded-[60px] shadow-2xl text-white flex flex-col items-center gap-4`}>
                        {feedback === 'correct' ? <CheckCircle size={80} /> : <XCircle size={80} />}
                        <span className="text-4xl font-black uppercase">
                          {feedback === 'correct' ? 'Bravo !' : 'Oups !'}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Bilan = ({ score, total, results, onRetry }) => (
  <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center w-full max-w-3xl">
    <Trophy size={100} className="text-yellow-400 mx-auto mb-6 animate-bounce" />
    <h2 className="text-5xl font-black text-slate-800 mb-2 uppercase tracking-tight">C'est terminé !</h2>
    <div className="bg-white rounded-[40px] p-8 shadow-xl border-2 border-emerald-50 mb-8">
       <div className="text-3xl font-black text-emerald-600 mb-6">Score final : {score} / {total}</div>
       <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
         {results.map((r, i) => (
           <div key={i} className={`p-3 rounded-2xl border-2 ${r.success ? 'border-emerald-100 bg-emerald-50' : 'border-red-100 bg-red-50'}`}>
             <div className="text-2xl">{r.emoji}</div>
             <div className={`text-[10px] font-black uppercase ${r.success ? 'text-emerald-700' : 'text-red-700'}`}>{r.word}</div>
           </div>
         ))}
       </div>
    </div>
    <button onClick={onRetry} className="bg-slate-900 text-white px-12 py-5 rounded-[30px] font-black uppercase shadow-2xl flex items-center gap-3 mx-auto hover:scale-105 transition-all">
      <RefreshCw /> Recommencer la semaine
    </button>
  </motion.div>
);

export default LexiqueExpert2A;