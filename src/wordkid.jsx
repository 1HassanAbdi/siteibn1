import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Timer, History, CheckCircle2, Trash2, XCircle, CheckCircle, AlertCircle, BookOpen, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

const WordKids = () => {
  const [difficulty, setDifficulty] = useState('Facile'); 
  const [grid, setGrid] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [currentHint, setCurrentHint] = useState({ emoji: "", text: "" }); // État pour l'indice
  const [selected, setSelected] = useState({ c: null });
  
  const [isValidated, setIsValidated] = useState(false);
  const [validationResults, setValidationResults] = useState({});
  const [showIncompleteMsg, setShowIncompleteMsg] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [time, setTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef(null);

  const [playerHistory, setPlayerHistory] = useState([]);

  // Dictionnaire enrichi avec Emojis et Définitions simples
  const WORDS = {
    'Facile': [
      { word: "LION", emoji: "🦁", hint: "Le roi de la savane." },
      { word: "CHAT", emoji: "🐱", hint: "Il adore faire 'Miaou'." },
      { word: "LUNE", emoji: "🌙", hint: "Elle brille dans le ciel la nuit." },
      { word: "VELO", emoji: "🚲", hint: "On pédale pour avancer." }
    ],
    'Intermédiaire': [
      { word: "SOLEIL", emoji: "☀️", hint: "Il nous réchauffe le jour." },
      { word: "BATEAU", emoji: "⛵", hint: "Il voyage sur l'eau." },
      { word: "OISEAU", emoji: "🐦", hint: "Il a des ailes pour voler." },
      { word: "POMMES", emoji: "🍎", hint: "Un fruit rouge ou vert." }
    ],
    'Expert': [
      { word: "CHOCOLAT", emoji: "🍫", hint: "Une gourmandise marron très sucrée." },
      { word: "ELEPHANT", emoji: "🐘", hint: "Un animal énorme avec une trompe." },
      { word: "PAPILLON", emoji: "🦋", hint: "Il commence sa vie en chenille." },
      { word: "GIRAFE", emoji: "🦒", hint: "Elle a un cou très, très long." }
    ]
  };

  const generateGame = () => {
    const wordList = WORDS[difficulty];
    const targetObj = wordList[Math.floor(Math.random() * wordList.length)];
    const chars = targetObj.word.split("");
    
    setSolution(chars);
    setCurrentHint({ emoji: targetObj.emoji, text: targetObj.hint });
    
    // On cache environ 50% des lettres
    let newGrid = chars.map((char) => (Math.random() > 0.5 ? char : ""));
    
    // S'assurer qu'il manque au moins une lettre pour jouer
    if (!newGrid.includes("")) {
      newGrid[Math.floor(Math.random() * newGrid.length)] = "";
    }
    
    setGrid(newGrid);
    setInitialGrid([...newGrid]);
    setValidationResults({});
    setIsValidated(false);
    setShowIncompleteMsg(false);
    setTime(0);
    setIsTimerActive(false);
    setHasStarted(false);
    setSelected({ c: null });
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
    const saved = localStorage.getItem('word_kids_v1');
    if (saved) setPlayerHistory(JSON.parse(saved));
    generateGame();
  }, [difficulty]);

  const handleValidate = () => {
    if (isValidated) return;
    let isComplete = !grid.includes("");
    if (!isComplete) { setShowIncompleteMsg(true); return; }

    const results = {};
    let corrects = 0, fautes = 0;
    grid.forEach((char, idx) => {
      if (initialGrid[idx] === "") {
        if (char === solution[idx]) { results[idx] = true; corrects++; }
        else { results[idx] = false; fautes++; }
      }
    });

    setValidationResults(results);
    setIsValidated(true);
    setIsTimerActive(false);

    const entry = {
      id: Date.now(),
      level: difficulty,
      word: solution.join(""),
      time: time,
      corrects,
      fautes,
      date: new Date().toLocaleTimeString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    };
    const newHistory = [entry, ...playerHistory].slice(0, 5);
    setPlayerHistory(newHistory);
    localStorage.setItem('word_kids_v1', JSON.stringify(newHistory));
    if (fautes === 0) confetti({ particleCount: 150, spread: 70 });
  };

  const handleInput = (char) => {
    if (isValidated) return;
    startAction();
    if (selected.c === null || initialGrid[selected.c] !== "") return;
    const newGrid = [...grid];
    newGrid[selected.c] = char;
    setGrid(newGrid);
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen rounded-[40px] border-4 border-white shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500 p-4 rounded-3xl text-white shadow-xl"><BookOpen size={32} /></div>
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Word<span className="text-blue-500">Kids</span></h1>
            <div className="flex gap-2 mt-2">
              {['Facile', 'Intermédiaire', 'Expert'].map(l => (
                <button key={l} onClick={() => setDifficulty(l)} className={`text-[10px] font-black px-4 py-1.5 rounded-full transition-all border-2 ${difficulty === l ? 'bg-blue-500 text-white border-blue-500 shadow-md' : 'bg-white text-slate-400 border-slate-100'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white px-10 py-5 rounded-[30px] shadow-sm border-b-4 border-slate-100 flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chrono</span>
          <div className="flex items-center gap-2 text-3xl font-black text-blue-500 font-mono"><Timer size={24} /> {formatTime(time)}</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
        <div className="flex flex-col items-center w-full lg:w-auto">
          
          {/* BULLE D'INDICE (Emoji + Texte) */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            key={currentHint.text}
            className="mb-6 bg-white p-6 rounded-[35px] shadow-lg border-b-4 border-blue-100 flex items-center gap-6 w-full max-w-lg"
          >
            <div className="text-6xl bg-blue-50 p-4 rounded-2xl">{currentHint.emoji}</div>
            <div>
              <div className="flex items-center gap-2 text-blue-500 font-black text-xs uppercase tracking-widest mb-1">
                <Lightbulb size={16} /> Indice
              </div>
              <p className="text-slate-600 font-bold text-lg leading-tight">{currentHint.text}</p>
            </div>
          </motion.div>

          {/* Grille du mot */}
          <div className="flex gap-2 p-6 bg-slate-800 rounded-[35px] shadow-2xl mb-6">
              {grid.map((char, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => { setSelected({ c: idx }); startAction(); }}
                  whileTap={{ scale: 0.9 }}
                  className={`
                    w-11 h-11 md:w-16 md:h-16 flex items-center justify-center text-xl md:text-4xl font-black rounded-xl cursor-pointer transition-all
                    ${initialGrid[idx] !== "" ? 'bg-slate-200 text-slate-500' : 'bg-white text-blue-600'}
                    ${selected.c === idx ? 'ring-4 ring-yellow-400 z-10 scale-105' : ''}
                    ${isValidated && validationResults[idx] === true ? 'bg-green-100 text-green-600 ring-2 ring-green-500' : ''}
                    ${isValidated && validationResults[idx] === false ? 'bg-red-100 text-red-500 ring-2 ring-red-500 animate-pulse' : ''}
                  `}
                >
                  {char}
                </motion.div>
              ))}
          </div>

          {showIncompleteMsg && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-2 mb-4 flex items-center gap-2 text-orange-600 bg-orange-50 px-6 py-3 rounded-2xl font-bold border border-orange-200">
               <AlertCircle size={20}/> Complète toutes les lettres du mot !
            </motion.div>
          )}

          <button onClick={handleValidate} disabled={isValidated} className={`w-full py-5 rounded-[25px] font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase ${isValidated ? 'bg-slate-300 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'}`}>
            <CheckCircle2 size={24}/> {isValidated ? "Bien joué !" : "Valider"}
          </button>
        </div>

        {/* Sidebar : Clavier et Historique */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[35px] shadow-xl border-b-8 border-slate-100">
            <div className="grid grid-cols-4 gap-2 mb-6">
              {["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"].map((letter) => (
                <button key={letter} onClick={() => handleInput(letter)} className="p-2 bg-slate-50 text-sm font-bold rounded-lg border hover:border-blue-500 hover:bg-white transition-all shadow-sm">{letter}</button>
              ))}
              <button onClick={() => handleInput("")} className="col-span-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-400 text-[10px] uppercase">Effacer</button>
            </div>
            <button onClick={generateGame} className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg uppercase text-xs">
              <RotateCcw size={18} /> Nouveau Mot
            </button>
          </div>

          <div className="bg-white p-6 rounded-[35px] shadow-lg border-b-4 border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="flex items-center gap-2 font-black text-slate-700 text-xs uppercase italic"><History size={16} className="text-blue-500" /> Historique</h3>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[200px] pr-1">
              {playerHistory.length === 0 ? <div className="text-center py-6 text-slate-300 text-[10px] font-bold uppercase">Aucun mot</div> : 
                playerHistory.map(h => (
                  <div key={h.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1 shadow-sm border-l-4 border-l-blue-400">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase">
                        <span className="text-blue-500">{h.word}</span>
                        <span className="text-slate-400">{h.date}</span>
                    </div>
                    <div className="flex gap-4 mt-1 border-t border-slate-100 pt-2">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-green-600"><CheckCircle size={14}/> {h.corrects}</div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-red-500"><XCircle size={14}/> {h.fautes}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordKids;