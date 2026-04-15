import React, { useState, useEffect } from "react";
import { BookOpen, Award, Loader2, ChevronLeft, X, ImageIcon, GraduationCap, AlertCircle } from "lucide-react";
import data from "./francais1.json"; 


const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7ozaPvt2WFlJdEff3TsjLp6csxdYdeRjL-XC7gU2J03KpEoaShue2dqy7Xokf9fHo/exec";
const SECRET_HASH = "MjIyMg=="; 

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function QuizOQREF() {
  const [etape, setEtape] = useState("login");
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [niveau, setNiveau] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [partieActive, setPartieActive] = useState(1);
  const [resultats, setResultats] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [ordresOptions, setOrdresOptions] = useState({});
  const [showTexte, setShowTexte] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const themesKeys = Object.keys(data.themes); 
  const totalThemes = themesKeys.length;
  const currentThemeKey = themesKeys[partieActive - 1];

  const texteComplet = data.texte_integral 
    ? data.texte_integral.map(p => p.contenu.replaceAll('|', '\n')).join("\n\n") 
    : data.texte?.replaceAll('|', '\n');

  const [reponses, setReponses] = useState(() => {
    const init = {};
    themesKeys.forEach(key => init[key] = {});
    return init;
  });

  const [score, setScore] = useState({});

  // Vérification si toutes les questions de la partie en cours ont une réponse
  const nombreQuestionsPartie = data.themes[currentThemeKey].questions.length;
  const nombreReponsesDonnees = Object.keys(reponses[currentThemeKey] || {}).length;
  const toutEstRepondu = nombreReponsesDonnees === nombreQuestionsPartie;

  useEffect(() => {
    if (etape === "quiz") {
      const nouvelOrdre = {};
      themesKeys.forEach(key => {
        nouvelOrdre[key] = data.themes[key].questions.map(q => 
          shuffleArray(q.options.map((opt, idx) => ({ opt, idx })))
        );
      });
      setOrdresOptions(nouvelOrdre);
    }
  }, [etape]);

  const handleReponse = (themeKey, indexQuestion, valOriginale) => {
    setReponses(prev => ({
      ...prev,
      [themeKey]: { ...prev[themeKey], [indexQuestion]: valOriginale }
    }));
  };

  const envoyerResultatsGroupes = async (scoresFinaux) => {
    setEnvoiEnCours(true);
    const tousLesDomaines = themesKeys.map((key, index) => ({
       partie: data.themes[key].domaine, 
      domaine: key.replace('_', ' '),
      note: scoresFinaux[key] * 2,
      details: data.themes[key].questions.map((q, i) => (reponses[key][i] === q.r ? 1 : 0))
    }));

    const payload = {
      email, eleve: nom, niveau,
      date: new Date().toLocaleDateString(),
      matiere: data.matiere,
      groupage: true, 
      domaines: tousLesDomaines 
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error("Erreur transmission", e);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const terminerQuiz = () => {
    const nouveauxScores = {};
    themesKeys.forEach(key => {
      let pts = 0;
      data.themes[key].questions.forEach((q, i) => {
        if (reponses[key][i] === q.r) pts++;
      });
      nouveauxScores[key] = pts;
    });
    const finalScore = { ...nouveauxScores, total: Object.values(nouveauxScores).reduce((a, b) => a + b, 0) };
    setScore(finalScore);
    setResultats(true);
    envoyerResultatsGroupes(finalScore);
  };

  const isCodeCorrect = accessCode === window.atob(SECRET_HASH);

  if (etape === "login") {
    return (
      <div className="min-h-screen bg-[#0f172a] p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-2xl rounded-[48px] p-10 border border-white/20 text-center shadow-2xl">
          <div className="w-20 h-20 bg-indigo-600 rounded-[28px] mx-auto mb-6 flex items-center justify-center text-white"><GraduationCap size={40} /></div>
          <h1 className="text-3xl font-black text-white uppercase italic mb-6 tracking-tighter">{data.matiere}</h1>
          <div className="space-y-4">
            <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom et Prénom" className="w-full p-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white outline-none font-bold text-center" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white outline-none font-bold text-center" />
            <select value={niveau} onChange={e => setNiveau(e.target.value)} className="w-full p-5 bg-[#1e293b] border-2 border-white/10 rounded-2xl text-white outline-none font-bold text-center appearance-none">
              <option value="">-- CHOISIR NIVEAU --</option>
              <option value="4E">4E</option><option value="5E">5E</option><option value="6E">6E</option><option value="7E">7E</option><option value="8E">8E</option>
            </select>
            <input type="password" value={accessCode} onChange={e => setAccessCode(e.target.value)} placeholder="Code" className="w-full p-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white outline-none font-black text-center tracking-[0.6em]" />
            <button onClick={() => setEtape("quiz")} disabled={!nom || !email || !niveau || !isCodeCorrect} className="w-full py-5 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-10 uppercase transition-all">Lancer</button>
          </div>
        </div>
      </div>
    );
  }

  if (resultats) {
    return (
      <div className="min-h-screen bg-[#0f172a] p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 md:p-12 rounded-[60px] shadow-2xl w-full max-w-2xl text-center">
          <Award className="w-20 h-20 text-orange-500 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-black text-slate-900 uppercase italic">Résultats</h1>
          <p className="text-indigo-600 font-black mb-8 uppercase tracking-widest">{nom} | {niveau}</p>
          
          <div className="space-y-3 mb-8 text-left">
            {themesKeys.map((key, index) => (
              <div key={key} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                <div>
                  <span className="text-[10px] font-black text-indigo-500 uppercase block">Partie {index + 1}</span>
                  <span className="text-sm font-bold text-slate-700 uppercase">{data.themes[key].domaine}</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-slate-900">{score[key] * 2}</span>
                  <span className="text-xs font-bold text-slate-400 ml-1">/ {data.themes[key].questions.length * 2}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-600 text-white p-8 rounded-[40px] shadow-2xl mb-8 font-black">
            <p className="text-[10px] uppercase opacity-70 mb-1">Note Finale</p>
            <div className="text-6xl italic">
              {score.total * 2} <span className="text-xl opacity-50">/ {themesKeys.reduce((acc, k) => acc + data.themes[k].questions.length, 0) * 2}</span>
            </div>
          </div>

          {envoiEnCours ? (
              <div className="flex items-center justify-center gap-2 text-slate-400 font-black animate-pulse uppercase text-[10px]">
                <Loader2 size={14} className="animate-spin" /> Enregistrement...
              </div>
          ) : (
            <button onClick={() => window.location.reload()} className="text-indigo-600 font-black uppercase text-xs border-b-2 border-indigo-600">Quitter</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="sticky top-6 z-40 bg-white/90 backdrop-blur-xl p-5 rounded-[32px] shadow-2xl border border-white flex justify-between items-center mb-10">
          <div className="flex gap-3">
            <button onClick={() => setShowTexte(true)} className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase">Texte</button>
            <button onClick={() => setShowImage(true)} className="bg-orange-500 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase">Image</button>
          </div>
          <div className="text-right">
             <span className="text-indigo-600 font-black text-xs uppercase block">{nom}</span>
             <span className="text-slate-400 font-black text-[9px] uppercase tracking-tighter">{niveau}</span>
          </div>
        </div>

        <div className="bg-white p-8 md:p-16 rounded-[64px] shadow-sm border border-slate-100">
          <div className="mb-16">
            <span className="text-indigo-500 font-black text-[11px] uppercase tracking-[0.4em] mb-4 block">Partie {partieActive} / {totalThemes}</span>
            <h2 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{data.themes[currentThemeKey].domaine}</h2>
          </div>

          <div className="space-y-16">
            {data.themes[currentThemeKey].questions.map((q, i) => {
              const options = ordresOptions[currentThemeKey]?.[i] || [];
              const estRepondu = reponses[currentThemeKey][i] !== undefined;

              return (
                <div key={i} className={`p-10 rounded-[48px] bg-white border-2 transition-all ${estRepondu ? 'border-indigo-100 shadow-lg' : 'border-slate-50 shadow-sm'}`}>
                  <div className="flex items-start gap-8 mb-10">
                    <span className={`w-16 h-16 shrink-0 rounded-3xl flex items-center justify-center font-black italic text-2xl border-2 ${estRepondu ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-50 text-slate-400 border-white'}`}>
                      {i + 1}
                    </span>
                    <p className="font-black text-3xl text-slate-800 leading-tight">{q.q}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-24">
                    {options.map((item, j) => (
                      <button key={j} onClick={() => handleReponse(currentThemeKey, i, item.idx)}
                        className={`p-7 text-left rounded-[30px] border-4 transition-all font-bold text-lg ${
                          reponses[currentThemeKey][i] === item.idx 
                          ? "bg-indigo-600 text-white border-indigo-200 shadow-xl scale-[1.02]" 
                          : "bg-slate-50 border-transparent text-slate-500 hover:border-slate-200 hover:bg-white"
                        }`}
                      >{item.opt}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* MESSAGE DE VALIDATION */}
          {!toutEstRepondu && (
            <p className="mt-10 flex items-center justify-center gap-2 text-orange-600 font-black uppercase text-[11px] animate-pulse">
              <AlertCircle size={16} /> Réponds à toutes les questions pour continuer
            </p>
          )}

          <div className="mt-12 flex justify-between items-center bg-[#0f172a] -mx-8 -mb-8 md:-mx-16 md:-mb-16 p-12 rounded-b-[64px]">
            <button disabled={partieActive === 1} onClick={() => { setPartieActive(partieActive - 1); window.scrollTo(0,0); }} className="font-black text-xs uppercase text-slate-500 hover:text-white disabled:opacity-0">
              <ChevronLeft size={20} className="inline mr-2"/> Précédent
            </button>
            
            <button 
              disabled={!toutEstRepondu}
              onClick={partieActive < totalThemes ? () => { setPartieActive(partieActive + 1); window.scrollTo(0,0); } : terminerQuiz}
              className={`px-14 py-6 rounded-3xl font-black text-xs uppercase text-white shadow-2xl transition-all disabled:opacity-20 disabled:grayscale ${partieActive < totalThemes ? "bg-indigo-600 shadow-indigo-500/40" : "bg-orange-500 shadow-orange-500/40"}`}
            >
              {partieActive < totalThemes ? "Suivant" : "Valider le Quiz"}
            </button>
          </div>
        </div>
      </div>
      
      <XModale show={showTexte} close={() => setShowTexte(false)} title="Texte" content={texteComplet} icon={BookOpen} />
           
{/* Modale pour l'image */}
<XModale 
  show={showImage} 
  close={() => setShowImage(false)} 
  title="Image" 
  content={<img src={data.image_illustration} alt="Illustration" className="w-full rounded-2xl" />} 
  icon={ImageIcon} 
/>
    </div>
  );
}

const XModale = ({ show, close, title, content, icon: Icon }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden border-4 border-indigo-100">
        <div className="flex justify-between items-center p-6 bg-slate-50 border-b">
          <div className="flex items-center gap-3 text-indigo-600 font-black uppercase"><Icon size={24} />{title}</div>
          <button onClick={close} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X size={24} /></button>
        </div>
        <div className="p-8 max-h-[70vh] overflow-y-auto text-2xl leading-relaxed text-slate-700 italic whitespace-pre-line font-medium">{content}</div>
      </div>
    </div>
  );
};