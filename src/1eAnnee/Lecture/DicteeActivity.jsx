import React, { useState, useEffect, useRef } from 'react';
import { Volume2, CheckCircle } from 'lucide-react';

export default function DicteeActivity({ data, onComplete }) {
  const [step, setStep] = useState(0);
  const [currentWordState, setCurrentWordState] = useState([]);
  const [wrong, setWrong] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [keyboard, setKeyboard] = useState([]);

  const current = data[step];
  const audioRef = useRef(null);
  const wordAudioRef = useRef(null);

  // Initialisation au changement d'étape
  useEffect(() => {
    const word = current.word.toUpperCase();
    const wordLetters = word.split("");
    
    // Stratégie : On cache environ 40% des lettres (au moins 2)
    // On garde toujours la première lettre visible pour aider
    const newState = wordLetters.map((char, index) => {
      if (index === 0) return char; // Toujours visible
      return Math.random() > 0.4 ? char : null; // Aléatoirement vide
    });

    // Sécurité : S'il n'y a pas de trous, on en force un
    if (!newState.includes(null)) {
      newState[newState.length - 1] = null;
    }

    setCurrentWordState(newState);
    setIsFinished(false);
    setWrong(null);

    // Préparer le clavier avec les lettres manquantes + quelques lettres pièges
    const missingLetters = wordLetters.filter((char, i) => newState[i] === null);
    const fillers = ["B", "S", "P", "L"].filter(l => !wordLetters.includes(l));
    const finalKeys = [...new Set([...missingLetters, ...fillers.slice(0, 2)])];
    
    setKeyboard(finalKeys.sort(() => Math.random() - 0.5));

    // Lire le mot seul au début
    if (wordAudioRef.current) {
      wordAudioRef.current.play().catch(e => console.log("Audio bloqué"));
    }
  }, [step, current]);

  const handleLetterClick = (letter, index) => {
    if (isFinished) return;

    // Trouver le premier index vide
    const firstEmptyIndex = currentWordState.indexOf(null);
    const correctLetter = current.word.toUpperCase()[firstEmptyIndex];

    if (letter === correctLetter) {
      const nextState = [...currentWordState];
      nextState[firstEmptyIndex] = letter;
      setCurrentWordState(nextState);

      // Vérifier si c'est fini
      if (!nextState.includes(null)) {
        setIsFinished(true);
        // Lire la phrase complète pour féliciter
        if (audioRef.current) audioRef.current.play();
      }
    } else {
      setWrong(index);
      setTimeout(() => setWrong(null), 400);
    }
  };

  const handleAudioEnded = () => {
    if (isFinished) {
      setTimeout(() => {
        if (step < data.length - 1) {
          setStep(step + 1);
        } else {
          onComplete();
        }
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 h-full justify-around bg-blue-50/20">
      {/* Audios */}
      <audio ref={wordAudioRef} src={current.wordAudio} />
      <audio ref={audioRef} src={current.audio} onEnded={handleAudioEnded} />

      <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-black uppercase shadow-lg">
        Je complète le mot
      </div>

      <div className="flex flex-col items-center gap-10 w-full">
        {/* Image Indice */}
        <div className="relative">
          <img 
            src={current.image} 
            className={`h-40 w-40 object-contain bg-white p-4 rounded-[2.5rem] shadow-xl border-4 ${isFinished ? 'border-green-400' : 'border-white'}`} 
            alt="aide"
          />
          <button 
            onClick={() => wordAudioRef.current.play()}
            className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-3 rounded-full shadow-lg"
          >
            <Volume2 size={24} />
          </button>
        </div>

        {/* Zone du mot à trous */}
        <div className="flex gap-2 flex-wrap justify-center">
          {currentWordState.map((char, i) => (
            <div 
              key={i} 
              className={`
                w-12 h-16 md:w-16 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-black
                transition-all duration-300 border-b-[6px]
                ${char 
                  ? "bg-white border-blue-200 text-blue-600 shadow-md" 
                  : "bg-blue-100/50 border-blue-300 text-transparent animate-pulse border-dashed"}
                ${isFinished ? "bg-green-50 border-green-400 text-green-600" : ""}
              `}
            >
              {char || "?"}
            </div>
          ))}
        </div>
      </div>

      {/* Clavier de lettres */}
      <div className="grid grid-cols-4 gap-4 max-w-sm w-full px-4">
        {keyboard.map((letter, i) => (
          <button 
            key={i} 
            onClick={() => handleLetterClick(letter, i)}
            className={`
              h-16 md:h-20 bg-white rounded-2xl shadow-lg border-b-8 border-slate-200 
              text-2xl md:text-3xl font-black text-slate-700 transition-all
              active:border-b-0 active:translate-y-1
              ${wrong === i ? "border-red-500 bg-red-50 text-red-500 animate-shake" : "hover:border-blue-400"}
              ${isFinished ? "opacity-20 grayscale" : ""}
            `}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="h-8 flex items-center">
        {isFinished && (
          <div className="flex items-center gap-2 text-green-600 font-black animate-bounce">
            <CheckCircle /> BIEN JOUÉ !
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out; }
      `}</style>
    </div>
  );
}