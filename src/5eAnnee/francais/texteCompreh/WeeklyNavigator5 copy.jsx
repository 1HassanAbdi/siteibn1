import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, Headphones, PenTool, ArrowRight, Sparkles, 
  Menu, Calendar, Star, Leaf, ArrowLeft, ChevronDown, Clock, AlertCircle, FileText
} from 'lucide-react';

// IMPORT DES DONNÉES
import menuData from "./menuAnnuel.json"; 

// IMPORT DES COMPOSANTS D'ACTIVITÉS
import QuizComponent from "./FrenchReadingQuiz5";
import DicteeComponent from "./DicteeComponent1";
import HistoireSemaine from "./histoire";

const MONTH_MAP = [
  "janvier", "fevrier", "mars", "avril", "mai", "juin",
  "juillet", "aout", "septembre", "octobre", "novembre", "decembre"
];

const MonthlyOverview = ({ monthName }) => (
  <div className="flex flex-col items-center justify-center text-center h-full p-8">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }}
      className="bg-emerald-500/10 p-8 rounded-full mb-6 text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.2)] border border-emerald-500/20"
    >
      <Clock size={80} />
    </motion.div>
    
    <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">
      Missions de <span className="text-emerald-400">{monthName}</span>
    </h2>
    <p className="text-slate-300 font-medium mb-12 max-w-lg leading-relaxed text-lg">
      C'est le moment de briller ! Sélectionne une activité dans le menu de gauche pour commencer tes exercices prioritaires.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
      {[
        { icon: BookOpen, label: "Lecture", color: "text-emerald-400", border: "hover:border-emerald-500" },
        { icon: Headphones, label: "Écoute", color: "text-teal-400", border: "hover:border-teal-500" },
        { icon: PenTool, label: "Écriture", color: "text-lime-400", border: "hover:border-lime-500" }
      ].map((item, idx) => (
        <div key={idx} className={`bg-slate-800/40 p-8 rounded-[40px] border border-slate-700/50 ${item.border} transition-all group`}>
          <item.icon className={`${item.color} mb-4 mx-auto group-hover:scale-110 transition-transform`} size={40} />
          <h3 className="text-white font-black uppercase text-xs tracking-[0.3em]">{item.label}</h3>
        </div>
      ))}
    </div>
  </div>
);

