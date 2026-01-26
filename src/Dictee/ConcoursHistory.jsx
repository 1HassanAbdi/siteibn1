import React from 'react';
import { Calendar, Trash2, ShieldAlert, ArrowLeft, Zap, Star, Flame } from 'lucide-react';

const ConcoursHistory = ({ onBack, hideHeader = false }) => {
  const SECRET_CODE = "1234"; 
  const history = JSON.parse(localStorage.getItem('concours_history') || '[]');

  const handleClearHistory = () => {
    const inputCode = window.prompt("⚠️ ZONE RÉSERVÉE AU PROFESSEUR\nEntrez le code de sécurité :");
    if (inputCode === SECRET_CODE) {
      if (window.confirm("Voulez-vous vraiment TOUT supprimer ?")) {
        localStorage.removeItem('concours_history');
        window.location.reload();
      }
    } else if (inputCode !== null) {
      alert("❌ Code incorrect.");
    }
  };

  // Fonction pour extraire et styliser le niveau de difficulté
  const renderDifficultyBadge = (concoursName) => {
    const text = concoursName.toLowerCase();
    
    if (text.includes("20 mots") || text.includes("facile")) {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md text-[9px] font-black uppercase">
          <Zap size={10} /> Facile
        </span>
      );
    }
    if (text.includes("40 mots") || text.includes("intermédiaire")) {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[9px] font-black uppercase">
          <Star size={10} /> Moyen
        </span>
      );
    }
    if (text.includes("60 mots") || text.includes("expert")) {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md text-[9px] font-black uppercase">
          <Flame size={10} /> Expert
        </span>
      );
    }
    return null;
  };

  return (
    <div className={`w-full ${!hideHeader ? 'min-h-screen bg-[#0f172a] p-6' : ''}`}>
      
      {!hideHeader && (
        <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
             {onBack && (
               <button onClick={onBack} className="p-2 text-slate-400 hover:text-white transition-colors">
                 <ArrowLeft size={24} />
               </button>
             )}
             <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
               Historique <span className="text-orange-500">Examens</span>
             </h1>
          </div>

          <button 
            onClick={handleClearHistory} 
            className="flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
          >
            <span className="text-xs font-bold uppercase">Effacer</span>
            <Trash2 size={18} />
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="p-6">Date & Niveau</th>
              <th className="p-6">Épreuve & Difficulté</th>
              <th className="p-6 text-center">Score</th>
              <th className="p-6 text-center">Temps</th>
              <th className="p-6 text-center text-rose-500">Fautes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {history.length > 0 ? history.map((res, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors group">
                {/* DATE ET NIVEAU SCOLAIRE */}
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">{res.date}</div>
                      <div className="text-[10px] text-orange-500 font-black uppercase italic">{res.niveau}</div>
                    </div>
                  </div>
                </td>

                {/* NOM DU CONCOURS + BADGE DIFFICULTÉ */}
                <td className="p-6">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium text-slate-300 text-sm">
                      {res.concours.split('(')[0]} {/* Affiche le nom avant la parenthèse */}
                    </span>
                    <div className="flex gap-2">
                      {renderDifficultyBadge(res.concours)}
                    </div>
                  </div>
                </td>

                {/* SCORE */}
                <td className="p-6">
                  <div className="flex justify-center">
                    <span className="px-4 py-1 bg-emerald-500/20 text-emerald-400 rounded-full font-black text-sm border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      {res.score}
                    </span>
                  </div>
                </td>

                {/* TEMPS */}
                <td className="p-6 text-center font-mono font-bold text-cyan-400">
                  {res.temps}
                </td>

                {/* ERREURS */}
                <td className="p-6 text-center font-bold text-rose-500">
                  {res.erreurs}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="p-20 text-center">
                   <ShieldAlert size={40} className="mx-auto mb-4 text-slate-800" />
                   <p className="text-slate-600 font-black uppercase italic tracking-widest text-xs">
                     Aucun examen terminé
                   </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hideHeader && (
        <div className="max-w-6xl mx-auto mt-6 flex justify-end">
             <button 
                onClick={handleClearHistory}
                className="text-[10px] text-slate-600 hover:text-red-500 font-black uppercase tracking-widest transition-colors flex items-center gap-2"
             >
                <Trash2 size={12} /> Zone Admin (Code Professeur requis)
             </button>
        </div>
      )}
    </div>
  );
};

export default ConcoursHistory;