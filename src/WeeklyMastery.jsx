import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Type, 
  MessageCircle, 
  Grid2X2, 
  Mic, 
  Check, 
  ArrowRight, 
  Trophy,
  RefreshCcw,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- CONFIGURATION DES 5 EXERCICES ---
const EXERCISE_TYPES = [
  { id: '1', title: "J'observe et je copie", icon: <Eye />, color: "bg-blue-500", border: "border-blue-500", light: "bg-blue-50" },
  { id: '2', title: "Le Détective (Un ou Une ?)", icon: <Grid2X2 />, color: "bg-orange-500", border: "border-orange-500", light: "bg-orange-50" },
  { id: '3', title: "La Phrase Mystère", icon: <MessageCircle />, color: "bg-purple-500", border: "border-purple-500", light: "bg-purple-50" },
  { id: '4', title: "C'est quoi ?", icon: <Type />, color: "bg-emerald-500", border: "border-emerald-500", light: "bg-emerald-50" },
  { id: '5', title: "La Grande Dictée", icon: <Mic />, color: "bg-pink-600", border: "border-pink-600", light: "bg-pink-50" },
];

export default function WeeklyMastery({ weekData }) {
  // weekData = l'objet complet d'une semaine (ex: week.data)
  const [currentExId, setCurrentExId] = useState('1');
  const [wordIndex, setWordIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Configuration de l'exercice actuel
  const activeConfig = EXERCISE_TYPES.find(e => e.id === currentExId);
  const currentWordData = weekData[wordIndex];

  // Gestion de la fin d'une série
  const handleNext = () => {
    if (wordIndex < weekData.length - 1) {
      setWordIndex(wordIndex + 1);
    } else {
      setIsCompleted(true);
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    }
  };

  const resetExercise = () => {
    setIsCompleted(false);
    setWordIndex(0);
  };

  const changeExercise = (id) => {
    setCurrentExId(id);
    resetExercise();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans text-slate-800">
      
      {/* --- MENU DES 5 EXERCICES --- */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
        {EXERCISE_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => changeExercise(type.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-b-4 transition-all ${
              currentExId === type.id 
                ? `${type.color} text-white ${type.border} scale-105 shadow-lg` 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="mb-1">{type.icon}</div>
            <span className="text-xs md:text-sm font-bold text-center leading-tight">{type.title}</span>
          </button>
        ))}
      </div>

      {/* --- ZONE PRINCIPALE --- */}
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key={`${currentExId}-${wordIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`relative w-full bg-white rounded-3xl shadow-xl overflow-hidden border-t-8 ${activeConfig.border}`}
          >
            {/* Barre de progression */}
            <div className="w-full h-2 bg-slate-100">
              <div 
                className={`h-full ${activeConfig.color} transition-all duration-500`}
                style={{ width: `${((wordIndex) / weekData.length) * 100}%` }}
              />
            </div>

            <div className="p-6 md:p-10">
              {/* Header de la carte */}
              <div className="flex justify-between items-start mb-6">
                 <span className={`px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest text-white ${activeConfig.color}`}>
                   Exercice {currentExId}
                 </span>
                 <span className="text-slate-400 font-bold">{wordIndex + 1} / {weekData.length}</span>
              </div>

              {/* CONTENU VARIABLE SELON L'EXERCICE */}
              <ExerciseRenderer 
                typeId={currentExId} 
                data={currentWordData} 
                onSuccess={handleNext} 
                config={activeConfig}
                allWords={weekData} // Nécessaire pour générer des faux choix
              />

            </div>
          </motion.div>
        ) : (
          /* --- ECRAN DE FIN DE SÉRIE --- */
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-xl p-10 text-center border-4 border-yellow-300"
          >
            <Trophy size={80} className="mx-auto text-yellow-400 mb-6 animate-bounce" />
            <h2 className="text-3xl font-black text-slate-800 mb-2">Exercice {currentExId} terminé !</h2>
            <p className="text-slate-500 mb-8">Tu deviens un expert des mots.</p>
            
            <div className="flex justify-center gap-4">
              <button onClick={resetExercise} className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200">
                <RefreshCcw size={20}/> Recommencer
              </button>
              
              {/* Bouton pour passer à l'exercice suivant automatiquement */}
              {parseInt(currentExId) < 5 && (
                <button 
                  onClick={() => changeExercise(String(parseInt(currentExId) + 1))}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                >
                  Exercice Suivant <ArrowRight size={20}/>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- LOGIQUE DE CHAQUE EXERCICE ---
function ExerciseRenderer({ typeId, data, onSuccess, config, allWords }) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle, error, success

  // Synthèse vocale helper
  const speak = (txt) => {
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'fr-FR';
    window.speechSynthesis.speak(u);
  };

  // Validation générique
  const validate = (userValue, correctValue) => {
    if (userValue.toLowerCase().trim() === correctValue.toLowerCase().trim()) {
      setStatus('success');
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
      
      setTimeout(() => {
        setInput('');
        setStatus('idle');
        onSuccess();
      }, 1000);
    } else {
      setStatus('error');
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
      setTimeout(() => setStatus('idle'), 800);
    }
  };

  // --- RENDER 1: COPIE (J'observe) ---
  if (typeId === '1') {
    return (
      <div className="text-center">
        <div className="text-7xl mb-4 animate-bounce-slow">{data.emoji}</div>
        <h3 className="text-4xl font-black text-slate-800 mb-2">{data.word}</h3>
        <p className="text-blue-400 font-medium mb-8">Recopie le mot ci-dessous :</p>
        
        <form onSubmit={(e) => { e.preventDefault(); validate(input, data.word); }}>
          <input 
            type="text" 
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full max-w-sm text-center text-3xl font-bold p-4 rounded-2xl border-4 outline-none transition-colors ${status === 'error' ? 'border-red-400 bg-red-50' : status === 'success' ? 'border-green-500 bg-green-50' : 'border-blue-100 focus:border-blue-400'}`}
          />
          <button type="submit" className="hidden">Valider</button>
        </form>
      </div>
    );
  }

  // --- RENDER 2: ARTICLE (Le Détective) ---
  if (typeId === '2') {
    // Liste d'articles possibles (dont le bon)
    const options = ["un", "une", "des", "le", "la", "l'", "de la"];
    // On s'assure que la bonne réponse est là, et on en prend 3 autres au hasard
    const wrongOptions = options.filter(o => o !== data.article).sort(() => 0.5 - Math.random()).slice(0, 3);
    const quizOptions = [data.article, ...wrongOptions].sort(() => 0.5 - Math.random());

    return (
      <div className="text-center">
        <div className="text-7xl mb-6">{data.emoji}</div>
        <div className="text-2xl font-medium mb-8 flex items-center justify-center gap-2">
           <span className="w-16 h-8 border-b-4 border-slate-300 inline-block text-slate-300">?</span> 
           <span className="font-bold text-slate-800 text-4xl">{data.word}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {quizOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => validate(opt, data.article)}
              className="p-4 rounded-xl bg-orange-50 text-orange-700 font-bold text-xl border-2 border-orange-100 hover:bg-orange-100 hover:scale-105 transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- RENDER 3: CONTEXTE (Phrase Mystère) ---
  if (typeId === '3') {
    const parts = data.sentence.split('___');
    return (
      <div className="text-center">
        <div className="text-6xl mb-6 opacity-80">{data.emoji}</div>
        <div className="bg-purple-50 p-6 rounded-2xl border-2 border-dashed border-purple-200 mb-8">
          <p className="text-2xl leading-relaxed text-slate-700">
            {parts[0]}
            <span className="font-bold text-purple-600 border-b-2 border-purple-400 px-1 mx-1">?</span>
            {parts[1]}
          </p>
        </div>
        <p className="text-slate-400 mb-4">Écris le mot manquant :</p>
        <form onSubmit={(e) => { e.preventDefault(); validate(input, data.word); }}>
          <input 
            type="text" 
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full max-w-xs text-center text-2xl font-bold p-3 rounded-xl border-4 outline-none ${status === 'error' ? 'border-red-400' : 'border-purple-100 focus:border-purple-400'}`}
          />
        </form>
      </div>
    );
  }

  // --- RENDER 4: CATEGORIE (C'est quoi ?) ---
  if (typeId === '4') {
    // Récupérer des catégories uniques depuis tout le JSON pour faire des leurres
    const allCategories = [...new Set(allWords.map(w => w.category))];
    const wrongCats = allCategories.filter(c => c !== data.category).sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [data.category, ...wrongCats].sort(() => 0.5 - Math.random());

    return (
      <div className="text-center">
        <div className="text-7xl mb-4">{data.emoji}</div>
        <h3 className="text-3xl font-black text-slate-800 mb-8">{data.article} {data.word}</h3>
        <p className="text-emerald-600 font-bold mb-6">C'est quelle catégorie ?</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {options.map((cat, i) => (
            <button
              key={i}
              onClick={() => validate(cat, data.category)}
              className="py-4 px-6 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-lg border-2 border-emerald-100 hover:bg-emerald-200 transition-colors capitalize"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- RENDER 5: DICTÉE (Mastery) ---
  if (typeId === '5') {
    return (
      <div className="text-center">
        <button 
          onClick={() => speak(data.word)}
          className="w-24 h-24 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform shadow-lg cursor-pointer"
        >
          <Volume2 size={40} />
        </button>
        <p className="text-slate-400 font-medium mb-6">Écoute et écris le mot (sans regarder !)</p>
        
        {/* Indice visuel caché (flou) qui se révèle si on survole (pour aider) */}
        <div className="mb-6 group cursor-help">
           <span className="text-4xl filter blur-md group-hover:blur-none transition-all duration-300 select-none">{data.emoji}</span>
           <p className="text-xs text-slate-300 mt-2">Passe la souris pour un indice</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); validate(input, data.word); }}>
           <span className="text-xl text-slate-400 italic mr-2">{data.article}</span>
           <input 
            type="text" 
            autoFocus
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-64 text-center text-3xl font-bold p-3 rounded-xl border-4 outline-none ${status === 'error' ? 'border-red-400 bg-red-50' : 'border-pink-200 focus:border-pink-500'}`}
          />
          <button type="submit" className="block w-full max-w-xs mx-auto mt-6 bg-pink-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-pink-700">
            Valider
          </button>
        </form>
      </div>
    );
  }

  return null;
}