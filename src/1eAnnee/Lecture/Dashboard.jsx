// Dashboard.jsx
import React from 'react';
import { Lock, Star, CheckCircle, GraduationCap } from 'lucide-react';

export default function Dashboard({ levels, unlockedLevels, badges, onSelectLevel, goal }) {
  return (
    <div className="space-y-6 animate-pop">
      {/* Encadré d'explication */}
      <div className="bg-white p-6 rounded-[2rem] border-4 border-green-200 shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-orange-400 p-3 rounded-2xl text-white shadow-lg">
            <GraduationCap size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              {goal?.title || "Objectif de la séance"}
            </h2>
            <p className="text-slate-500 font-medium">
              {goal?.description || "Complète tous les exercices pour gagner tes étoiles !"}
            </p>
          </div>
        </div>

        {/* LA CORRECTION EST ICI : Ajout de ?. et vérification de tableau */}
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 italic text-sm text-slate-600">
          {goal?.instructions?.map((ins, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full" /> {ins}
            </li>
          ))}
        </ul>
      </div>

      {/* Grille des niveaux */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {levels.map((lvl) => {
          const isUnlocked = unlockedLevels.includes(lvl.id);
          const isCompleted = badges.includes(lvl.id);
          return (
            <button
              key={lvl.id}
              disabled={!isUnlocked}
              onClick={() => onSelectLevel(lvl.id)}
              className={`relative h-48 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 border-b-[10px] transition-all
                ${isUnlocked 
                  ? 'bg-white border-green-300 hover:-translate-y-2 active:translate-y-0 shadow-lg' 
                  : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'}`}
            >
              <div className={`p-4 rounded-3xl ${isUnlocked ? lvl.color : 'bg-slate-200 text-slate-400'}`}>
                {isCompleted ? <CheckCircle size={40} /> : lvl.icon}
              </div>
              <span className={`font-black text-xl ${isUnlocked ? 'text-slate-700' : 'text-slate-400'}`}>
                {lvl.title}
              </span>
              {!isUnlocked && <Lock className="absolute top-4 right-6 text-slate-300" size={24} />}
              {isCompleted && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg border-4 border-white">
                  <Star size={20} className="text-white" fill="currentColor" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}