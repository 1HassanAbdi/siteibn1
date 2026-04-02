import React, { useState } from 'react';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyUQc9jibkBbUaeC58cpyfu8JFUO9TyXsoNzOsQsaBGjTsSRdTx0N3YcEnXh7cELosVuQ/exec";

const DATABASE = {
  "GÉOMÉTRIE 📐": [
    { q: "Lequel est un prisme à base rectangulaire ?", options: ["Balle 🏀", "Boîte 📦", "Cornet 🍦", "Canette 🥫"], r: 1 },
    { q: "Combien de sommets possède un cube 🧊 ?", options: ["4", "6", "8", "12"], r: 2 },
    { q: "Lequel est un ANGLE DROIT ?", options: ["Livre 📖", "Toit 🏠", "Équerre 📐", "Cercle ⭕"], r: 2 },
    { q: "Un hexagone a combien de côtés ? ⬢", options: ["4", "5", "6", "8"], r: 2 },
    { q: "Quelle forme a 4 côtés égaux et 4 angles droits ?", options: ["Triangle 🔺", "Cercle ⚪", "Carré 🔲", "Losange 💠"], r: 2 }
  ],
  "MESURES 📏": [
    { q: "Quelle unité utilise-t-on pour la longueur d'un crayon ?", options: ["Mètres (m)", "Centimètres (cm)", "Kilomètres (km)", "Litres (L)"], r: 1 },
    { q: "Combien de jours y a-t-il dans une semaine ? 📅", options: ["5 jours", "7 jours", "10 jours", "30 jours"], r: 1 },
    { q: "Il est 9h00. Quelle heure sera-t-il dans 30 minutes ?", options: ["9h30 🕤", "10h00 🕙", "8h30 🕣", "9h15 🕘"], r: 0 },
    { q: "Quelle unité mesure la masse d'une pomme ? 🍎", options: ["Grammes (g)", "Litres (L)", "Mètres (m)", "Degrés (°C)"], r: 0 },
    { q: "Le tour d'une figure s'appelle :", options: ["L'aire", "Le périmètre", "Le sommet", "La face"], r: 1 }
  ],
  "MONNAIE 💰": [
    { q: "Tu as 1 billet de 10$ 💵 et 2 pièces de 2$ 🪙. Total ?", options: ["12 $", "14 $", "15 $", "20 $"], r: 1 },
    { q: "Quelle pièce vaut 1$ au Canada ? 🇨🇦", options: ["Loonie 🦆", "Toonie 🐻", "Quart 🪙", "Sou 🪙"], r: 0 },
    { q: "Si un jouet coûte 6$ et que tu donnes 10$, on te rend :", options: ["2 $", "3 $", "4 $", "5 $"], r: 2 },
    { q: "Combien de pièces de 25¢ font 1$ ?", options: ["2", "4", "5", "10"], r: 1 },
    { q: "Quelle est la valeur d'un billet bleu au Canada ? 🟦", options: ["5 $", "10 $", "20 $", "50 $"], r: 0 }
  ],
  "RÉGULARITÉ 🔢": [
    { q: "Complète : 5, 10, 15, 20, ___", options: ["21", "25", "30", "35"], r: 1 },
    { q: "Règle de : 100, 90, 80, 70 ?", options: ["+10", "-10", "+5", "-5"], r: 1 },
    { q: "Trouve n : n - 5 = 10", options: ["5", "10", "15", "20"], r: 2 },
    { q: "Complète la suite : 2, 4, 6, 8, ___", options: ["9", "10", "11", "12"], r: 1 },
    { q: "Si la règle est 'Ajouter 3', quel nombre suit 12 ?", options: ["13", "14", "15", "16"], r: 2 }
  ]
};

