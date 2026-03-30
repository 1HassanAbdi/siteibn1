import React, { useState } from "react";
import data from "./verbes_complet.json";

export default function GrilleVerbesTaka({ onSelectVerbe }) {
  const [filtre, setFiltre] = useState("tous");

  // On transforme l'objet JSON en une seule liste plate pour l'affichage
  const toutLesVerbes = [
    ...data["1er_groupe"].map(v => ({ n: v, g: 1 })),
    ...data["2e_groupe"].map(v => ({ n: v, g: 2 })),
    ...data["3e_groupe"].map(v => ({ n: v, g: 3 }))
  ].sort((a, b) => a.n.localeCompare(b.n)); // Tri par ordre alphabétique

  const verbesFiltrés = filtre === "tous" 
    ? toutLesVerbes 
    : toutLesVerbes.filter(v => v.g === parseInt(filtre));

  return (
    <div className="min-h-screen bg-[#9bc4e2] p-6 font-sans">
      <div className="max-w-[1400px] mx-auto bg-white/40 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        
        {/* Barre de sélection des groupes (Haut de l'image) */}
        <div className="flex justify-center gap-10 mb-10 bg-white/90 p-3 rounded-full shadow-inner border border-blue-200">
          {[
            { id: "tous", label: "Tous les groupes" },
            { id: "1", label: "1e groupe" },
            { id: "2", label: "2e groupe" },
            { id: "3", label: "3e groupe" }
          ].map(item => (
            <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="groupe" 
                checked={filtre === item.id}
                onChange={() => setFiltre(item.id)}
                className="w-5 h-5 accent-pink-600"
              />
              <span className={`text-xl font-bold ${filtre === item.id ? 'text-pink-600' : 'text-[#2c4c7c]'}`}>
                {item.label}
              </span>
            </label>
          ))}
        </div>

        {/* Grille Multi-colonnes (7 colonnes comme l'image) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-x-8 gap-y-2">
          {verbesFiltrés.map((verbe, index) => (
            <button
              key={index}
              onClick={() => onSelectVerbe(verbe)}
              className="text-left group flex items-baseline gap-1 hover:bg-white/50 p-1 rounded transition-all"
            >
              <span className="text-[#1a3a5a] text-[1.1rem] font-bold border-b-2 border-[#1a3a5a]/10 group-hover:border-[#1a3a5a] transition-all whitespace-nowrap">
                {verbe.n}
              </span>
              <span className="text-[#6c8caf] text-[10px] font-normal italic">
                {verbe.g} gr
              </span>
            </button>
          ))}
        </div>

        {/* Footer (Contact) */}
        <div className="mt-16 text-center text-[#2c4c7c] font-black opacity-80 flex items-center justify-center gap-3">
          <span>📧 Contactez-nous pour ajouter un verbe</span>
        </div>
      </div>
    </div>
  );
}