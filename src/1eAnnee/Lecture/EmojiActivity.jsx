import React, { useState, useEffect, useRef } from 'react';
import { Volume2, CheckCircle2, Star } from 'lucide-react';

export default function WordActivity({ data, onComplete }) {
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState([]);
  
  const current = data[step];
  const audioRef = useRef(null);

  // Mélanger les mots au début de chaque étape
  useEffect(() => {
    const options = [
      { content: current.word.toUpperCase(), isCorrect: true },
      { content: "VÉLO", isCorrect: false }, 
      { content: "POMME", isCorrect: false }
    ];
    
    setShuffledChoices(options.sort(() => Math.random() - 0.5));
    setIsCorrect(false);
    setWrong(null);
  }, [step, current]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio bloqué"));
    }
  };

  const handleAudioEnded = () => {
    if (isCorrect) {
      if (step < data.length - 1) {
        setStep(step + 1);
      } else {
        onComplete();
      }
    }
  };

  const handleChoice = (isCorrectChoice, index) => {
    if (isCorrect) return;

    if (isCorrectChoice) {
      setIsCorrect(true);
      playAudio(); 
    } else {
      setWrong(index);
      setTimeout(() => setWrong(null), 500);
    }
  };

  // Fonction pour afficher la phrase dynamiquement
  const renderSentence = () => {
    const parts = current.text.split(new RegExp(`(${current.word})`, 'gi'));
    return parts.map((part, index) => {
      if (part.toLowerCase() === current.word.toLowerCase()) {
        return (
          <span 
            key={index} 
            className={`mx-2 px-3 py-1 rounded-xl transition-all duration-500 ${
              isCorrect 
              ? "bg-yellow-400 text-white shadow-lg scale-110 inline-block" 
              : "border-b-4 border-dashed border-slate-300 text-transparent"
            }`}
          >
            {isCorrect ? part : "__________"}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center p-6 h-full justify-around bg-orange-50/30">
      <audio ref={audioRef} src={current.audio} onEnded={handleAudioEnded} />

      {/* Barre de progression style "App" */}
      <div className="w-full max-w-md h-3 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-yellow-400 transition-all duration-700"
          style={{ width: `${((step + 1) / data.length) * 100}%` }}
        ></div>
      </div>

      {/* Zone d'affichage de la phrase */}
      <div className={`
        relative bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
        border-b-[12px] border-yellow-100 w-full max-w-3xl transition-all
        ${isCorrect ? 'border-green-100' : ''}
      `}>
        {/* Badge Flottant */}
        <div className="absolute -top-4 left-10 bg-yellow-400 text-white px-4 py-1 rounded-lg font-black text-xs uppercase shadow-md">
          Étape {step + 1}
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Image d'illustration */}
          <div className="relative">
            <img 
              src={current.image} 
              alt="illustration" 
              className={`h-40 w-40 object-contain rounded-3xl p-2 bg-slate-50 transition-transform duration-500 ${isCorrect ? 'scale-110 rotate-3' : ''}`} 
            />
            {isCorrect && (
              <Star className="absolute -top-4 -right-4 text-yellow-400 fill-yellow-400 animate-bounce" size={40} />
            )}
          </div>
          
          <p className="text-3xl md:text-4xl font-black text-slate-700 leading-relaxed text-center">
            {renderSentence()}
          </p>
        </div>
      </div>

      {/* Zone des choix - Boutons stylisés */}
      <div className="flex flex-wrap justify-center gap-5 w-full max-w-2xl">
        {shuffledChoices.map((opt, i) => (
          <button 
            key={i} 
            disabled={isCorrect}
            onClick={() => handleChoice(opt.isCorrect, i)}
            className={`
              group relative px-10 py-6 bg-white rounded-[2rem] border-b-[8px] transition-all
              text-2xl font-black tracking-widest active:border-b-0 active:translate-y-2
              ${wrong === i ? 'animate-shake border-red-500 text-red-500' : 'border-slate-200 text-slate-600'}
              ${isCorrect && opt.isCorrect ? 'border-green-500 text-green-600 scale-105' : 'hover:border-yellow-400 hover:text-yellow-500'}
              ${isCorrect && !opt.isCorrect ? 'opacity-20 scale-90' : ''}
            `}
          >
            {opt.content}
          </button>
        ))}
      </div>

      {/* Footer / Instructions */}
      <div className="h-12 flex items-center">
        {isCorrect ? (
          <div className="flex items-center gap-3 text-green-500 font-black text-xl animate-pulse">
            <CheckCircle2 size={28} /> TRÈS BIEN !
          </div>
        ) : (
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
            Choisis le mot correct pour compléter
          </p>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}