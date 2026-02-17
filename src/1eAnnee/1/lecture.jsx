import React, { useState, useEffect } from 'react';
import data from './lecture.json';

const LecteurInteractif = () => {
  const [indexH, setIndexH] = useState(0); // Index Histoire
  const [indexP, setIndexP] = useState(0); // Index Phrase

  const histoire = data.histoires[indexH];
  const phrase = histoire.lignes[indexP];

  // Fonction pour lire le texte à voix haute
  const lireTexte = (texte) => {
    // Annuler toute lecture en cours
    window.speechSynthesis.cancel();
    
    const énoncé = new SpeechSynthesisUtterance(texte);
    énoncé.lang = 'fr-FR'; // Force la voix française
    énoncé.pitch = 1.1;    // Un peu plus aigu pour une voix enfantine
    énoncé.rate = 0.8;     // Plus lent pour la 1re année
    
    window.speechSynthesis.speak(énoncé);
  };

  // Lire automatiquement quand on change de phrase (optionnel)
  useEffect(() => {
    // lireTexte(phrase.texte); // Décommente si tu veux la lecture auto
  }, [indexP]);

  const suivant = () => {
    if (indexP < histoire.lignes.length - 1) {
      setIndexP(indexP + 1);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.titreApp}>📖 Mon Jeu de Lecture</h1>
      
      <div style={styles.carte}>
        <div style={styles.header}>
          <span>Phrase {indexP + 1} / {histoire.lignes.length}</span>
        </div>

        <div style={styles.emojiSection} onClick={() => lireTexte(phrase.texte)}>
          <span style={styles.emojiBig}>{phrase.emoji}</span>
          <button style={styles.btnSon}>🔊 Écouter</button>
        </div>

        <p style={styles.textePhrase}>{phrase.texte}</p>

        <div style={styles.navigation}>
          <button 
            style={indexP === 0 ? styles.btnOff : styles.btnNav} 
            onClick={() => setIndexP(indexP - 1)}
            disabled={indexP === 0}
          >
            ⬅️ Précédent
          </button>

          <button 
            style={indexP === histoire.lignes.length - 1 ? styles.btnOff : styles.btnNav} 
            onClick={suivant}
            disabled={indexP === histoire.lignes.length - 1}
          >
            Suivant ➡️
          </button>
        </div>
      </div>
      
      <p style={{fontSize: '0.8em'}}>Appuie sur l'emoji ou le bouton pour entendre la phrase !</p>
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', padding: '20px', backgroundColor: '#f0f8ff', minHeight: '100vh' },
  titreApp: { color: '#2c3e50', marginBottom: '30px' },
  carte: { 
    backgroundColor: 'white', 
    borderRadius: '25px', 
    padding: '30px', 
    maxWidth: '500px', 
    margin: '0 auto', 
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    border: '5px solid #4CAF50'
  },
  emojiSection: { cursor: 'pointer', marginBottom: '20px', transition: 'transform 0.2s' },
  emojiBig: { fontSize: '80px', display: 'block' },
  btnSon: { backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '15px', padding: '5px 15px', cursor: 'pointer' },
  textePhrase: { fontSize: '32px', fontWeight: 'bold', margin: '20px 0', color: '#333', lineHeight: '1.4' },
  navigation: { display: 'flex', justifyContent: 'space-between', marginTop: '30px' },
  btnNav: { padding: '15px 25px', fontSize: '18px', cursor: 'pointer', borderRadius: '12px', border: 'none', backgroundColor: '#2196F3', color: 'white' },
  btnOff: { padding: '15px 25px', fontSize: '18px', borderRadius: '12px', border: 'none', backgroundColor: '#ccc', color: '#666' }
};

export default LecteurInteractif;