import React, { useState } from "react";
import { X, ChevronRight } from "lucide-react";

export default function ModeEtudier({ verbeNom, conjugaisons, onBack }) {
  const tempsList = Object.keys(conjugaisons);
  const [tempsSel, setTempsSel] = useState(tempsList[0]);
  const PRONOMS = ["je/j'", "tu", "il/elle", "nous", "vous", "ils/elles"];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-[#7fb8c0] p-6 flex justify-between items-center text-white h-28 shadow-md">
        <h1 className="text-5xl font-black italic uppercase">Je maîtrise {verbeNom}</h1>
        <X className="cursor-pointer text-black hover:scale-110 transition" size={45} onClick={onBack} />
      </div>

      <div className="flex flex-1 p-12 gap-12 bg-slate-50">
        <div className="flex flex-col gap-2 shrink-0 w-72">
          {tempsList.map(t => (
            <button 
              key={t} 
              onClick={() => setTempsSel(t)} 
              className={`text-left px-5 py-3 border-2 text-xl font-bold transition-all ${
                tempsSel === t ? "bg-[#cce0eb] border-[#8ea9b8] text-blue-900 translate-x-2" : "bg-white border-gray-100 text-gray-400 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-start pl-20 gap-12">
          <div className="text-[#a0d2eb] text-[300px] font-thin leading-none select-none opacity-40">{"{"}</div>
          <div className="space-y-6">
            {conjugaisons[tempsSel]?.map((f, i) => (
              <div key={i} className="text-5xl font-black flex gap-8 items-baseline">
                <span className="text-[#899bb0] italic w-40 text-right font-medium">{PRONOMS[i]}</span>
                <span className="text-[#1e3a5f] tracking-tight">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={onBack} className="bg-[#0099cc] py-6 text-white text-4xl font-black italic flex justify-center items-center gap-6 hover:bg-[#007ba3] transition">
        ACCUEIL
      </button>
    </div>
  );
}