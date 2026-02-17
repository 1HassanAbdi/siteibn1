import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Trash2 } from 'lucide-react';

export default function SyllableActivity({ data, onComplete }) {
  const [step, setStep] = useState(0);
  const [userAns, setUserAns] = useState([]);
  const [shuffled, setShuffled] = useState([]); 
  const [isError, setIsError] = useState(false);
  
  const current = data[step];
  
  // Ref pour l'audio de la phrase complète (consigne)
  const consigneAudioRef = useRef(null);

  // Initialisation à chaque changement de mot (mélange des syllabes)
  useEffect(() => {
    setShuffled([...current.syllables].sort(() => Math.random() - 0.5));
    setUserAns([]);
    setIsError(false);
  }, [step, current]);

  // Joue l'audio de la phrase (ex: "Maman coupe les tomates")
  const playConsigne = () => {
    if (consigneAudioRef.current) {
      consigneAudioRef.current.currentTime = 0;
      consigneAudioRef.current.play().catch(e => console.log("Audio consigne bloqué"));
    }
  };

  // --- NOUVELLE FONCTION : Lecture du mot gagné ---
  const playSuccessAudio = (wordFallback) => {
    // 1. On récupère le chemin audio directement depuis le JSON
    const audioSrc = current.wordAudio; 

    // Fonction de secours (Synthèse vocale)
    const playFallbackData = () => {
      console.warn("Utilisation de la synthèse vocale pour :", wordFallback);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(wordFallback);
        utterance.lang = 'fr-FR'; 
        utterance.rate = 0.9; 
        utterance.pitch = 1.1; 
        window.speechSynthesis.speak(utterance);
      }
    };

    if (audioSrc) {
      // 2. Si un fichier audio est défini dans le JSON, on essaie de le lire
      const successAudio = new Audio(audioSrc);
      
      successAudio.play()
        .then(() => {
          console.log("Lecture réussie du fichier :", audioSrc);
        })
        .catch((err) => {
          // 3. Si le fichier ne charge pas, on lance le fallback
          console.error("Erreur lecture fichier MP3, fallback activé.", err);
          playFallbackData();
        });
    } else {
      // 4. Si pas de fichier audio dans le JSON, on lance le fallback direct
      playFallbackData();
    }
  };

  const handleSyllable = (syl) => {
    if (isError) return; 

    const nextAns = [...userAns, syl];
    setUserAns(nextAns);

    // Vérification
    const currentAttempt = nextAns.join("");
    
    // Si le mot est complet (même longueur que la réponse attendue)
    if (nextAns.length === current.syllables.length) {
      if (currentAttempt === current.word) {
        
        // --- C'EST GAGNÉ ---
        
        // 1. On joue le son du mot
        playSuccessAudio(current.word);

        // 2. On attend 1.5s avant de passer à la suite
        setTimeout(() => {
          if (step < data.length - 1) {
            setStep(step + 1);
          } else {
            onComplete();
          }
        }, 2500); 

      } else {
        // --- C'EST PERDU ---
        setIsError(true);
        setTimeout(() => {
          setUserAns([]); 
          setIsError(false);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6 h-full justify-around animate-pop">
      {/* Audio caché pour la consigne (phrase complète) */}
      <audio ref={consigneAudioRef} src={current.audio} />

      {/* 1. Badge Titre */}
      <div className="bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest">
        4. Je découpe les mots
      </div>

      {/* 2. Image et Son (Consigne) */}
      <div className="relative cursor-pointer group" onClick={playConsigne}>
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-105">
          {current.image ? (
            <img src={current.image} className="w-full h-full object-cover" alt="mot à deviner" />
          ) : (
            <span className="text-8xl">{current.emoji}</span>
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white p-3 rounded-full shadow-lg border-4 border-white">
          <Volume2 size={24} />
        </div>
      </div>

      {/* 3. Zone de réponse (Cases vides ou remplies) */}
      <div className="w-full max-w-md">
        <div className={`
          flex gap-3 justify-center items-center min-h-[90px] p-4 bg-slate-50 rounded-3xl border-4 border-dashed transition-all
          ${isError ? 'border-red-300 animate-shake bg-red-50' : 'border-pink-100'}
        `}>
          {userAns.map((s, i) => (
            <span 
              key={i} 
              className="bg-pink-500 text-white px-5 py-3 rounded-2xl text-2xl md:text-3xl font-black shadow-md animate-pop"
            >
              {s}
            </span>
          ))}
          {userAns.length === 0 && !isError && (
            <span className="text-slate-300 font-bold italic">Clique sur les morceaux...</span>
          )}
        </div>
      </div>

      {/* 4. Clavier de Syllabes (Boutons) */}
      <div className="flex flex-wrap gap-4 justify-center">
        {shuffled.map((s, i) => (
          <button 
            key={i} 
            onClick={() => handleSyllable(s)}
            disabled={isError}
            className="bg-white border-b-8 border-pink-100 px-8 py-4 rounded-2xl text-2xl md:text-3xl font-black text-pink-600 hover:bg-pink-50 hover:border-pink-200 active:translate-y-1 active:border-b-0 transition-all shadow-md disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Bouton Effacer */}
      <button 
        onClick={() => setUserAns([])}
        className="flex items-center gap-2 text-slate-400 hover:text-pink-500 font-bold text-xs uppercase tracking-widest transition-colors"
      >
        <Trash2 size={16} /> Recommencer le mot
      </button>
    </div>
  );
}