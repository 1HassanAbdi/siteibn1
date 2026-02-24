import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Volume2, ArrowLeft, Trophy, BookOpen, GraduationCap, 
  CheckCircle, XCircle, Sparkles, Timer, RefreshCw, Clock, Brain, Search, Pencil, 
  AlertCircle, Lightbulb, Target, Flame, ChevronRight, Scissors, TrendingUp 
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// Importation des mini-jeux
import DefinitionGame from './DefinitionGame';
import WordMystery from './WordMystery';
import WordTypeGame from './WordTypeGame';
import SyllableGame from './SyllableGame';
import WorkHistory from './WorkHistory';
import ConcoursEvaluator from './ConcoursEvaluator';
import EvaluationGame from './EvaluationGameSem'; 
import Evolution from "./TeacherDashboard";


const formatTime = (s) => {
  const mins = Math.floor(s / 60);
  const secs = (s % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const DictationApp1 = () => {
  // --- LOGIQUE DE DATE ---
  const getCurrentWeekId = () => {
    const today = new Date();
    const startDate = new Date(2026, 0, 9); 
    const diff = today - startDate;
    const week = Math.ceil((Math.floor(diff / (1000 * 60 * 60 * 24)) + 1) / 7);
    return week > 0 ? week : 1;
  };

  const currentWeekId = getCurrentWeekId();

  // --- ÉTATS STRUCTURELS ---
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [levelData, setLevelData] = useState(null);
  const [activeWeek, setActiveWeek] = useState(null); 
  const [mode, setMode] = useState('etude'); 
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showEvolution, setShowEvolution] = useState(false);
  const [view, setView] = useState('training');

  // --- ÉTATS DU JEU & SCORE ---
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
    { id: 2, label: '2e Année', color: 'from-teal-400 to-emerald-600' },
    { id: 3, label: '3e Année', color: 'from-emerald-500 to-teal-700' },
    { id: 4, label: '4e Année', color: 'from-green-400 to-emerald-600' },
    { id: 5, label: '5e Année', color: 'from-cyan-500 to-teal-600' },
    { id: 6, label: '6e Année', color: 'from-blue-500 to-indigo-600' },
    { id: 7, label: '7e Année', color: 'from-purple-500 to-pink-600' },
    { id: 8, label: '8e Année', color: 'from-orange-500 to-red-600' },
  ];

  const accents = ['à', 'â', 'æ', 'ç', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'œ', 'ù', 'û', 'ü', '«', '»'];

  const insertAccent = (accent) => {
    setUserInput(prev => prev + accent);
    const inputElement = document.querySelector('input[type="text"]');
    if (inputElement) inputElement.focus();
  };

  // --- INITIALISATION ---
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isTimerRunning && !isFinished && mode !== 'etude') {
      timerRef.current = setInterval(() => setTotalSeconds(p => p + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, isFinished, mode]);

  const getActiveWords = () => {
    if (!levelData) return [];
    if (activeWeek === 'CONCOURS') return levelData.words || [];
    const week = levelData.weeks?.find(w => Number(w.id) === Number(activeWeek));
    return week ? (week.words || []) : [];
  };

  const handleLevelSelect = async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/data/JSON${id}A.json`);
      if (!res.ok) throw new Error();
      const d = await res.json();
      setLevelData(d);
      setSelectedLevel(id);
    } catch (e) {
      alert("Erreur de chargement du fichier.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetStats = () => {
    setCurrentWordIndex(0);
    setUserInput('');
    setFeedback(null);
    setCorrectCount(0);
    setWrongCount(0);
    setErrors([]);
    setIsFinished(false);
    setTotalSeconds(0);
  };

  const startSession = (weekId, chosenMode) => {
    const weekObj = levelData.weeks?.find(w => Number(w.id) === Number(weekId));
    const words = weekObj?.words || [];
    resetStats();
    setActiveWeek(Number(weekId));
    setMode(chosenMode);
    setSessionTotal(words.length);
    setIsTimerRunning(true);
  };

  const saveExerciseResult = (finalScore, finalTotal) => {
    setIsFinished(true);
    setIsTimerRunning(false);
    
    const scoreAEnregistrer = typeof finalScore === 'number' ? finalScore : correctCount;
    const totalAEnregistrer = typeof finalTotal === 'number' ? finalTotal : sessionTotal;

    const history = JSON.parse(localStorage.getItem('eleve_history') || '[]');
    const newEntry = {
      type: mode.toUpperCase(),
      score: scoreAEnregistrer,
      total: totalAEnregistrer,
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
    const audioPath = `/audio/${selectedLevel}A/semaine${activeWeek}/${cleanWord}.mp3`;
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

  if (view === 'concours') {
    return <ConcoursEvaluator trainingData={levelData} selectedLevel={selectedLevel} onBack={() => setView('training')} />;
  }

  return (
    <div className="min-h-screen bg-[#dee6e4] font-['Poppins'] pb-12 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="bg-gradient-to-br from-[#0d6e52] to-[#15a278] pt-12 pb-24 text-center text-white rounded-b-[60px] shadow-2xl relative">
        <div className="absolute top-4 right-4 flex gap-2">
           <button onClick={() => setShowHistory(true)} className="bg-white/20 p-3 rounded-full hover:bg-white/30 font-black text-xs flex items-center gap-2">
             <Clock size={18}/> <span className="hidden md:inline">MON HISTORIQUE</span>
           </button>
           <button onClick={() => setShowEvolution(true)} className="bg-amber-500 p-3 rounded-full hover:bg-amber-600 font-black text-xs flex items-center gap-2 text-white shadow-lg">
             <TrendingUp size={18}/> <span className="hidden md:inline">EVOLUTION</span>
           </button>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-black mb-2 flex items-center justify-center gap-3 tracking-tighter uppercase text-white">
             <Target className="text-yellow-300 w-10 h-10" /> Mission Concours 2026
          </h1>
          <p className="opacity-95 font-bold bg-black/10 inline-block px-6 py-1 rounded-full text-sm">
            Semaine de Préparation {currentWeekId}
          </p>
        </motion.div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 relative z-10">
        <AnimatePresence mode="wait">
          
          {isLoading ? (
            <motion.div key="loader" exit={{ opacity: 0 }} className="bg-white rounded-[40px] p-20 flex flex-col items-center shadow-xl min-h-[400px] justify-center">
               <RefreshCw className="animate-spin text-[#0d6e52] mb-4" size={40} />
               <p className="font-black text-[#0d6e52]">CHARGEMENT DU PROGRAMME...</p>
            </motion.div>
          ) : showHistory ? (
            <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] p-8 shadow-2xl min-h-[500px]">
               <button onClick={() => setShowHistory(false)} className="mb-6 flex items-center gap-2 text-[#0d6e52] font-black uppercase text-sm hover:translate-x-[-4px] transition-all">
                 <ArrowLeft size={20}/> Retour à la mission
               </button>
               <h2 className="text-2xl font-black mb-6 text-slate-800 uppercase tracking-tighter">Mes derniers exploits</h2>
               <WorkHistory />
            </motion.div>
          ): showEvolution ? (
            <motion.div key="evolution" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[40px] p-8 shadow-2xl">
                <button onClick={() => setShowEvolution(false)} className="mb-6 flex items-center gap-2 text-[#0d6e52] font-black uppercase text-sm">
                    <ArrowLeft size={20}/> Retour
                </button>
                <Evolution />
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
                  <div className="text-[#15a278] font-black text-[10px] uppercase mt-4 flex items-center gap-2">Ouvrir ma classe <ChevronRight size={14} /></div>
                </button>
              ))}
            </motion.div>
          ) : !activeWeek ? (
            <motion.div key="roadmap" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <button onClick={() => setSelectedLevel(null)} className="flex items-center gap-2 bg-white/60 px-6 py-3 rounded-full font-bold text-[#0d6e52] hover:bg-white transition-all shadow-sm">
                <ArrowLeft size={18} /> Changer de classe
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[40px] p-8 shadow-2xl border-4 border-emerald-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-8 py-2 font-black rounded-bl-3xl shadow-md uppercase text-xs">Semaine {currentWeekId}</div>
                  <h2 className="text-3xl font-black text-[#0d6e52] uppercase mb-2">Ta mission de la semaine</h2>
                  <p className="text-slate-500 font-bold mb-8 italic">Complète chaque étape pour devenir champion !</p>
                  
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'etude', title: "1. Découvrir", desc: "Mémorise et écoute les mots.", icon: <BookOpen className="text-blue-500"/> },
                    { id: 'syllabe', title: "2. Syllabes", desc: "Découpe pour bien écrire.", icon: <Scissors className="text-emerald-500"/> },
                    { id: 'definition', title: "3. Sens", desc: "Comprends ce que tu écris.", icon: <Search className="text-purple-500"/> },
                    { id: 'nature', title: "4. Grammaire", desc: "Trouve la classe des mots.", icon: <Brain className="text-pink-500"/> },
                    { id: 'mystere', title: "5. Jeu Mystère", desc: "Devine le mot caché.", icon: <Sparkles className="text-amber-500"/> },
                    { id: 'test', title: "6. La Dictée", desc: "Test final sans faute !", icon: <Pencil className="text-red-500"/> },
                    { id: 'evaluation', title: "7. ÉVALUATION", desc: "Test final noté par le prof.", icon: <Trophy className="text-white"/> },
                  ].map((step) => {
                    const isEval = step.id === 'evaluation';
                    return (
                      <button 
                        key={step.id} 
                        onClick={() => {
                          if (isEval) {
                            setActiveWeek(currentWeekId);
                            setMode('evaluation');
                          } else {
                            startSession(currentWeekId, step.id);
                          }
                        }}
                        className={`flex items-center gap-4 p-5 rounded-[25px] transition-all text-left group border-2 relative overflow-hidden
                          ${isEval 
                            ? 'bg-[#1e1b4b] border-amber-400 shadow-lg hover:scale-[1.03]' 
                            : 'bg-slate-50 border-transparent hover:bg-emerald-50 hover:border-emerald-200'
                          }`}
                      >
                        <div className={`p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform 
                          ${isEval ? 'bg-gradient-to-br from-amber-400 to-orange-600' : 'bg-white'}`}>
                          {step.icon}
                        </div>
                        <div>
                          <h4 className={`font-black text-sm uppercase tracking-tight ${isEval ? 'text-amber-400' : 'text-slate-800'}`}>
                            {step.title}
                          </h4>
                          <p className={`text-[10px] font-bold ${isEval ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {step.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-8 text-white text-center shadow-2xl flex flex-col justify-center">
                  <Flame size={60} className="text-orange-400 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-black uppercase mb-4 tracking-tighter">Zone Concours</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 italic">
                    Prêt pour l'évaluation officielle des 3 semaines ?
                  </p>
                  
                  <button 
                    onClick={() => setView('concours')}
                    className="bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase transition-all shadow-lg active:scale-95 mb-6"
                  >
                    🏆 Lancer le Concours
                  </button>

                  <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                    <span className="text-4xl font-black text-emerald-400 italic">#{currentWeekId}</span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Séquence en cours</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="game" className="space-y-6">
              <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-white">
                <button
                  onClick={() => { setActiveWeek(null); resetStats(); }}
                  className="p-3 text-[#0d6e52] hover:bg-slate-100 rounded-full transition-all flex items-center gap-3"
                >
                  <div className="w-12 h-12 bg-white border-[4px] border-[#0d6e52] rounded-full flex items-center justify-center shadow-sm">
                    <ArrowLeft size={28} className="text-[#0d6e52]" strokeWidth={4} />
                  </div>
                  <span className="text-[#0d6e52] font-black text-xl uppercase tracking-tighter">Retour</span>
                </button>
                <div className="font-black text-[#0d6e52] text-[11px] uppercase tracking-widest bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100">
                   {mode} — SEMAINE {activeWeek}
                </div>
                <div className="w-10"></div>
              </div>

              <div className="bg-[#fdfcf0] rounded-[40px] shadow-2xl min-h-[550px] flex flex-col relative overflow-hidden border-4 border-white">
                
                {mode !== 'etude' && !isFinished && (
                  <div className="bg-[#0d6e52] p-4 flex justify-between items-center text-white px-10">
                    <div className="flex gap-8 font-black text-xs uppercase">
                      <div className="flex items-center gap-2 text-green-300">
                        <CheckCircle size={18}/> <span>Note : {correctCount} / {sessionTotal}</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-300">
                        <XCircle size={18}/> <span>Erreurs : {wrongCount}</span>
                      </div>
                    </div>
                    <div className="bg-black/20 px-4 py-1 rounded-lg font-mono text-lg font-black text-emerald-300">
                      {formatTime(totalSeconds)}
                    </div>
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    
                    {isFinished ? (
                      <motion.div key="finished" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-10 text-center max-h-[550px] overflow-y-auto">
                        <Trophy size={80} className="text-yellow-500 mx-auto mb-4 drop-shadow-lg" />
                        <h2 className="text-4xl font-black text-slate-800 mb-2 uppercase italic">Mission Accomplie !</h2>
                        <div className="text-7xl font-black text-[#0d6e52] mb-10 bg-emerald-50 inline-block px-12 py-6 rounded-[40px] shadow-inner border-2 border-emerald-100">
                          {correctCount} <span className="text-slate-300 text-3xl">/ {sessionTotal}</span>
                        </div>
                        
                        <div className="max-w-xl mx-auto space-y-6">
                          {errors.length > 0 && (
                            <div className="bg-red-50 p-6 rounded-3xl border-2 border-red-100 text-left">
                              <h4 className="text-red-600 font-black uppercase text-xs mb-4 flex items-center gap-2"><AlertCircle size={16}/> Analyse :</h4>
                              {errors.map((err, i) => (
                                <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl mb-2 shadow-sm">
                                  <span className="text-red-400 line-through font-bold">{err.typed || "(vide)"}</span>
                                  <span className="text-emerald-600 font-black text-xl">{err.correct}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={() => startSession(activeWeek, mode)} className="flex-1 bg-slate-900 text-white py-5 rounded-3xl font-black uppercase shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2">
                              <RefreshCw size={20} /> Recommencer
                            </button>
                            <button onClick={() => { setActiveWeek(null); resetStats(); }} className="flex-1 bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase shadow-xl hover:bg-emerald-700 transition-all">
                              Menu Mission
                            </button>
                          </div>
                        </div>
                      </motion.div>

                    ) : mode === 'etude' ? (
                      <motion.div key="etude" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 text-center">
                        <h3 className="text-3xl font-black text-[#0d6e52] mb-10 uppercase italic">Atelier des mots</h3>
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
                        <button onClick={() => { setMode('syllabe'); resetStats(); }} className="mt-12 bg-[#0d6e52] text-white px-12 py-5 rounded-3xl font-black uppercase shadow-xl hover:scale-105 transition-all">
                          Prêt pour l'entraînement !
                        </button>
                      </motion.div>

                    ) : mode === 'test' ? (
                      <motion.div key="test" className="p-12 text-center flex flex-col items-center">
                        <button onClick={() => handleSpeak()} className="bg-[#15a278] w-28 h-28 rounded-full text-white shadow-2xl flex items-center justify-center mb-10 group">
                          <Volume2 size={50} className="group-hover:scale-110 transition-transform" />
                        </button>
                        <form onSubmit={handleCheck} className="w-full max-w-md">
                          <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Écris le mot..." autoFocus 
                            disabled={!!feedback}
                            className={`w-full bg-white border-4 rounded-[30px] py-6 px-6 text-center text-4xl font-black outline-none transition-all shadow-inner ${feedback === 'correct' ? 'border-green-400 text-green-600' : feedback === 'incorrect' ? 'border-red-400 text-red-600 shake' : 'border-slate-100'}`} />
                          
                          <div className="mt-10 p-4 bg-[#f8fafc] rounded-[30px] border-2 border-slate-200 shadow-sm max-w-xl mx-auto">
                            <div className="flex flex-wrap justify-center gap-2">
                              {accents.map(acc => (
                                <motion.button key={acc} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => insertAccent(acc)}
                                  className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-bold text-blue-600 shadow-sm"
                                >
                                  {acc}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          <p className="mt-8 text-slate-400 font-black uppercase text-[11px] tracking-widest bg-slate-100 py-2 rounded-full inline-block px-6">
                            Mot {currentWordIndex + 1} sur {sessionTotal}
                          </p>
                        </form>
                      </motion.div>

                    ) : (
                      <div className="p-4 md:p-8 flex-1 overflow-y-auto">
                        {mode === 'syllabe' && <SyllableGame selectedLevel={selectedLevel} activeWeek={activeWeek} onCorrect={() => setCorrectCount(c => c + 1)} onWrong={() => setWrongCount(w => w + 1)} onSetTotal={setSessionTotal} onFinish={saveExerciseResult} />}
                        {mode === 'definition' && <DefinitionGame selectedLevel={selectedLevel} activeWeek={activeWeek} onCorrect={() => setCorrectCount(c => c + 1)} onWrong={() => setWrongCount(w => w + 1)} onSetTotal={setSessionTotal} onFinish={saveExerciseResult} />}
                        {mode === 'nature' && <WordTypeGame selectedLevel={selectedLevel} activeWeek={activeWeek} onCorrect={() => setCorrectCount(c => c + 1)} onWrong={() => setWrongCount(w => w + 1)} onSetTotal={setSessionTotal} onFinish={saveExerciseResult} />}
                        {mode === 'mystere' && <WordMystery words={getActiveWords()} activeWeek={activeWeek} onCorrect={() => setCorrectCount(c => c + 1)} onWrong={() => setWrongCount(w => w + 1)} onSetTotal={setSessionTotal} onFinish={saveExerciseResult} />}
                        {(mode === 'evaluation' || mode === 'concours') && <EvaluationGame words={getActiveWords()} selectedLevel={selectedLevel} activeWeek={activeWeek} onBack={() => { setActiveWeek(null); setMode('etude'); }} onFinish={saveExerciseResult} />}
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

export default DictationApp1;