export default function AppImoji() {
  const [step, setStep] = useState('login');
  const [userNom, setUserNom] = useState('');
  const [theme, setTheme] = useState('');
  const [quizData, setQuizData] = useState({ idx: 0, score: 0, details: [] });
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleStart = (t) => {
    setTheme(t);
    setQuizData({ idx: 0, score: 0, details: [] });
    setStep('quiz');
    setFeedback(null);
    setSelectedIdx(null);
  };

  const handleSelection = (choice) => {
    if (feedback !== null) return;
    setSelectedIdx(choice);
    const isCorrect = choice === DATABASE[theme][quizData.idx].r;
    setFeedback(isCorrect ? 'correct' : 'wrong');
  };

  const handleNext = () => {
    const isCorrect = selectedIdx === DATABASE[theme][quizData.idx].r;
    const newDetails = [...quizData.details, isCorrect ? 1 : 0];
    const newScore = isCorrect ? quizData.score + 1 : quizData.score;

    if (quizData.idx + 1 < DATABASE[theme].length) {
      setQuizData({ ...quizData, idx: quizData.idx + 1, score: newScore, details: newDetails });
      setFeedback(null);
      setSelectedIdx(null);
    } else {
      // Fin du quiz : Envoi automatique et affichage résultat
      sendToSheets(userNom, theme, newScore, newDetails);
      setQuizData({ ...quizData, score: newScore, details: newDetails });
      setStep('result');
    }
  };

  const sendToSheets = async (nom, domaine, finalScore, finalDetails) => {
    const payload = {
      isReactEmoji: true, // Pour activer ta branche BILAN1 dans Apps Script
      eleve: nom,
      domaine: domaine,
      note: finalScore,
      total: DATABASE[domaine].length,
      date: new Date().toLocaleDateString('fr-CA'),
      details: finalDetails 
    };

    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });
    } catch (e) { console.error("Erreur d'envoi", e); }
  };

  return (
    <div style={st.bg}>
      <div style={st.card}>
        
        {step === 'login' && (
          <>
            <h1 style={st.title}>Ibn Batouta 🏫</h1>
            <input style={st.input} placeholder="Ton nom..." onChange={e => setUserNom(e.target.value)} />
            <button style={st.btn} onClick={() => userNom && setStep('menu')}>Entrer 🚀</button>
          </>
        )}

        {step === 'menu' && (
          <>
            <h2>Bonjour {userNom} !</h2>
            <p>Choisis un thème :</p>
            {Object.keys(DATABASE).map(t => (
              <button key={t} style={st.menuBtn} onClick={() => handleStart(t)}>{t}</button>
            ))}
          </>
        )}

        {step === 'quiz' && (
          <>
            <div style={st.progress}>{theme} | Question {quizData.idx + 1} / {DATABASE[theme].length}</div>
            <h2 style={st.qText}>{DATABASE[theme][quizData.idx].q}</h2>
            
            <div style={st.grid}>
              {DATABASE[theme][quizData.idx].options.map((opt, i) => (
                <button 
                  key={i} 
                  style={{
                    ...st.optBtn, 
                    backgroundColor: feedback && i === DATABASE[theme][quizData.idx].r ? '#c8e6c9' : 
                                    feedback && i === selectedIdx ? '#ffcdd2' : '#fff',
                    border: selectedIdx === i ? '3px solid #4a90e2' : '1px solid #ddd'
                  }}
                  onClick={() => handleSelection(i)}
                >
                  <span style={st.emojiLarge}>{opt.split(' ').pop()}</span>
                  <div style={st.optText}>{opt.replace(/[^\x00-\x7F]/g, "").trim()}</div>
                </button>
              ))}
            </div>

            {feedback && (
              <button style={{...st.btn, marginTop: '20px', backgroundColor: '#2ecc71'}} onClick={handleNext}>
                Suivant ➡️
              </button>
            )}
          </>
        )}

        {step === 'result' && (
          <>
            <h1>Fini ! 🏆</h1>
            <div style={st.score}>{quizData.score} / {DATABASE[theme].length}</div>
            <p>Bravo {userNom} ! Tes résultats sont enregistrés. ✅</p>
            <button style={st.btn} onClick={() => setStep('menu')}>Retour au Menu 🏠</button>
          </>
        )}

      </div>
    </div>
  );
}

const st = {
  bg: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eef2f7', fontFamily: 'system-ui', padding: '10px' },
  card: { width: '100%', maxWidth: '500px', backgroundColor: '#fff', padding: '25px', borderRadius: '30px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', textAlign: 'center', borderTop: '12px solid #4a90e2' },
  title: { color: '#4a90e2', fontSize: '32px', marginBottom: '20px' },
  input: { width: '100%', padding: '18px', margin: '20px 0', borderRadius: '15px', border: '2px solid #ddd', fontSize: '20px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '18px', borderRadius: '15px', border: 'none', backgroundColor: '#4a90e2', color: '#fff', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  menuBtn: { width: '100%', padding: '15px', margin: '8px 0', borderRadius: '15px', border: '2px solid #4a90e2', backgroundColor: '#fff', color: '#4a90e2', fontSize: '18px', cursor: 'pointer', fontWeight: '600' },
  qText: { fontSize: '22px', margin: '20px 0', color: '#2c3e50' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  optBtn: { padding: '20px 10px', borderRadius: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: '0.2s' },
  emojiLarge: { fontSize: '50px', marginBottom: '10px' },
  optText: { fontSize: '16px', fontWeight: '500' },
  progress: { fontSize: '14px', color: '#7f8c8d', fontWeight: 'bold' },
  score: { fontSize: '65px', fontWeight: 'bold', color: '#4a90e2', margin: '15px 0' }
};