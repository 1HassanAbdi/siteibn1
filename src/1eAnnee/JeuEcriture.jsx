import React, { useState, useEffect } from 'react';

const JeuEcriture = ({ item, onNiveauSuivant }) => {
  const [syllabesChoisies, setSyllabesChoisies] = useState([]);
  const [options, setOptions] = useState([]);
  const [gagne, setGagne] = useState(false);

  // Initialisation : Mélange des syllabes au chargement d'un nouveau mot
  useEffect(() => {
    const melangees = [...item.syllabes].sort(() => Math.random() - 0.5);
    setOptions(melangees);
    setSyllabesChoisies([]);
    setGagne(false);
  }, [item]);

  // Fonction pour faire parler l'homme (synthèse vocale)
  const faireParlerHomme = (texte, vitesse = 0.8) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(texte);
    msg.lang = 'fr-FR';
    msg.rate = vitesse;
    
    // Essayer de trouver une voix d'homme
    const voices = window.speechSynthesis.getVoices();
    const voiceHomme = voices.find(v => v.name.toLowerCase().includes('male') || v.name.includes('Daniel') || v.name.includes('Paul'));
    if (voiceHomme) msg.voice = voiceHomme;
    
    window.speechSynthesis.speak(msg);
  };

  const gererClicSyllabe = (syllabe, index) => {
    if (gagne) return;

    const nouvellesChoisies = [...syllabesChoisies, syllabe];
    setSyllabesChoisies(nouvellesChoisies);
    
    // Enlever la syllabe des options
    const nouvellesOptions = [...options];
    nouvellesOptions.splice(index, 1);
    setOptions(nouvellesOptions);

    // Faire entendre la syllabe cliquée
    faireParlerHomme(syllabe, 1);

    // Vérifier si le mot est complet
    if (nouvellesChoisies.join('') === item.word.replace(/\s/g, '')) {
      setGagne(true);
      setTimeout(() => {
        faireParlerHomme("Bravo ! Tu as écrit " + item.word);
      }, 500);
    }
  };

  const reinitialiser = () => {
    setOptions([...item.syllabes].sort(() => Math.random() - 0.5));
    setSyllabesChoisies([]);
    setGagne(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.emojiPrincipal}>{item.emoji}</div>
        <h2 style={styles.consigne}>Reconstruis le mot :</h2>

        {/* Zone de construction du mot */}
        <div style={styles.zoneConstruction}>
          {syllabesChoisies.map((s, i) => (
            <div key={i} style={styles.blocSyllabeActive}>{s}</div>
          ))}
          {syllabesChoisies.length === 0 && <span style={styles.placeholder}>? ? ?</span>}
        </div>

        {/* Zone des choix (Syllabes mélangées) */}
        <div style={styles.zoneChoix}>
          {options.map((s, i) => (
            <button key={i} onClick={() => gererClicSyllabe(s, i)} style={styles.btnSyllabe}>
              {s}
            </button>
          ))}
        </div>

        {/* Boutons d'action */}
        <div style={styles.actions}>
          <button onClick={reinitialiser} style={styles.btnReset}>🔄 Recommencer</button>
          {gagne && (
            <button onClick={onNiveauSuivant} style={styles.btnNext}>
              Mot Suivant 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- STYLES ATTRACTIFS ---
const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '20px' },
  card: { 
    background: '#fff', padding: '40px', borderRadius: '30px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px',
    textAlign: 'center', border: '5px solid #FFD700'
  },
  emojiPrincipal: { fontSize: '100px', marginBottom: '10px' },
  consigne: { color: '#555', fontSize: '20px' },
  zoneConstruction: { 
    display: 'flex', justifyContent: 'center', gap: '10px', 
    minHeight: '80px', alignItems: 'center', backgroundColor: '#f9f9f9',
    borderRadius: '15px', border: '3px dashed #ccc', margin: '20px 0'
  },
  blocSyllabeActive: { 
    background: '#4CAF50', color: 'white', padding: '10px 20px', 
    borderRadius: '10px', fontSize: '24px', fontWeight: 'bold',
    animation: 'bounce 0.3s'
  },
  placeholder: { color: '#ccc', fontSize: '30px', fontWeight: 'bold' },
  zoneChoix: { display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' },
  btnSyllabe: { 
    padding: '15px 25px', fontSize: '22px', borderRadius: '15px',
    border: 'none', background: '#3b82f6', color: 'white', 
    cursor: 'pointer', boxShadow: '0 5px #2563eb', fontWeight: 'bold'
  },
  actions: { marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px' },
  btnReset: { background: '#94a3b8', color: 'white', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' },
  btnNext: { 
    background: '#f59e0b', color: 'white', border: 'none', 
    padding: '15px 30px', borderRadius: '50px', fontSize: '18px', 
    fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px #d97706'
  }
};

export default JeuEcriture;