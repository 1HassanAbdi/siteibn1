import React, { useState } from 'react';
import { 
  BookOpen, Calculator, GraduationCap, Info, 
  ChevronRight, CheckCircle2, Star,
  Target, Lightbulb, ArrowLeft, Zap
} from 'lucide-react';
import PortailMaths from '../OQRE/MATHS/MathEvaluator'; 
import PortailFrancais from '../EXR_6_3/exercice';

const OQREHub = () => {
  const [view, setView] = useState('hub'); 
  const [selectedLevel, setSelectedLevel] = useState(null); 
  const [selectedSubject, setSelectedSubject] = useState(null); 

  // Couleurs basées sur vos images
  const brandGreen = "#108565"; 
  const brandOrange = "#F59E0B";

  const oqreExpectations = {
    3: {
      title: "3e Année - Niveau Primaire",
      color: brandOrange,
      description: "L'OQRE évalue les habiletés de base acquises depuis la 1re année.",
      points: [
        { t: "Lecture", d: "Comprendre des textes courts, identifier l'idée principale et faire des inférences simples." },
        { t: "Écriture", d: "Organiser ses idées, utiliser une ponctuation correcte et varier le vocabulaire." },
        { t: "Maths", d: "Nombres jusqu'à 1000, suites numériques, sens de l'espace et codage de base." }
      ]
    },
    6: {
      title: "6e Année - Niveau Moyen",
      color: brandGreen,
      description: "L'OQRE évalue la pensée critique et la résolution de problèmes complexes.",
      points: [
        { t: "Lecture", d: "Analyser des textes d'opinion, dégager des messages implicites et justifier par des preuves." },
        { t: "Écriture", d: "Rédiger des textes structurés (récits, rapports) avec une grammaire maîtrisée." },
        { t: "Maths", d: "Fractions, pourcentages, probabilités, algèbre et géométrie avancée." }
      ]
    }
  };

  if (view === 'redirect') {
    if (selectedSubject === 'MATHS') return <PortailMaths level={selectedLevel} onBack={() => setView('hub')} />;
    if (selectedSubject === 'FR') return <PortailFrancais level={selectedLevel} onBack={() => setView('hub')} />;
  }

  return (
    <div className="min-h-screen bg-[#F0F4F2] font-sans text-slate-900">
      {/* Header - Utilise le Vert Émeraude */}
      <header className="bg-white border-b-4 py-6 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm" style={{ borderBottomColor: brandGreen }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl text-white shadow-lg rotate-3" style={{ backgroundColor: brandGreen }}>
            <GraduationCap size={28} />
          </div>
          <h1 className="text-2xl font-black italic tracking-tighter" style={{ color: brandGreen }}>OQRE PORTAL 2026</h1>
        </div>
        <div className="hidden md:flex gap-4">
            <button onClick={() => setView('hub')} className="text-sm font-bold text-slate-500 hover:text-green-700">ACCUEIL</button>
            <button 
                onClick={() => setView('selection')} 
                className="px-4 py-2 rounded-full text-xs font-black uppercase shadow-sm transition-transform hover:scale-105 text-white"
                style={{ backgroundColor: brandOrange }}
            >
                Pratique de la semaine
            </button>
        </div>
      </header>

      {/* Vue 1 : Le Hub */}
      {view === 'hub' && (
        <main className="max-w-6xl mx-auto p-6 animate-in fade-in duration-500">
          <section className="text-center my-12">
            <h2 className="text-5xl font-black text-slate-900 mb-4 leading-none uppercase italic">C'est quoi l'OQRE ?</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              L'Office de la qualité et de la responsabilité en éducation aide à mesurer ton apprentissage selon les attentes du curriculum de l'Ontario.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            {[3, 6].map((lvl) => (
              <div key={lvl} className="bg-white rounded-[2.5rem] p-8 border-4 border-slate-100 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: oqreExpectations[lvl].color }}
                  >
                    {lvl}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase">{oqreExpectations[lvl].title}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic" style={{ color: oqreExpectations[lvl].color }}>Attentes ministérielles</p>
                  </div>
                </div>
                <p className="text-slate-600 font-medium mb-6 italic">{oqreExpectations[lvl].description}</p>
                <div className="space-y-4">
                  {oqreExpectations[lvl].points.map((p, i) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                      <CheckCircle2 style={{ color: brandGreen }} className="shrink-0 mt-1" size={18} />
                      <div>
                        <span className="font-black text-[10px] uppercase text-slate-400">{p.t}</span>
                        <p className="text-sm text-slate-700 font-bold leading-tight">{p.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setView('selection')}
            className="mt-16 block mx-auto text-white px-12 py-5 rounded-3xl font-black text-xl shadow-xl hover:scale-105 transition-all uppercase italic border-b-8"
            style={{ backgroundColor: brandGreen, borderBottomColor: "#0a5d46" }}
          >
            Passer à l'entraînement <ChevronRight className="inline ml-2" />
          </button>
        </main>
      )}

      {/* Vue 2 : Sélection */}
      {view === 'selection' && (
        <main className="max-w-4xl mx-auto p-6 pt-12 text-center">
          <button onClick={() => setView('hub')} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase mb-8 hover:text-green-700 transition-colors">
            <ArrowLeft size={16} /> Retour aux explications
          </button>
          
          <h2 className="text-4xl font-black uppercase italic mb-12">Entraînement de la semaine</h2>

          <div className="space-y-12">
            {/* Étape 1 : Le Niveau */}
            <div>
              <p className="text-slate-400 font-black uppercase text-xs mb-6 tracking-[0.2em]">1. Choisis ton niveau</p>
              <div className="flex justify-center gap-6">
                {[3, 6].map(lvl => (
                  <button 
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`w-32 h-32 rounded-[2rem] border-4 transition-all flex flex-col items-center justify-center gap-2 ${selectedLevel === lvl ? 'border-white text-white shadow-2xl scale-110' : 'bg-white border-slate-200 text-slate-400 hover:border-green-400'}`}
                    style={{ backgroundColor: selectedLevel === lvl ? brandGreen : '' }}
                  >
                    <span className="text-4xl font-black">{lvl}e</span>
                    <span className="text-[10px] font-bold uppercase italic">Année</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Étape 2 : La Matière */}
            <div className={selectedLevel ? "opacity-100 transition-opacity" : "opacity-30 pointer-events-none"}>
              <p className="text-slate-400 font-black uppercase text-xs mb-6 tracking-[0.2em]">2. Choisis la matière</p>
              <div className="flex justify-center gap-6">
                <button 
                  onClick={() => setSelectedSubject('MATHS')}
                  className={`flex-1 max-w-[200px] p-8 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-4 ${selectedSubject === 'MATHS' ? 'border-white text-white shadow-2xl' : 'bg-white border-slate-200 text-slate-400 hover:border-orange-400'}`}
                  style={{ backgroundColor: selectedSubject === 'MATHS' ? brandOrange : '' }}
                >
                  <Calculator size={40} />
                  <span className="font-black italic uppercase tracking-widest">Maths</span>
                </button>
                <button 
                  onClick={() => setSelectedSubject('FR')}
                  className={`flex-1 max-w-[200px] p-8 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-4 ${selectedSubject === 'FR' ? 'border-white text-white shadow-2xl' : 'bg-white border-slate-200 text-slate-400 hover:border-green-400'}`}
                  style={{ backgroundColor: selectedSubject === 'FR' ? brandGreen : '' }}
                >
                  <BookOpen size={40} />
                  <span className="font-black italic uppercase tracking-widest">Français</span>
                </button>
              </div>
            </div>

            {/* Bouton de lancement */}
            {selectedLevel && selectedSubject && (
              <button 
                onClick={() => setView('redirect')}
                className="w-full py-6 text-white rounded-[2rem] font-black text-2xl shadow-2xl hover:brightness-110 border-b-8 animate-in slide-in-from-bottom-4 duration-300 uppercase italic"
                style={{ backgroundColor: "#0f172a", borderBottomColor: "#000" }}
              >
                C'est parti ! <ChevronRight className="inline ml-2" />
              </button>
            )}
          </div>
        </main>
      )}

      {/* Footer Info */}
      <footer className="mt-20 border-t border-slate-200 py-10 px-8 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex gap-4 items-center">
            <Info style={{ color: brandGreen }} />
            <p className="text-[10px] font-bold text-slate-400 max-w-sm uppercase italic">
              Ressource de préparation non-officielle basée sur les cadres d'évaluation du curriculum de l'Ontario.
            </p>
          </div>
          <div className="flex gap-4 items-center">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Système prêt pour 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OQREHub;