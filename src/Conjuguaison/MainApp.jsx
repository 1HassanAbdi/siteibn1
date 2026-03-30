import React, { useState } from "react";
import TakaApp from "./TakaApp"; // Ton module conjugaison
// import MathApp from "./MathApp"; // Ton module math

export default function MainLauncher() {
  const [matiereActive, setMatiereActive] = useState(null);

  if (matiereActive === "conjugaison") {
    return <TakaApp onQuitter={() => setMatiereActive(null)} />;
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-10">
      <h1 className="text-5xl font-black text-blue-900 mb-12 italic">École Ibn Batouta - Portail</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button 
          onClick={() => setMatiereActive("conjugaison")}
          className="bg-orange-400 p-10 rounded-3xl text-3xl font-bold text-white shadow-xl hover:scale-105 transition"
        >
          📖 Conjugaison
        </button>
        <button 
          className="bg-green-500 p-10 rounded-3xl text-3xl font-bold text-white shadow-xl opacity-50 cursor-not-allowed"
        >
          ➕ Mathématiques (Bientôt)
        </button>
      </div>
    </div>
  );
}