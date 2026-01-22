import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Volume2, ArrowLeft, Trophy, BookOpen, GraduationCap, 
  CheckCircle, XCircle, Sparkles, Timer, RefreshCw, Clock, 
  Target, Lightbulb, Brain, MessageSquare, Star
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import DefinitionGame from './DefinitionGame';
import WordMystery from './WordMystery';
import WorkHistory from './WorkHistory';

const DictationApp2 = () => {
  // --- ÉTATS STRUCTURELS ---
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [levelData, setLevelData] = useState(null);
  const [activeWeek, setActiveWeek] = useState(null); 
  const [mode, setMode] = useState('etude'); 
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  // --- ÉTATS DU JEU ---
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [errors, setErrors] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionTotal, setSessionTotal] = useState(0);

  // --- NOUVEAUX ÉTATS PÉDAGOGIQUES ---
  const [intention, setIntention] = useState(null); // Pilier 1
  const [showIntentionScreen, setShowIntentionScreen] = useState(false);
  const [errorAnalysis, setErrorAnalysis] = useState(null); // Pilier 3
  const [isReflecting, setIsReflecting] = useState(false); // Pilier 4
  const [reflectionAnswer, setReflectionAnswer] = useState("");

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

  // --- LOGIQUE DE SAUVEGARDE ---
  const saveToHistory = (gameMode, score, total, userReflection) => {
    const modeLabels = { test: 'Dictée', definition: 'Définitions', mystere: 'Mot Mystère' };
    const newEntry = {
      type: modeLabels[gameMode] || gameMode,
      score,
      total,
      intention,
      reflection: userReflection,
      level: selectedLevel,
      week: activeWeek,
      date: new Date().toISOString()
    };
    const existingHistory = JSON.parse(localStorage.getItem('eleve_history') || '[]');
    localStorage.setItem('eleve_history', JSON.stringify([newEntry, ...existingHistory]));
  };

  // --- PILIER 4: MÉTACOGNITION AVANT LA FIN ---
  const triggerReflection = () => {
    setIsTimerRunning(false);
    setIsReflecting(true);
  };

  const handleFinalFinish = (finalReflection) => {
    setIsReflecting(false);
    setIsFinished(true);
    saveToHistory(mode, correctCount, sessionTotal, finalReflection);
  };

  // --- INITIALISATION & CHARGEMENT ---
  useEffect(() => {
    const fetchAllStats = async () => {
      const newStats = {};
      for (const lvl of levels) {
        try {
          const response = await fetch(`/data/JSON${lvl.id}A.json`);
          if (response.ok) {
            const data = await response.json();
            newStats[lvl.id] = {
              weekCount: data.weeks?.length || 0,
              wordCount: data.weeks?.reduce((acc, w) => acc + (w.words?.length || 0), 0) || 0
            };
          }
        } catch (e) { console.error(e); }
      }
      setStats(newStats);
      setIsLoading(false);
    };
    fetchAllStats();
  }, []);

  useEffect(() => {
    if (isTimerRunning && !isFinished && mode !== 'etude') {
      timerRef.current = setInterval(() => setTotalSeconds(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, isFinished, mode]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleLevelSelect = async (levelId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/data/JSON${levelId}A.json`);
      const data = await response.json();
      setLevelData(data);
      setSelectedLevel(levelId);
    } catch (error) { alert("Erreur de chargement."); }
    finally { setIsLoading(false); }
  };

  const startSession = (weekId, chosenMode) => {
    setActiveWeek(weekId);
    setMode(chosenMode);
    if (chosenMode !== 'etude') {
      setShowIntentionScreen(true); // Déclenche le Pilier 1
    } else {
      resetGame();
    }
  };

  const resetGame = () => {
    const words = getActiveWords();
    setCurrentWordIndex(0);
    setUserInput('');
    setFeedback(null);
    setCorrectCount(0);
    setWrongCount(0);
    setErrors([]);
    setIsFinished(false);
    setIsReflecting(false);
    setTotalSeconds(0);
    setIsTimerRunning(true);
    setSessionTotal(words.length);
    setErrorAnalysis(null);
  };

  const getActiveWords = () => levelData?.weeks.find(w => w.id === activeWeek)?.words || [];

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

  // --- PILIER 3: ANALYSE DE L'ERREUR ---
  const analyzeError = (typed, correct) => {
    // Logique simplifiée pour aider l'enfant
    if (typed.length > 0 && correct.toLowerCase().startsWith(typed.toLowerCase())) {
      return "C'est un bon début ! Il manque juste la fin.";
    }
    if (typed.length > correct.length) {
      return "Oups, il y a des lettres en trop.";
    }
    return "Regarde bien l'orthographe du mot, tu vas y arriver !";
  };

  const handleCheck = (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || feedback) return;
    const words = getActiveWords();
    const correctWord = words[currentWordIndex].trim();
    
    if (userInput.trim().toLowerCase() === correctWord.toLowerCase()) {
      setFeedback('correct'); 
      setCorrectCount(prev => prev + 1);
      setErrorAnalysis(null);
      
      setTimeout(() => {
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(prev => prev + 1); 
          setUserInput(''); 
          setFeedback(null);
        } else {
          triggerReflection();
        }
      }, 800);
    } else {
      setFeedback('incorrect'); 
      setWrongCount(prev => prev + 1);
      setErrors(prev => [...prev, { correct: correctWord, typed: userInput }]);
      setErrorAnalysis(analyzeError(userInput, correctWord)); // Pilier 3
      
      // On ne passe pas au mot suivant immédiatement pour laisser l'enfant voir l'erreur
    }
  };

  const nextWordAfterError = () => {
    const words = getActiveWords();
    setFeedback(null);
    setErrorAnalysis(null);
    setUserInput('');
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      triggerReflection();
    }
  };

  return (
    <div className="min-h-screen bg-[#dee6e4] font-['Poppins'] pb-12 overflow-x-hidden">
      <header className="bg-gradient-to-br from-[#0d6e52] to-[#15a278] pt-12 pb-24 text-center text-white rounded-b-[60px] md:rounded-b-[100px] shadow-2xl relative">
        <div className="absolute top-4 right-4 md:right-10 flex gap-2">
           <button onClick={() => setShowHistory(true)} className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all flex items-center gap-2 font-bold text-xs">
             <Clock size={18}/> <span className="hidden md:inline">HISTORIQUE</span>
           </button>
        </div>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-black mb-2 flex items-center justify-center gap-3 tracking-tighter uppercase">
             <Sparkles className="text-yellow-300 w-6 h-6 md:w-10 md:h-10" /> Dictée Interactive
          </h1>
          <p className="opacity-80 text-sm md:text-lg font-medium">L'erreur est le premier pas vers la réussite !</p>
        </motion.div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* --- MODALE INTENTION (PILIER 1) --- */}
          {showIntentionScreen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-[#0d6e52]/95 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="bg-white rounded-[50px] p-8 md:p-12 max-w-xl w-full text-center shadow-2xl">
                <Target className="text-[#15a278] w-16 h-16 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-slate-800 mb-4 uppercase">Ton objectif ?</h2>
                <p className="text-slate-500 mb-8 font-medium">Pourquoi souhaites-tu t'entraîner aujourd'hui ?</p>
                <div className="grid gap-4">
                  {[
                    { id: 'mots', label: 'Apprendre de nouveaux mots', icon: <BookOpen size={20}/> },
                    { id: 'orthographe', label: 'Mieux écrire sans fautes', icon: <GraduationCap size={20}/> },
                    { id: 'vitesse', label: "M'entraîner pour progresser", icon: <Timer size={20}/> }
                  ].map(obj => (
                    <button key={obj.id} onClick={() => { setIntention(obj.id); setShowIntentionScreen(false); resetGame(); }}
                      className="flex items-center gap-4 p-5 bg-emerald-50 hover:bg-emerald-100 rounded-3xl border-2 border-emerald-100 transition-all text-left font-bold text-emerald-800 group">
                      <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">{obj.icon}</div>
                      {obj.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* --- MODALE MÉTACOGNITION (PILIER 4) --- */}
          {isReflecting && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white rounded-[50px] p-8 md:p-12 max-w-xl w-full text-center">
                <Brain className="text-purple-500 w-16 h-16 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-slate-800 mb-4 uppercase">Bilan de ton cerveau</h2>
                <p className="text-slate-500 mb-8">Qu'est-ce qui était le plus difficile pour toi aujourd'hui ?</p>
                <textarea 
                  value={reflectionAnswer}
                  onChange={(e) => setReflectionAnswer(e.target.value)}
                  placeholder="Ex: Les mots avec 'eau', les accents..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 mb-8 focus:border-purple-400 outline-none font-medium h-32"
                />
                <button onClick={() => handleFinalFinish(reflectionAnswer)} className="w-full bg-purple-600 text-white py-5 rounded-3xl text-xl font-black uppercase shadow-xl hover:bg-purple-700 transition-all">
                  Terminer ma mission
                </button>
              </div>
            </motion.div>
          )}

          {/* --- ÉCRANS STANDARDS --- */}
          {showHistory ? (
            <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-[40px] p-8 shadow-2xl">
               <button onClick={() => setShowHistory(false)} className="mb-6 flex items-center gap-2 text-[#0d6e52] font-black uppercase text-sm">
                 <ArrowLeft size={20}/> Retour à l'accueil
               </button>
               <WorkHistory />
            </motion.div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 text-[#0d6e52]">
               <div className="w-12 h-12 border-4 border-t-transparent border-[#0d6e52] rounded-full animate-spin mb-4"></div>
               <p className="font-black uppercase tracking-widest text-sm">Chargement...</p>
            </div>
          ) : !selectedLevel ? (
            <motion.div key="levels" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {levels.map((lvl) => (
                <button key={lvl.id} onClick={() => handleLevelSelect(lvl.id)}
                  className="bg-white/80 backdrop-blur-md p-6 rounded-[40px] border border-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group text-left relative overflow-hidden">
                  <div className={`bg-gradient-to-br ${lvl.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <GraduationCap size={28} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">{lvl.label}</h3>
                  <div className="flex gap-2 mb-4">
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-bold uppercase">{stats[lvl.id]?.weekCount || 0} Sem.</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-bold uppercase">{stats[lvl.id]?.wordCount || 0} Mots</span>
                  </div>
                  <div className="flex items-center justify-between text-[#15a278] font-black text-xs uppercase tracking-tighter">
                    Ouvrir le niveau <Play size={14} fill="currentColor" />
                  </div>
                </button>
              ))}
            </motion.div>
          ) : !activeWeek ? (
            <motion.div key="weeks" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <button onClick={() => setSelectedLevel(null)} className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full font-bold text-[#0d6e52] hover:bg-white transition-all shadow-sm">
                <ArrowLeft size={18} /> Retour
              </button>
              <div className="bg-[#f4f7f6]/90 backdrop-blur-md rounded-[50px] p-8 md:p-12 shadow-2xl border border-white">
                <h2 className="text-2xl font-black mb-10 text-center text-[#0d6e52] tracking-tight uppercase">Semaines - {selectedLevel}A </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                  {levelData?.weeks.map((w) => (
                    <button key={w.id} onClick={() => startSession(w.id, 'etude')}
                      className="aspect-square bg-white rounded-[30px] flex flex-col items-center justify-center border-2 border-transparent hover:border-[#15a278] hover:shadow-xl hover:-translate-y-1 transition-all group">
                      <span className="text-[10px] uppercase font-black text-slate-400 group-hover:text-[#15a278]">Semaine</span>
                      <span className="text-3xl font-black text-slate-800">{w.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <button onClick={() => { setActiveWeek(null); setIntention(null); }} className="bg-white/60 px-6 py-3 rounded-full font-bold text-[#0d6e52] shadow-sm hover:bg-white transition-all">
                   <ArrowLeft size={18} className="inline mr-2" /> Quitter
                </button>
                <div className="flex bg-white/80 p-1.5 rounded-3xl shadow-lg border border-white w-full md:w-auto overflow-x-auto">
                  <button onClick={() => setMode('etude')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${mode === 'etude' ? 'bg-[#15a278] text-white shadow-md' : 'text-slate-500 hover:text-[#15a278]'}`}>ÉTUDIER</button>
                  <button onClick={() => { startSession(activeWeek, 'test'); }} className={`flex-1 md:flex-none px-6 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${mode === 'test' ? 'bg-[#15a278] text-white shadow-md' : 'text-slate-500 hover:text-[#15a278]'}`}>DICTÉE</button>
                  <button onClick={() => { startSession(activeWeek, 'definition'); }} className={`flex-1 md:flex-none px-6 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${mode === 'definition' ? 'bg-[#15a278] text-white shadow-md' : 'text-slate-500 hover:text-[#15a278]'}`}>DÉFINITIONS</button>
                  <button onClick={() => { startSession(activeWeek, 'mystere'); }} className={`flex-1 md:flex-none px-6 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap ${mode === 'mystere' ? 'bg-[#15a278] text-white shadow-md' : 'text-slate-500 hover:text-[#15a278]'}`}>MYSTÈRE</button>
                </div>
              </div>

              <div className="bg-[#fdfcf0] rounded-[40px] md:rounded-[60px] shadow-2xl border-4 border-white min-h-[550px] flex flex-col overflow-hidden relative">
                
                {mode !== 'etude' && !isFinished && (
                  <div className="bg-[#0d6e52] p-5 md:p-6 flex justify-between items-center text-white px-6 md:px-10">
                    <div className="flex gap-4 font-black text-xs">
                      <div className="bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10 text-green-300">
                        <CheckCircle size={16}/> {correctCount}
                      </div>
                      <div className="bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10 text-red-300">
                        <XCircle size={16}/> {wrongCount}
                      </div>
                    </div>
                    {intention && (
                       <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/10">
                         <Target size={14}/> {intention}
                       </div>
                    )}
                    <div className="flex items-center gap-2 bg-black/20 px-5 py-2 rounded-xl font-mono text-xl font-black text-emerald-300">
                      <Timer size={18} /> {formatTime(totalSeconds)}
                    </div>
                  </div>
                )}

                <div className="flex-1 flex flex-col">
                  {mode === 'etude' ? (
                    <div className="p-8 md:p-12">
                      <div className="text-center mb-12">
                        <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">Préparation</span>
                        <h3 className="text-4xl font-black text-[#0d6e52] mt-2">Semaine {activeWeek}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        {getActiveWords().map((word, i) => (
                          <div key={i} className="bg-white p-5 rounded-[25px] shadow-sm border border-slate-100 flex justify-between items-center group hover:border-emerald-300 transition-all">
                            <span className="text-2xl font-black text-slate-700 capitalize">{word}</span>
                            <button onClick={() => handleSpeak(word)} className="bg-emerald-50 p-3 rounded-xl text-emerald-600 hover:bg-[#15a278] hover:text-white transition-all shadow-sm">
                              <Volume2 size={24} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-12 text-center">
                         <button onClick={() => startSession(activeWeek, 'test')} className="bg-[#0d6e52] text-white px-10 py-4 rounded-full font-black uppercase hover:scale-105 transition-transform shadow-xl">
                            Je suis prêt !
                         </button>
                      </div>
                    </div>
                  ) : isFinished ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 md:p-12 flex-1 overflow-y-auto">
                      <div className="text-center mb-12">
                        <Trophy size={80} className="text-yellow-500 mx-auto mb-4 drop-shadow-lg" />
                        <h2 className="text-4xl font-black text-slate-800 mb-2 uppercase italic">Fantastique !</h2>
                        
                        {/* PILIER 2: VALORISER L'EFFORT */}
                        <p className="text-emerald-600 font-bold mb-4 flex items-center justify-center gap-2">
                           <Star size={20} fill="currentColor"/> Bravo pour tes efforts aujourd'hui ! <Star size={20} fill="currentColor"/>
                        </p>

                        <div className="inline-block bg-emerald-100 text-[#0d6e52] text-2xl font-black px-10 py-3 rounded-full shadow-inner">
                            {correctCount} / {sessionTotal}
                        </div>
                      </div>

                      <div className="max-w-2xl mx-auto">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-2 text-center">Ton parcours d'apprentissage</h3>
                        <WorkHistory />
                        <div className="mt-10 flex justify-center">
                           <button onClick={() => startSession(activeWeek, mode)} className="bg-slate-900 text-white px-10 py-4 rounded-3xl font-black uppercase flex items-center gap-3 hover:scale-105 transition-all">
                             <RefreshCw size={22}/> Recommencer
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : mode === 'test' ? (
                    <div className="p-8 md:p-12 flex flex-col items-center justify-center flex-1 gap-10">
                      
                      <div className="flex flex-col items-center gap-4">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSpeak()} 
                          className="bg-[#15a278] w-24 h-24 md:w-32 md:h-32 rounded-full text-white shadow-2xl flex items-center justify-center group">
                          <Volume2 size={50} className="group-hover:scale-110 transition-transform" />
                        </motion.button>
                        <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Écoute le mot</p>
                      </div>

                      <form onSubmit={handleCheck} className="w-full max-w-xl relative">
                        <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Écris ici..." autoFocus
                          className={`w-full bg-white border-4 rounded-[30px] py-6 md:py-8 px-6 text-center text-3xl md:text-5xl font-black outline-none transition-all
                          ${feedback === 'correct' ? 'border-green-400 text-green-600' : feedback === 'incorrect' ? 'border-red-400 text-red-600' : 'border-slate-100 focus:border-[#15a278]'}`} />
                        
                        {/* PILIER 3: ZONE DE FEEDBACK PÉDAGOGIQUE */}
                        <AnimatePresence>
                          {errorAnalysis && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
                              className="mt-4 p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-700 font-bold flex items-start gap-3">
                              <Lightbulb className="flex-shrink-0 mt-1" size={18}/>
                              <div>
                                <p>{errorAnalysis}</p>
                                <button type="button" onClick={nextWordAfterError} className="mt-2 text-xs uppercase underline font-black">Passer au mot suivant</button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {!errorAnalysis && (
                          <button type="submit" disabled={!userInput.trim() || feedback} className="w-full mt-6 bg-[#0d6e52] text-white py-5 rounded-[25px] text-xl font-black uppercase shadow-xl hover:bg-black transition-all disabled:opacity-30">VÉRIFIER</button>
                        )}
                      </form>
                      
                      <div className="flex items-center gap-6">
                         <p className="text-slate-400 font-bold uppercase text-xs">Mot {currentWordIndex + 1} sur {getActiveWords().length}</p>
                      </div>
                    </div>
                  ) : mode === 'definition' ? (
                    <div className="p-4 md:p-8 flex-1">
                      <DefinitionGame 
                        selectedLevel={selectedLevel} 
                        activeWeek={activeWeek}
                        onCorrect={() => setCorrectCount(c => c + 1)}
                        onWrong={() => setWrongCount(w => w + 1)}
                        onFinish={triggerReflection}
                      />
                    </div>
                  ) : (
                    <div className="p-4 md:p-8 flex-1 flex flex-col items-center justify-center">
                      <WordMystery 
                        words={getActiveWords()} 
                        activeWeek={activeWeek}
                        onCorrect={() => setCorrectCount(c => c + 1)}
                        onWrong={() => setWrongCount(w => w + 1)}
                        onSetTotal={(num) => setSessionTotal(num)}
                        onFinish={triggerReflection}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default DictationApp2;