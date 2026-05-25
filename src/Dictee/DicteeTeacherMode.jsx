import React, { useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, Check, X } from "lucide-react";

export default function DicteeTeacherMode({
  words = [],
  currentWordIndex = 0,
  correctCount = 0,
  wrongCount = 0,
  sessionTotal = 0,
  handleSpeak,
  setCorrectCount,
  setWrongCount,
  setCurrentWordIndex,
  saveExerciseResult
}) {
  
  // 1. Mélange les mots au début (une seule fois)
  const shuffledWords = useMemo(() => {
    return [...words].sort(() => Math.random() - 0.5);
  }, [words]);

  const motActuel = shuffledWords[currentWordIndex] || "";
  
  // RÉFÉRENCE POUR ÉVITER LA RÉPÉTITION
  // On stocke l'index du mot déjà lu pour ne pas le relire
  const lastPlayedIndex = useRef(-1);

  // 2. LECTURE AUTOMATIQUE UNIQUE
  useEffect(() => {
    if (motActuel && lastPlayedIndex.current !== currentWordIndex) {
      handleSpeak(motActuel);
      lastPlayedIndex.current = currentWordIndex; // On marque comme "lu"
    }
  }, [currentWordIndex, motActuel, handleSpeak]);

  const handleAction = (isCorrect) => {
    const nextIndex = currentWordIndex + 1;
    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;

    if (isCorrect) setCorrectCount(newCorrectCount);
    else setWrongCount(prev => prev + 1);

    if (nextIndex < shuffledWords.length) {
      setCurrentWordIndex(nextIndex);
    } else {
      saveExerciseResult(newCorrectCount, shuffledWords.length);
    }
  };

  if (!motActuel) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-between h-[75vh] w-full max-w-2xl mx-auto overflow-hidden px-2 py-4"
    >
      {/* SECTION HAUTE : AUDIO ET MOT NORMAL */}
      <div className="text-center flex flex-col items-center gap-2">
        <button
          onClick={() => handleSpeak(motActuel)}
          className="bg-[#15a278] w-20 h-20 rounded-full text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          <Volume2 size={40} />
        </button>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mot à dicter :</p>
          <h2 className="text-3xl font-black text-[#0d6e52] capitalize">
            {motActuel}
          </h2>
        </div>
      </div>

      {/* SECTION CENTRALE : VÉRIFICATION LETTRES */}
      <div className="w-full">
        <p className="text-[10px] font-black text-center text-slate-400 uppercase mb-3 tracking-widest">Vérification</p>
        <div className="flex flex-wrap justify-center gap-2">
          {motActuel.split("").map((lettre, index) => (
            <motion.div
              key={`${currentWordIndex}-${index}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`
                w-11 h-11 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl font-black shadow-lg border-b-4
                ${index % 2 === 0 
                  ? "bg-emerald-500 border-emerald-700 text-white" 
                  : "bg-amber-400 border-amber-600 text-amber-900"
                }
              `}
            >
              {lettre.toUpperCase()}
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION BASSE : BOUTONS ACTIONS */}
      <div className="w-full max-w-md">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleAction(false)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-5 rounded-2xl font-black shadow-lg uppercase flex flex-col items-center justify-center transition-all active:scale-90"
          >
            <X size={28} strokeWidth={4} />
            <span className="text-[10px]">Faux</span>
          </button>

          <button
            onClick={() => handleAction(true)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black shadow-lg uppercase flex flex-col items-center justify-center transition-all active:scale-90"
          >
            <Check size={28} strokeWidth={4} />
            <span className="text-[10px]">Juste</span>
          </button>
        </div>

        {/* PROGRESSION COMPACTE */}
        <div className="flex items-center gap-3">
          <div className="flex gap-2 font-black text-[10px]">
            <span className="text-green-600">✔{correctCount}</span>
            <span className="text-red-500">✘{wrongCount}</span>
          </div>
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-100">
            <motion.div 
              className="h-full bg-[#0d6e52]"
              animate={{ width: `${((currentWordIndex + 1) / shuffledWords.length) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-black text-slate-400">
            {currentWordIndex + 1}/{shuffledWords.length}
          </span>
        </div>
      </div>
    </motion.div>
  );
}