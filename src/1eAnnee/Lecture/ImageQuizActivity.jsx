import React, { useState, useEffect, useRef } from 'react';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';

export default function ImageQuizActivity({ data, onComplete }) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState(null); // 'correct', 'wrong', ou null
  const [activeIndex, setActiveIndex] = useState(null);
  const [choices, setChoices] = useState([]);
  
  const current = data[step];
  const audioRef = useRef(null);

  // Préparation de la question
  useEffect(() => {
  const options = [
    { 
      content: current.image, 
      isCorrect: true, 
      type: 'image' 
    },
    { 
      content: current.distractors[0], 
      isCorrect: false, 
      type: 'image' 
    }
  ];

  setChoices(options.sort(() => Math.random() - 0.5));
  setStatus(null);
  setActiveIndex(null);
}, [step]);


  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio bloqué"));
    }
  };

  // CETTE FONCTION SE LANCE AUTOMATIQUEMENT QUAND LE SON EST FINI
  const handleAudioEnded = () => {
    if (status === 'correct') {
      if (step < data.length - 1) {
        setStep(step + 1);
      } else {
        onComplete();
      }
    }
  };

  const handleChoice = (isCorrect, index) => {
    if (status !== null) return; 

    setActiveIndex(index);

    if (isCorrect) {
      setStatus('correct');
      playAudio(); // On lance la lecture, handleAudioEnded fera la suite
    } else {
      setStatus('wrong');
      setTimeout(() => {
        setStatus(null);
        setActiveIndex(null);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 h-full justify-around animate-pop">
      {/* L'écouteur onEnded est la clé ici */}
      <audio 
        ref={audioRef} 
        src={current.audio} 
        onEnded={handleAudioEnded} 
      />

      <div className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest">
        Question {step + 1} / {data.length}
      </div>

      <div className="bg-white border-4 border-purple-100 p-6 rounded-[2rem] shadow-sm flex items-center gap-4 max-w-xl w-full">
        <button 
          onClick={playAudio}
          className="bg-purple-500 text-white p-3 rounded-2xl hover:scale-110 transition-transform shrink-0 shadow-md"
        >
          <Volume2 size={24} />
        </button>
        <p className="text-2xl md:text-3xl font-bold text-slate-700 italic leading-tight">
          "{current.text}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-2xl px-4">
        {choices.map((opt, i) => (
          <button 
            key={i} 
            disabled={status === 'correct'}
            onClick={() => handleChoice(opt.isCorrect, i)}
            className={`
              relative aspect-square rounded-[2.5rem] bg-white shadow-xl border-8 transition-all overflow-hidden
              ${activeIndex === i && status === 'wrong' ? 'animate-shake border-red-400' : 'border-white'}
              ${activeIndex === i && status === 'correct' ? 'border-green-400 scale-105' : ''}
              ${status === 'correct' && !opt.isCorrect ? 'opacity-50' : ''}
            `}
          >
            {opt.type === 'image' ? (
              <img src={opt.content} className="w-full h-full object-cover" alt="choix" />
            ) : (
              <span className="text-8xl md:text-9xl flex items-center justify-center h-full">
                {opt.content}
              </span>
            )}
            
            {activeIndex === i && status === 'wrong' && (
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                <span className="text-6xl">❌</span>
              </div>
            )}

            {activeIndex === i && status === 'correct' && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <span className="text-6xl">✅</span>
              </div>
            )}
          </button>
        ))}
      </div>

      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
        Écoute et choisis la bonne image
      </p>
    </div>
  );
}