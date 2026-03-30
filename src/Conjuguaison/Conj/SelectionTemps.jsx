import React, { useState } from "react";

export default function SelectionTemps({ tempsDisponibles, onContinuer, onBack }) {
  // On initialise avec le premier temps par défaut
  const [selection, setSelection] = useState([tempsDisponibles[0]]);

  const toggleTemps = (t) => {
    // CORRECTION : Au lieu de faire un toggle (ajouter/enlever), 
    // on crée un nouveau tableau contenant UNIQUEMENT le dernier temps cliqué.
    setSelection([t]);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-10 items-center">
      <h2 className="text-4xl font-black text-blue-400 mb-10 italic">
        Choisis un temps
      </h2>
      
      <div className="grid grid-cols-2 gap-8 max-w-2xl">
        {tempsDisponibles.map((t) => (
          <label 
            key={t} 
            className={`flex items-center gap-4 text-3xl font-bold cursor-pointer p-4 rounded-xl transition-all ${
              selection.includes(t) ? "bg-blue-50 text-blue-600" : "text-blue-900"
            }`}
          >
            <input 
              type="checkbox" 
              checked={selection.includes(t)} 
              onChange={() => toggleTemps(t)} 
              className="w-10 h-10 accent-blue-500" 
            />
            {t}
          </label>
        ))}
      </div>

      <div className="mt-20 flex gap-10 w-full max-w-4xl">
        <button 
          onClick={onBack} 
          className="flex-1 bg-blue-400 text-white p-6 text-3xl font-black rounded-lg uppercase hover:bg-blue-500 transition"
        >
          Retour
        </button>
        <button 
          onClick={() => onContinuer(selection)} 
          className="flex-1 bg-[#0099cc] text-white p-6 text-3xl font-black rounded-lg uppercase hover:bg-[#007ba3] transition"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}