import React, { useState } from 'react';
import { Volume2, ArrowRight } from 'lucide-react';

export default function LectureActivity({ data, onComplete }) {
  const [step, setStep] = useState(0);
  const current = data[step];

  return (
    <div className="flex flex-col items-center p-8 h-full justify-between animate-in slide-in-from-right">
      <div className="text-9xl bg-slate-50 w-48 h-48 flex items-center justify-center rounded-full shadow-inner">{current.emoji}</div>
      <p className="text-4xl font-black text-slate-700 text-center leading-snug">
        {current.text.split(" ").map((w, i) => (
          <span key={i} className="hover:text-orange-500 cursor-help transition-colors"> {w} </span>
        ))}
      </p>
      <div className="flex gap-4">
        <button className="bg-green-100 p-4 rounded-full text-green-600 hover:scale-110 transition-transform"><Volume2 size={32}/></button>
        <button onClick={() => step < data.length - 1 ? setStep(step + 1) : onComplete()} className="bg-orange-500 text-white px-10 py-4 rounded-full text-2xl font-black shadow-lg">
          {step === data.length - 1 ? "J'ai fini !" : "Suite"} <ArrowRight className="inline ml-2"/>
        </button>
      </div>
    </div>
  );
}