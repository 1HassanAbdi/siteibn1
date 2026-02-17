import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Image as ImageIcon, Smile, Type, PenTool, ListOrdered,
  Lock, CheckCircle, Star, Home, ArrowRight, Play, Pause, RefreshCcw, Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ==========================================
// 0. DONNÉES PÉDAGOGIQUES
// ==========================================
// Note : Pour l'exercice "Ordre", on utilise toutes les phrases à la fin.
const storyData = [
  { id: 1, text: "Maman lave les tomates.", word: "TOMATES", syllables: ["TO", "MA", "TES"], emoji: "🍅", audio: "repas/1.mp3", image: "repas/1.jpg" },
  { id: 2, text: "Papa coupe le rôti.", word: "RÔTI", syllables: ["RÔ", "TI"], emoji: "🍖", audio: "repas/2.mp3", image: "repas/2.jpg" },
  { id: 3, text: "Le bébé boit son lait.", word: "LAIT", syllables: ["LAIT"], emoji: "🍼", audio: "repas/3.mp3", image: "repas/3.jpg" },
  { id: 4, text: "Il y a une salade verte.", word: "SALADE", syllables: ["SA", "LA", "DE"], emoji: "🥗", audio: "repas/4.mp3", image: "repas/4.jpg" }
];

// --- Utilitaires ---
const triggerWin = () => {
  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#22c55e', '#eab308', '#f97316'] });
};

// Fonction fictive pour l'audio (à adapter selon vos dossiers)
const playAudioMock = () => {
  // Simule la lecture audio
  console.log("Lecture audio...");
};

