import React, { useState, useEffect } from "react";
import { BookOpen, Award, Loader2, ChevronLeft, X, ImageIcon, GraduationCap, AlertCircle, Edit3 } from "lucide-react";
import data from "./francais.json"; 
import imageIllustration from "./averon.png"; 

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7ozaPvt2WFlJdEff3TsjLp6csxdYdeRjL-XC7gU2J03KpEoaShue2dqy7Xokf9fHo/exec";
const SECRET_HASH = "MjIyMg=="; 

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function QuizOQREF() {
  const [etape, setEtape] = useState("login");
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [niveau, setNiveau] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [indexSection, setIndexSection] = useState(0);
  const [resultats, setResultats] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [ordresOptions, setOrdresOptions] = useState({});
  const [showTexte, setShowTexte] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const currentSection = data.sections[indexSection];
  const totalSections = data.sections.length;

  // Récupération dynamique des questions selon le type de section
  const getQuestions = (section) => {
    return section.questions_lecture || section.questions_choix_multiple || [];
  };

  const currentQuestions = getQuestions(currentSection);

  // Initialisation des réponses
  const [reponses, setReponses] = useState(() => {
    const init = {};
    data.sections.forEach((_, idx) => init[idx] = {});
    return init;
  });

  const [score, setScore] = useState({});

  const toutEstRepondu = Object.keys(reponses[indexSection] || {}).length === currentQuestions.length;

  useEffect(() => {
    if (etape === "quiz") {
      const nouvelOrdre = {};
      data.sections.forEach((section, idx) => {
        const qs = getQuestions(section);
        nouvelOrdre[idx] = qs.map(q => 
          shuffleArray(q.options.map((opt, optIdx) => ({ 
            opt, 
            letter: String.fromCharCode(97 + optIdx) // a, b, c, d
          })))
        );
      });
      setOrdresOptions(nouvelOrdre);
    }
  }, [etape]);

  const handleReponse = (sIdx, qId, letterSelectionnee) => {
    setReponses(prev => ({
      ...prev,
      [sIdx]: { ...prev[sIdx], [qId]: letterSelectionnee }
    }));
  };

  const terminerQuiz = async () => {
    const nouveauxScores = {};
    let totalPoints = 0;
    let totalMax = 0;

    const tousLesDomaines = data.sections.map((section, idx) => {
      const qs = getQuestions(section);
      let ptsSection = 0;
      
      qs.forEach((q) => {
        if (reponses[idx][q.id] === q.reponse_correcte) ptsSection++;
      });

      totalPoints += ptsSection;
      totalMax += qs.length;
      nouveauxScores[idx] = ptsSection;

      return {
        partie: section.partie,
        domaine: section.titre_du_texte || "Écriture",
        note: (ptsSection / qs.length) * 20,
        details: qs.map(q => (reponses[idx][q.id] === q.reponse_correcte ? 1 : 0))
      };
    });

    setScore({ ...nouveauxScores, total: totalPoints, max: totalMax });
    setResultats(true);
    setEnvoiEnCours(true);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, eleve: nom, niveau,
          date: new Date().toLocaleDateString(),
          matiere: "FRANÇAIS OQRE",
          groupage: true,
          domaines: tousLesDomaines
        }),
      });
    } catch (e) { console.error(e); } finally { setEnvoiEnCours(false); }
  };

  const isCodeCorrect = accessCode === window.atob(SECRET_HASH);

  // --- RENDU LOGIN ---
  if (etape === "login") {
    return (
      <div className="min-h-screen bg-[#0f172a] p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-2xl rounded-[48px] p-10 border border-white/20 text-center shadow-2xl">
          <div className="w-20 h-20 bg-indigo-600 rounded-[28px] mx-auto mb-6 flex items-center justify-center text-white"><GraduationCap size={40} /></div>
          <h1 className="text-2xl font-black text-white uppercase italic mb-6 leading-tight">{data.document_info.titre}</h1>
          <div className="space-y-4">
            <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom et Prénom" className="w-full p-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white outline-none font-bold text-center" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white outline-none font-bold text-center" />
            <select value={niveau} onChange={e => setNiveau(e.target.value)} className="w-full p-5 bg-[#1e293b] border-2 border-white/10 rounded-2xl text-white outline-none font-bold text-center appearance-none">
              <option value="">-- NIVEAU --</option>
              <option value="6E">6E ANNÉE</option>
            </select>
            <input type="password" value={accessCode} onChange={e => setAccessCode(e.target.value)} placeholder="Code" className="w-full p-5 bg-white/5 border-2 border-white/10 rounded-2xl text-white outline-none font-black text-center tracking-[0.6em]" />
            <button onClick={() => setEtape("quiz")} disabled={!nom || !email || !niveau || !isCodeCorrect} className="w-full py-5 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-10 uppercase transition-all">Commencer le Test</button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDU RÉSULTATS ---
  if (resultats) {
    return (
      <div className="min-h-screen bg-[#0f172a] p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-[60px] shadow-2xl w-full max-w-2xl text-center">
          <Award className="w-20 h-20 text-orange-500 mx-auto mb-4" />
          <h1 className="text-4xl font-black text-slate-900 uppercase italic">Test Terminé</h1>
          <p className="text-indigo-600 font-black mb-8 uppercase">{nom} | {data.document_info.niveau}</p>
          
          <div className="space-y-3 mb-8 text-left">
            {data.sections.map((section, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                <div className="max-w-[70%]">
                  <span className="text-[10px] font-black text-indigo-500 uppercase block">{section.partie}</span>
                  <span className="text-sm font-bold text-slate-700 uppercase truncate block">{section.titre_du_texte || "Écriture"}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-slate-900">
                    {Math.round((score[idx] / getQuestions(section).length) * 20)}
                  </span>
                  <span className="text-xs font-bold text-slate-400 ml-1">/ 20</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-600 text-white p-8 rounded-[40px] shadow-2xl mb-8 font-black">
            <p className="text-[10px] uppercase opacity-70 mb-1">Score Global</p>
            <div className="text-6xl italic">
              {score.total} <span className="text-xl opacity-50">/ {score.max}</span>
            </div>
          </div>

          <button onClick={() => window.location.reload()} className="text-indigo-600 font-black uppercase text-xs border-b-2 border-indigo-600">Quitter le test</button>
        </div>
      </div>
    );
  }

  // --- RENDU QUIZ ---
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="sticky top-6 z-40 bg-white/90 backdrop-blur-xl p-5 rounded-[32px] shadow-2xl border border-white flex justify-between items-center mb-10">
          <div className="flex gap-3">
            {currentSection.contenu_du_texte && (
                <button onClick={() => setShowTexte(true)} className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase">Lire le texte</button>
            )}
            <button onClick={() => setShowImage(true)} className="bg-orange-500 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase">Aide Visuelle</button>
          </div>
          <div className="text-right">
             <span className="text-indigo-600 font-black text-xs uppercase block">{data.document_info.session}</span>
             <span className="text-slate-400 font-black text-[9px] uppercase tracking-tighter">OQRE {data.document_info.niveau}</span>
          </div>
        </div>

        <div className="bg-white p-8 md:p-16 rounded-[64px] shadow-sm border border-slate-100">
          <div className="mb-16">
            <span className="text-indigo-500 font-black text-[11px] uppercase tracking-[0.4em] mb-4 block">{currentSection.partie}</span>
            <h2 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                {currentSection.titre_du_texte || "Épreuve d'écriture"}
            </h2>
          </div>

          {/* QUESTIONS À CHOIX MULTIPLE */}
          <div className="space-y-16">
            {currentQuestions.map((q, i) => {
              const optionsShuffled = ordresOptions[indexSection]?.[i] || [];
              const estRepondu = reponses[indexSection][q.id] !== undefined;

              return (
                <div key={q.id} className={`p-10 rounded-[48px] bg-white border-2 transition-all ${estRepondu ? 'border-indigo-100 shadow-lg' : 'border-slate-50 shadow-sm'}`}>
                  <div className="flex items-start gap-8 mb-10">
                    <span className={`w-16 h-16 shrink-0 rounded-3xl flex items-center justify-center font-black italic text-2xl border-2 ${estRepondu ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-50 text-slate-400 border-white'}`}>
                      {i + 1}
                    </span>
                    <p className="font-black text-3xl text-slate-800 leading-tight">{q.question}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-24">
                    {optionsShuffled.map((item, j) => (
                      <button key={j} onClick={() => handleReponse(indexSection, q.id, item.letter)}
                        className={`p-7 text-left rounded-[30px] border-4 transition-all font-bold text-lg ${
                          reponses[indexSection][q.id] === item.letter 
                          ? "bg-indigo-600 text-white border-indigo-200 shadow-xl scale-[1.02]" 
                          : "bg-slate-50 border-transparent text-slate-500 hover:border-slate-200 hover:bg-white"
                        }`}
                      >
                        <span className="mr-3 opacity-40 italic">{item.letter.toUpperCase()}.</span>
                        {item.opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* QUESTIONS OUVERTES OU TACHE DE REDACTION */}
            {(currentSection.questions_ouvertes || currentSection.tache_redaction) && (
                <div className="mt-10 p-10 bg-amber-50 rounded-[48px] border-2 border-amber-100">
                    <div className="flex items-center gap-4 mb-6 text-amber-700 font-black uppercase text-sm">
                        <Edit3 /> Écriture / Réflexion
                    </div>
                    {currentSection.tache_redaction && (
                        <p className="text-2xl font-bold text-slate-800 mb-6">{currentSection.tache_redaction.consigne}</p>
                    )}
                    {currentSection.questions_ouvertes?.map((qo) => (
                         <div key={qo.id} className="mb-8">
                            <p className="text-xl font-bold text-slate-700 mb-4">{qo.consigne}</p>
                            <textarea placeholder="Rédige ta réponse ici (sur ta feuille de test)..." className="w-full h-32 p-6 rounded-3xl border-2 border-amber-200 bg-white/50 outline-none focus:border-amber-500 transition-all font-medium text-lg italic" readOnly />
                         </div>
                    ))}
                </div>
            )}
          </div>

          {!toutEstRepondu && (
            <p className="mt-10 flex items-center justify-center gap-2 text-orange-600 font-black uppercase text-[11px] animate-pulse">
              <AlertCircle size={16} /> Réponds à tous les choix multiples pour continuer
            </p>
          )}

          <div className="mt-12 flex justify-between items-center bg-[#0f172a] -mx-8 -mb-8 md:-mx-16 md:-mb-16 p-12 rounded-b-[64px]">
            <button disabled={indexSection === 0} onClick={() => { setIndexSection(indexSection - 1); window.scrollTo(0,0); }} className="font-black text-xs uppercase text-slate-500 hover:text-white disabled:opacity-0">
              <ChevronLeft size={20} className="inline mr-2"/> Précédent
            </button>
            
            <button 
              disabled={!toutEstRepondu}
              onClick={indexSection < totalSections - 1 ? () => { setIndexSection(indexSection + 1); window.scrollTo(0,0); } : terminerQuiz}
              className={`px-14 py-6 rounded-3xl font-black text-xs uppercase text-white shadow-2xl transition-all disabled:opacity-20 ${indexSection < totalSections - 1 ? "bg-indigo-600 shadow-indigo-500/40" : "bg-orange-500 shadow-orange-500/40"}`}
            >
              {indexSection < totalSections - 1 ? "Suivant" : "Valider le Test"}
            </button>
          </div>
        </div>
      </div>
      
      <XModale show={showTexte} close={() => setShowTexte(false)} title="Texte de lecture" content={currentSection.contenu_du_texte || currentSection.contenu} icon={BookOpen} />
      <XModale show={showImage} close={() => setShowImage(false)} title="Illustration" content={<img src={imageIllustration} alt="Illustration" className="w-full rounded-2xl" />} icon={ImageIcon} />
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
        <div className="p-8 max-h-[70vh] overflow-y-auto text-xl leading-relaxed text-slate-700 italic whitespace-pre-line font-medium">{content}</div>
      </div>
    </div>
  );
};