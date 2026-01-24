import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// AJOUT DE Trophy ICI
import { RotateCcw, CheckCircle, XCircle, ArrowRight, Settings2, Trophy } from 'lucide-react';

const WordMystery = ({ words, onCorrect, onWrong, onFinish, onSetTotal }) => {
  const [gameWords, setGameWords] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [localScore, setLocalScore] = useState(0);

  const startWithLimit = (limit) => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = limit === 'all' ? shuffled : shuffled.slice(0, limit);
    if (onSetTotal) onSetTotal(selected.length);
    setGameWords(selected);
    setLocalScore(0);
    setGameStarted(true);
  };

  useEffect(() => {
    if (gameStarted && gameWords[currentIndex]) {
      const word = gameWords[currentIndex].toLowerCase().trim();
      const lettersObj = word.split('').map((l, index) => ({
        id: index,
        char: l
      })).sort(() => Math.random() - 0.5);
      setAvailableLetters(lettersObj);
      setPlacedLetters([]);
      setFeedback(null);
    }
  }, [currentIndex, gameWords, gameStarted]);

  const handleLetterClick = (letterObj) => {
    if (feedback) return;
    setPlacedLetters([...placedLetters, letterObj]);
    setAvailableLetters(availableLetters.filter(l => l.id !== letterObj.id));
  };

  const removeLetter = (letterObj) => {
    if (feedback) return;
    setAvailableLetters([...availableLetters, letterObj]);
    setPlacedLetters(placedLetters.filter(l => l.id !== letterObj.id));
  };

  useEffect(() => {
    if (placedLetters.length > 0 && availableLetters.length === 0 && !feedback) {
      const playerWord = placedLetters.map(l => l.char).join('');
      const correctWord = gameWords[currentIndex].toLowerCase().trim();
      const isRight = playerWord === correctWord;

      setFeedback(isRight ? 'correct' : 'incorrect');
      let updatedScore = localScore;
      if (isRight) {
        updatedScore = localScore + 1;
        setLocalScore(updatedScore);
        onCorrect(); 
      } else {
        onWrong();
      }

      setHistory(prev => [...prev, {
        original: gameWords[currentIndex],
        attempt: playerWord,
        isCorrect: isRight
      }]);

      setTimeout(() => {
        if (currentIndex < gameWords.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setIsGameEnded(true);
          if (onFinish) onFinish(updatedScore, gameWords.length);
        }
      }, 1000);
    }
  }, [placedLetters, availableLetters]);

  const getLetterColor = (char) => {
    const vowels = 'aeiouyàâéèêëîïôûù';
    return vowels.includes(char.toLowerCase()) 
      ? 'text-pink-500 bg-pink-50 border-pink-200' 
      : 'text-indigo-600 bg-indigo-50 border-indigo-200';
  };

  if (!gameStarted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8">
        <div className="bg-indigo-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600"><Settings2 size={40} /></div>
        <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase">Combien de mots ?</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-xl mx-auto mt-8">
          {[5, 10, 15, 20, 'all'].map((num) => (
            <button key={num} onClick={() => startWithLimit(num)} className="bg-white border-4 border-slate-100 p-6 rounded-[30px] font-black text-2xl text-indigo-600 hover:border-indigo-500 hover:scale-105 transition-all shadow-sm uppercase">
              {num === 'all' ? 'Tout' : num}
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  if (isGameEnded) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 max-w-2xl mx-auto text-center">
        <Trophy size={60} className="mx-auto text-yellow-500 mb-4" />
        <h3 className="text-3xl font-black text-[#0d6e52] mb-6 uppercase">Session Terminée</h3>
        <div className="bg-white p-8 rounded-[40px] shadow-inner border-2 border-slate-50 mb-8">
            <span className="text-6xl font-black text-[#0d6e52]">{localScore}</span>
            <span className="text-2xl text-slate-300 font-black"> / {gameWords.length}</span>
        </div>
        <button onClick={() => onFinish(localScore, gameWords.length)} className="w-full bg-[#0d6e52] text-white py-5 rounded-3xl font-black text-xl shadow-xl flex items-center justify-center gap-3">
          VOIR MON BILAN <ArrowRight />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full p-4 select-none">
      {/* CORRECTION DU STYLE : On retire l'attribut jsx et on utilise une balise style classique */}
      <style dangerouslySetInnerHTML={{ __html: `
        .shake { animation: shake 0.4s ease-in-out; }
        @keyframes shake { 
          0%, 100% { transform: translateX(0); } 
          25% { transform: translateX(-8px); } 
          75% { transform: translateX(8px); } 
        }
      `}} />

      <div className="text-center mb-8">
        <span className="bg-indigo-100 text-indigo-700 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
          🕵️ Mot {currentIndex + 1} / {gameWords.length}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 min-h-[120px] p-6 bg-white/50 rounded-[40px] border-2 border-dashed border-slate-300 shadow-inner">
        <AnimatePresence>
          {placedLetters.map((letter) => (
            <motion.button key={letter.id} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={() => removeLetter(letter)}
              className={`w-10 h-14 md:w-14 md:h-20 flex items-center justify-center text-2xl md:text-4xl font-black rounded-2xl shadow-sm transition-all border-2
                ${feedback === 'correct' ? 'bg-green-500 text-white border-green-600' : 
                  feedback === 'incorrect' ? 'bg-red-500 text-white border-red-600 shake' : 
                  'bg-white border-indigo-500 text-indigo-600'}`}>
              {letter.char.toUpperCase()}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
        {availableLetters.map((letter) => (
          <motion.button key={letter.id} layout whileHover={{ y: -5 }} onClick={() => handleLetterClick(letter)}
            className={`w-10 h-12 md:w-16 md:h-20 border-b-8 rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-black shadow-md transition-all ${getLetterColor(letter.char)}`}>
            {letter.char.toUpperCase()}
          </motion.button>
        ))}
      </div>

      <div className="mt-8 flex justify-center border-t border-slate-100 pt-6">
        <button onClick={() => { setAvailableLetters([...availableLetters, ...placedLetters].sort(() => Math.random() - 0.5)); setPlacedLetters([]); setFeedback(null); }}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase">
          <RotateCcw size={14} /> Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default WordMystery;