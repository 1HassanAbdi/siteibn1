import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, Search, GraduationCap, ChevronRight, 
  ArrowLeft, RefreshCw, Loader2 
} from "lucide-react";
import TableauBordEleve from "./TableauBordEleve";

export default function CahierBordEnseignant({ onBack }) {
  const [toutHistorique, setToutHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreGrade, setFiltreGrade] = useState("");
  const [rechercheNom, setRechercheNom] = useState("");
  const [eleveSelectionne, setEleveSelectionne] = useState(null);

  // URL DE TON SCRIPT (Vérifie bien qu'elle est à jour)
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx0TTakmyk02hazQFob7iSZ-pgfmZdUn-hUZm1RAq_cRFa_xQEaNT56pwB5vxD_35Q8/exec";

  const chargerDonneesGlobales = async () => {
    setLoading(true);
    try {
      // MODIFICATION : On utilise "readAll" comme défini dans le Code.gs
      const response = await fetch(`${WEB_APP_URL}?action=readAll`);
      const data = await response.json();
      setToutHistorique(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Erreur prof :", e);
      setToutHistorique([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { chargerDonneesGlobales(); }, []);

  const listeEleves = useMemo(() => {
    const groupes = {};

    toutHistorique.forEach(h => {
      // On gère les différentes casses possibles (Email ou email)
      const email = (h.Email || h.email || "inconnu@ecole.com").toLowerCase().trim();
      const grade = String(h.Grade || h.grade || "");

      if (filtreGrade && grade !== filtreGrade) return;
      if (rechercheNom && !email.includes(rechercheNom.toLowerCase())) return;

      if (!groupes[email]) {
        groupes[email] = {
          email: email,
          nomAffichage: email.split('@')[0].replace('.', ' ').toUpperCase(),
          grade: grade,
          totalExos: 0,
          sommeScores: 0
        };
      }
      groupes[email].totalExos++;
      groupes[email].sommeScores += parseInt(h.Score) || 0;
    });

    return Object.values(groupes).map(e => ({
      ...e,
      moyenneGenerale: (e.sommeScores / e.totalExos).toFixed(1)
    }));
  }, [toutHistorique, filtreGrade, rechercheNom]);

  if (eleveSelectionne) {
    return (
      <TableauBordEleve 
        email={eleveSelectionne.email} 
        grade={eleveSelectionne.grade} 
        onBack={() => setEleveSelectionne(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF] pb-20 font-sans">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* HEADER PROF */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-8 border-blue-600 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 transition-all"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-lg">
                <Users size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black italic text-slate-800 uppercase leading-none">Registre</h1>
                <p className="text-blue-500 font-bold uppercase tracking-widest text-[10px]">École Ibn Batouta • Enseignant</p>
              </div>
            </div>
          </div>

          <button 
            onClick={chargerDonneesGlobales} 
            className={`p-4 rounded-2xl transition-all ${loading ? 'bg-blue-50 text-blue-400' : 'bg-slate-50 text-slate-400 hover:text-blue-600'}`}
          >
            <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* BARRE DE FILTRES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Rechercher un élève..." 
              value={rechercheNom}
              onChange={(e) => setRechercheNom(e.target.value)}
              className="w-full pl-16 p-6 bg-white rounded-3xl border-4 border-transparent focus:border-blue-200 outline-none font-bold text-xl shadow-sm transition-all"
            />
          </div>
          <div className="relative">
            <GraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" />
            <select 
              value={filtreGrade}
              onChange={(e) => setFiltreGrade(e.target.value)}
              className="w-full pl-16 p-6 bg-white rounded-3xl border-4 border-transparent focus:border-orange-200 outline-none font-black text-xl shadow-sm appearance-none cursor-pointer"
            >
              <option value="">TOUS LES NIVEAUX</option>
              {[2, 3, 4, 5, 6, 7, 8].map(g => (
                <option key={g} value={String(g)}>GRADE {g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* LISTE DES ÉLÈVES */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <Loader2 size={50} className="animate-spin text-blue-500 mb-4" />
            <p className="font-black text-slate-400 uppercase text-xs tracking-[0.2em]">Chargement des données sécurisées...</p>
          </div>
        ) : listeEleves.length === 0 ? (
          <div className="bg-white p-20 rounded-[50px] text-center border-4 border-dashed border-slate-100">
            <p className="text-xl font-black text-slate-300 uppercase italic">Aucun élève trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {listeEleves.map((eleve, idx) => (
              <div 
                key={idx}
                onClick={() => setEleveSelectionne(eleve)}
                className="bg-white p-6 rounded-[35px] shadow-sm border-2 border-transparent hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {eleve.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">{eleve.nomAffichage}</h3>
                    <div className="flex gap-3 mt-1">
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">Grade {eleve.grade}</span>
                      <span className="bg-blue-50 text-blue-500 px-3 py-1 rounded-full text-[9px] font-black uppercase">{eleve.totalExos} missions</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Moyenne Globale</p>
                    <p className="text-3xl font-black text-blue-600 italic leading-none">{eleve.moyenneGenerale}<span className="text-sm opacity-30">/6</span></p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl text-slate-200 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}