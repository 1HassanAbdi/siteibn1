import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ListOrdered, BookOpen, LayoutGrid, Trophy, GraduationCap } from 'lucide-react';

// Importez vos composants
import SudokuMaster from './SudokuMaster';
import SuiteKids from "./SuiteKids";
import WordKids from './wordkid';
import LexiKids from './lexique1e';

const GeniusAcademy = () => {
  const [activeTab, setActiveTab] = useState('sudoku');
  const [totalScore, setTotalScore] = useState(0);

  const tabs = [
    { id: 'sudoku', name: 'Sudoku', icon: <LayoutGrid size={20}/>, color: 'bg-indigo-600' },
    { id: 'suites', name: 'Suites Numériques', icon: <ListOrdered size={20}/>, color: 'bg-emerald-600' },
    { id: 'mots', name: 'Le Mot Mystère', icon: <BookOpen size={20}/>, color: 'bg-blue-500' },
    { id: 'lexique', name: 'Parcours des Sons', icon: <GraduationCap size={20}/>, color: 'bg-purple-600' },
  ];

  // On récupère l'objet de l'onglet actif pour afficher son nom
  const currentTab = tabs.find(tab => tab.id === activeTab);

  // Calcul du score total à partir des 4 historiques localstorage
  useEffect(() => {
    const getScore = (key) => {
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      return data.reduce((acc, curr) => acc + (curr.corrects || 0), 0);
    };

    const total = 
      getScore('sudoku_final_v3') + 
      getScore('suite_kids_v1') + 
      getScore('word_kids_v1') +
      getScore('lexikids_v1');
    
    setTotalScore(total);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#d0f0c0] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER DU HUB --- */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[40px] p-6 md:p-8 mb-8 shadow-xl text-center border-b-[10px] border-slate-200"
        >
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-4 flex items-center justify-center gap-3 uppercase italic">
            <Trophy className="text-yellow-500 w-8 h-8 md:w-12 md:h-12" /> ACADÉMIE DES GÉNIES 🚀
          </h1>
          
          {/* AFFICHAGE DU NOM DU JEU ACTIF (Remplacer SCORE TOTAL) */}
          <div className="inline-flex items-center gap-4 bg-[#fff9c4] px-8 py-3 rounded-full border-2 border-yellow-200 shadow-sm mb-8">
            <Star className="text-yellow-500 fill-yellow-500" size={24} />
            <span className="text-xl md:text-2xl font-black text-slate-700 uppercase tracking-tight">
              {currentTab ? currentTab.name : "Sélectionne un jeu"}
            </span>
            <Star className="text-yellow-500 fill-yellow-500" size={24} />
          </div>

          {/* SÉLECTEUR DE JEUX */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col md:flex-row items-center justify-center gap-2 p-3 md:p-4 rounded-[20px] transition-all font-black uppercase text-[10px] md:text-xs
                  ${activeTab === tab.id 
                    ? `${tab.color} text-white shadow-lg scale-105 border-b-4 border-black/20` 
                    : 'bg-slate-50 text-slate-400 hover:bg-white hover:shadow-md border-b-4 border-transparent'
                  }`}
              >
                {tab.icon}
                {tab.id === 'lexique' ? 'Lexique' : tab.name} 
              </button>
            ))}
          </div>
        </motion.div>

        {/* --- ZONE DE JEU DYNAMIQUE --- */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'sudoku' && <SudokuMaster />}
              {activeTab === 'suites' && <SuiteKids />}
              {activeTab === 'mots' && <WordKids />}
              {activeTab === 'lexique' && <LexiKids />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SCORE TOTAL DISCRET EN BAS */}
        <div className="mt-8 text-center flex flex-col gap-2">
          <p className="text-slate-600 font-black text-sm uppercase">
             ⭐ Mon Score Total : {totalScore} points ⭐
          </p>
          <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em]">
            Entraînement cérébral pour enfants • Niveau 1e - 8e année
          </p>
        </div>

      </div>
    </div>
  );
};

export default GeniusAcademy;