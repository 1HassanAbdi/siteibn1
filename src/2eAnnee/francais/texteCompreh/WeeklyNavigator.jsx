import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, Headphones, PenTool, ArrowRight, Sparkles, 
  Menu, ChevronRight, Calendar, Star, Leaf, ArrowLeft, ChevronDown 
} from 'lucide-react';

// IMPORT DES DONNÉES
import menuData from "./menuAnnuel.json"; 

// IMPORT DES COMPOSANTS D'ACTIVITÉS
import QuizComponent from "./QuizComponent";
import StoryLoader from "./StoryLoader";
import DicteeComponent from "./DicteeComponent1";
import HistoireSemaine from "./histoire";

// --- COMPOSANT D'ACCUEIL ---
const MonthlyOverview = ({ monthName }) => (
  <div className="flex flex-col items-center justify-center text-center h-full p-8">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }}
      className="bg-slate-800 p-6 rounded-full mb-6 text-emerald-400 shadow-xl shadow-emerald-900/20"
    >
      <Calendar size={60} />
    </motion.div>
    
    <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
      Objectifs de {monthName}
    </h2>
    <p className="text-slate-400 font-medium mb-12 max-w-lg leading-relaxed">
      Voici ton espace de travail pour ce mois. Sélectionne une activité à gauche pour commencer !
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      <div className="bg-slate-800/40 p-6 rounded-[30px] border border-slate-700 hover:border-emerald-500/50 transition-colors">
        <BookOpen className="text-emerald-400 mb-3 mx-auto" size={32} />
        <h3 className="text-white font-bold uppercase text-xs tracking-widest">Lecture</h3>
      </div>
      <div className="bg-slate-800/40 p-6 rounded-[30px] border border-slate-700 hover:border-teal-500/50 transition-colors">
        <Headphones className="text-teal-400 mb-3 mx-auto" size={32} />
        <h3 className="text-white font-bold uppercase text-xs tracking-widest">Histoire</h3>
      </div>
      <div className="bg-slate-800/40 p-6 rounded-[30px] border border-slate-700 hover:border-lime-500/50 transition-colors">
        <PenTool className="text-lime-400 mb-3 mx-auto" size={32} />
        <h3 className="text-white font-bold uppercase text-xs tracking-widest">Dictée</h3>
      </div>
    </div>
  </div>
);

