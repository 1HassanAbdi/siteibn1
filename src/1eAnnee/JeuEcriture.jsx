import React, { useState, useEffect } from 'react';

const JeuEcriture = ({ item, onWordComplete }) => {
  const [syllabesChoisies, setSyllabesChoisies] = useState([]);
  const [options, setOptions] = useState([]);
  const [gagne, setGagne] = useState(false);

  // Initialisation à chaque nouveau mot
  useEffect(() => {
    if (item) {
      const melangees = [...item.syllables].sort(() => Math.random() - 0.5);
      setOptions(melangees);
      setSyllabesChoisies([]);
      setGagne(false);
    }
  }, [item]);

  const faireParler = (texte) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(texte);
    msg.lang = 'fr-FR';
    window.speechSynthesis.speak(msg);
  };

  const gererClicSyllabe = (syllabe, index) => {
    if (gagne) return;

    const nouvellesChoisies = [...syllabesChoisies, syllabe];
    setSyllabesChoisies(nouvellesChoisies);
    
    const nouvellesOptions = options.filter((_, i) => i !== index);
    setOptions(nouvellesOptions);

    faireParler(syllabe);

    // Vérifier si le mot est complet (on compare sans espaces)
    if (nouvellesChoisies.join('') === item.word.replace(/\s/g, '')) {
      setGagne(true);
      faireParler("Bravo ! " + item.word);
    }
  };

  const reinitialiser = () => {
    setOptions([...item.syllables].sort(() => Math.random() - 0.5));
    setSyllabesChoisies([]);
    setGagne(false);
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-8 border-yellow-200 text-center max-w-lg w-full">
      <div className="text-8xl mb-6">{item.emoji}</div>
      
      {/* Zone où le mot se construit */}
      <div className="flex justify-center gap-3 min-h-[80px] items-center bg-slate-50 rounded-2xl border-4 border-dashed border-slate-200 mb-8 p-4">
        {syllabesChoisies.map((s, i) => (
          <span key={i} className="bg-green-500 text-white px-5 py-2 rounded-xl text-2xl font-black shadow-lg animate-bounce">
            {s}
          </span>
        ))}
        {syllabesChoisies.length === 0 && <span className="text-slate-300 text-xl font-bold italic">Choisis les morceaux...</span>}
      </div>

      {/* Syllabes à cliquer */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {options.map((s, i) => (
          <button
            key={i}
            onClick={() => gererClicSyllabe(s, i)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-2xl text-2xl font-black shadow-[0_6px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 transition-all"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col gap-4">
        {gagne ? (
          <button 
            onClick={onWordComplete}
            className="bg-orange-500 text-white py-4 px-8 rounded-full text-2xl font-black shadow-[0_6px_0_rgb(194,65,12)] hover:scale-105 transition-transform"
          >
            CONTINUER 🚀
          </button>
        ) : (
          <button onClick={reinitialiser} className="text-slate-400 font-bold hover:text-red-500 transition-colors">
            🔄 Recommencer
          </button>
        )}
      </div>
    </div>
  );
};

export default JeuEcriture;