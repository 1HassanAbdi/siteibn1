import React, { useState, useEffect } from "react";
import { X, Timer } from "lucide-react";

export default function QuizEntrainement({ verbe, temps, onValider, onBack }) {
  const [reponses, setReponses] = useState(Array(6).fill(""));
  const [secondes, setSecondes] = useState(0);
  const [isStarted, setIsStarted] = useState(false); // Nouveau : surveille le début
  const PRONOMS = ["je/j'", "tu", "il/elle", "nous", "vous", "ils/elles"];

  // Le chrono ne tourne que si isStarted est vrai
  useEffect(() => {
    let interval;
    if (isStarted) {
      interval = setInterval(() => {
        setSecondes(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = document.getElementById(`input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      } else {
        onValider(reponses, secondes);
      }
    }
  };

  const handleChange = (val, i) => {
    // Si c'est la toute première lettre écrite dans n'importe quel champ
    if (!isStarted && val.length > 0) {
      setIsStarted(true);
    }
    const r = [...reponses];
    r[i] = val;
    setReponses(r);
  };

  return (
    <div className="min-h-screen bg-[#d9e8b5] flex flex-col font-sans">
      <div className="bg-[#7db9c2] p-5 text-white flex justify-between items-center shadow-lg px-10">
        <div className="flex flex-col">
          <span className="text-3xl font-black italic uppercase">{verbe}</span>
          <span className="text-xl opacity-90">{temps}</span>
        </div>
        
        {/* Affichage du chrono qui clignote si pas encore démarré */}
        <div className={`flex items-center gap-3 bg-black/20 px-6 py-2 rounded-full border-2 ${!isStarted ? 'border-yellow-300 animate-pulse' : 'border-transparent'}`}>
          <Timer size={30} />
          <span className="text-3xl font-mono font-bold">
            {isStarted ? `${secondes}s` : "Prêt ?"}
          </span>
        </div>

        <X className="cursor-pointer bg-black/10 rounded-full p-1 hover:bg-black/20" size={40} onClick={onBack} />
      </div>

      <div className="flex-1 bg-white mx-4 mt-4 rounded-t-[60px] p-10 flex flex-col items-center shadow-inner">
        <div className="grid grid-cols-2 gap-x-20 gap-y-6 w-full max-w-4xl mt-10">
          {PRONOMS.map((p, i) => (
            <div key={i} className="flex items-center gap-4 text-4xl">
              <span className="w-24 text-right text-gray-300 font-black italic">{p}</span>
              <input 
                id={`input-${i}`}
                className="flex-1 border-b-4 border-blue-50 outline-none p-2 font-black text-blue-900 lowercase focus:border-blue-400 transition-colors"
                value={reponses[i]}
                autoFocus={i === 0}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onChange={(e) => handleChange(e.target.value, i)}
              />
            </div>
          ))}
        </div>

        <button 
          onClick={() => onValider(reponses, secondes)}
          className="mt-16 bg-[#0099cc] text-white px-24 py-5 rounded-full font-black text-4xl shadow-xl hover:bg-[#007ba3] active:scale-95 transition-all"
        >
          VALIDER
        </button>
      </div>
    </div>
  );
}