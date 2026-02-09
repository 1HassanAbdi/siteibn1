import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, XCircle, ChevronRight, Trophy, UserCircle2, 
  Sparkles, Languages, BookOpen, Target, ArrowLeft, Loader2,
  Search, Grid2X2, Zap
} from 'lucide-react';

// LISTE DE TOUTES VOS MISSIONS
const ALL_MISSIONS = [
  { id: "p10_11", module: 1, title: { fr: "À la découverte des nombres entiers", en: "Discovering Integers" }, pages: "10-11" },
  { id: "p12_13", module: 2, title: { fr: "Le Million", en: "The Million" }, pages: "12-13" },
  { id: "p14_15", module: 2, title: { fr: "Grands Nombres", en: "Large Numbers" }, pages: "14-15" },
  { id: "p16_17", module: 2, title: { fr: "Comparer les Nombres", en: "Comparing Numbers" }, pages: "16-17" },
  { id: "p18_19", module: 2, title: { fr: "Les Multiples", en: "Multiples" }, pages: "18-19" },
  { id: "p20_21", module: 2, title: { fr: "Nombres premiers et composés", en: "Prime and Composite Numbers" }, pages: "20-21" },
  { id: "p22_23", module: 2, title: { fr: "Utiliser le calcul mental", en: "Using Mental Math" }, pages: "22-23" },
  { id: "p24_25", module: 2, title: { fr: "La priorité des opérations", en: "Order of Operations" }, pages: "24-25" },
  { id: "p46_47", module: 4, title: { fr: "Nombres décimaux et millièmes", en: "Decimal Numbers and Thousandths" }, pages: "46-47" },
  { id: "p48_49", module: 4, title: { fr: "Comparer et ordonner les décimaux", en: "Comparing and Ordering Decimals" }, pages: "48-49" },
  { id: "p50_51", module: 4, title: { fr: "Arrondir les nombres décimaux", en: "Rounding Decimal Numbers" }, pages: "50-51" },
  { id: "p52_53", module: 4, title: { fr: "Estimation de sommes et différences", en: "Estimating Sums and Differences" }, pages: "52-53" },
  { id: "p54_55", module: 4, title: { fr: "Addition et soustraction de décimaux", en: "Adding and Subtracting Decimals" }, pages: "54-55" }
];

const uiTranslations = {
  fr: {
    teacherName: "Professeur Chenelière", welcome: "Quelle page allons-nous faire ?",
    search: "Cherche une page ou un titre...",
    score: "Réussites", errors: "Erreurs", check: "VÉRIFIER", continue: "CONTINUER",
    page: "Page", ex: "Exercice", explanation: "L'explication du prof :",
    finished: "Félicitations !", loading: "Chargement...", back: "Menu"
  },
  en: {
    teacherName: "Professor Cheneliere", welcome: "Which page shall we do today?",
    search: "Search page or title...",
    score: "Success", errors: "Mistakes", check: "CHECK", continue: "CONTINUE",
    page: "Page", ex: "Exercise", explanation: "Teacher's explanation:",
    finished: "Well done!", loading: "Loading...", back: "Menu"
  }
};

