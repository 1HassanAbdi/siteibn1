import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Timer, History, CheckCircle2, Trash2, XCircle, CheckCircle, AlertCircle, Sparkles, ArrowRight, Award, BarChart3 } from 'lucide-react';
import confetti from 'canvas-confetti';

import lexiqueData from './lexique.json';

const LexiKids = () => {
  // --- ÉTATS DU PARCOURS ---
  const [currentWeekIdx, setCurrentWeekIdx] = useState(0); 
  const [wordIndexInSession, setWordIndexInSession] = useState(0); // Index du mot dans la liste du son
  const [sessionResults, setSessionResults] = useState([]); // Stocke les résultats de chaque mot
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // --- ÉTATS DU MOT ACTUEL ---
  const [grid, setGrid] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [currentEmoji, setCurrentEmoji] = useState("");
  const [selected, setSelected] = useState({ c: null });
  const [isValidated, setIsValidated] = useState(false);
  const [validationResults, setValidationResults] = useState({});
  const [showIncompleteMsg, setShowIncompleteMsg] = useState(false);

  // --- ÉTATS GLOBAUX ---
  const [time, setTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef(null);
  const [playerHistory, setPlayerHistory] = useState([]);

  // Nettoyage du mot
  const cleanWord = (fullString) => {
    const parts = fullString.split(' ');
    const word = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    return word.toUpperCase().replace("-", "");
  };

  // Initialisation d'un mot spécifique
  const initWord = (index) => {
    const week = lexiqueData.weeks[currentWeekIdx];
    const wordObj = week.words[index];
    const targetWord = cleanWord(wordObj.word);
    const chars = targetWord.split("");
    
    setSolution(chars);
    setCurrentEmoji(wordObj.emoji);

    let newGrid = chars.map((char) => (Math.random() > 0.6 ? char : ""));
    if (!newGrid.includes("")) {
        newGrid[Math.floor(Math.random() * chars.length)] = "";
    }

    setGrid(newGrid);
    setInitialGrid([...newGrid]);
    setValidationResults({});
    setIsValidated(false);
    setShowIncompleteMsg(false);
    setSelected({ c: null });
    setIsTimerActive(true);
  };

  // Démarrer ou changer de son
  const startNewSession = (weekIdx) => {
    setCurrentWeekIdx(weekIdx);
    setWordIndexInSession(0);
    setSessionResults([]);
    setIsSessionFinished(false);
    setTime(0);
    // On attend le useEffect pour initWord
  };

  useEffect(() => {
    initWord(wordIndexInSession);
  }, [wordIndexInSession, currentWeekIdx]);

  useEffect(() => {
    if (isTimerActive) timerRef.current = setInterval(() => setTime(prev => prev + 1), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [isTimerActive]);

  useEffect(() => {
    const saved = localStorage.getItem('lexikids_v1');
    if (saved) setPlayerHistory(JSON.parse(saved));
  }, []);

  const handleValidate = () => {
    if (isValidated) return;
    if (grid.includes("")) { setShowIncompleteMsg(true); return; }

    const results = {};
    let faultCount = 0;
    grid.forEach((char, idx) => {
      if (initialGrid[idx] === "" && char !== solution[idx]) {
        results[idx] = false;
        faultCount++;
      } else if (initialGrid[idx] === "") {
        results[idx] = true;
      }
    });

    setValidationResults(results);
    setIsValidated(true);

    // Enregistrer le résultat du mot actuel
    const currentWordObj = lexiqueData.weeks[currentWeekIdx].words[wordIndexInSession];
    const resultEntry = {
      word: currentWordObj.word,
      emoji: currentWordObj.emoji,
      success: faultCount === 0
    };
    setSessionResults(prev => [...prev, resultEntry]);

    if (faultCount === 0) {
        confetti({ particleCount: 50, spread: 30, origin: { y: 0.8 } });
    }
  };

  const nextWord = () => {
    const totalWords = lexiqueData.weeks[currentWeekIdx].words.length;
    if (wordIndexInSession + 1 < totalWords) {
      setWordIndexInSession(prev => prev + 1);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    setIsSessionFinished(true);
    setIsTimerActive(false);
    const soundTitle = lexiqueData.weeks[currentWeekIdx].title;
    
    const historyEntry = {
      id: Date.now(),
      sound: soundTitle,
      time: time,
      score: `${sessionResults.filter(r => r.success).length} / ${lexiqueData.weeks[currentWeekIdx].words.length}`,
      date: new Date().toLocaleDateString('fr-FR')
    };

    const newHistory = [historyEntry, ...playerHistory].slice(0, 10);
    setPlayerHistory(newHistory);
    localStorage.setItem('lexikids_v1', JSON.stringify(newHistory));
    confetti({ particleCount: 200, spread: 90 });
  };

  const handleInput = (char) => {
    if (isValidated) return;
    if (selected.c === null || initialGrid[selected.c] !== "") return;
    const newGrid = [...grid];
    newGrid[selected.c] = char;
    setGrid(newGrid);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white min-h-screen rounded-[40px] shadow-2xl font-sans border-8 border-blue-50">
      
      {/* HEADER & NAVIGATION DES SONS */}
      <div className="flex flex-col items-center mb-8 gap-4">
        <h1 className="text-4xl font-black text-blue-600 flex items-center gap-2">
          <Award className="text-yellow-400" /> PARCOURS DES SONS
        </h1>
        
        <div className="flex flex-wrap justify-center gap-2 bg-slate-50 p-3 rounded-3xl">
          {lexiqueData.weeks.map((week, idx) => (
            <button 
              key={week.id} 
              onClick={() => startNewSession(idx)} 
              className={`px-4 py-2 rounded-2xl font-black text-xs transition-all border-2 
                ${currentWeekIdx === idx ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-100'}`}
            >
              {week.title.replace("Lexique du son", "Son")}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isSessionFinished ? (
          <motion.div 
            key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row gap-8 justify-center"
          >
            {/* ZONE DE JEU */}
            <div className="flex-1 flex flex-col items-center">
              {/* Barre de progression */}
              <div className="w-full max-w-md mb-6 bg-slate-100 h-4 rounded-full overflow-hidden flex">
                {lexiqueData.weeks[currentWeekIdx].words.map((_, i) => (
                  <div key={i} className={`flex-1 border-r border-white transition-all 
                    ${i < wordIndexInSession ? 'bg-green-400' : i === wordIndexInSession ? 'bg-blue-400' : 'bg-slate-200'}`} 
                  />
                ))}
              </div>
              <p className="font-black text-slate-400 uppercase text-xs mb-4">
                Mot {wordIndexInSession + 1} sur {lexiqueData.weeks[currentWeekIdx].words.length}
              </p>

              <div className="bg-blue-50 w-full p-8 rounded-[50px] border-4 border-dashed border-blue-200 flex flex-col items-center gap-6">
                <motion.div key={currentEmoji} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-8xl">{currentEmoji}</motion.div>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {grid.map((char, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelected({ c: idx })}
                      className={`w-12 h-16 md:w-14 md:h-20 flex items-center justify-center text-3xl md:text-4xl font-black rounded-2xl cursor-pointer transition-all shadow-sm
                        ${initialGrid[idx] !== "" ? 'bg-slate-200 text-slate-500' : 'bg-white text-blue-600'}
                        ${selected.c === idx ? 'ring-4 ring-yellow-400' : ''}
                        ${isValidated && validationResults[idx] === true ? 'bg-green-500 text-white' : ''}
                        ${isValidated && validationResults[idx] === false ? 'bg-red-500 text-white animate-shake' : ''}`}
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              {!isValidated ? (
                <button onClick={handleValidate} className="mt-8 w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-2xl shadow-xl hover:bg-blue-700 transition-all">
                  VÉRIFIER
                </button>
              ) : (
                <button onClick={nextWord} className="mt-8 w-full py-6 bg-green-500 text-white rounded-3xl font-black text-2xl shadow-xl hover:bg-green-600 flex items-center justify-center gap-3">
                  SUIVANT <ArrowRight />
                </button>
              )}
            </div>

            {/* CLAVIER SIDEBAR */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
              <div className="bg-slate-800 p-4 rounded-3xl flex justify-between text-white font-mono font-bold">
                <div className="flex items-center gap-2"><Timer size={18}/> {formatTime(time)}</div>
              </div>
              <div className="bg-white p-4 rounded-[35px] shadow-xl border border-slate-100 grid grid-cols-5 gap-1">
                {[ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "É", "È", "Ê", "Î", "Ô", "Û"].map(l => (
                  <button key={l} onClick={() => handleInput(l)} className="h-10 bg-slate-50 font-black rounded-lg hover:bg-blue-500 hover:text-white transition-all border-b-2 border-slate-200">{l}</button>
                ))}
                <button onClick={() => handleInput("")} className="col-span-2 h-10 bg-red-50 text-red-500 font-black rounded-lg">Effacer</button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* BILAN INDIVIDUALISÉ */
          <motion.div 
            key="summary" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="max-w-3xl mx-auto bg-slate-50 p-8 rounded-[40px] shadow-xl border-t-8 border-blue-500"
          >
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-yellow-400 rounded-full text-white mb-4"><Award size={48}/></div>
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Parcours terminé !</h2>
              <p className="text-blue-500 font-bold uppercase tracking-widest text-sm mt-2">{lexiqueData.weeks[currentWeekIdx].title}</p>
            </div>

            <div className="grid gap-3 mb-8">
              <h3 className="flex items-center gap-2 font-black text-slate-500 text-xs uppercase"><BarChart3 size={16}/> Détail de tes mots :</h3>
              {sessionResults.map((res, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{res.emoji}</span>
                    <span className="font-black text-slate-700 uppercase tracking-wide">{res.word}</span>
                  </div>
                  {res.success ? 
                    <div className="flex items-center gap-1 text-green-500 font-bold"><CheckCircle size={20}/> Réussi</div> : 
                    <div className="flex items-center gap-1 text-red-400 font-bold"><XCircle size={20}/> Avec aide</div>
                  }
                </div>
              ))}
            </div>

            <div className="bg-blue-600 p-6 rounded-3xl text-white flex justify-between items-center mb-8 shadow-lg shadow-blue-200">
                <div>
                    <p className="text-[10px] font-black uppercase opacity-80">Temps total</p>
                    <p className="text-2xl font-black">{formatTime(time)}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase opacity-80">Score final</p>
                    <p className="text-2xl font-black">{sessionResults.filter(r => r.success).length} / {sessionResults.length}</p>
                </div>
            </div>

            <button onClick={() => startNewSession(currentWeekIdx)} className="w-full py-5 bg-slate-800 text-white rounded-3xl font-black flex items-center justify-center gap-2 hover:bg-slate-900 transition-all uppercase tracking-widest">
              <RotateCcw size={20}/> Recommencer ce son
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

export default LexiKids;