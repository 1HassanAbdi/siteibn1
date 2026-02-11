import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Calculator, GraduationCap, Info, 
  ChevronRight, CheckCircle2, Target, MoveRight,
  ShieldCheck, Calendar, Star, ListChecks
} from 'lucide-react';

// --- IMPORT DE LA CONFIGURATION (Le JSON qui contient les chemins) ---
import configExercices from "../EXR_6_3/data/config_exercices.json"

// --- IMPORT DU COMPOSANT QUIZ (Moteur unique) ---
import PortailFrancais from '../EXR_6_3/exercice';


const OQREHub = () => {
  const [selectedLevel, setSelectedLevel] = useState(3);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(null); // Stocke l'exercice précis choisi
  const [view, setView] = useState('hub');

  // Filtrage dynamique du JSON en fonction du niveau et de la matière
  const listToDisplay = configExercices.filter(ex => 
    ex.niveau === selectedLevel && ex.matiere === selectedSubject
  );

  // --- LOGIQUE DE REDIRECTION ---
  // On passe le "slug" au composant de quiz pour qu'il sache quel JSON charger
 // --- LOGIQUE DE REDIRECTION DANS OQREHub ---
if (view === 'quiz') {
  return (
    <PortailFrancais 
      exerciseSlug={selectedSlug} 
      level={selectedLevel} // <--- ON AJOUTE CECI
      onBack={() => setView('hub')} 
    />
  );
}

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* EFFETS DE FOND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase">Portal OQRE <span className="text-indigo-500">2026</span></span>
        </div>
        <div className="hidden md:flex items-center gap-6 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
            <Calendar size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Un nouvel exercice chaque semaine</span>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* SECTION 1 : MISSION & OBJECTIFS */}
        <section className="mb-16 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] mb-6 italic uppercase">
              Objectif <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Réussite OQRE.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              L'OQRE évalue les compétences en lecture, écriture et mathématiques selon le curriculum de l'Ontario. Pratiquez ici pour maîtriser chaque attente ministérielle.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard 
                icon={<ShieldCheck className="text-indigo-400" />} 
                title="Mission OQRE" 
                desc="Garantir que chaque élève possède les bases solides en littératie et numératie." 
            />
            <InfoCard 
                icon={<Star className="text-amber-400" />} 
                title="Nouveau contenu" 
                desc="Chaque semaine, un exercice de maths et un de français sont ajoutés." 
            />
          </div>
        </section>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* GAUCHE : SÉLECTEUR DE NIVEAU & INFOS */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">1. Choisis ton niveau</p>
            
            <div className="grid grid-cols-2 gap-6">
              {[3, 6].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => { setSelectedLevel(lvl); setSelectedSubject(null); setSelectedSlug(null); }}
                  className={`relative p-8 rounded-[2.5rem] border-2 transition-all text-left overflow-hidden group ${
                    selectedLevel === lvl 
                    ? 'bg-slate-900 border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.15)]' 
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl mb-4 ${selectedLevel === lvl ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {lvl}e
                    </div>
                    <h3 className="text-2xl font-black uppercase italic leading-none mb-1">Année</h3>
                  </div>
                </button>
              ))}
            </div>

            {/* DÉTAILS DU NIVEAU */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLevel}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem]"
              >
                <div className="flex items-center gap-2 mb-4 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                    <Target size={18} /> Attentes ministérielles de {selectedLevel}e année
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {(selectedLevel === 3 ? expectations3 : expectations6).map((exp, i) => (
                    <div key={i} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{exp.t}</p>
                      <p className="text-sm font-bold leading-tight text-white">{exp.d}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* DROITE : MATIÈRES ET LISTE DES SUJETS */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">2. Matière & Exercice</p>
            
            <div className="flex gap-4">
              <button onClick={() => {setSelectedSubject('FR'); setSelectedSlug(null);}} 
                className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-black transition-all ${selectedSubject === 'FR' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                <BookOpen size={18}/> FR
              </button>
              <button onClick={() => {setSelectedSubject('MATHS'); setSelectedSlug(null);}} 
                className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-black transition-all ${selectedSubject === 'MATHS' ? 'bg-orange-500 border-orange-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                <Calculator size={18}/> MATHS
              </button>
            </div>

            {/* LISTE DES EXERCICES FILTRÉS */}
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-3xl min-h-[150px] space-y-2">
              {!selectedSubject ? (
                <p className="text-slate-600 text-center mt-12 text-sm italic">Sélectionne une matière</p>
              ) : listToDisplay.length > 0 ? (
                listToDisplay.map((ex) => (
                  <button 
                    key={ex.slug} 
                    onClick={() => setSelectedSlug(ex.slug)}
                    className={`w-full p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all ${selectedSlug === ex.slug ? 'bg-white text-slate-950 border-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                  >
                    <span className="font-bold text-sm uppercase italic">{ex.titre}</span>
                    {selectedSlug === ex.slug && <CheckCircle2 size={16} />}
                  </button>
                ))
              ) : (
                <p className="text-slate-500 text-center mt-12 text-sm">Bientôt disponible pour ce niveau.</p>
              )}
            </div>

            <button
                disabled={!selectedSlug}
                onClick={() => setView('quiz')}
                className={`w-full py-6 rounded-[2rem] font-black text-xl uppercase italic transition-all flex items-center justify-center gap-4 group mt-4 ${
                    selectedSlug 
                    ? 'bg-white text-slate-950 shadow-[0_10px_40px_rgba(255,255,255,0.1)] hover:scale-[1.02]' 
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                }`}
            >
                Lancer l'exercice
                <MoveRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- DONNÉES STATIQUES DES ATTENTES ---
const expectations3 = [
    { t: "Lecture", d: "Identifier l'idée principale et faire des inférences." },
    { t: "Écriture", d: "Organiser ses idées et utiliser la ponctuation." },
    { t: "Maths", d: "Nombres jusqu'à 1000 et codage de base." }
];

const expectations6 = [
    { t: "Lecture", d: "Analyser des textes et justifier par des preuves." },
    { t: "Écriture", d: "Rédiger des récits structurés et grammaire maîtrisée." },
    { t: "Maths", d: "Fractions, Algèbre et Probabilités." }
];

const InfoCard = ({ icon, title, desc }) => (
  <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] flex flex-col gap-3 hover:bg-slate-900/60 transition-colors">
    <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shadow-inner">{icon}</div>
    <h4 className="font-black text-white uppercase italic text-sm">{title}</h4>
    <p className="text-xs text-slate-400 font-medium leading-relaxed">{desc}</p>
  </div>
);

const SubjectButton = ({ title, icon, color, isActive, onClick, desc }) => (
  <button
    onClick={onClick}
    className={`w-full p-6 rounded-[2.5rem] border-2 text-left transition-all flex items-center gap-6 group ${isActive ? 'bg-white/5 border-white' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all ${isActive ? 'scale-110 shadow-lg' : 'grayscale'}`} style={{ backgroundColor: color }}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className={`text-xl font-black uppercase italic ${isActive ? 'text-white' : 'text-slate-500'}`}>{title}</h4>
      <p className="text-xs font-medium text-slate-500 mt-1">{desc}</p>
    </div>
    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isActive ? 'bg-white text-slate-950' : 'border-slate-800'}`}>
        <CheckCircle2 size={16} />
    </div>
  </button>
);

export default OQREHub;