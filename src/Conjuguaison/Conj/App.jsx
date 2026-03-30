import React, { useState } from "react";
import MenuPrincipal from "./MenuPrincipal";
import SelectionVerbe from "./SelectionVerbe";
import ModeEtudier from "./ModeEtudier";
import QuizEntrainement from "./QuizEntrainement";
import SelectionTemps from "./SelectionTemps"; 
import Bilan from "./Bilan";
import TableauBordEleve from "./TableauBordEleve";
import CahierBordProf from "./CahierBordProf";
import { genererToutesConjugaisons } from "./conjugateur";

// Configuration des verbes par niveau/groupe
const listesVerbes = {
  1: ["Acheter", "Aider", "Aimer", "Ajouter", "Amuser", "Appeler", "Appuyer", "Arpenter", "Arriver", "Arroser", "Avancer", "Changer", "Chanter", "Chercher", "Commencer", "Dessiner", "Donner", "Écouter", "Effacer", "Étudier", "Jouer", "Manger", "Marcher", "Parler", "Penser", "Regarder", "Travailler", "Trouver"],
  2: ["Agrandir", "Applaudir", "Bâtir", "Choisir", "Définir", "Finir", "Guérir", "Obéir", "Punir", "Remplir", "Réussir", "Rougir"],
  3: ["Accueillir", "Aller", "Attendre", "Avoir", "Boire", "Comprendre", "Conduire", "Connaître", "Dire", "Dormir", "Être", "Faire", "Lire", "Mettre", "Ouvrir", "Partir", "Pouvoir", "Prendre", "Savoir", "Sortir", "Venir", "Vivre", "Voir", "Vouloir"]
};

export default function App() {
  // --- ÉTATS GLOBAUX ---
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState(""); // Initialisé à vide pour forcer le choix
  const [page, setPage] = useState("menu"); 
  const [mode, setMode] = useState(""); // "etudier" ou "entrainer"
  
  // --- ÉTATS DE JEU ---
  const [verbeSel, setVerbeSel] = useState(null);
  const [tempsSel, setTempsSel] = useState("");
  const [tempsFinal, setTempsFinal] = useState(0); 
  const [resultatsBilan, setResultatsBilan] = useState(null);

  // --- LOGIQUE MÉTIER ---

  const determinerGroupeTexte = (nom) => {
    const v = nom.toLowerCase().trim();
    if (v.endsWith("er") && v !== "aller") return "1er Groupe";
    if (v.endsWith("ir")) return "2e Groupe";
    return "3e Groupe";
  };

  const envoyerVersGoogleSheets = async (donnees) => {
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx0TTakmyk02hazQFob7iSZ-pgfmZdUn-hUZm1RAq_cRFa_xQEaNT56pwB5vxD_35Q8/exec"; 
    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donnees)
      });
      console.log("✅ Données synchronisées");
    } catch (error) {
      console.error("❌ Erreur Sheets :", error);
    }
  };

  const gererChoixVerbe = (nom, groupeNum) => {
    const toutesLesConjs = genererToutesConjugaisons(nom, groupeNum);
    setVerbeSel({ n: nom, g: groupeNum, conj: toutesLesConjs });
    // Si mode étude, on va direct voir les tables, sinon on choisit le temps pour le quiz
    setPage(mode === "etudier" ? "etudier" : "selectionTemps");
  };

  const gererValidationQuiz = (reponsesSaisies, secondes) => {
    setTempsFinal(secondes);
    const attendu = verbeSel.conj[tempsSel];
    const pronoms = ["je/j'", "tu", "il/elle", "nous", "vous", "ils/elles"];
    
    const bilan = reponsesSaisies.map((saisie, i) => ({
      pronom: pronoms[i],
      saisie: saisie.trim().toLowerCase(),
      attendu: attendu[i],
      estCorrect: saisie.trim().toLowerCase() === attendu[i].toLowerCase()
    }));

    const scoreFinal = bilan.filter(r => r.estCorrect).length;
    setResultatsBilan({ bilan, score: scoreFinal });

    envoyerVersGoogleSheets({
      email: email.trim().toLowerCase(),
      grade: grade,
      verbe: verbeSel.n,
      tempsConjugaison: tempsSel,
      groupe: determinerGroupeTexte(verbeSel.n),
      score: scoreFinal,
      tempsMis: secondes,
      resultats: bilan 
    });

    setPage("bilan");
  };

  // --- SYSTÈME DE ROUTAGE ---
  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900 overflow-x-hidden">
      
      {/* 1. MENU PRINCIPAL (Gère l'identification) */}
      {page === "menu" && (
        <MenuPrincipal 
          email={email} 
          setEmail={setEmail} 
          grade={grade} 
          setGrade={setGrade} 
          onNavigate={(destination) => { 
            if (email.toLowerCase().trim() === "prof2026") {
              setPage("prof");
            } else {
              setMode(destination); 
              if (destination === "tableau-bord") {
                setPage("dashboard");
              } else {
                setPage("selection"); // destination sera "etudier" ou "entrainer"
              }
            }
          }} 
        />
      )}

      {/* 2. ESPACE PROFESSEUR */}
      {page === "prof" && (
        <CahierBordProf onBack={() => setPage("menu")} />
      )}

      {/* 3. CAHIER DE RÉUSSITE (Dashboard Élève) */}
      {page === "dashboard" && (
        <TableauBordEleve 
          email={email} 
          grade={grade} 
          onBack={() => setPage("menu")} 
        />
      )}

      {/* 4. SÉLECTION DU VERBE */}
      {page === "selection" && (
        <SelectionVerbe 
          listesVerbes={listesVerbes} 
          onChoisir={gererChoixVerbe} 
          onBack={() => setPage("menu")} 
        />
      )}

      {/* 5. MODE ÉTUDE (Visualisation) */}
      {page === "etudier" && verbeSel && (
        <ModeEtudier 
          verbeNom={verbeSel.n} 
          conjugaisons={verbeSel.conj} 
          onBack={() => setPage("selection")} 
        />
      )}

      {/* 6. SÉLECTION DU TEMPS (Avant Quiz) */}
      {page === "selectionTemps" && verbeSel && (
        <SelectionTemps 
          tempsDisponibles={Object.keys(verbeSel.conj)} 
          onContinuer={(t) => { 
            setTempsSel(t[0]); 
            setPage("entrainement"); 
          }} 
          onBack={() => setPage("selection")} 
        />
      )}

      {/* 7. LE QUIZ (Action) */}
      {page === "entrainement" && verbeSel && (
        <QuizEntrainement 
          verbe={verbeSel.n} 
          temps={tempsSel} 
          onValider={gererValidationQuiz} 
          onBack={() => setPage("menu")} 
        />
      )}

      {/* 8. BILAN ET SCORE */}
      {page === "bilan" && resultatsBilan && (
        <Bilan 
          verbeNom={verbeSel.n} 
          score={resultatsBilan.score} 
          resultats={resultatsBilan.bilan} 
          tempsMis={tempsFinal} 
          onMenu={() => setPage("menu")} 
          onRejouer={() => setPage("entrainement")} 
        />
      )}
    </div>
  );
}