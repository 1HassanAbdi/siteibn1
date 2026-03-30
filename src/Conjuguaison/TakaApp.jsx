import React, { useState } from "react";
import { X, Home, CheckCircle } from "lucide-react";

// --- 1. MOTEUR DE CONJUGAISON ---
const listesVerbes = {
  1: ["Acheter", "Aider", "Aimer", "Ajouter", "Amuser", "Appeler", "Appuyer", "Arpenter", "Arriver", "Arroser", "Avancer", "Balayer", "Changer", "Chanter", "Chercher", "Commencer", "Dessiner", "Donner", "Écouter", "Effacer", "Envoyer", "Étudier", "Fermer", "Gagner", "Jouer", "Lancer", "Manger", "Marcher", "Parler", "Payer", "Penser", "Porter", "Regarder", "Sauter", "Travailler", "Trouver"],
  2: ["Agrandir", "Applaudir", "Arrondir", "Bâtir", "Choisir", "Définir", "Élargir", "Finir", "Franchir", "Guérir", "Obéir", "Punir", "Remplir", "Réussir", "Rougir"],
  3: ["Accueillir", "Aller", "Apercevoir", "Asseoir", "Attendre", "Avoir", "Boire", "Comprendre", "Conduire", "Connaître", "Courir", "Croire", "Devoir", "Dire", "Dormir", "Être", "Faire", "Lire", "Mettre", "Ouvrir", "Partir", "Pouvoir", "Prendre", "Recevoir", "Savoir", "Sortir", "Tenir", "Venir", "Vivre", "Voir", "Vouloir"]
};

const genererConjugaison = (verbe, groupe) => {
  const v = verbe.toLowerCase();
  const rad = v.slice(0, -2);
  const rad2 = v.slice(0, -3);

  if (v === "être") return ["suis", "es", "est", "sommes", "êtes", "sont"];
  if (v === "avoir") return ["ai", "as", "a", "avons", "avez", "ont"];
  if (v === "aller") return ["vais", "vas", "va", "allons", "allez", "vont"];
  
  if (groupe === 1) {
    let n = rad + "ons";
    if (v.endsWith("ger")) n = rad + "eons";
    if (v.endsWith("cer")) n = rad2 + "çons";
    return [rad + "e", rad + "es", rad + "e", n, rad + "ez", rad + "ent"];
  }
  if (groupe === 2) return [rad + "is", rad + "is", rad + "it", rad + "issons", rad + "issez", rad + "issent"];
  return Array(6).fill(rad);
};

const PRONOMS = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];