const YearlyNavigator2e = () => {
  const navigate = useNavigate();

  // --- LOGIQUE DE DÉTECTION DU MOIS ACTUEL ---
  const currentMonthData = useMemo(() => {
    const monthsFr = [
      "janvier", "février", "mars", "avril", "mai", "juin", 
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    const now = new Date();
    const currentMonthName = monthsFr[now.getMonth()];

    // Fonction pour enlever les accents et comparer proprement
    const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const found = menuData.sections.find(section => 
      normalize(section.label).includes(normalize(currentMonthName))
    );

    // Retourne le mois trouvé, sinon le premier mois du JSON par défaut
    return found || menuData.sections[0];
  }, []);

  // ÉTATS (On utilise directement currentMonthData)
  const [expandedCat, setExpandedCat] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const handleActivityClick = (child, categoryId) => {
    setSelectedChild(child);
    setActiveCategoryId(categoryId);
  };

  const renderActivityContent = () => {
    if (!selectedChild) return <MonthlyOverview monthName={currentMonthData.label} />;

    if (activeCategoryId.includes("dictee")) {
      return <DicteeComponent configPath={selectedChild.componentJson} />;
    }

    if (activeCategoryId.includes("histoire")) {
      return (
        <HistoireSemaine 
          videoUrl={selectedChild.videoUrl || "https://drive.google.com/file/d/1140LTNptqx0ZOyWfeuAoj_W7sQCIm7yK/preview"} 
          title={selectedChild.label} 
        />
      );
    }

    const folder = selectedChild.folderName || selectedChild.id;
    return <StoryLoader storyFolder={folder} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#e0f2f1] to-[#dcfce7] font-sans pb-12 selection:bg-emerald-600 selection:text-white">
      
      {/* --- HEADER --- */}
      <header className="relative bg-[#0d6e52] pt-8 pb-24 rounded-b-[60px] md:rounded-b-[100px] shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex justify-between items-center text-white">
          <div>
            <h1 className="text-3xl md:text-5xl font-black flex items-center gap-4 tracking-tighter">
              <div className="bg-yellow-400 p-3 rounded-3xl text-emerald-900 shadow-xl transform -rotate-3">
                <Sparkles size={32} />
              </div>
              {menuData.title}
            </h1>
            <p className="text-emerald-100 mt-3 font-medium flex items-center gap-2 pl-2">
              <Leaf size={18} className="text-lime-300" /> Programme de {currentMonthData.label}
            </p>
          </div>

          <button 
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all border border-white/20 backdrop-blur-md group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Retour</span>
          </button>
        </div>
      </header>

      {/* --- CONTENU --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-16 relative z-20 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-80 space-y-4">
          
          {/* AFFICHAGE DU MOIS ACTUEL (Statique) */}
          <div className="bg-white rounded-[35px] p-5 shadow-xl border border-emerald-100">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-2 block px-2">Période actuelle</label>
            <div className="flex items-center gap-3 w-full bg-emerald-50 rounded-2xl px-5 py-4 font-black text-emerald-800 border-2 border-emerald-100">
              <Calendar className="text-emerald-600" size={24} />
              <span className="text-lg">{currentMonthData.label}</span>
            </div>
          </div>

          {/* ACCORDEONS DU MOIS */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-6 shadow-2xl shadow-emerald-900/5 border border-white">
            <div className="flex items-center gap-2 mb-6 text-emerald-800 uppercase text-[11px] font-black tracking-[0.15em] border-b border-emerald-50 pb-4">
              <Menu size={16} /> Sommaire du mois
            </div>

            <div className="space-y-3">
              {currentMonthData.categories.map((cat) => (
                <div key={cat.id} className="flex flex-col">
                  <button
                    onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                    className={`w-full text-left px-5 py-4 rounded-3xl font-bold transition-all flex justify-between items-center group
                    ${expandedCat === cat.id 
                      ? "bg-emerald-700 text-white shadow-lg shadow-emerald-200" 
                      : "bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100"}`}
                  >
                    <span className="tracking-tight">{cat.label}</span>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${expandedCat === cat.id ? "rotate-180" : ""}`} />
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
                            className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-3
                            ${selectedChild?.id === child.id 
                              ? "bg-emerald-500 text-white shadow-md shadow-emerald-200" 
                              : "text-slate-500 hover:text-emerald-700 hover:bg-white"}`}
                          >
                            {selectedChild?.id === child.id ? <Star size={14} className="fill-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-emerald-200"></div>}
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

        {/* ZONE DE CONTENU PRINCIPALE */}
        <div className="flex-1 w-full bg-slate-900 rounded-[60px] shadow-3xl shadow-black/40 border-[6px] border-slate-800 min-h-[700px] flex flex-col relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!selectedChild ? (
              <motion.div key="month-overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
                 <MonthlyOverview monthName={currentMonthData.label} />
              </motion.div>
            ) : (
              <motion.div
                key={selectedChild.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col"
              >
                {/* Header de l'activité */}
                <div className="bg-slate-950 px-10 py-8 border-b border-slate-800 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="bg-emerald-500 p-4 rounded-3xl text-white shadow-lg shadow-emerald-500/20 transform -rotate-2">
                        <ArrowRight size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight italic">
                          {selectedChild.label}
                        </h2>
                        <div className="flex gap-4 mt-1">
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Mois de {currentMonthData.label}</p>
                          <div className="w-1 h-1 bg-slate-700 rounded-full mt-1.5"></div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">En cours</p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="p-6 md:p-12 flex-1 text-slate-200">
                  <div className="max-w-5xl mx-auto">
                    {renderActivityContent()}
                  </div>

                  {selectedChild.quizJsonPath && (
                    <div className="mt-20 pt-10 border-t-4 border-dotted border-slate-800 relative">
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                         Vérifie tes connaissances !
                       </div>
                      <QuizComponent 
                        quizJsonPath={selectedChild.quizJsonPath} 
                        quizTitle={selectedChild.label} 
                      />
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
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}</style>
    </div>
  );
};

export default YearlyNavigator2e;