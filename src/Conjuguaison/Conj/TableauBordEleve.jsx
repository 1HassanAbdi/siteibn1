import React, { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Loader2, TrendingUp, RefreshCw, Flame, Trophy, Target, CheckCircle2, PieChart as PieIcon } from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function TableauBordEleve({ email, grade, onBack }) {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // URL de ton script mis à jour avec action=read
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx0TTakmyk02hazQFob7iSZ-pgfmZdUn-hUZm1RAq_cRFa_xQEaNT56pwB5vxD_35Q8/exec";

  const prenomEleve = email ? email.split('.')[0].toUpperCase().replace('.', ' ') : "ÉLÈVE";
  const dateDuJour = new Date().toLocaleDateString('fr-FR');

  const chargerDonnees = async () => {
    setLoading(true);
    try {
      // Nettoyage de l'email pour la requête
      const emailQuery = encodeURIComponent(email.trim().toLowerCase());
      const res = await fetch(`${WEB_APP_URL}?action=read&email=${emailQuery}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setHistorique(data);
      } else {
        setHistorique([]);
      }
    } catch (e) { 
      console.error("Erreur chargement élève:", e); 
      setHistorique([]);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { chargerDonnees(); }, [email]);

const stats = useMemo(() => {
  if (!historique || historique.length === 0) return null;

  const analyse = {
    recap: {}, 
    frequence: {},
    // Initialisation propre avec les noms EXACTS attendus
    groupes: { 
      "1er Groupe": { total: 0, count: 0 }, 
      "2e Groupe": { total: 0, count: 0 }, 
      "3e Groupe": { total: 0, count: 0 } 
    },
    temps: {}, 
    terminees: [], 
    arefaire: []
  };

  historique.forEach(h => {
    const score = parseInt(h.Score) || 0;
    const verbe = h.Verbe || "Inconnu";
    const temps = h.Temps || "Inconnu";
    
    // CORRECTION CRITIQUE : Nettoyage du nom du groupe reçu de Google
    // On transforme "1er groupe" ou "1ER GROUPE" en "1er Groupe"
    let grpBrut = h.Groupe ? h.Groupe.toString().trim() : "3e Groupe";
    let grpFinal = "3e Groupe"; // Valeur par défaut
    
    if (grpBrut.toLowerCase().includes("1")) grpFinal = "1er Groupe";
    else if (grpBrut.toLowerCase().includes("2")) grpFinal = "2e Groupe";
    else grpFinal = "3e Groupe";

    // 1. Fréquence des verbes
    analyse.frequence[verbe] = (analyse.frequence[verbe] || 0) + 1;

    // 2. Moyenne par groupe (Utilise maintenant grpFinal qui est propre)
    analyse.groupes[grpFinal].total += score;
    analyse.groupes[grpFinal].count += 1;

    // 3. Répartition par temps
    analyse.temps[temps] = (analyse.temps[temps] || 0) + 1;

    // 4. Meilleur score
    const key = `${verbe}-${temps}`;
    if (!analyse.recap[key] || score > analyse.recap[key].record) {
      analyse.recap[key] = { v: verbe, t: temps, g: grpFinal, record: score };
    }
  });

  // Séparation Maîtrise / À refaire
  Object.values(analyse.recap).forEach(item => {
    if (item.record === 6) analyse.terminees.push(item);
    else analyse.arefaire.push(item);
  });

  const top3 = Object.entries(analyse.frequence)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return { ...analyse, top3 };
}, [historique]);
  

  

   
  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="animate-spin text-blue-700" size={50}/>
      <p className="font-black text-slate-400 uppercase text-xs tracking-widest">Récupération de tes scores...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7F9] pb-20 font-sans">
      
      {/* HEADER OFFICIEL */}
      <div className="max-w-5xl mx-auto bg-white shadow-sm pt-16 pb-10 px-8 text-center border-t-[12px] border-blue-700 rounded-b-[60px]">
        <h1 className="text-6xl font-black text-blue-700 tracking-tighter mb-1 uppercase">École Ibn Batouta</h1>
        <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-sm mb-12 italic">Rapport de Suivi Pédagogique</p>

        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tight">{prenomEleve}</h2>
          <p className="text-blue-500 font-bold text-2xl italic">Niveau {grade}</p>
          <p className="text-slate-300 font-bold text-xs mt-6 uppercase tracking-widest text-center">Aujourd'hui, le {dateDuJour}</p>
        </div>
        <div className="mt-10 mx-auto w-32 h-[6px] bg-blue-700 rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto flex justify-between p-4 px-10 mt-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-700 transition-colors uppercase text-xs tracking-widest">
          <ArrowLeft size={18}/> Rejouer
        </button>
        <button onClick={chargerDonnees} className="p-2 text-slate-400 hover:text-blue-700 transition-all active:rotate-180">
          <RefreshCw size={22}/>
        </button>
      </div>

      {!stats ? (
        <div className="text-center py-40 text-slate-300 font-black uppercase italic text-2xl">Commence une mission pour voir tes stats !</div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          
          {/* TOP 3 VERBES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 bg-white p-10 rounded-[50px] shadow-sm border border-slate-100">
              <h3 className="font-black italic mb-8 text-orange-500 flex items-center gap-2 uppercase tracking-tight"><Flame size={24}/> Tes Verbes Favoris</h3>
              <div className="h-64">
                <Bar 
                  data={{
                    labels: stats.top3.map(v => v[0]),
                    datasets: [{ 
                        data: stats.top3.map(v => v[1]), 
                        backgroundColor: ['#FFD700', '#C0C0C0', '#CD7F32'], 
                        borderRadius: 15, 
                        barThickness: 45 
                    }]
                  }}
                  options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                />
              </div>
            </div>
            <div className="space-y-4">
                {stats.top3.map(([nom, fois], i) => (
                    <div key={i} className={`p-6 rounded-[35px] shadow-sm flex items-center justify-between border-l-[10px] ${i===0 ? 'bg-yellow-50 border-yellow-400' : i===1 ? 'bg-slate-50 border-slate-300' : 'bg-orange-50 border-orange-300'}`}>
                        <div className="flex items-center gap-4"><Trophy className="text-slate-400" size={32}/><span className="font-black uppercase italic text-xl">{nom}</span></div>
                        <span className="font-black text-sm bg-white/80 px-3 py-1 rounded-full">{fois}x</span>
                    </div>
                ))}
            </div>
          </div>

          {/* MOYENNES PAR GROUPE & RÉPARTITION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[50px] shadow-sm border border-slate-100">
              <h3 className="font-black italic mb-10 text-slate-800 uppercase flex items-center gap-2">
                <TrendingUp size={22} className="text-blue-700"/> Moyennes par Groupe
              </h3>
              <div className="h-72">
                <Bar 
                  data={{
                    labels: ["1er Groupe", "2e Groupe", "3e Groupe"],
                    datasets: [{ 
                      data: ["1er Groupe", "2e Groupe", "3e Groupe"].map(g => 
                        stats.groupes[g].count > 0 ? (stats.groupes[g].total / stats.groupes[g].count).toFixed(1) : 0
                      ), 
                      backgroundColor: ['#1D4ED8', '#16A34A', '#DC2626'],
                      borderRadius: 12,
                      barThickness: 50,
                    }]
                  }} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    plugins: { legend: { display: false } },
                    scales: { y: { max: 6, beginAtZero: true, grid: { display: false } } }
                  }} 
                />
              </div>
              <div className="flex justify-around mt-6 pt-4 border-t border-slate-50">
                  {["1er Groupe", "2e Groupe", "3e Groupe"].map((g, i) => (
                    <div key={g} className="text-center">
                      <p className={`text-2xl font-black ${i===0 ? 'text-blue-700' : i===1 ? 'text-green-700' : 'text-red-700'}`}>
                        {stats.groupes[g].count > 0 ? (stats.groupes[g].total / stats.groupes[g].count).toFixed(1) : "0"}/6
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{g}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[50px] shadow-sm border border-slate-100 flex flex-col items-center">
              <h3 className="font-black italic mb-6 text-pink-500 uppercase self-start flex items-center gap-2">
                <PieIcon size={22}/> Tes Temps Préférés
              </h3>
              <div className="h-64 w-full">
                <Pie data={{
                  labels: Object.keys(stats.temps),
                  datasets: [{ 
                    data: Object.values(stats.temps), 
                    backgroundColor: ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6'], 
                    borderWidth: 0 
                  }]
                }} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* MISSIONS RÉUSSIES */}
          <section className="bg-white p-10 rounded-[50px] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black uppercase italic text-slate-800 flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={30}/> Missions Maîtrisées
                </h3>
                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-black uppercase">{stats.terminees.length} terminées</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.terminees.map((m, i) => (
                <div key={i} className="bg-green-50/30 p-6 rounded-[35px] border-b-4 border-green-500 text-center">
                  <p className="font-black text-blue-900 uppercase italic truncate">{m.v}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{m.t}</p>
                  <div className="mt-2 text-green-600 font-black text-[9px] uppercase tracking-tighter italic">PARFAIT 6/6</div>
                </div>
              ))}
            </div>
          </section>

          {/* MISSIONS À REFAIRE */}
          <section className="bg-white p-10 rounded-[50px] shadow-sm border border-slate-100">
            <h3 className="text-2xl font-black uppercase italic text-slate-800 mb-8 flex items-center gap-3">
              <Target className="text-orange-500" size={30}/> Objectifs à Atteindre
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-slate-400 font-black uppercase text-[10px] border-b border-slate-100">
                  <tr><th className="pb-4">Verbe</th><th className="pb-4">Temps</th><th className="pb-4 text-center">Meilleur Score</th><th className="pb-4 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats.arefaire.map((m, i) => (
                    <tr key={i} className="group">
                      <td className="py-6 font-black text-blue-700 uppercase italic text-xl leading-none">{m.v}</td>
                      <td className="py-6 font-bold text-slate-400 text-xs uppercase italic">{m.t}</td>
                      <td className="py-6 text-center">
                        <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full font-black text-sm">{m.record} / 6</span>
                      </td>
                      <td className="py-6 text-right">
                        <button onClick={onBack} className="bg-slate-900 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase shadow-md hover:bg-blue-700 transition-all">S'ENTRAÎNER</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}