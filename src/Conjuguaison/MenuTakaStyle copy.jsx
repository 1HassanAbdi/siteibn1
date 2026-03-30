import React, { useState } from "react";
import { X, Home, CheckCircle, User, Play, BookOpen, Trophy, LogOut } from "lucide-react";

// --- BASE DE DONNÉES DES VERBES (Image 4) ---
const listesVerbes = {
  1: ["Acheter", "Aider", "Aimer", "Ajouter", "Amuser", "Appeler", "Appuyer", "Arpenter", "Arriver", "Arroser", "Avancer", "Changer", "Chanter", "Chercher", "Commencer", "Dessiner", "Donner", "Écouter", "Effacer", "Étudier", "Jouer", "Manger", "Marcher", "Parler", "Penser", "Regarder", "Travailler", "Trouver"],
  2: ["Agrandir", "Applaudir", "Bâtir", "Choisir", "Définir", "Finir", "Guérir", "Obéir", "Punir", "Remplir", "Réussir", "Rougir"],
  3: ["Accueillir", "Aller", "Attendre", "Avoir", "Boire", "Comprendre", "Conduire", "Connaître", "Dire", "Dormir", "Être", "Faire", "Lire", "Mettre", "Ouvrir", "Partir", "Pouvoir", "Prendre", "Savoir", "Sortir", "Venir", "Vivre", "Voir", "Vouloir"]
};

const PRONOMS = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];

// --- LOGIQUE DE CONJUGAISON (PRÉSENT) ---
const genererConjugaison = (verbe, groupe) => {
  const v = verbe.toLowerCase();
  const rad = v.slice(0, -2);
  if (v === "être") return ["suis", "es", "est", "sommes", "êtes", "sont"];
  if (v === "avoir") return ["ai", "as", "a", "avons", "avez", "ont"];
  if (v === "aller") return ["vais", "vas", "va", "allons", "allez", "vont"];
  if (groupe === 1) {
    let n = rad + "ons";
    if (v.endsWith("ger")) n = rad + "eons";
    if (v.endsWith("cer")) n = v.slice(0, -3) + "çons";
    return [rad + "e", rad + "es", rad + "e", n, rad + "ez", rad + "ent"];
  }
  if (groupe === 2) return [rad + "is", rad + "is", rad + "it", rad + "issons", rad + "issez", rad + "issent"];
  return Array(6).fill(rad); // Simplifié pour le groupe 3
};

