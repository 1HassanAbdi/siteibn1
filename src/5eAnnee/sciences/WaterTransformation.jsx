import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Thermometer, Snowflake, Droplets, CloudFog, 
  Flame, Wind, ArrowDown, Info 
} from 'lucide-react';

const WaterTransformation = () => {
  const [temperature, setTemperature] = useState(20); // Température initiale (Liquide)

  // Déterminer l'état selon la température
  const getState = (temp) => {
    if (temp <= 0) return { id: 'solide', label: 'SOLIDE (Glace)', icon: Snowflake, color: 'text-cyan-500', bg: 'bg-cyan-100', desc: "Il fait très froid ! L'eau gèle et devient dure." };
    if (temp >= 100) return { id: 'gaz', label: 'GAZ (Vapeur)', icon: CloudFog, color: 'text-slate-400', bg: 'bg-slate-100', desc: "Il fait très chaud ! L'eau bout et s'envole en vapeur." };
    return { id: 'liquide', label: 'LIQUIDE (Eau)', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-100', desc: "La température est douce. L'eau coule et prend la forme du verre." };
  };

  const currentState = getState(temperature);

  // Configuration des particules (Molécules d'eau)
  // On génère 20 particules
  const particles = Array.from({ length: 20 });

  return (
    <div className="w-full max-w-4xl mx-auto font-sans text-slate-700">
      
      {/* --- TITRE --- */}
      <div className="text-center mb-8">
        <div className="inline-block bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-3">
           <Thermometer size={32} className={temperature > 50 ? "text-orange-500" : "text-cyan-500"} />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#0d6e52]">Les 3 États de l'Eau</h2>
        <p className="text-slate-500 font-medium">Change la température pour voir la transformation !</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        
        {/* --- ZONE GAUCHE : VISUALISATION --- */}
        <div className="flex-1 bg-white rounded-[40px] shadow-xl border-4 border-white overflow-hidden relative min-h-[400px]">
          {/* Arrière-plan dynamique */}
          <div 
            className={`absolute inset-0 transition-colors duration-1000 ${
              temperature <= 0 ? 'bg-cyan-50' : temperature >= 100 ? 'bg-orange-50' : 'bg-blue-50'
            }`}
          />

          {/* CONTENEUR (Le "Verre") */}
          <div className="absolute inset-x-10 bottom-10 top-20 border-b-4 border-x-4 border-white/50 rounded-b-[40px] backdrop-blur-sm bg-white/30 overflow-hidden shadow-inner">
            
            {/* PARTICULES D'EAU */}
            <div className="absolute inset-0 p-4">
              {particles.map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-6 h-6 rounded-full shadow-sm border border-white/40 ${
                    temperature <= 0 ? 'bg-cyan-300' : temperature >= 100 ? 'bg-slate-300' : 'bg-blue-400'
                  }`}
                  // ANIMATION MAGIQUE SELON L'ÉTAT
                  animate={
                    temperature <= 0 
                    ? { 
                        // SOLIDE : Vibrations sur place, structure serrée en bas
                        x: (i % 5) * 40 + 20, 
                        y: Math.floor(i / 5) * 40 + 150,
                        rotate: 0,
                        scale: 1 
                      } 
                    : temperature >= 100 
                    ? { 
                        // GAZ : Mouvement aléatoire partout, rapide
                        x: [Math.random() * 250, Math.random() * 250, Math.random() * 250],
                        y: [Math.random() * 300, Math.random() * 300, Math.random() * 300],
                        scale: [1, 1.5, 0.8],
                        opacity: [0.4, 0.8, 0.4],
                        transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                      } 
                    : { 
                        // LIQUIDE : Mouvement fluide en bas (coule)
                        x: [Math.random() * 200, Math.random() * 250],
                        y: 200 + Math.random() * 80, // Reste en bas
                        scale: 1,
                        transition: { duration: 3, repeat: Infinity, repeatType: "mirror" }
                      }
                  }
                  transition={temperature <= 0 ? { type: "spring", stiffness: 300 } : {}}
                />
              ))}
            </div>

            {/* Niveau d'eau (décoratif) */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-blue-400/20 w-full"
              animate={{ height: temperature >= 100 ? "0%" : "40%" }}
              transition={{ duration: 2 }}
            />
          </div>

          {/* Indicateur Température sur le visuel */}
          <div className="absolute top-6 right-6 font-mono font-black text-2xl bg-white/80 px-4 py-2 rounded-xl text-slate-600 shadow-sm backdrop-blur">
            {temperature}°C
          </div>
        </div>

        {/* --- ZONE DROITE : CONTRÔLES --- */}
        <div className="w-full md:w-80 flex flex-col gap-6">
          
          {/* Carte d'Info État */}
          <div className={`flex-1 bg-white rounded-[32px] p-6 shadow-lg border-2 transition-colors duration-500 ${temperature <= 0 ? 'border-cyan-100' : temperature >= 100 ? 'border-orange-100' : 'border-blue-100'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-2xl ${currentState.bg} ${currentState.color}`}>
                <currentState.icon size={28} />
              </div>
              <h3 className={`text-xl font-black uppercase ${currentState.color}`}>
                {currentState.label}
              </h3>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">
              {currentState.desc}
            </p>
            
            {/* Indicateur visuel type "Jauge" */}
            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
                <span>Glace</span>
                <span>Eau</span>
                <span>Vapeur</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden relative">
                <motion.div 
                  className={`h-full rounded-full ${
                    temperature <= 0 ? 'bg-cyan-400' : temperature >= 100 ? 'bg-slate-400' : 'bg-blue-500'
                  }`}
                  animate={{ width: `${Math.min(Math.max((temperature + 20) / 140 * 100, 5), 100)}%` }} // Calcul approximatif pour la barre
                />
              </div>
            </div>
          </div>

          {/* Contrôleur Slider */}
          <div className="bg-slate-800 rounded-[32px] p-6 shadow-xl text-white">
            <label className="flex items-center gap-2 font-bold mb-4 uppercase text-sm tracking-wider text-slate-400">
              <Flame size={16} /> Chauffer / Refroidir
            </label>
            
            <input
              type="range"
              min="-20"
              max="120"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="w-full h-4 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
            />
            
            <div className="flex justify-between mt-4 text-xs font-bold text-slate-500">
              <span className="flex flex-col items-center gap-1"><Snowflake size={14}/> -20°C</span>
              <span className="flex flex-col items-center gap-1"><Droplets size={14}/> 0°C à 100°C</span>
              <span className="flex flex-col items-center gap-1"><Wind size={14}/> 120°C</span>
            </div>

            <div className="mt-6 bg-white/10 rounded-xl p-4 flex items-center gap-3">
               <Info size={20} className="text-emerald-400 shrink-0"/>
               <p className="text-xs text-slate-300 leading-snug">
                 Bouge le curseur pour changer la chaleur !
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WaterTransformation;