import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, XCircle, ChevronRight, Trophy, UserCircle2, 
  Sparkles, Languages, BookOpen, Target, ArrowLeft, Loader2,
  Search, Grid2X2
} from 'lucide-react';

// LISTE DE TOUTES VOS MISSIONS (Ajoute tes 50 fichiers ici au fur et à mesure)
// LISTE DE TOUTES VOS MISSIONS ORGANISÉE PAR PAGES
const ALL_MISSIONS = [
  { id: "p12_13", module: 2, title: { fr: "Le Million", en: "The Million" }, pages: "12-13" },
  { id: "p14_15", module: 2, title: { fr: "Grands Nombres", en: "Large Numbers" }, pages: "14-15" },
  { id: "p16_17", module: 2, title: { fr: "Comparer les Nombres", en: "Comparing Numbers" }, pages: "16-17" },
  { id: "p18_19", module: 2, title: { fr: "Les Multiples", en: "Multiples" }, pages: "18-19" },
  
  // Sections suivantes (à compléter avec vos prochaines photos)
  { id: "p20_21", module: 3, title: { fr: "Facteurs et Divisibilité", en: "Factors and Divisibility" }, pages: "20-21" },
  { id: "p22_23", module: 3, title: { fr: "Nombres Premiers et Composés", en: "Prime and Composite Numbers" }, pages: "22-23" },
  { id: "p24_25", module: 3, title: { fr: "La Puissance et les Exposants", en: "Power and Exponents" }, pages: "24-25" },

  // Section des nombres décimaux
  { id: "p46_47", module: 4, title: { fr: "Nombres décimaux et millièmes", en: "Decimal Numbers and Thousandths" }, pages: "46-47" },
  { id: "p48_49", module: 4, title: { fr: "Comparer et ordonner les décimaux", en: "Comparing and Ordering Decimals" }, pages: "48-49" },
  { id: "p50_51", module: 4, title: { fr: "Arrondir les nombres décimaux", en: "Rounding Decimal Numbers" }, pages: "50-51" },
   { id: "p52_53", module: 4, title: { fr: "Estimation de sommes et différences", en: "Estimating Sums and Differences" }, pages: "52-53" },
  { id: "p54_55", module: 4, title: { fr: "Addition et soustraction de décimaux", en: "Adding and Subtracting Decimals" }, pages: "54-55" }
];

const uiTranslations = {
  fr: {
    teacherName: "Professeur Chenelière", welcome: "Quelle page allons-nous faire ?",
    search: "Chercher un numéro de page ou un titre...",
    score: "Réussites", errors: "Erreurs", check: "VÉRIFIER", continue: "CONTINUER",
    page: "Page", ex: "Exercice", explanation: "L'explication du prof :",
    finished: "Félicitations !", loading: "Chargement...", back: "Menu principal"
  },
  en: {
    teacherName: "Professor Cheneliere", welcome: "Which page shall we do today?",
    search: "Search page number or title...",
    score: "Success", errors: "Mistakes", check: "CHECK", continue: "CONTINUE",
    page: "Page", ex: "Exercise", explanation: "Teacher's explanation:",
    finished: "Well done!", loading: "Loading...", back: "Main Menu"
  }
};

