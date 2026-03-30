import React from "react";
import { ChevronLeft } from "lucide-react";

export default function SelectionVerbe({ listesVerbes, onChoisir, onBack }) {
  return (
    <div className="min-h-screen bg-white p-10">
      <button onClick={onBack} className="flex items-center text-blue-500 font-bold mb-8">
        <ChevronLeft size={30} /> Retour
      </button>
      <h2 className="text-5xl font-black text-center mb-12 italic">Choisis ton verbe</h2>
      
      <div className="grid grid-cols-3 gap-10">
        {[1, 2, 3].map(groupe => (
          <div key={groupe} className="space-y-4">
            <h3 className="text-2xl font-black text-blue-400 border-b-4 border-blue-50 uppercase pb-2">Groupe {groupe}</h3>
            <div className="flex flex-wrap gap-2">
              {listesVerbes[groupe].map(v => (
                <button 
                  key={v} 
                  onClick={() => onChoisir(v, groupe)}
                  className="bg-gray-50 hover:bg-blue-500 hover:text-white px-4 py-2 rounded font-bold transition shadow-sm border border-gray-100"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}