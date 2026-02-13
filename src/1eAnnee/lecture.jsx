import React, { useState, useEffect, useRef, useMemo } from "react";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";

export default function LecteurFluide({ texte = "Rémi va à l'école." }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [voice, setVoice] = useState(null);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);

  // 1. Préparer le texte (Découpage en mots pour l'affichage)
  const mots = useMemo(() => {
    return texte.split(/(\s+)/).filter((e) => e.trim().length > 0);
  }, [texte]);

  // 2. Charger la meilleure voix possible
  useEffect(() => {
    const loadVoice = () => {
      const voices = synth.getVoices();
      // On cherche en priorité "Google français" qui est très fluide, ou une voix native
      const bestVoice =
        voices.find((v) => v.name.includes("Google") && v.lang.includes("fr")) ||
        voices.find((v) => v.lang.includes("fr"));
      setVoice(bestVoice);
    };

    loadVoice();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoice;
    }
  }, []);

  // 3. La fonction de lecture intelligente
  const lire = () => {
    if (synth.paused) {
      synth.resume();
      setIsPlaying(true);
      return;
    }

    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(texte);
    utterance.voice = voice;
    utterance.lang = "fr-FR";
    utterance.rate = 0.9; // Vitesse idéale pour la lecture fluide (ni trop lent, ni trop rapide)
    utterance.pitch = 1;

    // --- LE SECRET DE LA FLUIDITÉ : SYNC VISUELLE ---
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        // On calcule quel mot est lu en fonction de l'index du caractère
        const charIndex = event.charIndex;
        // On trouve l'index du mot correspondant
        let currentLength = 0;
        for (let i = 0; i < mots.length; i++) {
          currentLength += mots[i].length + 1; // +1 pour l'espace approximatif
          if (currentLength > charIndex) {
            setCurrentWordIndex(i);
            break;
          }
        }
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentWordIndex(-1);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
    setIsPlaying(true);
  };

  const pause = () => {
    synth.pause();
    setIsPlaying(false);
  };

  const stop = () => {
    synth.cancel();
    setIsPlaying(false);
    setCurrentWordIndex(-1);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      
      {/* Zone de texte Interactive */}
      <div className="p-8 md:p-12 bg-gradient-to-br from-indigo-50 to-white min-h-[200px] flex items-center flex-wrap content-center gap-x-2 gap-y-3 leading-relaxed">
        {mots.map((mot, index) => (
          <span
            key={index}
            className={`transition-all duration-200 px-2 py-1 rounded-lg text-2xl md:text-4xl font-medium cursor-pointer ${
              index === currentWordIndex
                ? "bg-orange-400 text-white scale-110 shadow-lg transform font-bold" // Le mot actif
                : "text-slate-700 hover:bg-indigo-100 hover:text-indigo-600" // Les autres mots
            }`}
            onClick={() => {
              // Bonus : Cliquer sur un mot lance la lecture de toute la phrase (optionnel)
              stop();
              const resteDuTexte = mots.slice(index).join(" ");
              const u = new SpeechSynthesisUtterance(resteDuTexte);
              u.voice = voice;
              u.rate = 0.9;
              synth.speak(u);
            }}
          >
            {mot}
          </span>
        ))}
      </div>

      {/* Barre de contrôle */}
      <div className="bg-slate-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          {isPlaying ? (
            <button
              onClick={pause}
              className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full transition shadow-lg shadow-orange-500/30"
            >
              <Pause fill="currentColor" size={24} />
            </button>
          ) : (
            <button
              onClick={lire}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full transition shadow-lg shadow-green-500/30 pl-5"
            >
              <Play fill="currentColor" size={24} />
            </button>
          )}

          <button
            onClick={stop}
            className="text-slate-400 hover:text-white p-2 transition"
            title="Recommencer"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <Volume2 size={16} />
          {voice ? (
            <span className="text-green-400">Voix Naturelle Active</span>
          ) : (
            <span>Voix Standard</span>
          )}
        </div>
      </div>
    </div>
  );
}