import React, { useState, useEffect, useRef } from 'react';
import { Volume2, CheckCircle } from 'lucide-react';

export default function OrderActivity({ data, onComplete }) {
  const [ordered, setOrdered] = useState([]);
  const [pool, setPool] = useState([]);
  const [errorId, setErrorId] = useState(null);
  const audioRef = useRef(new Audio());

  // Initialisation du pool de phrases
  useEffect(() => {
    setPool([...data].sort(() => Math.random() - 0.5));
  }, [data]);

  const playText = (audioUrl) => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play blocked"));
    }
  };

  const handleSelect = (item) => {
    // Vérifier si c'est la bonne phrase suivante dans l'ordre de 'data'
    if (item.id === data[ordered.length].id) {
      // 1. Lire l'audio immédiatement
      playText(item.audio);

      // 2. Déplacer vers la liste ordonnée
      const nextOrdered = [...ordered, item];
      setOrdered(nextOrdered);
      setPool(pool.filter(p => p.id !== item.id));

      // 3. Si terminé, attendre la fin de l'audio ou un court délai
      if (nextOrdered.length === data.length) {
        audioRef.current.onended = () => {
          setTimeout(onComplete, 1000);
        };
        // Sécurité si pas d'audio
        if (!item.audio) setTimeout(onComplete, 2000);
      }
    } else {
      // Gestion de l'erreur (animation secousse)
      setErrorId(item.id);
      setTimeout(() => setErrorId(null), 500);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-6 bg-slate-50">
      
      {/* Zone de destination (Phrases ordonnées) */}
      <div className="flex-[1.5] overflow-y-auto space-y-3 bg-white p-6 rounded-[2.5rem] border-4 border-dashed border-green-200 shadow-inner">
        {ordered.length === 0 && (
          <p className="text-center text-slate-300 mt-10 italic">
            Clique sur les phrases en bas pour construire l'histoire...
          </p>
        )}
        {ordered.map((item, i) => (
          <div 
            key={i} 
            className="bg-green-50 p-4 rounded-2xl border-l-8 border-green-500 shadow-sm animate-pop flex items-center gap-4"
          >
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-black shrink-0">
              {i + 1}
            </div>
            <p className="text-lg font-bold text-slate-800">{item.text}</p>
            <CheckCircle className="ml-auto text-green-500" size={20} />
          </div>
        ))}
      </div>

      {/* Zone de sélection (Pool) */}
      <div className="flex-1 space-y-3">
        <h3 className="text-center text-orange-500 font-black text-sm uppercase tracking-widest mb-2">
          Quelle est la suite ?
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {pool.map((item) => (
            <button 
              key={item.id} 
              onClick={() => handleSelect(item)} 
              className={`
                w-full p-5 bg-white border-b-4 rounded-2xl text-left font-bold text-slate-700
                flex items-center gap-4 transition-all active:scale-95
                ${errorId === item.id 
                  ? 'border-red-500 animate-shake bg-red-50' 
                  : 'border-orange-200 hover:border-orange-400 hover:bg-orange-50'}
              `}
            >
              <div className="bg-orange-100 p-2 rounded-xl">
                <Volume2 size={20} className="text-orange-500"/>
              </div>
              <span className="text-md md:text-lg">{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Animation CSS pour la secousse et l'apparition */}
      <style sx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        .animate-pop { animation: pop 0.3s cubic-bezier(0.26, 0.53, 0.74, 1.48); }
        @keyframes pop {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}