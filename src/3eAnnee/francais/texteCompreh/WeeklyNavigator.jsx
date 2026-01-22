import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, Headphones, PenTool, ArrowRight, Sparkles, 
  Menu, Calendar, Star, Leaf, ArrowLeft, ChevronDown, Lock 
} from 'lucide-react';

// IMPORT DES DONNÉES
import menuData from "./menuAnnuel.json"; 

// IMPORT DES COMPOSANTS D'ACTIVITÉS
import QuizComponent from "./QuizComponent";
import StoryLoader from "./StoryLoader";
import DicteeComponent from "./DicteeComponent1"; 
import HistoireSemaine from "./histoire"; 

const MonthlyOverview = ({ monthName }) => (
  <div className="flex flex-col items-center justify-center text-center h-full p-8">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }}
      className="bg-slate-800 p-6 rounded-full mb-6 text-emerald-400 shadow-xl shadow-emerald-900/20"
    >
      <Calendar size={60} />
    </motion.div>
    <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Objectifs de {monthName}</h2>
    <p className="text-slate-400 font-medium mb-12 max-w-lg">
      C'est le moment d'apprendre ! Sélectionne une activité pour commencer.
    </p>
  </div>
);

const YearlyNavigator = () => {
  const navigate = useNavigate();
  const allMonths = [
    "Septembre", "Octobre", "Novembre", "Décembre", "Janvier", 
    "Février", "Mars", "Avril", "Mai", "Juin"
  ];

  // --- LOGIQUE MOIS ACTUEL ---
  const getCurrentMonthName = () => {
    const monthsFrench = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    return monthsFrench[new Date().getMonth()];
  };

  const currentMonthName = getCurrentMonthName();
  const selectedMonth = menuData.sections.find(
    (m) => m.label.toLowerCase() === currentMonthName.toLowerCase()
  ) || menuData.sections[0];

  const [expandedCat, setExpandedCat] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const handleActivityClick = (child, categoryId) => {
    setSelectedChild(child);
    setActiveCategoryId(categoryId);
  };

  const renderActivityContent = () => {
    if (!selectedChild) return <MonthlyOverview monthName={selectedMonth.label} />;
    if (activeCategoryId.includes("dictee")) return <DicteeComponent configPath={selectedChild.componentJson} />;
    if (activeCategoryId.includes("histoire")) {
      return <HistoireSemaine videoUrl={selectedChild.videoUrl} title={selectedChild.label} />;
    }
    return <StoryLoader storyFolder={selectedChild.folderName || selectedChild.id} />;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-12 selection:bg-emerald-600 selection:text-white">
      
      {/* --- HEADER AVEC FRISE DES MOIS --- */}
      <header className="relative bg-[#0d6e52] pt-8 pb-32 rounded-b-[80px] shadow-2xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex justify-between items-center text-white mb-10">
            <h1 className="text-3xl font-black flex items-center gap-3 tracking-tighter">
              <Sparkles className="text-yellow-400" /> {menuData.title}
            </h1>
            <button onClick={() => navigate(-1)} className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full text-sm font-bold border border-white/20 backdrop-blur-md transition-all">
              <ArrowLeft size={18} className="inline mr-2" /> Retour
            </button>
          </div>

          {/* FRISE DES MOIS */}
          <div className="flex flex-wrap justify-center gap-3">
            {allMonths.map((m) => {
              const isCurrent = m.toLowerCase() === currentMonthName.toLowerCase();
              return (
                <div
                  key={m}
                  className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2
                    ${isCurrent 
                      ? "bg-yellow-400 text-emerald-900 shadow-lg scale-110 ring-4 ring-yellow-400/30" 
                      : "bg-emerald-900/40 text-emerald-200/40 border border-emerald-800/50 cursor-not-allowed opacity-60"
                    }`}
                >
                  {isCurrent ? <Star size={14} className="fill-emerald-900" /> : <Lock size={12} />}
                  {m}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* --- CONTENU --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-16 relative z-20 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-80 space-y-4">
          <div className="bg-white rounded-[40px] p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-6 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b pb-4">
              <Menu size={16} /> Menu de {selectedMonth.label}
            </div>

            <div className="space-y-3">
              {selectedMonth.categories.map((cat) => (
                <div key={cat.id} className="flex flex-col">
                  <button
                    onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                    className={`w-full text-left px-5 py-4 rounded-3xl font-bold transition-all flex justify-between items-center
                    ${expandedCat === cat.id ? "bg-emerald-600 text-white shadow-lg" : "bg-slate-50 text-slate-600 hover:bg-emerald-50"}`}
                  >
                    <span className="text-sm">{cat.label}</span>
                    <ChevronDown size={16} className={`transition-transform ${expandedCat === cat.id ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {expandedCat === cat.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden ml-4 mt-2 space-y-1 border-l-2 border-emerald-100 pl-4"
                      >
                        {cat.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleActivityClick(child, cat.id)}
                            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3
                            ${selectedChild?.id === child.id ? "bg-emerald-100 text-emerald-700" : "text-slate-500 hover:text-emerald-600"}`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${selectedChild?.id === child.id ? "bg-emerald-600" : "bg-slate-200"}`}></div>
                            {child.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ZONE PRINCIPALE */}
        <div className="flex-1 w-full bg-slate-900 rounded-[60px] shadow-3xl border-[6px] border-white min-h-[700px] flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!selectedChild ? (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
                 <MonthlyOverview monthName={selectedMonth.label} />
              </motion.div>
            ) : (
              <motion.div key={selectedChild.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
                <div className="bg-slate-950 px-10 py-8 border-b border-slate-800">
                  <h2 className="text-2xl font-black text-white italic">{selectedChild.label}</h2>
                  <p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest mt-1">Module interactif • {selectedMonth.label}</p>
                </div>
               
                <div className="p-6 md:p-12 flex-1 text-slate-200">
                  <div className="max-w-5xl mx-auto">{renderActivityContent()}</div>
                  {selectedChild.quizJsonPath && (
                    <div className="mt-20 pt-10 border-t-4 border-dotted border-slate-800 relative">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-2.5 rounded-full text-xs font-black uppercase shadow-xl">Quiz express</div>
                      <QuizComponent quizJsonPath={selectedChild.quizJsonPath} quizTitle={selectedChild.label} />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap');
        body { font-family: 'Poppins', sans-serif; }
      `}</style>
    </div>
  );
};

export default YearlyNavigator;