import React, { useState, useEffect } from 'react';
import gameData from './donnees.json';
import WordGame from './WordGame'; // Ton premier jeu
import JeuEcriture from './JeuEcriture'; // Ton deuxième jeu

const LaboEducatif = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profil_cp')) || null);
  const [page, setPage] = useState('menu'); // menu, lecture, ecriture
  const [globalScore, setGlobalScore] = useState(parseInt(localStorage.getItem('score_total')) || 0);

  // --- SAUVEGARDE ---
  const ajouterPoints = (pts) => {
    const nouveauScore = globalScore + pts;
    setGlobalScore(nouveauScore);
    localStorage.setItem('score_total', nouveauScore);
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
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border-4 border-indigo-100">
          <div>
            <h2 className="text-2xl font-black text-slate-700">Explorateur : {user.name} 🚀</h2>
            <p className="text-indigo-400 font-bold">Prêt pour une mission ?</p>
          </div>
          <div className="bg-yellow-400 px-6 py-2 rounded-2xl text-2xl font-black text-yellow-900 shadow-md">
            ⭐ {globalScore}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* CARTE JEU 1 : LECTURE */}
          <div onClick={() => setPage('lecture')} className="bg-white p-8 rounded-[3rem] border-8 border-blue-100 hover:border-blue-400 cursor-pointer transition-all group">
            <div className="text-8xl mb-4 group-hover:scale-110 transition-transform text-center">📖</div>
            <h3 className="text-3xl font-black text-blue-600 text-center uppercase">Labo Lecture</h3>
            <p className="text-center text-slate-400 font-bold mt-2">Trouve le bon mot pour l'image !</p>
          </div>

          {/* CARTE JEU 2 : ÉCRITURE */}
          <div onClick={() => setPage('ecriture')} className="bg-white p-8 rounded-[3rem] border-8 border-yellow-100 hover:border-yellow-400 cursor-pointer transition-all group">
            <div className="text-8xl mb-4 group-hover:scale-110 transition-transform text-center">✏️</div>
            <h3 className="text-3xl font-black text-yellow-600 text-center uppercase">Labo Écriture</h3>
            <p className="text-center text-slate-400 font-bold mt-2">Assemble les syllabes pour écrire !</p>
          </div>
        </div>
      </div>
    );
  }

  // --- AFFICHAGE DES JEUX ---
  return (
    <div className="min-h-screen bg-indigo-600 p-4">
      <button 
        onClick={() => setPage('menu')}
        className="mb-4 bg-white/20 hover:bg-white/40 text-white px-6 py-2 rounded-full font-bold transition-all"
      >
        🏠 Retour au Menu
      </button>

      {page === 'lecture' && <WordGame onScoreUpdate={ajouterPoints} />}
      {page === 'ecriture' && (
         <div className="flex flex-col items-center">
            {/* On passe le premier mot du premier niveau par défaut pour l'exemple */}
            <JeuEcriture 
                item={gameData.levels[0].items[0]} 
                onNiveauSuivant={() => ajouterPoints(20)} 
            />
         </div>
      )}
    </div>
  );
};

export default LaboEducatif;