const YearlyNavigator5e = () => {
  const navigate = useNavigate();
  const currentMonthData = useMemo(() => {
    const today = new Date();
    const monthId = MONTH_MAP[today.getMonth()];
    return menuData.sections.find(m => m.id === monthId) || menuData.sections[0];
  }, []);

  const [expandedCat, setExpandedCat] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const handleActivityClick = (child, categoryId) => {
    setSelectedChild(child);
    setActiveCategoryId(categoryId);
  };

  const renderActivityContent = () => {
    if (!selectedChild) return <MonthlyOverview monthName={currentMonthData.label} />;
    if (activeCategoryId.includes("dictee")) return <DicteeComponent configPath={selectedChild.componentJson} />;
    if (activeCategoryId.includes("histoire")) return <HistoireSemaine videoUrl={selectedChild.videoUrl} title={selectedChild.label} />;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans pb-12 text-slate-200">
      
      {/* HEADER */}
      <header className="relative bg-[#063b2c] pt-10 pb-28 rounded-b-[80px] md:rounded-b-[120px] shadow-2xl overflow-hidden border-b border-emerald-900/30">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_#10b981_0%,transparent_60%)]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center text-white gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black flex items-center gap-5 tracking-tighter">
              <div className="bg-yellow-400 p-4 rounded-[30px] text-emerald-900 shadow-2xl transform -rotate-3">
                <Sparkles size={40} />
              </div>
              {menuData.title}
            </h1>
            <p className="text-emerald-50 mt-4 font-bold flex items-center gap-3 text-xl opacity-90">
              <Calendar size={24} className="text-lime-300" /> 
              Objectifs de <span className="bg-white/10 px-4 py-1 rounded-full text-white border border-white/20">{currentMonthData.label}</span>
            </p>
          </div>

          <button onClick={() => navigate(-1)} className="bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-4 rounded-full font-black flex items-center gap-3 transition-all shadow-xl group">
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Retour Accueil</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-20 relative z-20 flex flex-col md:flex-row gap-10">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-80 space-y-6">
          <div className="bg-slate-900 rounded-[45px] p-8 shadow-2xl border border-slate-800">
            <div className="flex items-center gap-3 text-emerald-400 mb-3">
              <Clock size={20} className="animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em]">Missions Actuelles</span>
            </div>
            <h2 className="text-3xl font-black text-white">{currentMonthData.label}</h2>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[50px] p-8 shadow-2xl border border-slate-800">
            <div className="flex items-center gap-3 mb-8 text-emerald-400 uppercase text-[12px] font-black tracking-[0.2em] border-b border-slate-800 pb-5">
              <Menu size={20} /> Exercices
            </div>

            <div className="space-y-4">
              {currentMonthData.categories.map((cat) => (
                <div key={cat.id} className="flex flex-col">
                  <button
                    onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                    className={`w-full text-left px-6 py-5 rounded-[30px] font-black transition-all flex justify-between items-center group
                    ${expandedCat === cat.id ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                  >
                    <span>{cat.label}</span>
                    <ChevronDown size={22} className={`transition-transform ${expandedCat === cat.id ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {expandedCat === cat.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-5 mt-3 space-y-2 border-l-2 border-slate-800 pl-5">
                        {cat.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleActivityClick(child, cat.id)}
                            className={`w-full text-left px-5 py-4 rounded-2xl text-[13px] font-bold transition-all flex items-center gap-4
                            ${selectedChild?.id === child.id ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" : "text-slate-400 hover:text-white"}`}
                          >
                            <div className={`w-2 h-2 rounded-full ${selectedChild?.id === child.id ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`}></div>
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

        {/* CONTENU PRINCIPAL (DARK MODE) */}
        <div className="flex-1 w-full bg-[#0a0a0a] rounded-[80px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border-[1px] border-slate-800 min-h-[800px] flex flex-col relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!selectedChild ? (
              <motion.div key="month-overview" className="flex-1"><MonthlyOverview monthName={currentMonthData.label} /></motion.div>
            ) : (
              <motion.div key={selectedChild.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
                <div className="bg-slate-900/50 px-12 py-10 border-b border-slate-800/50 flex items-center justify-between">
                   <div className="flex items-center gap-8">
                      <div className="bg-emerald-500 p-5 rounded-[30px] text-white shadow-xl shadow-emerald-500/20">
                        <ArrowRight size={32} />
                      </div>
                      <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter">{selectedChild.label}</h2>
                        <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em] mt-2">Mission Active</p>
                      </div>
                   </div>
                </div>

                <div className="p-8 md:p-16 flex-1 text-slate-300">
                  <div className="max-w-5xl mx-auto">
                    {renderActivityContent()}
                    
                    {/* INFO PASSAGE À L'ÉCRIT (ALERTE) */}
                    <div className="mt-12 p-6 bg-amber-500/10 border border-amber-500/30 rounded-[35px] flex items-center gap-6 group hover:bg-amber-500/20 transition-all">
                        <div className="bg-amber-500 p-4 rounded-2xl text-black shadow-lg">
                            <FileText size={28} />
                        </div>
                        <div>
                            <h4 className="text-amber-400 font-black text-lg">Prêt pour l'évaluation ?</h4>
                            <p className="text-slate-400 text-sm font-medium">
                                Pour la partie <span className="text-white">Questions Courtes</span>, tu peux maintenant passer à l'écrit sur ta <span className="text-amber-200 underline underline-offset-4">feuille d'évaluation papier</span>.
                            </p>
                        </div>
                        <AlertCircle className="ml-auto text-amber-500/50 group-hover:text-amber-500" size={30} />
                    </div>
                  </div>

                  {selectedChild.quizJsonPath && (
                    <div className="mt-24 pt-12 border-t border-slate-800 relative">
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-10 py-3 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-xl">
                         Vérifie tes acquis !
                       </div>
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
        body { font-family: 'Poppins', sans-serif; background-color: #050505; color: #e2e8f0; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}</style>
    </div>
  );
};

export default YearlyNavigator5e;