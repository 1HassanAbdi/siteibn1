import React, { useState, useEffect } from 'react';

export default function Syllabes({ data, onComplete }) {
  const [step, setStep] = useState(0);
  const [userAns, setUserAns] = useState([]);
  const current = data[step];
  const [shuffled, setShuffled] = useState([]);

  useEffect(() => {
    setShuffled([...current.syllables].sort(() => Math.random() - 0.5));
    setUserAns([]);
  }, [step, current]);

  const handleAdd = (s) => {
    const next = [...userAns, s];
    setUserAns(next);
    if (next.join("") === current.word) {
      setTimeout(() => step < data.length - 1 ? setStep(step + 1) : onComplete(), 1000);
    } else if (next.length >= current.syllables.length) {
      setTimeout(() => setUserAns([]), 600);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="text-6xl mb-6">{current.emoji}</div>
      <div className="flex gap-2 mb-10 min-h-[60px] p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-pink-200">
        {userAns.map((s, i) => <span key={i} className="bg-pink-500 text-white px-4 py-2 rounded-xl text-2xl font-bold animate-pop">{s}</span>)}
      </div>
      <div className="flex gap-4">
        {shuffled.map((s, i) => (
          <button key={i} onClick={() => handleAdd(s)} className="bg-white border-b-4 border-pink-200 p-4 rounded-xl text-2xl font-bold text-pink-600 hover:bg-pink-50 transition-all">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}