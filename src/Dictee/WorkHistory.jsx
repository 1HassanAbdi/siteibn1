import React, { useState, useEffect } from 'react';
import { Clock, Trophy, BookOpen, Trash2, Calendar, ChevronRight, GraduationCap, Scissors, Search, Brain, Sparkles, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Formatage du temps sécurisé
const formatTime = (s) => {
  if (s === undefined || s === null) return "--:--";
  const totalSeconds = Number(s);
  const mins = Math.floor(totalSeconds / 60);
  const secs = (totalSeconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const WorkHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('eleve_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Erreur lecture historique");
        setHistory([]);
      }
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm("Voulez-vous vraiment supprimer tout l'historique de travail ?")) {
      localStorage.removeItem('eleve_history');
      setHistory([]);
    }
  };

  // Mappage strict des modes (doit correspondre au mode.toUpperCase() du parent)
  const getModeDetails = (type) => {
    const t = type ? type.toUpperCase() : "";
    
    if (t.includes('SYLLABE')) 
      return { label: "Syllabes", icon: <Scissors size={24} />, color: "bg-emerald-100 text-emerald-600" };
    if (t.includes('DEFINITION')) 
      return { label: "Définitions", icon: <Search size={24} />, color: "bg-purple-100 text-purple-600" };
    if (t.includes('NATURE') || t.includes('TYPE')) 
      return { label: "Grammaire", icon: <Brain size={24} />, color: "bg-pink-100 text-pink-600" };
    if (t.includes('MYSTERE')) 
      return { label: "Mot Mystère", icon: <Sparkles size={24} />, color: "bg-amber-100 text-amber-600" };
    if (t.includes('TEST')) 
      return { label: "Dictée Finale", icon: <Pencil size={24} />, color: "bg-red-100 text-red-600" };
    
    return { label: type, icon: <BookOpen size={24} />, color: "bg-slate-100 text-slate-500" };
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 rounded-[40px] border-4 border-dashed border-slate-200">
        <Trophy size={60} className="mx-auto text-slate-200 mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-widest">Aucun exploit enregistré</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Mon Journal</h2>
          <p className="text-slate-500 text-sm font-bold uppercase opacity-60">Tes dernières missions</p>
        </div>
        <button 
          onClick={clearHistory}
          className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
          title="Effacer tout"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {history
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((entry, index) => {
              const details = getModeDetails(entry.type);
              
              // Conversion forcée en nombres pour éviter les erreurs de calcul (+1/-1)
              const score = Number(entry.score || 0);
              const total = Number(entry.total || 0);
              const isPerfect = score >= total && total > 0;

              return (
                <motion.div 
                  key={entry.date + index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* Icône */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${details.color}`}>
                      {details.icon}
                    </div>
                    
                    <div>
                      {/* Tags */}
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest mb-1">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500 flex items-center gap-1">
                           <GraduationCap size={10} /> {entry.level}A
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                           <Calendar size={10} /> {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                        {entry.duration && (
                          <span className="text-emerald-500 flex items-center gap-1">
                             <Clock size={10} /> {formatTime(entry.duration)}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xl font-black text-slate-700 uppercase tracking-tighter leading-tight">
                        {details.label} <span className="text-slate-300 mx-1">/</span> <span className="text-emerald-600">S{entry.week}</span>
                      </h4>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className={`text-3xl font-black ${
                          isPerfect ? 'text-emerald-500' : 
                          (score / total) >= 0.7 ? 'text-orange-400' : 'text-red-400'
                        }`}>
                          {score}
                        </span>
                        <span className="text-slate-300 font-black text-sm italic">/{total}</span>
                      </div>
                      {isPerfect && (
                        <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-1">
                          Parfait ! <Trophy size={10} />
                        </div>
                      )}
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-400 transition-colors">
                       <ChevronRight size={20} strokeWidth={3} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkHistory;