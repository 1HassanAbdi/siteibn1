import React, { useState } from 'react';
import data from '../data.json';

// Import des sous-composants
import Login from './Login';
import ThemeSelector from './ThemeSelector';
import Exercise1 from './Exercice1'; // Appariement
import Exercise2 from './Exercise2'; // Glisser-déposer
import Exercise3 from './Exercise3'; // Schéma
import Exercise4 from './Exercise4'; // QCM
import FinalResults from './FinalResults';

// --- CONFIGURATION GOOGLE SHEET ---
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyvtqOyxrJnNHVyN557xk_UJXytP8tON_dHvHzYupwwXFD0XptzSqB58Rg3QLf2_504zg/exec";

export default function SciencePrincipa() {
  // --- ÉTATS ---
  const [step, setStep] = useState('login'); 
  const [student, setStudent] = useState({ name: "", class: "" });
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [scores, setScores] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });

  // Récupération des données du thème choisi
  const themeData = selectedTheme ? data.themes.find(t => t.theme === selectedTheme) : null;

  // --- FONCTION AUDIO (Synthèse vocale) ---
  const say = (text) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'fr-FR';
    window.speechSynthesis.speak(msg);
  };

  // --- FONCTION D'ENVOI AUTOMATIQUE (Exercice par Exercice) ---
  const sendProgressToGoogle = async (exNum, score, total) => {
    const payload = {
      subject: "Sciences",
      studentName: student.name,
      studentClass: "1er",
      theme: selectedTheme,
      exercise: "Exercice " + exNum,
      score: score,
      total: total,
      date: new Date().toLocaleString()
    };

    try {
      await fetch(GOOGLE_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(payload)
      });
      console.log(`✅ Sauvegarde réussie : Exercice ${exNum}`);
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde automatique", error);
    }
  };

  // --- GESTION DU CHANGEMENT D'ÉTAPE ---
  const handleNextStep = (currentExerciseScore, nextStepName) => {
    if (currentExerciseScore !== null) {
      const currentExNum = step.replace('ex', ''); // Récupère "1", "2", etc.
      
      // 1. Calcul du total de l'exercice pour l'envoi
      let totalItems = 0;
      if (currentExNum === "1") totalItems = themeData.exercice1_appariement.length;
      if (currentExNum === "2") totalItems = themeData.exercice2_glisser_deposer.length;
      if (currentExNum === "3") totalItems = themeData.exercice3_schema.zones.length;
      if (currentExNum === "4") totalItems = themeData.exercice4_qcm.length;

      // 2. Envoi automatique au Google Sheet
      sendProgressToGoogle(currentExNum, currentExerciseScore, totalItems);

      // 3. Mise à jour locale du score
      setScores(prev => ({ ...prev, [currentExNum]: currentExerciseScore }));
    }

    // 4. Passage à l'écran suivant
    setStep(nextStepName);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      {/* --- STYLES CSS --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&family=Nunito:wght@700;900&display=swap');
        
        .app-container { 
          font-family: 'Nunito', sans-serif; 
          background: #f0f9ff; 
          min-height: 100vh; 
          padding: 20px; 
          display: flex; 
          flex-direction: column;
          align-items: center; 
        }

        .card { 
          background: white; 
          border-radius: 40px; 
          padding: 30px; 
          box-shadow: 0 12px 0 #bae6fd; 
          border: 4px solid #7dd3fc; 
          width: 100%; 
          max-width: 900px; 
          text-align: center; 
          position: relative; 
        }

        .main-title { 
          font-family: 'Fredoka', sans-serif; 
          color: #0369a1; 
          font-size: 2.2rem; 
          margin-bottom: 20px; 
        }

        /* Barre de progression avec le petit coureur */
        .progress-wrapper {
          width: 100%;
          max-width: 800px;
          margin-bottom: 30px;
          position: relative;
          padding-top: 20px;
        }

        .progress-bar { 
          width: 100%; 
          height: 14px; 
          background: #e2e8f0; 
          border-radius: 10px; 
          overflow: hidden; 
          border: 2px solid #cbd5e1;
        }

        .progress-fill { 
          height: 100%; 
          background: linear-gradient(90deg, #38bdf8, #0ea5e9); 
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); 
        }

        .runner-icon {
          position: absolute;
          top: -10px;
          font-size: 2rem;
          transition: left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: translateX(-50%);
        }

        .pop-in { animation: popIn 0.5s ease-out; }
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* --- BARRE DE PROGRESSION (Visible après le login) --- */}
      {step !== 'login' && step !== 'theme' && step !== 'results' && (
        <div className="progress-wrapper">
          <div className="runner-icon" style={{ left: `${(parseInt(step.replace('ex','')) / 4) * 100}%` }}>🏃</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(parseInt(step.replace('ex','')) / 4) * 100}%` }}></div>
          </div>
        </div>
      )}

      {/* --- CONTENU DYNAMIQUE --- */}
      <div className="card pop-in">
        
        {/* Étape 0 : Connexion */}
        {step === 'login' && (
          <Login onStart={(userData) => { setStudent(userData); setStep('theme'); }} />
        )}
        
        {/* Étape 1 : Choix du thème */}
        {step === 'theme' && (
          <ThemeSelector themes={data.themes} onSelect={(t) => { setSelectedTheme(t); setStep('ex1'); }} />
        )}

        {/* Étape 2 : Exercice 1 (Relier par 3) */}
        {step === 'ex1' && (
          <Exercise1 
            data={themeData.exercice1_appariement} 
            onNext={(score) => handleNextStep(score, 'ex2')} 
            say={say}
            student={student}
            theme={selectedTheme}
          />
        )}

        {/* Étape 3 : Exercice 2 (Glisser-déposer) */}
        {step === 'ex2' && (
          <Exercise2 
            data={themeData.exercice2_glisser_deposer} 
            onNext={(score) => handleNextStep(score, 'ex3')} 
            say={say} 
          />
        )}

        {/* Étape 4 : Exercice 3 (Schéma) */}
        {step === 'ex3' && (
          <Exercise3 
            data={themeData.exercice3_schema} 
            onNext={(score) => handleNextStep(score, 'ex4')} 
            say={say} 
          />
        )}

        {/* Étape 5 : Exercice 4 (QCM) */}
        {step === 'ex4' && (
          <Exercise4 
            data={themeData.exercice4_qcm} 
            onNext={(score) => handleNextStep(score, 'results')} 
            say={say} 
          />
        )}

        {/* Étape 6 : Bilan Final */}
        {step === 'results' && (
          <FinalResults 
            student={student} 
            theme={selectedTheme} 
            scores={scores} 
            themeData={themeData} 
          />
        )}
      </div>
    </div>
  );
}