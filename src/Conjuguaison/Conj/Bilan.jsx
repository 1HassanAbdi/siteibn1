import React from "react";
import { CheckCircle, Home, RotateCcw, Timer } from "lucide-react";

export default function Bilan({ verbeNom, score, resultats, tempsMis, onMenu, onRejouer }) {
  return (
    <div className="min-h-screen bg-[#d9e8b5] flex flex-col font-sans">
      {/* BARRE DE TITRE */}
      <div className="bg-[#7db9c2] p-4 text-white flex justify-between items-center shadow-md px-10">
        <h2 className="text-4xl font-black italic uppercase">Bilan : {verbeNom}</h2>
        
        <div className="flex gap-4">
          {/* BULLE DU CHRONO : On affiche la variable {tempsMis} */}
          <div className="bg-white text-blue-900 px-8 py-2 rounded-full text-4xl font-black flex items-center gap-3 border-4 border-white shadow-xl">
            <Timer className="text-blue-400" size={35} />
            <span>{tempsMis} s</span> 
          </div>

          {/* BULLE DU SCORE */}
          <div className="bg-white text-[#1e3a5f] px-10 py-2 rounded-full text-5xl font-black border-4 border-white shadow-xl">
            {score} / 6
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-white mx-6 mt-6 rounded-t-[60px] p-10 shadow-2xl flex flex-col items-center">
        <h3 className="text-4xl font-black text-gray-700 italic mb-4">
          {score === 6 ? "🌟 Magnifique !" : "Continue de t'entraîner !"}
        </h3>

        {/* LA LIGNE CORRIGÉE : Utilisation des accolades {} pour afficher le chiffre */}
        <p className="text-2xl font-bold text-gray-400 mb-10">
          Temps réalisé : <span className="text-blue-600 font-black">{tempsMis} secondes</span>
        </p>

        <table className="w-full max-w-5xl text-3xl border-separate border-spacing-y-4">
          <thead>
            <tr className="text-[#3b5998] font-black text-left">
              <th className="pb-4 pl-10 text-xl uppercase opacity-50">Sujet</th>
              <th className="pb-4 text-xl uppercase opacity-50">Réponse</th>
              <th className="pb-4 text-xl uppercase opacity-50">Correction</th>
            </tr>
          </thead>
          <tbody className="font-bold">
            {resultats.map((res, i) => (
              <tr key={i} className="bg-blue-50/30 rounded-2xl">
                <td className="text-gray-400 italic py-4 pl-10">{res.pronom}</td>
                <td className={`py-4 ${res.estCorrect ? 'text-green-500' : 'text-red-500 line-through decoration-4'}`}>
                  {res.saisie || "---"}
                </td>
                <td className="py-4">
                  {res.estCorrect ? (
                    <CheckCircle className="text-green-500" size={40} />
                  ) : (
                    <span className="text-blue-600 font-black">{res.attendu}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* BOUTONS D'ACTION */}
        <div className="mt-16 flex gap-8 w-full max-w-2xl">
          <button 
            onClick={onMenu} 
            className="flex-1 bg-blue-500 text-white py-6 rounded-full text-3xl font-black flex items-center justify-center gap-4 hover:bg-blue-600 shadow-lg active:scale-95 transition-all"
          >
            <Home size={40} /> MENU
          </button>
          <button 
            onClick={onRejouer} 
            className="flex-1 bg-[#fdd835] text-[#1e3a5f] py-6 rounded-full text-3xl font-black flex items-center justify-center gap-4 hover:bg-yellow-500 shadow-lg active:scale-95 transition-all"
          >
            <RotateCcw size={40} /> REJOUER
          </button>
        </div>
      </div>
    </div>
  );
}