import React from 'react';

export default function FinalResults({ student, theme, scores, themeData }) {
  const total = scores[1] + scores[2] + scores[3] + scores[4];
  const max = themeData.exercice1_appariement.length + themeData.exercice2_glisser_deposer.length + themeData.exercice3_schema.zones.length + themeData.exercice4_qcm.length;

  return (
    <div className="pop-in">
      <div style={{ fontSize: '6rem' }}>🏆</div>
      <h1 className="main-title">Bravo {student.name} !</h1>
      <p style={{ fontSize: '1.5rem' }}>Tu as terminé le thème : <strong>{theme}</strong></p>
      
      <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '20px', margin: '20px 0' }}>
        <h2 style={{ color: '#0369a1' }}>Ton score total :</h2>
        <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#0ea5e9' }}>{total} / {max}</div>
      </div>

      {/* BOUTON AGRANDI ICI 👇 */}
      <button 
        className="btn-next" 
        onClick={() => window.location.reload()}
        style={{
          padding: '25px 60px', /* Rend le bouton beaucoup plus large et haut */
          fontSize: '2rem',     /* Agrandit considérablement le texte et l'émoji */
          fontWeight: 'bold',   /* Met le texte en gras */
          borderRadius: '50px', /* Garde les bords bien ronds */
          cursor: 'pointer',    /* Affiche la petite main au survol */
          marginTop: '20px'     /* Ajoute un peu d'espace avec le score au-dessus */
        }}
      >
        Recommencer 🔄
     </button>
     </div>
 );
}