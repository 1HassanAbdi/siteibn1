import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Brain, Timer, History, CheckCircle2, Trash2, XCircle, CheckCircle, AlertCircle, ListOrdered } from 'lucide-react';
import confetti from 'canvas-confetti';

const SuiteKids = () => {
  const [difficulty, setDifficulty] = useState('Facile'); 
  const [grid, setGrid] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selected, setSelected] = useState({ r: null, c: null });
  
  const [isValidated, setIsValidated] = useState(false);
  const [validationResults, setValidationResults] = useState({});
  const [showIncompleteMsg, setShowIncompleteMsg] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [time, setTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef(null);

  const [playerHistory, setPlayerHistory] = useState([]);

  // Les "chiffres" sont ici des emojis
  const EMOJIS = ["🍎", "🍐", "🍋", "🍇", "🍓", "🍒", "🥝", "🍍", "🥭"];

  const puzzles = {
    'Facile': { size: 4, data: [[1, 2, 1, 2], [3, 4, 3, 4], [2, 1, 2, 1], [4, 3, 4, 3]], hide: 4 },
    'Intermédiaire': { size: 4, data: [[1, 2, 3, 1], [2, 3, 1, 2], [3, 1, 2, 3], [1, 2, 3, 1]], hide: 8 },
    'Expert': { size: 4, data: [[1, 2, 3, 4], [2, 3, 4, 1], [3, 4, 1, 2], [4, 1, 2, 3]], hide: 12 }
  };

  const generateGame = () => {
    const config = puzzles[difficulty];
    const size = config.size;
    let newGrid = JSON.parse(JSON.stringify(config.data));
    const seed = Math.floor(Math.random() * size) + 1;
    newGrid = newGrid.map(row => row.map(val => ((val + seed - 1) % size) + 1));
    setSolution(JSON.parse(JSON.stringify(newGrid)));

    let count = 0;
    while (count < config.hide) {
      let r = Math.floor(Math.random() * size), c = Math.floor(Math.random() * size);
      if (newGrid[r][c] !== 0) { newGrid[r][c] = 0; count++; }
    }

    setGrid(newGrid);
    setInitialGrid(JSON.parse(JSON.stringify(newGrid)));
    setValidationResults({});
    setIsValidated(false);
    setShowIncompleteMsg(false);
    setTime(0);
    setIsTimerActive(false);
    setHasStarted(false);
    setSelected({ r: null, c: null });
  };

  useEffect(() => {
    if (isTimerActive) timerRef.current = setInterval(() => setTime(prev => prev + 1), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [isTimerActive]);

  const startAction = () => {
    if (!hasStarted) { setHasStarted(true); setIsTimerActive(true); }
  };

  useEffect(() => {
    const saved = localStorage.getItem('suite_kids_v1');
    if (saved) setPlayerHistory(JSON.parse(saved));
    generateGame();
  }, [difficulty]);

  const handleValidate = () => {
    if (isValidated) return;
    let isComplete = true;
    const results = {};
    let corrects = 0, fautes = 0;

    grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (initialGrid[r][c] === 0) {
          if (cell === 0) isComplete = false;
          else if (cell === solution[r][c]) { results[`${r}-${c}`] = true; corrects++; }
          else { results[`${r}-${c}`] = false; fautes++; }
        }
      });
    });

    if (!isComplete) { setShowIncompleteMsg(true); return; }

    setShowIncompleteMsg(false);
    setValidationResults(results);
    setIsValidated(true);
    setIsTimerActive(false);

    const entry = {
      id: Date.now(),
      level: difficulty,
      time: time,
      corrects,
      fautes,
      date: new Date().toLocaleTimeString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    };
    const newHistory = [entry, ...playerHistory].slice(0, 5);
    setPlayerHistory(newHistory);
    localStorage.setItem('suite_kids_v1', JSON.stringify(newHistory));
    if (fautes === 0) confetti({ particleCount: 150, spread: 70 });
  };

  const confirmDelete = () => {
    setPlayerHistory([]);
    localStorage.removeItem('suite_kids_v1');
    setShowDeleteConfirm(false);
  };

  const handleInput = (num) => {
    if (isValidated) return;
    startAction();
    if (selected.r === null || initialGrid[selected.r][selected.c] !== 0) return;
    const newGrid = [...grid];
    newGrid[selected.r][selected.c] = num;
    setGrid(newGrid);
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen rounded-[40px] border-4 border-white shadow-2xl font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 p-4 rounded-3xl text-white shadow-xl"><ListOrdered size={32} /></div>
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Suite<span className="text-emerald-600">Kids</span></h1>
            <div className="flex gap-2 mt-2">
              {['Facile', 'Intermédiaire', 'Expert'].map(l => (
                <button key={l} onClick={() => setDifficulty(l)} className={`text-[10px] font-black px-4 py-1.5 rounded-full transition-all border-2 ${difficulty === l ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-400 border-slate-100'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white px-10 py-5 rounded-[30px] shadow-sm border-b-4 border-slate-100 flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chrono</span>
          <div className="flex items-center gap-2 text-3xl font-black text-emerald-600 font-mono"><Timer size={24} /> {formatTime(time)}</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
        <div className="flex flex-col items-center">
          <div className="grid gap-2 p-3 bg-slate-800 rounded-[35px] shadow-2xl">
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${puzzles[difficulty].size}, minmax(0, 1fr))` }}>
              {grid.map((row, r) => row.map((cell, c) => (
                <motion.div
                  key={`${r}-${c}`}
                  onClick={() => { setSelected({ r, c }); startAction(); }}
                  whileTap={{ scale: 0.9 }}
                  className={`
                    w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-xl md:text-3xl font-black rounded-xl cursor-pointer transition-all
                    ${initialGrid[r][c] !== 0 ? 'bg-slate-200 opacity-80' : 'bg-white shadow-inner'}
                    ${selected.r === r && selected.c === c ? 'ring-4 ring-yellow-400 z-10 scale-105 shadow-xl' : ''}
                    ${isValidated && validationResults[`${r}-${c}`] === true ? 'bg-green-100 ring-2 ring-green-500' : ''}
                    ${isValidated && validationResults[`${r}-${c}`] === false ? 'bg-red-100 ring-2 ring-red-500 animate-pulse' : ''}
                  `}
                >
                  {cell !== 0 ? EMOJIS[cell - 1] : ''}
                </motion.div>
              )))}
            </div>
          </div>
          {showIncompleteMsg && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-4 flex items-center gap-2 text-orange-600 bg-orange-50 px-6 py-3 rounded-2xl font-bold border border-orange-200">
               <AlertCircle size={20}/> Complète la suite d'emojis !
            </motion.div>
          )}
          <button onClick={handleValidate} disabled={isValidated} className={`mt-6 w-full py-5 rounded-[25px] font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase ${isValidated ? 'bg-slate-300 text-slate-500' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105'}`}>
            <CheckCircle2 size={24}/> {isValidated ? "Suites vérifiées" : "Valider"}
          </button>
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[35px] shadow-xl border-b-8 border-slate-100">
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[...Array(puzzles[difficulty].size)].map((_, i) => (
                <button key={i+1} onClick={() => handleInput(i + 1)} className="h-16 bg-slate-50 text-2xl rounded-2xl shadow-sm border-2 border-transparent hover:border-emerald-400 transition-all">{EMOJIS[i]}</button>
              ))}
              <button onClick={() => handleInput(0)} className="col-span-2 py-3 bg-slate-100 rounded-xl font-bold text-slate-400 text-[10px] uppercase">Effacer</button>
            </div>
            <button onClick={generateGame} className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg uppercase text-xs">
              <RotateCcw size={18} /> Nouvelle Suite
            </button>
          </div>

          <div className="bg-white p-6 rounded-[35px] shadow-lg border-b-4 border-slate-100 flex flex-col relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="flex items-center gap-2 font-black text-slate-700 text-xs uppercase italic"><History size={16} className="text-emerald-500" /> Historique</h3>
              <button onClick={() => setShowDeleteConfirm(true)} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[250px] pr-1 mb-2">
              {playerHistory.length === 0 ? <div className="text-center py-6 text-slate-300 text-[10px] font-bold uppercase">Aucun essai</div> : 
                playerHistory.map(h => (
                  <div key={h.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1 shadow-sm border-l-4 border-l-emerald-400">
                    <div className="flex justify-between items-center"><span className="text-[9px] font-black text-emerald-500 uppercase">{h.level} • {h.date}</span><span className="font-mono font-bold text-xs text-slate-400">{formatTime(h.time)}</span></div>
                    <div className="flex gap-4 mt-1 border-t border-slate-100 pt-2">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-green-600"><CheckCircle size={14}/> {h.corrects}</div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-red-500"><XCircle size={14}/> {h.fautes}</div>
                    </div>
                  </div>
                ))
              }
            </div>
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-red-600 text-center uppercase">Supprimer tout ?</p>
                    <div className="flex gap-2">
                      <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-2 rounded-xl text-[10px] font-black uppercase">OUI</button>
                      <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-slate-200 text-slate-600 py-2 rounded-xl text-[10px] font-black uppercase">NON</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuiteKids;