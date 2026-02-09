import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Volume2, ArrowLeft, Trophy, BookOpen, GraduationCap, 
  CheckCircle, XCircle, Sparkles, Timer, RefreshCw, Clock, Brain, Search, Pencil, 
  AlertCircle, Target, Flame, ChevronRight, Scissors 
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// Mini-games imports restant
import DefinitionGame from './DefinitionGame';
import WordMystery from './WordMystery';
import WordTypeGame from './WordTypeGame';
import WorkHistory from './WorkHistory';

const formatTime = (s) => {
  const mins = Math.floor(s / 60);
  const secs = (s % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const DictationAppcka = () => {
  // --- DATE LOGIC (2026 Preparation Week) ---
  const getCurrentWeekId = () => {
    const today = new Date();
    const startDate = new Date(2026, 0, 9); 
    const diff = today - startDate;
    const week = Math.ceil((Math.floor(diff / (1000 * 60 * 60 * 24)) + 1) / 7);
    return week > 0 ? week : 1;
  };

  const currentWeekId = getCurrentWeekId();

  // --- STRUCTURAL STATES ---
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [levelData, setLevelData] = useState(null);
  const [activeWeek, setActiveWeek] = useState(null); 
  const [mode, setMode] = useState('study'); 
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  // --- GAME & SCORE STATES ---
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [errors, setErrors] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionTotal, setSessionTotal] = useState(0);

  // --- CHRONO ---
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const levels = [
    { id: 2, label: 'Grade 2', color: 'from-teal-400 to-emerald-600' },
    { id: 3, label: 'Grade 3', color: 'from-emerald-500 to-teal-700' },
    { id: 4, label: 'Grade 4', color: 'from-green-400 to-emerald-600' },
    { id: 5, label: 'Grade 5', color: 'from-cyan-500 to-teal-600' },
    { id: 6, label: 'Grade 6', color: 'from-blue-500 to-indigo-600' },
    { id: 7, label: 'Grade 7', color: 'from-purple-500 to-pink-600' },
    { id: 8, label: 'Grade 8', color: 'from-orange-500 to-red-600' },
  ];

  // --- INITIALIZATION ---
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // --- TIMER MANAGEMENT ---
  useEffect(() => {
    if (isTimerRunning && !isFinished && mode !== 'study') {
      timerRef.current = setInterval(() => setTotalSeconds(p => p + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, isFinished, mode]);

  // --- DATA LOGIC ---
  const getActiveWords = () => {
    if (!levelData || !activeWeek) return [];
    const week = levelData.weeks?.find(w => Number(w.id) === Number(activeWeek));
    return week ? (week.words || []) : [];
  };

  const handleLevelSelect = async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/data/cka/JSON${id}A.json`);
      if (!res.ok) throw new Error();
      const d = await res.json();
      setLevelData(d);
      setSelectedLevel(id);
    } catch (e) {
      alert("Error loading file.");
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = (weekId, chosenMode) => {
    const weekObj = levelData.weeks?.find(w => Number(w.id) === Number(weekId));
    const words = weekObj?.words || [];
    
    setActiveWeek(Number(weekId));
    setMode(chosenMode);
    setCurrentWordIndex(0);
    setUserInput('');
    setFeedback(null);
    setCorrectCount(0);
    setWrongCount(0);
    setErrors([]);
    setIsFinished(false);
    setTotalSeconds(0);
    setSessionTotal(words.length);
    setIsTimerRunning(true);
  };

  const saveExerciseResult = (finalScore, finalTotal) => {
    setIsFinished(true);
    setIsTimerRunning(false);
    
    const scoreToSave = typeof finalScore === 'number' ? finalScore : correctCount;
    const totalToSave = typeof finalTotal === 'number' ? finalTotal : sessionTotal;

    const history = JSON.parse(localStorage.getItem('eleve_history') || '[]');
    const newEntry = {
      type: mode.toUpperCase(),
      score: scoreToSave,
      total: totalToSave,
      week: activeWeek,
      level: selectedLevel,
      date: new Date().toISOString(),
      duration: totalSeconds 
    };
    
    localStorage.setItem('eleve_history', JSON.stringify([newEntry, ...history].slice(0, 50)));
  };

  const handleSpeak = (word) => {
    const text = word || getActiveWords()[currentWordIndex];
    if (!text) return;
    const cleanWord = text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, "").replace(/\s+/g, "_");
    const audioPath = `/audio/cka/${selectedLevel}A/Semaine_${activeWeek}/${cleanWord}.mp3`;
    const audio = new Audio(audioPath);
    audio.play().catch(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR'; 
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleCheck = (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || feedback) return;

    const words = getActiveWords();
    const correct = words[currentWordIndex].trim();
    
    if (userInput.trim().toLowerCase() === correct.toLowerCase()) {
      setFeedback('correct');
      const newScore = correctCount + 1;
      setCorrectCount(newScore);
      
      setTimeout(() => {
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(i => i + 1);
          setUserInput('');
          setFeedback(null);
        } else {
          saveExerciseResult(newScore, sessionTotal);
        }
      }, 800);
    } else {
      setFeedback('incorrect');
      setWrongCount(w => w + 1);
      setErrors(p => [...p, { correct, typed: userInput }]);
      
      setTimeout(() => {
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(i => i + 1);
          setUserInput('');
          setFeedback(null);
        } else {
          saveExerciseResult(correctCount, sessionTotal);
        }
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#dee6e4] font-['Poppins'] pb-12 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="bg-gradient-to-br from-[#0d6e52] to-[#15a278] pt-12 pb-24 text-center text-white rounded-b-[60px] shadow-2xl relative">
        <div className="absolute top-4 right-4 flex gap-2">
           <button onClick={() => setShowHistory(true)} className="bg-white/20 p-3 rounded-full hover:bg-white/30 font-black text-xs flex items-center gap-2">
             <Clock size={18}/> <span className="hidden md:inline">MY HISTORY</span>
           </button>
        </div>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-black mb-2 flex items-center justify-center gap-3 tracking-tighter uppercase text-white">
             <Target className="text-yellow-300 w-10 h-10" /> 2026 Contest Mission
          </h1>
          <p className="opacity-95 font-bold bg-black/10 inline-block px-6 py-1 rounded-full text-sm">
            Preparation Week {currentWeekId}
          </p>
        </motion.div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 relative z-10">
        <AnimatePresence mode="wait">
          
          {isLoading ? (
            <motion.div key="loader" exit={{ opacity: 0 }} className="bg-white rounded-[40px] p-20 flex flex-col items-center shadow-xl min-h-[400px] justify-center">
               <RefreshCw className="animate-spin text-[#0d6e52] mb-4" size={40} />
               <p className="font-black text-[#0d6e52]">LOADING PROGRAM...</p>
            </motion.div>
          ) : showHistory ? (
            <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] p-8 shadow-2xl min-h-[500px]">
               <button onClick={() => setShowHistory(false)} className="mb-6 flex items-center gap-2 text-[#0d6e52] font-black uppercase text-sm hover:translate-x-[-4px] transition-all">
                 <ArrowLeft size={20}/> Back to Mission
               </button>
               <h2 className="text-2xl font-black mb-6 text-slate-800 uppercase tracking-tighter">My Recent Achievements</h2>
               <WorkHistory />
            </motion.div>
          ) : !selectedLevel ? (
            <motion.div key="levels" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
              {levels.map((lvl) => (
                <button key={lvl.id} onClick={() => handleLevelSelect(lvl.id)}
                  className="bg-white p-6 rounded-[40px] shadow-xl hover:-translate-y-2 transition-all text-left group border-b-8 border-emerald-50">
                  <div className={`bg-gradient-to-br ${lvl.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                    <GraduationCap size={28} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">{lvl.label}</h3>
                  <div className="text-[#15a278] font-black text-[10px] uppercase mt-4 flex items-center gap-2">Enter Classroom <ChevronRight size={14} /></div>
                </button>
              ))}
            </motion.div>
          ) : !activeWeek ? (
            <motion.div key="roadmap" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <button onClick={() => setSelectedLevel(null)} className="flex items-center gap-2 bg-white/60 px-6 py-3 rounded-full font-bold text-[#0d6e52] hover:bg-white transition-all shadow-sm">
                <ArrowLeft size={18} /> Change Grade
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[40px] p-8 shadow-2xl border-4 border-emerald-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-8 py-2 font-black rounded-bl-3xl shadow-md uppercase text-xs">Week {currentWeekId}</div>
                  <h2 className="text-3xl font-black text-[#0d6e52] uppercase mb-2">Your Weekly Mission</h2>
                  <p className="text-slate-500 font-bold mb-8 italic">Complete each step to become a champion!</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'study', title: "1. Discover", desc: "Memorize and listen to words.", icon: <BookOpen className="text-blue-500"/> },
                      { id: 'syllabe', title: "2. Syllables", desc: "Break it down to write better.", icon: <Scissors className="text-emerald-500"/> },
                      { id: 'definition', title: "3. Meaning", desc: "Understand what you write.", icon: <Search className="text-purple-500"/> },
                      { id: 'nature', title: "4. Grammar", desc: "Find the word category.", icon: <Brain className="text-pink-500"/> },
                      { id: 'mystere', title: "5. Mystery Game", desc: "Guess the hidden word.", icon: <Sparkles className="text-amber-500"/> },
                      { id: 'test', title: "6. The Dictation", desc: "Final test, zero mistakes!", icon: <Pencil className="text-red-500"/> },
                    ].map((step) => (
                      <button 
                        key={step.id} 
                        onClick={() => startSession(currentWeekId, step.id)}
                        className="flex items-center gap-4 p-5 rounded-[25px] bg-slate-50 hover:bg-emerald-50 border-2 border-transparent hover:border-emerald-200 transition-all text-left group"
                      >
                        <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">{step.icon}</div>
                        <div>
                          <h4 className="font-black text-slate-800 text-sm uppercase">{step.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold">{step.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-8 text-white text-center shadow-2xl flex flex-col justify-center">
                  <Flame size={60} className="text-orange-400 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">Objective: May 2026</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 italic">
                    "Success is the sum of small efforts repeated every day."
                  </p>
                  <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                    <span className="text-4xl font-black text-emerald-400 italic">#{currentWeekId}</span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Current Sequence</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="game" className="space-y-6">
              <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-white">
                <button onClick={() => setActiveWeek(null)} className="p-3 text-[#0d6e52] hover:bg-slate-100 rounded-full transition-all">
                  <ArrowLeft size={24} />
                </button>
                <div className="font-black text-[#0d6e52] text-[11px] uppercase tracking-widest bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100 shadow-inner">
                   {mode.toUpperCase()} — WEEK {activeWeek}
                </div>
                <div className="w-10"></div>
              </div>

              <div className="bg-[#fdfcf0] rounded-[40px] shadow-2xl min-h-[550px] flex flex-col relative overflow-hidden border-4 border-white">
                {mode !== 'study' && !isFinished && (
                  <div className="bg-[#0d6e52] p-4 flex justify-between items-center text-white px-10">
                    <div className="flex gap-8 font-black text-xs uppercase">
                      <div className="flex items-center gap-2 text-green-300">
                        <CheckCircle size={18}/> <span>Score: {correctCount} / {sessionTotal}</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-300">
                        <XCircle size={18}/> <span>Mistakes: {wrongCount}</span>
                      </div>
                    </div>
                    <div className="bg-black/20 px-4 py-1 rounded-lg font-mono text-lg font-black text-emerald-300 border border-white/10">
                      {formatTime(totalSeconds)}
                    </div>
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {isFinished ? (
                      <motion.div key="finished" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-10 text-center max-h-[550px] overflow-y-auto">
                        <Trophy size={80} className="text-yellow-500 mx-auto mb-4 drop-shadow-lg" />
                        <h2 className="text-4xl font-black text-slate-800 mb-2 uppercase italic">Mission Accomplished!</h2>
                        <div className="text-7xl font-black text-[#0d6e52] mb-10 bg-emerald-50 inline-block px-12 py-6 rounded-[40px] shadow-inner border-2 border-emerald-100">
                          {correctCount} <span className="text-slate-300 text-3xl">/ {sessionTotal}</span>
                        </div>
                        <div className="max-w-xl mx-auto space-y-6">
                          {errors.length > 0 && (
                            <div className="bg-red-50 p-6 rounded-3xl border-2 border-red-100 text-left">
                              <h4 className="text-red-600 font-black uppercase text-xs mb-4 flex items-center gap-2"><AlertCircle size={16}/> Error Analysis:</h4>
                              {errors.map((err, i) => (
                                <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl mb-2 shadow-sm border border-red-50">
                                  <span className="text-red-400 line-through font-bold text-lg">{err.typed || "(empty)"}</span>
                                  <span className="text-emerald-600 font-black text-xl uppercase tracking-tighter">{err.correct}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={() => startSession(activeWeek, mode)} className="flex-1 bg-slate-900 text-white py-5 rounded-3xl font-black uppercase shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2">
                              <RefreshCw size={20} /> Try Again
                            </button>
                            <button onClick={() => setActiveWeek(null)} className="flex-1 bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                              Mission Menu <ChevronRight size={20}/>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : mode === 'study' ? (
                      <motion.div key="study" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 text-center">
                        <h3 className="text-3xl font-black text-[#0d6e52] mb-10 uppercase italic">Word Workshop</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                          {getActiveWords().map((w, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-slate-100">
                              <span className="text-2xl font-black text-slate-700 capitalize">{w}</span>
                              <button onClick={() => handleSpeak(w)} className="bg-emerald-50 p-3 rounded-xl text-[#0d6e52] hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                                <Volume2 size={24} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => { setMode('syllabe'); }} className="mt-12 bg-[#0d6e52] text-white px-12 py-5 rounded-3xl font-black uppercase shadow-xl hover:scale-105 transition-all">
                          Ready for Training!
                        </button>
                      </motion.div>
                    ) : mode === 'test' ? (
                      <motion.div key="test" className="p-12 text-center flex flex-col items-center">
                        <button onClick={() => handleSpeak()} className="bg-[#15a278] w-28 h-28 rounded-full text-white shadow-2xl flex items-center justify-center mb-10 group">
                          <Volume2 size={50} className="group-hover:scale-110 transition-transform" />
                        </button>
                        <form onSubmit={handleCheck} className="w-full max-w-md">
                          <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Type the word..." autoFocus 
                            disabled={!!feedback}
                            className={`w-full bg-white border-4 rounded-[30px] py-6 px-6 text-center text-4xl font-black outline-none transition-all shadow-inner ${feedback === 'correct' ? 'border-green-400 text-green-600' : feedback === 'incorrect' ? 'border-red-400 text-red-600 shake' : 'border-slate-100'}`} />
                          <p className="mt-8 text-slate-400 font-black uppercase text-[11px] tracking-widest bg-slate-100 py-2 rounded-full inline-block px-6 shadow-sm">
                            Word {currentWordIndex + 1} of {sessionTotal}
                          </p>
                        </form>
                      </motion.div>
                    ) : (
                      <div className="p-4 md:p-8 flex-1 overflow-y-auto">
                        {mode === 'nature' && (
                          <WordTypeGame 
                            selectedLevel={selectedLevel} 
                            activeWeek={activeWeek} 
                            onCorrect={() => setCorrectCount(c => c + 1)} 
                            onWrong={() => setWrongCount(w => w + 1)} 
                            onSetTotal={(num) => setSessionTotal(num)}
                            onFinish={(score, total) => saveExerciseResult(score, total)} 
                          />
                        )}
                        {/* Note: SyllableGame, DefinitionGame and WordMystery components should be imported if they are used here */}
                         {/* DEFINITION (Correction ici : on retire le -1) */}
  {mode === 'definition' && (
  <DefinitionGame 
    selectedLevel={selectedLevel} 
    activeWeek={activeWeek} 
    onCorrect={() => setCorrectCount(c => c + 1)} 
    onWrong={() => setWrongCount(w => w + 1)} 
    // On récupère score ET total depuis le composant enfant
     onSetTotal={(num) => setSessionTotal(num)} // <--- AJOUTEZ CETTE LIGNE
    onFinish={(finalScore, finalTotal) => saveExerciseResult(finalScore, finalTotal)} 
  />
)}
{/* MYSTERE */}
  {mode === 'mystere' && (
    <WordMystery 
      words={getActiveWords()} 
      activeWeek={activeWeek} 
      onCorrect={() => setCorrectCount(c => c + 1)} 
      onWrong={() => setWrongCount(w => w + 1)} 
      onSetTotal={(num) => setSessionTotal(num)} // <--- AJOUTEZ CETTE LIGNE
     
    // On s'assure de passer score et total à la fin
    onFinish={(score, total) => saveExerciseResult(score, total)} 
   
    />
  )}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .shake { animation: shake 0.4s ease-in-out; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default DictationAppcka;