import React, { useState, useRef, useEffect } from 'react';
import { Volume2, ArrowRight, Star, Sparkles } from 'lucide-react';

export default function LectureActivity({ data, onComplete }) {
  const [step, setStep] = useState(0);
  const current = data[step];
  const audioRef = useRef(null);

  // Lecture automatique au changement d'étape
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => console.log("Attente clic utilisateur"));
      }
    }
  }, [step]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handleNext = () => {
    if (step < data.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const renderText = () => {
    const words = current.text.split(" ");
    
    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 px-2">
        {words.map((word, i) => {
          // On sépare la ponctuation du mot (ex: "tomates." -> "tomates" + ".")
          const cleanWord = word.replace(/[.,!?;]/g, "");
          const punctuation = word.replace(/[a-zA-ZÀ-ÿ]/g, "");
          const isTarget = cleanWord.toUpperCase() === current.word.toUpperCase();

          return (
            <span 
              key={i} 
              onClick={playAudio}
              className={`cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 text-3xl md:text-4xl ${
                isTarget 
                  ? "text-orange-600 font-black underline decoration-4 decoration-orange-300 underline-offset-8" 
                  : "text-slate-700 font-bold"
              }`}
            >
              {cleanWord}
              <span className="text-slate-400">{punctuation}</span>
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-4 md:p-6 max-w-3xl mx-auto h-full justify-between">
      <audio ref={audioRef} src={current.audio} />

      {/* 1. Badge Header */}
      <div className="flex items-center gap-2 bg-blue-100 text-blue-600 px-5 py-2 rounded-full shadow-sm border border-blue-200 mb-4">
        <Sparkles size={18} className="animate-pulse" />
        <span className="font-black uppercase tracking-wider text-sm">
          Étape {step + 1} sur {data.length}
        </span>
      </div>

      {/* 2. Image Illustration (Taille optimisée) */}
      <div className="relative group mb-6">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl bg-slate-50 flex items-center justify-center transform group-hover:rotate-2 transition-transform">
          {current.image ? (
            <img 
              src={current.image} 
              alt={current.word} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-8xl">{current.emoji}</span>
          )}
        </div>
        
        <button 
          onClick={playAudio}
          className="absolute -bottom-3 -right-3 bg-orange-500 text-white p-4 rounded-2xl shadow-lg hover:bg-orange-600 transition-colors animate-bounce-slow"
        >
          <Volume2 size={28} />
        </button>
      </div>

      {/* 3. Zone de Texte Bulle (Espacement corrigé) */}
      <div className="w-full bg-white/80 backdrop-blur-md p-8 rounded-[3rem] shadow-inner border-2 border-white mb-6">
        {renderText()}
        
        {/* Syllabes discrètes sous la phrase */}
        <div className="mt-8 flex justify-center gap-3">
          {current.syllables.map((syl, i) => (
            <div key={i} className="bg-sky-50 text-sky-600 border-2 border-sky-100 px-4 py-1 rounded-xl text-lg font-black uppercase tracking-widest">
              {syl}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bouton d'action */}
      <div className="w-full max-w-sm px-4">
        <button 
          onClick={handleNext} 
          className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-[2rem] text-2xl font-black shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-[0_4px_0_rgb(21,128,61)] transition-all flex items-center justify-center gap-3 group"
        >
          {step === data.length - 1 ? (
            <>TERMINÉ ! <Star fill="white" className="group-hover:rotate-45 transition-transform" /></>
          ) : (
            <>SUIVANT <ArrowRight size={28} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" /></>
          )}
        </button>
      </div>
    </div>
  );
}