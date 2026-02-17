import React, { useState, useMemo } from 'react';
import { 
  BookOpen, ImageIcon, Smile, Type, PenTool, 
  ListOrdered, Home, GraduationCap, Utensils, CheckCircle, User
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { allStories } from './storyData';
import Dashboard from './Dashboard';
import LectureActivity from './LectureActivity';
import ImageQuizActivity from './ImageQuizActivity';
import EmojiActivity from './EmojiActivity';
import SyllableActivity from './SyllableActivity';
import DicteeActivity from './DicteeActivity';
import OrderActivity from './OrderActivity';
import Evaluation from "./evaluation";

const LEVELS = [
  { id: 1, title: "Découverte", icon: <BookOpen />, color: "bg-green-100 text-green-600", component: LectureActivity },
  { id: 2, title: "Images", icon: <ImageIcon />, color: "bg-purple-100 text-purple-600", component: ImageQuizActivity },
  { id: 3, title: "Mots", icon: <Smile />, color: "bg-yellow-100 text-yellow-600", component: EmojiActivity },
  { id: 4, title: "Syllabes", icon: <Type />, color: "bg-pink-100 text-pink-600", component: SyllableActivity },
  { id: 5, title: "Dictée", icon: <PenTool />, color: "bg-blue-100 text-blue-600", component: DicteeActivity },
  { id: 6, title: "Histoire", icon: <ListOrdered />, color: "bg-orange-100 text-orange-600", component: OrderActivity },
  { id: 7, title: "Évaluation", icon: <CheckCircle />, color: "bg-red-100 text-red-600", component: Evaluation },
];

export default function ReadingApp() {
  // --- NOUVEAUX STATES POUR L'IDENTIFICATION ---
  const [studentName, setStudentName] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const studentClass = "1A"; 

  const [selectedStoryKey, setSelectedStoryKey] = useState(null); 
  const [currentLevel, setCurrentLevel] = useState(null);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [badges, setBadges] = useState([]);

  const currentStory = useMemo(() => {
    return selectedStoryKey ? allStories[selectedStoryKey] : null;
  }, [selectedStoryKey]);

  const completeLevel = (id) => {
    confetti({ 
      particleCount: 150, 
      spread: 70, 
      origin: { y: 0.6 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
    });
    
    if (!badges.includes(id)) setBadges(prev => [...prev, id]);

    const nextLevelId = id + 1;
    if (nextLevelId <= LEVELS.length && !unlockedLevels.includes(nextLevelId)) {
      setUnlockedLevels(prev => [...prev, nextLevelId]);
    }
    
    setTimeout(() => setCurrentLevel(null), 2000);
  };

  const resetAll = () => {
    setSelectedStoryKey(null);
    setCurrentLevel(null);
    setBadges([]);
    setUnlockedLevels([1]);
  };

  // --- 1. ÉCRAN D'IDENTIFICATION (NOUVEAU) ---
  if (!isLogged) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-b-[12px] border-blue-500 w-full max-w-md text-center animate-pop">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={40} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-700 mb-2">Bienvenue !</h1>
          <p className="text-slate-500 mb-8 font-bold">Écris ton nom pour commencer</p>
          
          <input 
            type="text" 
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full p-5 rounded-2xl border-4 border-slate-100 mb-6 text-center text-2xl font-bold focus:border-blue-400 outline-none transition-all placeholder:text-slate-200"
            placeholder="Ton prénom..."
          />
          
          <button 
            disabled={!studentName.trim()}
            onClick={() => setIsLogged(true)}
            className="w-full bg-blue-500 text-white py-5 rounded-2xl font-black text-xl shadow-[0_8px_0_#1e40af] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-2"
          >
            C'EST PARTI !
          </button>
          <p className="mt-4 text-slate-400 font-bold uppercase text-xs">Classe : {studentClass}</p>
        </div>
      </div>
    );
  }

  // --- 2. SÉLECTION DE L'HISTOIRE ---
  if (!selectedStoryKey || !currentStory) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Bonjour {studentName} !</h2>
        <h1 className="text-4xl font-black text-green-900 mb-12 animate-bounce text-center">Choisis ton histoire</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          <button onClick={() => setSelectedStoryKey('repas')} className="group bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-green-500 hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-4">
            <Utensils size={80} className="text-green-500 group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-black text-slate-700">Le Repas</span>
          </button>
          <button onClick={() => setSelectedStoryKey('ecole')} className="group bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-blue-500 hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-4">
            <GraduationCap size={80} className="text-blue-500 group-hover:-rotate-12 transition-transform" />
            <span className="text-2xl font-black text-slate-700">L'École</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0fdf4] font-sans pb-10">
      <header className="bg-white p-4 shadow-sm border-b-4 border-green-600 mb-8 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={resetAll} className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-inner">
            <Home size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-green-800 uppercase italic leading-none">{currentStory.title}</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{studentName} - Classe {studentClass}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 w-1/3">
           <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden border">
              <div 
                className="h-full bg-green-500 transition-all duration-1000" 
                style={{width: `${(badges.length / LEVELS.length) * 100}%`}}
              ></div>
           </div>
           <span className="text-xs font-bold text-green-600 whitespace-nowrap">{badges.length} / {LEVELS.length}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {!currentLevel ? (
          <Dashboard 
            levels={LEVELS} 
            unlockedLevels={unlockedLevels} 
            badges={badges} 
            onSelectLevel={setCurrentLevel} 
            goal={currentStory.goal} 
          />
        ) : (
          <div className="bg-white rounded-[3rem] shadow-2xl border-8 border-green-600 min-h-[600px] overflow-hidden relative animate-pop">
            <button 
              onClick={() => setCurrentLevel(null)} 
              className="absolute top-4 left-4 z-50 bg-slate-100/90 p-3 rounded-full hover:bg-red-100 hover:text-red-500 transition-all shadow-md active:scale-90"
            >
              Retour
            </button>
            <div className="h-full">
              {(() => {
                const activeCfg = LEVELS.find(l => l.id === currentLevel);
                const ActiveComponent = activeCfg?.component;
                if (!ActiveComponent) return null;

                return (
                  <ActiveComponent 
                    // CORRECTION : On passe les données selon le niveau
                    data={currentLevel === 7 ? currentStory.evaluation : currentStory.items} 
                    // INFOS POUR GOOGLE SHEET (Noms de props correspondant à Evaluation.jsx)
                    storyTitle={currentStory.title}
                    studentName={studentName}
                    studentClass={studentClass}
                    onComplete={() => completeLevel(currentLevel)} 
                  />
                );
              })()}
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
}