const MathExerciseApp = () => {
  const [lang, setLang] = useState('fr');
  const [currentMission, setCurrentMission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  
  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState("");

  const t = uiTranslations[lang];

  // LOGIQUE DE FILTRE POUR LA RECHERCHE
  const filteredMissions = useMemo(() => {
    return ALL_MISSIONS.filter(m => 
      m.pages.includes(searchTerm) || 
      m.title.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.title.en.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const loadMission = async (fileName) => {
    setLoading(true);
    try {
      const module = await import(`./data/${fileName}.json`);
      setCurrentMission(module.default);
      setCurrentIndex(0); setScore(0); setErrors(0);
      setUserInput(''); setFeedback(null); setHasAnswered(false);
    } catch (e) {
      alert("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const getTxt = (field) => field?.[lang] || field?.['fr'] || field || "";

  // --- ECRAN MENU (DESIGN COMPACT POUR 50+ JSON) ---
  if (!currentMission && !loading) {
    return (
      <div className="max-w-5xl mx-auto my-6 px-4 animate-in fade-in duration-700">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-indigo-100">
          
          {/* HEADER MENU */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8 text-white text-center relative">
            <div className="absolute top-4 right-4">
               <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition-all">
                <Languages size={16}/> {lang.toUpperCase()}
               </button>
            </div>
            <div className="inline-block p-3 bg-white text-indigo-600 rounded-2xl mb-4 shadow-lg animate-bounce-slow">
              <UserCircle2 size={48} />
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase">{t.teacherName}</h1>
            <p className="text-indigo-100 mt-2 font-medium italic">{t.welcome}</p>
          </div>

          <div className="p-6 bg-indigo-50/50">
            {/* BARRE DE RECHERCHE */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
              <input 
                type="text" 
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none shadow-sm font-medium transition-all"
              />
            </div>

            {/* GRILLE D'EXERCICES AVEC SCROLL INTERNE */}
            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMissions.map((mission) => (
                  <button 
                    key={mission.id}
                    onClick={() => loadMission(mission.id)}
                    className="bg-white p-5 rounded-2xl border-2 border-transparent hover:border-indigo-400 hover:shadow-xl transition-all group text-left relative"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded-md tracking-tighter">
                        PAGE {mission.pages}
                      </span>
                      <span className="text-indigo-200 group-hover:text-indigo-400 transition-colors">
                        <Grid2X2 size={16} />
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 group-hover:text-indigo-700 transition-colors leading-tight">
                      {getTxt(mission.title)}
                    </h3>
                  </button>
                ))}
              </div>
              {filteredMissions.length === 0 && (
                <div className="text-center py-10 text-gray-400 font-bold italic">Aucun résultat trouvé...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ECRAN CHARGEMENT ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-indigo-600">
        <Loader2 className="animate-spin mb-4" size={64} />
        <p className="font-black uppercase tracking-widest animate-pulse">{t.loading}</p>
      </div>
    );
  }

  // --- ECRAN EXERCICE (Identique à ton design) ---
  const currentEx = currentMission.exercices[currentIndex];

  return (
    <div className="max-w-4xl mx-auto my-8 font-sans antialiased px-4">
      {/* BARRE DE STATUT */}
      <div className="bg-white rounded-3xl shadow-xl border-b-4 border-indigo-200 overflow-hidden mb-6 transition-all">
        <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 p-4 sm:p-6 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentMission(null)} className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-all">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none uppercase">{t.teacherName}</h1>
              <p className="text-indigo-100 text-xs mt-1 font-medium italic opacity-90">{getTxt(currentMission.titre)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/20 transition-all font-bold">
              <Languages size={18} /> <span className="text-sm uppercase">{lang}</span>
            </button>
            <div className="flex bg-black/10 rounded-2xl p-1 border border-white/10 font-black text-sm">
              <div className="px-3 py-1 bg-green-500/80 rounded-xl">{score}</div>
              <div className="px-3 py-1 bg-red-500/80 rounded-xl ml-1">{errors}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE EXERCICE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 shadow-xl border-2 border-indigo-50 relative">
          <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-xs font-black uppercase mb-6 inline-block tracking-widest">
            {t.page} {currentEx.page} • {t.ex} {currentEx.exercice_num}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight mb-10">{getTxt(currentEx.consigne)}</h2>
          
          <select disabled={hasAnswered} value={userInput} onChange={(e) => setUserInput(e.target.value)}
            className={`w-full p-5 text-lg font-bold rounded-2xl border-4 outline-none transition-all appearance-none cursor-pointer mb-6 ${hasAnswered ? (userInput === getTxt(currentEx.reponse_attendue) ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50') : 'border-indigo-100 bg-gray-50'}`}>
            <option value="" disabled>Choisis ta réponse...</option>
            {currentEx.options.map((opt, idx) => (
              <option key={idx} value={getTxt(opt)}>{getTxt(opt)}</option>
            ))}
          </select>

          {!hasAnswered ? (
            <button onClick={() => {
              if(!userInput) return;
              if(userInput === getTxt(currentEx.reponse_attendue)) setScore(s => s+1); else setErrors(e => e+1);
              setHasAnswered(true);
            }} className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl shadow-xl transition-all uppercase">{t.check}</button>
          ) : (
            <button onClick={() => {
              if (currentIndex < currentMission.exercices.length - 1) {
                setCurrentIndex(currentIndex + 1); setUserInput(''); setHasAnswered(false);
              } else {
                alert(t.finished); setCurrentMission(null);
              }
            }} className="w-full py-5 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-xl shadow-xl transition-all uppercase flex items-center justify-center gap-3">
              {t.continue} <ChevronRight size={28} />
            </button>
          )}
        </div>

        {/* AIDE DU PROF */}
        <div className="lg:col-span-4 h-full">
           <div className={`p-6 rounded-3xl border-2 shadow-xl h-full transition-all duration-700 ${hasAnswered ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-transparent opacity-40'}`}>
              <h3 className="font-black text-indigo-900 uppercase text-xs mb-4 flex items-center gap-2"><Sparkles size={18} className="text-amber-500" /> {t.explanation}</h3>
              {hasAnswered ? <p className="text-gray-700 italic text-lg leading-relaxed">"{getTxt(currentEx.aide)}"</p> : <div className="flex flex-col items-center justify-center h-48"><Target size={48} className="text-indigo-200 animate-pulse"/></div>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MathExerciseApp;