const MathExerciseApp = () => {
  const [lang, setLang] = useState('fr');
  const [currentMission, setCurrentMission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const brandGreen = "#108565";
  const brandOrange = "#F59E0B";
  const t = uiTranslations[lang];

  const filteredMissions = useMemo(() => {
    return ALL_MISSIONS.filter(m => 
      m.pages.includes(searchTerm) || 
      m.title.fr.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const loadMission = async (fileName) => {
    setLoading(true);
    try {
      const module = await import(`./data/${fileName}.json`);
      setCurrentMission(module.default);
      setCurrentIndex(0); setScore(0); setErrors(0);
      setUserInput(''); setHasAnswered(false);
    } catch (e) {
      alert("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const getTxt = (field) => field?.[lang] || field?.['fr'] || field || "";

  // --- ECRAN MENU ---
  if (!currentMission && !loading) {
    return (
      <div className="max-w-5xl mx-auto my-6 px-4 animate-in fade-in duration-700">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-slate-100">
          
          <div style={{ backgroundColor: brandGreen }} className="p-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-4 right-4">
               <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full font-black text-xs flex items-center gap-2 transition-all">
                <Languages size={16}/> {lang.toUpperCase()}
               </button>
            </div>
            <div className="relative z-10">
                <div className="inline-block p-4 bg-white rounded-3xl mb-4 shadow-xl rotate-3">
                    <UserCircle2 size={48} style={{ color: brandGreen }} />
                </div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">{t.teacherName}</h1>
                <p className="text-white/80 mt-2 font-bold uppercase tracking-widest text-xs">{t.welcome}</p>
            </div>
            <Zap className="absolute bottom-[-20px] left-[-20px] text-white/5 w-48 h-48 -rotate-12" />
          </div>

          <div className="p-8 bg-slate-50">
            <div className="relative max-w-md mx-auto mb-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-4 border-slate-200 focus:border-green-600 outline-none shadow-sm font-black transition-all"
              />
            </div>

            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMissions.map((mission) => (
                  <button 
                    key={mission.id}
                    onClick={() => loadMission(mission.id)}
                    className="bg-white p-6 rounded-[30px] border-4 border-transparent hover:border-orange-400 hover:shadow-2xl transition-all group text-left relative"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span style={{ backgroundColor: brandGreen }} className="text-white text-[10px] font-black px-3 py-1 rounded-lg tracking-widest">
                        PAGE {mission.pages}
                      </span>
                      <Grid2X2 className="text-slate-200 group-hover:text-orange-400 transition-colors" size={20} />
                    </div>
                    <h3 className="font-black text-slate-900 group-hover:text-green-800 transition-colors leading-tight text-lg uppercase italic">
                      {getTxt(mission.title)}
                    </h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin mb-4" size={64} style={{ color: brandGreen }} />
      <p className="font-black uppercase tracking-widest animate-pulse" style={{ color: brandGreen }}>{t.loading}</p>
    </div>
  );

  // --- ECRAN EXERCICE ---
  const currentEx = currentMission.exercices[currentIndex];

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER EXERCICE */}
      <div className="bg-white rounded-[35px] shadow-xl border-b-8 border-slate-200 overflow-hidden mb-8">
        <div style={{ backgroundColor: brandGreen }} className="p-6 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentMission(null)} className="bg-black/20 p-3 rounded-2xl hover:bg-black/40 transition-all shadow-inner">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">{t.teacherName}</h1>
              <p className="text-white/70 text-[10px] mt-1 font-black uppercase tracking-widest">{getTxt(currentMission.titre)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-black/20 p-2 rounded-2xl border border-white/10">
            <div className="flex font-black text-sm">
              <div className="px-4 py-1 bg-green-500 rounded-xl shadow-lg border-b-4 border-green-700">{score}</div>
              <div className="px-4 py-1 bg-red-500 rounded-xl ml-2 shadow-lg border-b-4 border-red-700">{errors}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CARTE QUESTION */}
        <div className="lg:col-span-8 bg-white rounded-[40px] p-10 shadow-2xl border-4 border-white relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <span style={{ color: brandGreen }} className="bg-green-50 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-green-100">
              {t.page} {currentEx.page} • {t.ex} {currentEx.exercice_num}
            </span>
          </div>

          <h2 className="text-3xl font-black text-slate-900 leading-tight mb-12 italic">
            {getTxt(currentEx.consigne)}
          </h2>
          
          <div className="relative mb-8">
            <select 
              disabled={hasAnswered} 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)}
              className={`w-full p-6 text-xl font-black rounded-[25px] border-4 outline-none transition-all appearance-none cursor-pointer ${
                hasAnswered 
                ? (userInput === getTxt(currentEx.reponse_attendue) ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700') 
                : 'border-slate-100 bg-slate-50 text-slate-900 focus:border-green-600'
              }`}
            >
              <option value="" disabled>Choisis ta réponse...</option>
              {currentEx.options.map((opt, idx) => (
                <option key={idx} value={getTxt(opt)}>{getTxt(opt)}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                <ChevronRight size={30} className="rotate-90" />
            </div>
          </div>

          {!hasAnswered ? (
            <button 
              disabled={!userInput}
              onClick={() => {
                if(userInput === getTxt(currentEx.reponse_attendue)) setScore(s => s+1); else setErrors(e => e+1);
                setHasAnswered(true);
              }} 
              style={{ backgroundColor: brandGreen }}
              className="w-full py-6 rounded-[25px] text-white font-black text-2xl shadow-xl hover:brightness-110 transition-all uppercase italic border-b-8 border-black/20 disabled:opacity-50"
            >
              {t.check}
            </button>
          ) : (
            <button 
              onClick={() => {
                if (currentIndex < currentMission.exercices.length - 1) {
                  setCurrentIndex(currentIndex + 1); setUserInput(''); setHasAnswered(false);
                } else {
                  alert(t.finished); setCurrentMission(null);
                }
              }} 
              style={{ backgroundColor: brandOrange }}
              className="w-full py-6 rounded-[25px] text-white font-black text-2xl shadow-xl hover:brightness-110 transition-all uppercase italic border-b-8 border-black/20 flex items-center justify-center gap-3"
            >
              {t.continue} <ChevronRight size={32} />
            </button>
          )}
        </div>

        {/* AI HELPER / PROF */}
        <div className="lg:col-span-4 h-full">
           <div 
             className={`p-8 rounded-[40px] shadow-2xl border-4 h-full transition-all duration-700 relative overflow-hidden ${
               hasAnswered ? 'bg-white border-green-600' : 'bg-slate-100 border-transparent opacity-50'
             }`}
           >
              <h3 className="font-black uppercase text-xs mb-6 flex items-center gap-2" style={{ color: brandGreen }}>
                <Sparkles size={20} style={{ color: brandOrange }} /> {t.explanation}
              </h3>
              
              {hasAnswered ? (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <p className="text-slate-900 font-bold italic text-xl leading-relaxed">
                        "{getTxt(currentEx.aide)}"
                    </p>
                    <div className="mt-8 flex justify-end">
                        <Trophy size={40} className="text-slate-100" />
                    </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48">
                    <Target size={60} className="text-slate-300 animate-pulse"/>
                    <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">En attente...</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MathExerciseApp;