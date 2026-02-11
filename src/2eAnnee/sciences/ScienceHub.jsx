import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 👈 1. IMPORTATION
import { 
  PawPrint, Droplets, Globe, ArrowLeft, Sparkles, 
  FlaskConical, Star, ArrowRight 
} from 'lucide-react';

// 1. IMPORTATION DES MODULES
import AnimalClassifierMUI from './AnimalClassifierMUI';
import AirWaterModule from './AirWaterModule';
import SocialStudiesWorld from './SocialStudiesWorld';

// 2. DONNÉES DU MENU
const MODULES = [
    {
        id: 'animals',
        title: 'Les Animaux',
        icon: PawPrint,
        colorClass: 'text-emerald-600',
        bgIcon: 'bg-emerald-100',
        borderClass: 'border-emerald-100 hover:border-emerald-300',
        desc: 'Exploration des mammifères, oiseaux et reptiles.'
    },
    {
        id: 'social',
        title: "Le Monde",
        icon: Globe,
        colorClass: 'text-orange-500',
        bgIcon: 'bg-orange-100',
        borderClass: 'border-orange-100 hover:border-orange-300',
        desc: 'Découverte des continents, fêtes et traditions.'
    },
    {
        id: 'air_water',
        title: "L'Air et l'Eau",
        icon: Droplets,
        colorClass: 'text-sky-500',
        bgIcon: 'bg-sky-100',
        borderClass: 'border-sky-100 hover:border-sky-300',
        desc: "Comprendre les états de la matière et le cycle de l'eau."
    }
];

export default function ScienceHub() {
    const [currentView, setCurrentView] = useState('menu');
    const navigate = useNavigate(); // 👈 2. HOOK

    return (
        // FOND GLOBAL
        <div className="min-h-screen bg-gradient-to-br from-[#eafaf1] via-[#e0f2f1] to-[#dcfce7] font-sans pb-12 selection:bg-[#0d6e52] selection:text-white">
            
            {/* --- HEADER --- */}
            <header className="relative bg-[#0d6e52] pt-8 pb-24 rounded-b-[48px] md:rounded-b-[80px] shadow-2xl overflow-hidden transition-all duration-500">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#34d399] via-transparent to-transparent"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                     <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        
                        {/* TITRE */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 tracking-tight">
                            <div className="bg-[#fbbf24] p-2.5 rounded-2xl text-[#064e3b] shadow-lg transform -rotate-3">
                                <FlaskConical size={28} />
                            </div>
                            Sciences & Découvertes
                            </h1>
                            <p className="text-emerald-100 mt-2 font-medium pl-16 opacity-90 hidden md:block">
                            Exploration du monde pour la 2e Année
                            </p>
                        </div>

                        {/* --- ZONE BOUTONS (Retour Menu Module + Retour Page Précédente) --- */}
                        <div className="flex gap-3">
                            
                            {/* Bouton: Retour au Menu des Modules (si un module est ouvert) */}
                            <AnimatePresence>
                                {currentView !== 'menu' && (
                                    <motion.button
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        onClick={() => setCurrentView('menu')}
                                        className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all border border-white/20 shadow-lg backdrop-blur-md"
                                    >
                                        <ArrowLeft size={18} /> Menu Sciences
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {/* 👈 3. BOUTON RETOUR GLOBAL (Quitter ScienceHub) */}
                            <button 
                                onClick={() => navigate(-1)} 
                                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all border border-white/20 shadow-lg backdrop-blur-sm group"
                            >
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                                <span className="hidden sm:inline">Quitter</span>
                            </button>
                        </div>

                     </div>
                </div>
            </header>

            {/* --- CONTENU PRINCIPAL --- */}
            <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-16 relative z-20">
                <AnimatePresence mode="wait">
                    
                    {/* VUE 1 : MENU PRINCIPAL */}
                    {currentView === 'menu' ? (
                        <motion.div 
                            key="menu"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="text-center mb-10">
                                <p className="inline-block bg-white/80 backdrop-blur text-[#0d6e52] px-6 py-2 rounded-full font-bold shadow-sm">
                                    👋 Choisis ton sujet d'exploration aujourd'hui :
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {MODULES.map((mod) => (
                                    <button 
                                        key={mod.id}
                                        onClick={() => setCurrentView(mod.id)}
                                        className={`bg-white p-8 rounded-[40px] border-4 ${mod.borderClass} shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group text-left relative overflow-hidden`}
                                    >
                                        <div className={`w-20 h-20 ${mod.bgIcon} rounded-3xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                                            <mod.icon size={40} className={mod.colorClass} />
                                        </div>
                                        
                                        <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-[#0d6e52] transition-colors">
                                            {mod.title}
                                        </h3>
                                        
                                        <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                            {mod.desc}
                                        </p>

                                        <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-slate-300 group-hover:text-[#0d6e52] transition-colors">
                                            Commencer <ArrowRight size={18} />
                                        </div>

                                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none"></div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        /* VUE 2 : MODULE ACTIF */
                        <motion.div
                            key="module"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white rounded-[40px] shadow-2xl border-4 border-white overflow-hidden min-h-[600px]"
                        >
                            <div className="p-4 md:p-8">
                                {currentView === 'animals' && <AnimalClassifierMUI />}
                                {currentView === 'air_water' && <AirWaterModule />}
                                {currentView === 'social' && <SocialStudiesWorld />}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Styles globaux */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap');
                body { font-family: 'Poppins', sans-serif; }
            `}</style>
        </div>
    );
}