export default function TakaApp() {
  const [user, setUser] = useState("");
  const [page, setPage] = useState("login"); // login, menu, selection, quiz, bilan
  const [verbeSel, setVerbeSel] = useState(null);
  const [filtreGroupe, setFiltreGroupe] = useState("tous");
  const [reponses, setReponses] = useState(Array(6).fill(""));
  const [resultat, setResultat] = useState(null);

  // --- 1. LOGIN & MENU (Image 5) ---
  if (page === "login" || page === "menu") return (
    <div className="min-h-screen bg-[#e8f4cd] flex flex-col font-sans">
      <div className="bg-[#f9f9f9] p-2 text-[#4a6b8a] text-sm font-bold border-b italic">
        Jeu de conjugaison de verbes {verbeSel ? `- ${verbeSel.n}` : ""}
      </div>
      <div className="bg-[#7fb8c0] p-6 relative overflow-hidden h-32 flex items-center">
        <h1 className="text-6xl font-black text-[#fdfd96] italic drop-shadow-md z-10">Taka t'amuser</h1>
        <div className="absolute right-[-20px] top-[-10px] text-white opacity-20 text-9xl font-black italic select-none">Je maîtrise les verbes</div>
      </div>
      
      <div className="flex-1 bg-white p-10 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-8">
          <div className="flex items-center gap-4">
            <label className="text-4xl font-black text-gray-800 italic">Nom :</label>
            <input 
              className="flex-1 border-2 border-blue-100 p-4 text-3xl font-bold rounded-sm outline-blue-300"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 text-2xl font-bold text-gray-700">
            <input type="checkbox" className="w-6 h-6" /> Inclure tous les temps de verbe
          </div>

          <div className="space-y-4 pt-4">
            <button onClick={() => user && setPage("selection")} className="flex items-center gap-4 group">
              <Play className="text-blue-300 fill-blue-300 group-hover:scale-110 transition" size={45} />
              <span className="text-4xl font-black text-gray-800 hover:text-blue-500 transition italic">Étudier</span>
            </button>
            <button onClick={() => user && setPage("selection")} className="flex items-center gap-4 group">
              <Play className="text-blue-300 fill-blue-300 group-hover:scale-110 transition" size={45} />
              <span className="text-4xl font-black text-[#5d6d7e] hover:text-blue-500 transition italic">Jouer - mode entraînement*</span>
            </button>
            <button className="flex items-center gap-4 opacity-30">
              <Play className="text-blue-100 fill-blue-100" size={45} />
              <span className="text-4xl font-black text-gray-400 italic">Jouer</span>
            </button>
            <button className="flex items-center gap-4 group">
              <Play className="text-blue-300 fill-blue-300 group-hover:scale-110 transition" size={45} />
              <span className="text-4xl font-black text-gray-800 hover:text-blue-500 transition italic">Classement</span>
            </button>
          </div>
          <p className="text-gray-500 italic pt-10">*Mode entraînement: sans limite de temps ni sauvegarder</p>
        </div>
      </div>
    </div>
  );

  // --- 2. SÉLECTION (Image 4) ---
  if (page === "selection") return (
    <div className="min-h-screen bg-[#9bc4e2] p-4 flex flex-col items-center font-sans">
      <div className="bg-[#cedef0] px-10 py-3 rounded-full flex gap-8 mb-8 border-2 border-white shadow-sm">
        {["tous", 1, 2, 3].map(g => (
          <label key={g} className="flex items-center gap-2 font-black text-blue-900 cursor-pointer">
            <input 
              type="radio" 
              checked={filtreGroupe === g} 
              onChange={() => setFiltreGroupe(g)}
              className="w-5 h-5 accent-pink-500"
            /> {g === "tous" ? "Tous les groupes" : `${g}e groupe`}
          </label>
        ))}
      </div>

      <div className="w-full max-w-6xl grid grid-cols-7 gap-x-4 gap-y-1 bg-white/30 p-8 rounded-[40px] h-[75vh] overflow-y-auto custom-scrollbar">
        {Object.entries(listesVerbes).map(([groupe, verbes]) => (
          (filtreGroupe === "tous" || filtreGroupe === Number(groupe)) && (
            verbes.map(v => (
              <button 
                key={v} 
                onClick={() => { setVerbeSel({n: v, g: Number(groupe)}); setPage("quiz"); }}
                className="text-left font-black text-blue-900 hover:text-pink-600 transition text-[15px] border-b border-transparent hover:border-pink-300 whitespace-nowrap"
              >
                <span className="underline decoration-blue-400">{v.charAt(0)}</span>{v.slice(1)} <span className="text-[10px] opacity-40 ml-1">{groupe} gr</span>
              </button>
            ))
          )
        ))}
      </div>
    </div>
  );

  // --- 3. QUIZ (Image de saisie) ---
  if (page === "quiz") return (
    <div className="min-h-screen bg-[#d9e8b5] flex flex-col">
      <div className="bg-[#7db9c2] p-5 text-white flex justify-between items-center shadow-lg">
        <span className="text-3xl font-black italic uppercase tracking-tighter">{verbeSel?.n} (Présent)</span>
        <X className="cursor-pointer bg-black/10 rounded-full" size={40} onClick={() => setPage("menu")} />
      </div>
      <div className="flex-1 bg-white mx-4 mt-4 rounded-t-[60px] p-10 flex flex-col items-center">
        <div className="w-full max-w-lg space-y-4">
          {PRONOMS.map((p, i) => (
            <div key={i} className="flex items-center gap-6 text-3xl">
              <span className="w-32 text-right text-gray-300 font-black italic">{p}</span>
              <input 
                className="flex-1 border-b-4 border-blue-50 outline-none p-1 font-black text-blue-900 lowercase"
                value={reponses[i]}
                onChange={(e) => { const r = [...reponses]; r[i] = e.target.value; setReponses(r); }}
                autoFocus={i === 0}
              />
            </div>
          ))}
        </div>
        <button 
          onClick={() => {
            const sols = genererConjugaison(verbeSel.n, verbeSel.g);
            const bilan = reponses.map((rep, i) => ({
              pronom: PRONOMS[i],
              saisie: rep.trim(),
              correction: sols[i].charAt(0).toUpperCase() + sols[i].slice(1),
              estCorrect: rep.trim().toLowerCase() === sols[i].toLowerCase()
            }));
            setResultat({ bilan, score: bilan.filter(b => b.estCorrect).length });
            setPage("bilan");
          }}
          className="mt-10 bg-yellow-400 text-blue-900 px-20 py-4 rounded-full font-black text-3xl shadow-lg active:scale-95 transition"
        >VALIDER</button>
      </div>
    </div>
  );

  // --- 4. BILAN (Images 1, 2, 3) ---
  if (page === "bilan") return (
    <div className="min-h-screen bg-[#d9e8b5] flex flex-col">
      <div className="bg-[#7db9c2] p-4 text-white flex justify-between items-center font-sans">
        <h2 className="text-3xl font-black italic italic">Bilan : {verbeSel?.n}</h2>
        <div className="bg-white text-blue-900 px-8 py-1 rounded-full text-4xl font-black border-4 border-white shadow-inner">
          {resultat.score} / 6
        </div>
      </div>
      
      <div className="flex-1 bg-white mx-4 mt-4 rounded-t-[50px] p-8 shadow-2xl flex flex-col items-center">
        <h3 className="text-3xl font-black text-gray-700 italic mb-8">
          {resultat.score === 6 ? "🌟 Magnifique !" : "C'est bien, continue de t'entraîner !"}
        </h3>

        <table className="w-full max-w-4xl text-3xl border-separate border-spacing-y-4">
          <thead>
            <tr className="text-[#3b5998] font-black text-left">
              <th className="pb-4">Sujet</th>
              <th className="pb-4">Ta réponse</th>
              <th className="pb-4">Correction</th>
            </tr>
          </thead>
          <tbody className="font-bold">
            {resultat.bilan.map((l, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="text-gray-400 italic py-2">{l.pronom}</td>
                {/* Image 1 & 2 : Texte rouge barré si faux */}
                <td className={`py-2 ${l.estCorrect ? 'text-green-500 font-black' : 'text-red-500 line-through font-black'}`}>
                  {l.saisie || "---"}
                </td>
                {/* Image 1 & 2 : Correction en bleu gras */}
                <td className="text-blue-600 font-black py-2">
                  {l.estCorrect ? <CheckCircle className="text-green-500" size={35} /> : l.correction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-10 flex gap-4 w-full max-w-lg">
          <button onClick={() => { setPage("menu"); setReponses(Array(6).fill("")); }} className="flex-1 bg-blue-500 text-white py-4 rounded-full text-2xl font-black shadow-lg">MENU</button>
          <button onClick={() => { setPage("quiz"); setReponses(Array(6).fill("")); }} className="flex-1 bg-yellow-400 text-blue-900 py-4 rounded-full text-2xl font-black shadow-lg">REJOUER</button>
        </div>
      </div>
    </div>
  );

  return null;
}