// ==========================================
// 1. ACTIVITÉ LECTURE (Imprégnation)
// ==========================================
const LectureActivity = ({ onComplete, data }) => {
  const [index, setIndex] = useState(0);
  const current = data[index];

  const handleNext = () => {
    if (index < data.length - 1) setIndex(index + 1);
    else { triggerWin(); onComplete(); }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 animate-fade-in">
      <h2 className="text-xl font-black text-green-700 mb-4 bg-green-100 px-4 py-1 rounded-full uppercase tracking-widest">1. Écoute et Lis</h2>
      
      <div className="bg-white p-6 rounded-[30px] shadow-xl border-b-8 border-green-600 w-full max-w-lg text-center relative">
        <button onClick={playAudioMock} className="absolute top-4 right-4 bg-green-100 p-3 rounded-full text-green-700 hover:bg-green-200 transition-colors">
          <Volume2 size={24} />
        </button>
        
        <div className="h-48 bg-slate-50 rounded-2xl mb-6 flex items-center justify-center text-8xl shadow-inner">
          {current.emoji}
        </div>
        
        <p className="text-3xl md:text-4xl font-black text-slate-700 mb-8 leading-snug font-sans">
          {current.text.split(" ").map((word, i) => (
            <span key={i} className="hover:text-orange-500 cursor-pointer transition-colors duration-300"> {word} </span>
          ))}
        </p>

        <div className="flex justify-center">
          <button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-xl font-bold shadow-lg hover:shadow-orange-500/40 hover:-translate-y-1 transition-all flex items-center gap-2">
            {index === data.length - 1 ? "J'ai fini !" : "Suite"} <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. ACTIVITÉ QUIZ IMAGE (Compréhension)
// ==========================================
const ImageQuizActivity = ({ onComplete, data }) => {
  const [step, setStep] = useState(0);

  const handleChoice = (isCorrect) => {
    if (isCorrect) {
       triggerWin();
       if(step < data.length - 1) setStep(step + 1);
       else onComplete();
    } else {
      // Effet visuel d'erreur (géré par CSS ou alert simple)
      const btn = document.getElementById('bad-choice');
      if(btn) btn.classList.add('animate-shake');
      setTimeout(() => btn?.classList.remove('animate-shake'), 500);
    }
  };

  const wrongEmojis = ["🚗", "🎈", "🐶", "✈️"]; // Faux choix

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 animate-fade-in text-center">
      <h2 className="text-xl font-black text-purple-700 mb-6 bg-purple-100 px-4 py-1 rounded-full">2. Trouve l'image</h2>
      
      <div className="bg-white px-8 py-4 rounded-2xl shadow-sm border-2 border-purple-100 mb-8">
        <p className="text-2xl font-bold text-slate-700">"{data[step].text}"</p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        {/* Bon choix */}
        <button onClick={() => handleChoice(true)} className="aspect-square bg-white rounded-3xl border-4 border-white hover:border-green-400 shadow-xl flex items-center justify-center text-7xl hover:scale-105 transition-all cursor-pointer">
          {data[step].emoji}
        </button>
        {/* Mauvais choix */}
        <button id="bad-choice" onClick={() => handleChoice(false)} className="aspect-square bg-white rounded-3xl border-4 border-white hover:border-red-400 shadow-xl flex items-center justify-center text-7xl hover:scale-105 transition-all cursor-pointer">
          {wrongEmojis[step % wrongEmojis.length]}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 3. ACTIVITÉ MOTS (Devinette)
// ==========================================
const EmojiActivity = ({ onComplete, data }) => {
  const [step, setStep] = useState(0);
  const current = data[step];
  
  // On remplace le mot cible par des tirets
  const sentenceParts = current.text.split(current.word.toLowerCase());
  // Cas simple (ne gère pas la casse parfaitement pour l'exemple, mais fonctionnel)
  const displaySentence = current.text.replace(new RegExp(current.word, "i"), "_____");

  const checkAnswer = (emoji) => {
    if (emoji === current.emoji) {
      triggerWin();
      if (step < data.length - 1) setStep(step + 1);
      else onComplete();
    }
  };

  const choices = [current.emoji, "🚲", "🍌"].sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 animate-fade-in text-center">
      <h2 className="text-xl font-black text-yellow-700 mb-6 bg-yellow-100 px-4 py-1 rounded-full">3. Complète la phrase</h2>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-yellow-200 mb-10 w-full max-w-lg">
        <p className="text-3xl font-black text-slate-700 leading-relaxed">
          {displaySentence}
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        {choices.map((e, i) => (
          <button key={i} onClick={() => checkAnswer(e)} className="w-20 h-20 bg-white text-4xl rounded-2xl shadow-md border-b-4 border-gray-200 hover:border-yellow-400 hover:-translate-y-1 transition-all">
            {e}
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. ACTIVITÉ SYLLABES (Analytique)
// ==========================================
const SyllableActivity = ({ onComplete, data }) => {
  const [step, setStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState([]);
  
  const current = data[step];
  // Copie mélangée
  const [shuffled, setShuffled] = useState([]);

  useEffect(() => {
    setShuffled([...current.syllables].sort(() => Math.random() - 0.5));
    setUserAnswer([]);
  }, [step]);

  const addSyllable = (syl) => {
    const newAns = [...userAnswer, syl];
    setUserAnswer(newAns);
    
    // Validation
    if (newAns.join("") === current.word) {
      triggerWin();
      setTimeout(() => {
        if (step < data.length - 1) setStep(step + 1);
        else onComplete();
      }, 1000);
    } else if (newAns.length >= current.syllables.length) {
      // Erreur : reset
      setTimeout(() => setUserAnswer([]), 500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 animate-fade-in">
      <h2 className="text-xl font-black text-pink-700 mb-4 bg-pink-100 px-4 py-1 rounded-full">4. Les Syllabes</h2>
      
      {/* Mot Image */}
      <div className="text-6xl mb-6 animate-bounce-slow">{current.emoji}</div>

      {/* Zone de réponse */}
      <div className="flex gap-2 mb-8 min-h-[70px] items-center justify-center bg-white w-full max-w-md rounded-2xl shadow-inner p-2 border-2 border-pink-100">
        {userAnswer.map((s, i) => (
          <span key={i} className="text-2xl font-black text-white bg-pink-500 px-3 py-2 rounded-xl shadow-md animate-pop">
            {s}
          </span>
        ))}
        {userAnswer.length === 0 && <span className="text-gray-300 font-bold text-sm">Clique sur les étiquettes</span>}
      </div>

      {/* Boutons Syllabes */}
      <div className="flex flex-wrap gap-3 justify-center">
        {shuffled.map((s, i) => (
          <button key={i} onClick={() => addSyllable(s)} className="bg-white text-pink-600 border-b-4 border-pink-200 text-xl font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-pink-500 hover:text-white hover:border-pink-600 transition-all active:scale-95">
            {s}
          </button>
        ))}
      </div>
       <button onClick={() => setUserAnswer([])} className="mt-6 text-slate-400 underline text-sm">Effacer</button>
    </div>
  );
};

// ==========================================
// 5. ACTIVITÉ DICTÉE (Encodage)
// ==========================================
const DicteeActivity = ({ onComplete, data }) => {
  const [step, setStep] = useState(0);
  const [letters, setLetters] = useState([]);
  const current = data[step];

  useEffect(() => { setLetters([]); }, [step]);

  const handleType = (char) => {
    const newLetters = [...letters, char];
    setLetters(newLetters);
    
    if (newLetters.join("") === current.word) {
      triggerWin();
      setTimeout(() => {
        if (step < data.length - 1) setStep(step + 1);
        else onComplete();
      }, 1000);
    } else if (newLetters.length >= current.word.length) {
       setTimeout(() => setLetters([]), 500); 
    }
  };

  // Clavier simplifié (Lettres du mot + 2 pièges)
  const keyboard = (current.word + "XS").split('').sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 animate-fade-in">
      <h2 className="text-xl font-black text-blue-700 mb-4 bg-blue-100 px-4 py-1 rounded-full">5. Dictée Magique</h2>
      
      <div className="mb-4 text-6xl">{current.emoji}</div>

      {/* Cases des lettres */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-3 rounded-2xl shadow-inner">
        {current.word.split('').map((_, i) => (
          <div key={i} className="w-10 h-12 bg-white rounded-lg border-b-4 border-slate-300 flex items-center justify-center text-xl font-black text-slate-700">
            {letters[i] || ""}
          </div>
        ))}
      </div>

      {/* Clavier */}
      <div className="grid grid-cols-4 gap-2">
        {keyboard.map((char, i) => (
          <button key={i} onClick={() => handleType(char)} className="w-12 h-12 bg-white rounded-xl shadow-[0_4px_0_rgb(0,0,0,0.1)] border border-slate-200 font-bold text-xl hover:bg-blue-100 hover:text-blue-600 text-slate-600 active:translate-y-1 active:shadow-none transition-all">
            {char}
          </button>
        ))}
      </div>
      <button onClick={() => setLetters([])} className="mt-4 text-red-400 font-bold text-sm">Recommencer</button>
    </div>
  );
};

// ==========================================
// 6. ACTIVITÉ ORDRE (Logique & Syntaxe)
// ==========================================
const OrderActivity = ({ onComplete, data }) => {
  const [items, setItems] = useState([]);
  const [nextIndex, setNextIndex] = useState(0); 
  const [wrongShake, setWrongShake] = useState(null);

  // Initialisation : on mélange tout
  useEffect(() => {
    const shuffled = [...data]
      .map((item, index) => ({ ...item, originalIndex: index, uid: `card-${index}` }))
      .sort(() => Math.random() - 0.5);
    setItems(shuffled);
  }, [data]);

  const handleCardClick = (item) => {
    // Si c'est la bonne phrase (celle qui suit dans l'histoire)
    if (item.originalIndex === nextIndex) {
      // Succès
      const newNextIndex = nextIndex + 1;
      setNextIndex(newNextIndex);

      if (newNextIndex === data.length) {
        triggerWin();
        setTimeout(onComplete, 2500);
      }
    } else {
      // Erreur
      setWrongShake(item.uid);
      setTimeout(() => setWrongShake(null), 500);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-orange-50 overflow-y-auto w-full animate-slide-up">
      <h2 className="text-xl font-black text-orange-600 mb-4 text-center bg-white py-2 rounded-xl border border-orange-200 shadow-sm sticky top-0 z-10">
        Remets l'histoire dans l'ordre !
      </h2>

      <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto pb-4">
        
        {/* ZONE 1 : HISTOIRE RÉSOLUE (Haut) */}
        <div className="flex flex-col gap-2 min-h-[100px]">
           {data.slice(0, nextIndex).map((item, i) => (
             <div key={`solved-${i}`} className="animate-pop flex items-center bg-green-100 border-l-4 border-green-500 rounded-lg p-3 shadow-sm">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3 shrink-0 text-sm">
                  {i + 1}
                </div>
                <p className="text-base md:text-lg font-bold text-green-900">{item.text}</p>
             </div>
           ))}
           {nextIndex === 0 && (
             <div className="text-center text-orange-300 italic py-4 border-2 border-dashed border-orange-200 rounded-lg">
               L'histoire va apparaître ici...
             </div>
           )}
        </div>

        {/* SÉPARATEUR */}
        <div className="flex items-center gap-2 my-2">
            <div className="h-px bg-orange-200 flex-1"></div>
            <span className="text-xs text-orange-400 font-bold uppercase">Choisis la suite</span>
            <div className="h-px bg-orange-200 flex-1"></div>
        </div>

        {/* ZONE 2 : PHRASES EN DÉSORDRE (Bas - Cliquer pour choisir) */}
        <div className="grid gap-3">
          {items
            .filter(item => item.originalIndex >= nextIndex) // On cache celles déjà trouvées
            .map((item) => (
            <button
              key={item.uid}
              onClick={() => handleCardClick(item)}
              className={`
                group relative flex items-center w-full text-left
                bg-white border-b-4 border-orange-200 rounded-xl p-3
                transition-all duration-200 hover:scale-[1.01] hover:bg-orange-50 active:scale-95
                ${wrongShake === item.uid ? 'animate-shake border-red-400 bg-red-50' : 'border-r-4'}
              `}
            >
              {/* Bouton Audio Visuel (Décoratif ou fonctionnel) */}
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm mr-3">
                 <Volume2 size={20} />
              </div>

              {/* Texte */}
              <span className="text-base md:text-lg font-medium text-slate-700 leading-tight">
                {item.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPOSANT PRINCIPAL (App)
// ==========================================
export default function ReadingApp() {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [badges, setBadges] = useState([]);

  // Configuration des niveaux
  const levels = [
    { id: 1, title: "Découverte", icon: <BookOpen />, color: "bg-green-100 text-green-700", component: LectureActivity },
    { id: 2, title: "Images", icon: <ImageIcon />, color: "bg-purple-100 text-purple-700", component: ImageQuizActivity },
    { id: 3, title: "Mots", icon: <Smile />, color: "bg-yellow-100 text-yellow-700", component: EmojiActivity },
    { id: 4, title: "Syllabes", icon: <Type />, color: "bg-pink-100 text-pink-700", component: SyllableActivity },
    { id: 5, title: "Dictée", icon: <PenTool />, color: "bg-blue-100 text-blue-700", component: DicteeActivity },
    { id: 6, title: "Histoire", icon: <ListOrdered />, color: "bg-orange-100 text-orange-700", component: OrderActivity },
  ];

  const finishLevel = (levelId) => {
    if (!badges.includes(levelId)) setBadges([...badges, levelId]);
    if (!unlockedLevels.includes(levelId + 1)) setUnlockedLevels([...unlockedLevels, levelId + 1]);
    setTimeout(() => setCurrentLevel(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] font-sans text-slate-800">
      
      {/* Styles globaux pour animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        .animate-fade-in { animation: pop 0.5s ease-out; }
      `}</style>

      {/* HEADER */}
      <header className="bg-white p-3 shadow-md border-b-4 border-green-700 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-lg md:text-xl font-black text-green-800 uppercase tracking-widest flex items-center gap-2">
          <Home className="text-green-600" size={24} /> CP • Le Repas
        </h1>
        <div className="flex gap-1">
          {levels.map((lvl) => (
            <div key={lvl.id} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${badges.includes(lvl.id) ? 'bg-yellow-400 border-yellow-600 scale-110' : 'bg-gray-100 border-gray-200'}`}>
              {badges.includes(lvl.id) ? <Star size={16} className="text-white" fill="currentColor"/> : <span className="text-[10px] font-bold text-gray-400">{lvl.id}</span>}
            </div>
          ))}
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        
        {/* --- MENU PRINCIPAL --- */}
        {!currentLevel && (
          <div className="animate-fade-in pb-10">
            <div className="text-center mb-8 mt-4">
              <h2 className="text-3xl font-black text-green-900">Ton Parcours</h2>
              <p className="text-green-600 font-medium">Gagne toutes les étoiles !</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {levels.map((level) => {
                const isUnlocked = unlockedLevels.includes(level.id);
                const isCompleted = badges.includes(level.id);

                return (
                  <button
                    key={level.id}
                    disabled={!isUnlocked}
                    onClick={() => setCurrentLevel(level.id)}
                    className={`
                      relative h-40 rounded-3xl flex flex-col items-center justify-center gap-2 border-b-8 transition-all duration-200
                      ${isUnlocked 
                        ? 'bg-white border-green-200 hover:-translate-y-1 hover:border-green-400 hover:shadow-lg cursor-pointer' 
                        : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed grayscale'}
                    `}
                  >
                    <div className={`p-3 rounded-2xl ${isUnlocked ? level.color : 'bg-gray-200 text-gray-400'}`}>
                      {isCompleted ? <CheckCircle size={32} /> : level.icon}
                    </div>
                    <span className={`text-lg font-black ${isUnlocked ? 'text-slate-700' : 'text-gray-400'}`}>{level.title}</span>
                    
                    {!isUnlocked && <Lock className="absolute top-3 right-3 text-gray-300" size={20} />}
                    {isCompleted && <Star className="absolute top-2 right-2 text-yellow-400 animate-pulse" fill="currentColor" size={24}/>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- ZONE DE JEU --- */}
        {currentLevel && (
          <div className="bg-white rounded-[40px] shadow-2xl h-[75vh] border-8 border-green-600 relative overflow-hidden flex flex-col">
            
            {/* Barre Titre / Retour */}
            <div className="bg-green-50 p-2 flex items-center justify-between border-b border-green-100 shrink-0">
               <button onClick={() => setCurrentLevel(null)} className="bg-white p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm">
                  <Home size={20} />
               </button>
               <div className="font-bold text-green-800 uppercase text-sm tracking-wider">
                  Exercice {currentLevel} / 6
               </div>
               <div className="w-8"></div> {/* Spacer */}
            </div>

            {/* Barre de progression visuelle */}
            <div className="h-2 bg-slate-100 w-full shrink-0">
               <div className="h-full bg-green-500 transition-all duration-500 rounded-r-full" style={{ width: `${(currentLevel / 6) * 100}%` }}></div>
            </div>

            {/* Contenu de l'activité (Scrollable) */}
            <div className="flex-1 overflow-y-auto relative">
                {/* Rendu dynamique du composant */}
                {(() => {
                   const ActiveComponent = levels.find(l => l.id === currentLevel).component;
                   return <ActiveComponent onComplete={() => finishLevel(currentLevel)} data={storyData} />;
                })()}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}