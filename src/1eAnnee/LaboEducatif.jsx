import React, { useState } from 'react';
import gameData from './donnees.json';
import JeuEcriture from './JeuEcriture';

// Un petit composant temporaire pour ne pas faire planter si WordGame n'existe pas encore
const WordGamePlaceholder = ({ onScoreUpdate }) => (
  <div className="bg-white p-10 rounded-3xl text-center">
    <h2 className="text-2xl font-bold mb-4">Le Labo Lecture arrive bientôt !</h2>
    <button onClick={() => onScoreUpdate(10)} className="bg-blue-500 text-white p-4 rounded-xl">Simuler un gain</button>
  </div>
);

const LaboEducatif = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profil_cp')) || null);
  const [page, setPage] = useState('menu'); // menu, lecture, ecriture
  const [globalScore, setGlobalScore] = useState(parseInt(localStorage.getItem('score_total')) || 0);
  
  // Gestion de la progression du jeu d'écriture
  const [ecritureIndex, setEcritureIndex] = useState(0);
  const motsEcriture = gameData.levels[0].content.syllables_tasks;

  const ajouterPoints = (pts) => {
    const nouveauScore = globalScore + pts;
    setGlobalScore(nouveauScore);
    localStorage.setItem('score_total', nouveauScore);
  };

  const suivantEcriture = () => {
    ajouterPoints(20);
    if (ecritureIndex < motsEcriture.length - 1) {
      setEcritureIndex(ecritureIndex + 1);
    } else {
      alert("Félicitations ! Tu as fini tous les mots ! 🏆");
      setPage('menu');
      setEcritureIndex(0);
    }
  };

  // --- ÉCRAN D'INSCRIPTION ---
  if (!user) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-8 border-white text-center max-w-sm">
          <h1 className="text-4xl font-black text-indigo-600 mb-6">Salut ! 👋</h1>
          <input id="prenom" type="text" placeholder="Ton prénom..." className="w-full p-4 rounded-2xl border-4 border-indigo-100 mb-4 text-center text-xl outline-none focus:border-indigo-400" />
          <button 
            onClick={() => {
              const name = document.getElementById('prenom').value;
              if(name) {
                const newUser = { name, joined: new Date().toLocaleDateString() };
                setUser(newUser);
                localStorage.setItem('profil_cp', JSON.stringify(newUser));
              }
            }}
            className="w-full py-4 bg-green-500 text-white font-black rounded-2xl shadow-[0_6px_0_rgb(21,128,61)] active:translate-y-1"
          >
            C'EST PARTI !
          </button>
        </div>
      </div>
    );
  }

  // --- MENU PRINCIPAL ---
  if (page === 'menu') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 font-sans">
        <header className="flex flex-wrap gap-4 justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border-4 border-indigo-100 max-w-4xl mx-auto">
          <div>
            <h2 className="text-2xl font-black text-slate-700">Explorateur : {user.name} 🚀</h2>
            <p className="text-indigo-400 font-bold">Prêt pour une mission ?</p>
          </div>
          <div className="bg-yellow-400 px-6 py-2 rounded-2xl text-2xl font-black text-yellow-900 shadow-md">
            ⭐ {globalScore}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div onClick={() => setPage('lecture')} className="bg-white p-8 rounded-[3rem] border-8 border-blue-100 hover:border-blue-400 cursor-pointer transition-all group">
            <div className="text-8xl mb-4 group-hover:scale-110 transition-transform text-center">📖</div>
            <h3 className="text-3xl font-black text-blue-600 text-center uppercase">Labo Lecture</h3>
            <p className="text-center text-slate-400 font-bold mt-2">Trouve le bon mot !</p>
          </div>

          <div onClick={() => setPage('ecriture')} className="bg-white p-8 rounded-[3rem] border-8 border-yellow-100 hover:border-yellow-400 cursor-pointer transition-all group">
            <div className="text-8xl mb-4 group-hover:scale-110 transition-transform text-center">✏️</div>
            <h3 className="text-3xl font-black text-yellow-600 text-center uppercase">Labo Écriture</h3>
            <p className="text-center text-slate-400 font-bold mt-2">Assemble les syllabes !</p>
          </div>
        </div>
      </div>
    );
  }

  // --- AFFICHAGE DES JEUX ---
  return (
    <div className="min-h-screen bg-indigo-600 p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <button 
          onClick={() => setPage('menu')}
          className="bg-white/20 hover:bg-white/40 text-white px-6 py-2 rounded-full font-bold transition-all"
        >
          🏠 Menu
        </button>
        {page === 'ecriture' && (
          <div className="text-white font-black bg-black/20 px-4 py-2 rounded-full">
            MOT {ecritureIndex + 1} / {motsEcriture.length}
          </div>
        )}
      </div>

      {page === 'lecture' && <WordGamePlaceholder onScoreUpdate={ajouterPoints} />}
      
      {page === 'ecriture' && (
        <JeuEcriture 
          item={motsEcriture[ecritureIndex]} 
          onWordComplete={suivantEcriture} 
        />
      )}
    </div>
  );
};

export default LaboEducatif;