export default function TakaApp() {
  const [page, setPage] = useState("selection");
  const [verbeSel, setVerbeSel] = useState(null);
  const [reponses, setReponses] = useState(Array(6).fill(""));
  const [resultat, setResultat] = useState(null);

  const verifier = () => {
    const solutions = genererConjugaison(verbeSel.n, verbeSel.g);
    const bilan = reponses.map((rep, i) => {
      // COMPARAISON SÉCURISÉE : on force tout en minuscules
      const estCorrect = rep.trim().toLowerCase() === solutions[i].toLowerCase();
      return {
        pronom: PRONOMS[i],
        saisie: rep.trim(),
        // Affichage avec Majuscule pour la correction
        correction: solutions[i].charAt(0).toUpperCase() + solutions[i].slice(1),
        estCorrect
      };
    });

    const scoreFinal = bilan.filter(r => r.estCorrect).length;
    setResultat({ bilan, score: scoreFinal });
    setPage("bilan");
  };

  const reset = () => {
    setPage("selection");
    setReponses(Array(6).fill(""));
    setVerbeSel(null);
  };

  // --- RENDU 1 : SÉLECTION ---
  if (page === "selection") return (
    <div className="min-h-screen bg-[#9bc4e2] p-4 flex flex-col items-center">
      <h1 className="text-3xl font-black text-white mb-6 italic uppercase">Choisir un verbe</h1>
      <div className="grid grid-cols-3 gap-4 w-full max-w-6xl h-[80vh] overflow-y-auto bg-white/30 p-6 rounded-[40px] shadow-2xl">
        {[1, 2, 3].map(g => (
          <div key={g} className="bg-white/90 p-4 rounded-3xl shadow-sm">
            <h2 className="text-xl font-black text-blue-600 mb-3 border-b-2 border-blue-50">Groupe {g}</h2>
            <div className="grid grid-cols-1 gap-1">
              {listesVerbes[g].map(v => (
                <button key={v} onClick={() => { setVerbeSel({n: v, g: g}); setPage("quiz"); }} className="text-left font-bold text-gray-700 hover:text-pink-600 transition text-sm">{v}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- RENDU 2 : QUIZ (MEME STRUCTURE) ---
  if (page === "quiz") return (
    <div className="min-h-screen bg-[#d9e8b5] flex flex-col">
      <div className="bg-[#7db9c2] p-4 text-white text-3xl font-black flex justify-between shadow-md">
        <span>{verbeSel?.n.toUpperCase()} <span className="opacity-60 text-xl">(Indicatif Présent)</span></span>
        <X className="cursor-pointer" onClick={reset} />
      </div>
      <div className="flex-1 bg-white mx-4 mt-4 rounded-t-[50px] p-6 flex flex-col items-center shadow-inner">
        <div className="space-y-4 w-full max-w-lg">
          {PRONOMS.map((p, i) => (
            <div key={i} className="flex items-center gap-4 text-2xl">
              <span className="w-28 text-right text-gray-400 font-bold">{p}</span>
              <input 
                className="flex-1 border-b-4 border-blue-50 outline-none p-1 font-black text-blue-900 lowercase"
                value={reponses[i]}
                onChange={(e) => {
                  const c = [...reponses]; c[i] = e.target.value; setReponses(c);
                }}
                autoFocus={i === 0}
              />
            </div>
          ))}
        </div>
        <button onClick={verifier} className="mt-8 bg-yellow-400 text-blue-900 px-12 py-4 rounded-full font-black text-2xl shadow-xl hover:scale-105 active:scale-95 transition">VALIDER</button>
      </div>
    </div>
  );

  // --- RENDU 3 : BILAN (L'ÉCRAN DE TES IMAGES) ---
  if (page === "bilan") return (
    <div className="min-h-screen bg-[#d9e8b5] flex flex-col">
      <div className="bg-[#7db9c2] p-4 text-white flex justify-between items-center shadow-md">
        <h2 className="text-3xl font-black italic">Bilan : {verbeSel?.n}</h2>
        <div className="bg-white text-blue-900 px-8 py-2 rounded-full text-4xl font-black border-4 border-blue-100 shadow-lg">
          {resultat.score} / 6
        </div>
      </div>
      <div className="flex-1 bg-white mx-4 mt-4 rounded-t-[50px] p-6 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-2xl font-bold text-gray-500 mb-6 italic">
            {resultat.score === 6 ? "🌟 Magnifique ! C'est parfait !" : "C'est bien, continue de t'entraîner !"}
          </h3>
          <table className="w-full text-2xl border-separate border-spacing-y-2">
            <thead>
              <tr className="text-blue-400 text-sm uppercase">
                <th className="p-2 text-left">Sujet</th>
                <th className="p-2 text-left">Ta réponse</th>
                <th className="p-2 text-left">Correction</th>
              </tr>
            </thead>
            <tbody>
              {resultat.bilan.map((l, i) => (
                <tr key={i} className="bg-gray-50/50 rounded-xl">
                  <td className="p-3 text-gray-400 italic font-medium">{l.pronom}</td>
                  {/* ICI : Le texte s'affiche enfin en vert si l'élève a bon (même en minuscules) ! */}
                  <td className={`p-3 font-black ${l.estCorrect ? 'text-green-500' : 'text-red-500 line-through'}`}>
                    {l.saisie || "---"}
                  </td>
                  <td className="p-3 font-black text-blue-600">
                    {l.estCorrect ? <CheckCircle className="text-green-500 inline" size={32} /> : l.correction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={reset} className="mt-8 w-full bg-blue-500 text-white py-4 rounded-full text-2xl font-black shadow-lg hover:bg-blue-600 transition">MENU PRINCIPAL</button>
        </div>
      </div>
    </div>
  );

  return null;
}