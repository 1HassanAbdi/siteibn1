import React from 'react';

export default function ThemeSelector({ themes, onSelect }) {
  return (
    <div className="pop-in">
      <h2 className="main-title">Choisis ta mission 🎯</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {themes.map((t, i) => (
          <button 
            key={i} 
            className="theme-card"
            onClick={() => onSelect(t.theme)}
          >
            <span style={{ fontSize: '4rem', display: 'block' }}>{t.emoji}</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0369a1' }}>{t.theme}</span>
          </button>
        ))}
      </div>
      <style>{`
        .theme-card {
          background: white; border: 4px solid #e2e8f0; border-radius: 30px; padding: 25px;
          cursor: pointer; transition: 0.3s;
        }
        .theme-card:hover { transform: translateY(-10px); border-color: #38bdf8; background: #f0f9ff; }
      `}</style>
    </div>
  );
}