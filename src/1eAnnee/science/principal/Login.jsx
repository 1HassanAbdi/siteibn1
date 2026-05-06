import React, { useState } from 'react';

export default function Login({ onStart }) {
  const [name, setName] = useState("");

  return (
    <div className="pop-in login-container">
      <div className="avatar-welcome">👋</div>
      <h1 className="main-title">Bonjour !</h1>
      <p className="subtitle">Prêt pour l'aventure ? Écris ton prénom :</p>
      
      <div className="form-group">
        <input 
          type="text" 
          placeholder="Ton prénom ici..." 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="kid-input"
        />
        
        <button 
          className={`btn-start ${name ? 'pulse' : ''}`}
          onClick={() => name && onStart({ name })}
          disabled={!name}
        >
          C'EST PARTI ! 🚀
        </button>
      </div>

      <style>{`
        .login-container {
          padding: 20px;
        }

        .avatar-welcome {
          font-size: 6rem;
          margin-bottom: 10px;
          animation: wave 2s infinite;
        }

        .subtitle {
          font-size: 1.4rem;
          color: #475569;
          font-weight: 600;
          margin-bottom: 25px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 350px;
          margin: 0 auto;
        }

        .kid-input {
          padding: 20px;
          border-radius: 20px;
          border: 4px solid #7dd3fc;
          font-size: 1.5rem;
          text-align: center;
          font-family: 'Nunito', sans-serif;
          outline: none;
          transition: border-color 0.3s;
        }

        .kid-input:focus {
          border-color: #38bdf8;
          background-color: #f0f9ff;
        }

        /* --- LE BOUTON MAGIQUE --- */
        .btn-start {
          background-color: #22c55e;
          color: white;
          border: none;
          padding: 22px 40px;
          border-radius: 25px;
          font-size: 1.8rem;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 10px 0 #16a34a; /* Effet 3D (Ombre dessous) */
          position: relative;
          top: 0;
        }

        .btn-start:hover:not(:disabled) {
          background-color: #16a34a;
          transform: translateY(-2px);
          box-shadow: 0 12px 0 #15803d;
        }

        .btn-start:active:not(:disabled) {
          top: 8px; /* S'enfonce quand on clique */
          box-shadow: 0 2px 0 #15803d;
        }

        .btn-start:disabled {
          background-color: #cbd5e1;
          box-shadow: 0 10px 0 #94a3b8;
          cursor: not-allowed;
          opacity: 0.7;
        }

        /* Animation de battement quand le nom est écrit */
        .pulse {
          animation: pulse-animation 1.5s infinite;
        }

        @keyframes pulse-animation {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
        }
      `}</style>
    </div>
  );
}