import React, { useState } from 'react';
import { 
  ChevronLeft, GraduationCap, Sparkles, Zap, Target, 
  CheckCircle2, PenTool, Trophy, Lightbulb, Users, 
  ShieldCheck, LayoutGrid, Globe, Heart
} from 'lucide-react';

import ParentPlan from './parent';
import MathExerciseApp from './ex';
import planData from './data/plan_oqre.json';

const App = () => {
  const [view, setView] = useState('home');
  const [lang, setLang] = useState('fr');

  const brandGreen = "#108565"; 
  const brandOrange = "#F59E0B";

  const content = {
    fr: {
      badge: "100% Aligné au Curriculum de l'Ontario 2026",
      subtitle: "Réussite OQRE Programmée",
      curriculumTitle: "Structure du Programme Officiel de l'Ontario",
      domains: [
        { n: "Nombres", d: "Sens du nombre" },
        { n: "Algèbre", d: "Codage & Suites" },
        { n: "Données", d: "Probabilités" },
        { n: "Espace", d: "Géométrie" },
        { n: "Littératie", d: "Finances" }
      ],
      parentTitle: "Parent",
      parentAction: "Rôle du Parent : Coach & Guide",
      parentDesc: "Encouragez votre enfant, vérifiez les exercices faits et la note du Devoir du Jeudi.",
      parentBtn: "Ouvrir le suivi conseil",
      studentTitle: "Élève",
      studentAction: "Action Élève : Apprendre & Gagner",
      studentDesc: "Cliquez ici pour valider tes exercices du livre et t'entraîner pour l'OQRE.",
      studentBtn: "Lancer ma mission",
      assuranceTitle: "Zéro Doute.",
      assuranceHighlight: "Le succès se prépare.",
      assuranceText: "Parents, votre soutien positif est la clé. En vérifiant le travail et en encourageant l'effort, vous garantissez sa progression.",
      strategy: "Méthode : Exercices livre + Validation App + IXL",
      guideTitle: "Mission Conseil Parent",
      guideList: [
        "Vérifier si les exercices du jour sont faits",
        "Vérifier la note du Devoir du Jeudi",
        "Donner un conseil positif pour encourager l'effort"
      ],
      studentRuleTitle: "Le Secret de la Progression",
      studentRuleText: "Sois fier de tes erreurs, elles t'apprennent ! Écris précisément où tu bloques pour ton prof.",
      back: "Retour",
      headerParent: "Conseils & Suivi Parent",
      headerStudent: "Zone d'Apprentissage"
    },
    en: {
      badge: "100% Aligned with Ontario Curriculum 2026",
      subtitle: "EQAO Success Programmed",
      curriculumTitle: "Official Ontario Curriculum Structure",
      domains: [
        { n: "Number", d: "Number Sense" },
        { n: "Algebra", d: "Coding & Patterns" },
        { n: "Data", d: "Probability" },
        { n: "Spatial", d: "Geometry" },
        { n: "Literacy", d: "Financial" }
      ],
      parentTitle: "Parent",
      parentAction: "Parent Role: Coach & Guide",
      parentDesc: "Encourage your child, check completed exercises and Thursday's Math grade.",
      parentBtn: "Open Coaching Dashboard",
      studentTitle: "Student",
      studentAction: "Student Action: Learn & Win",
      studentDesc: "Click here to validate your workbook exercises and practice for EQAO.",
      studentBtn: "Start My Mission",
      assuranceTitle: "Zero Doubt.",
      assuranceHighlight: "Success is prepared.",
      assuranceText: "Parents, your positive support is key. By checking work and encouraging effort, you guarantee their progress.",
      strategy: "Method: Workbook + App + IXL",
      guideTitle: "Parent Coaching Mission",
      guideList: [
        "Check if daily exercises are completed",
        "Check Thursday's Math homework grade",
        "Give positive feedback to encourage effort"
      ],
      studentRuleTitle: "The Secret to Progress",
      studentRuleText: "Be proud of mistakes, they help you learn! Write exactly where you are stuck for your teacher.",
      back: "Back",
      headerParent: "Parent Coaching & Tracking",
      headerStudent: "Learning Zone"
    }
  };

  const t = content[lang];

  if (view === 'home') {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center p-4 md:p-10 font-sans pb-24 text-white">
        
        {/* LANGUE */}
        <div className="w-full max-w-6xl flex justify-end mb-4">
          <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/20 transition-all">
            <Globe size={18} className="text-orange-400" />
            <span className="font-black text-xs uppercase tracking-widest">{lang === 'fr' ? 'English' : 'Français'}</span>
          </button>
        </div>

        {/* CERTIFICATION */}
        <div className="bg-green-500/10 border border-green-500/30 px-6 py-2 rounded-full mb-8 animate-pulse">
          <p className="text-green-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <ShieldCheck size={14} /> {t.badge}
          </p>
        </div>

        {/* TITRE */}
        <div className="text-center mb-12 animate-in fade-in zoom-in duration-700">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">
            Success<span style={{ color: brandGreen }}>Math</span>
          </h1>
          <div className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-full mt-6 inline-block border border-white/20">
            <p className="text-orange-400 font-black uppercase tracking-[0.5em] text-sm">{t.subtitle}</p>
          </div>
        </div>

        {/* DOMAINES */}
        <div className="w-full max-w-6xl mb-16">
          <h3 className="text-center text-slate-500 font-black uppercase text-xs tracking-[0.3em] mb-8 italic">{t.curriculumTitle}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {t.domains.map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[30px] group">
                <p style={{ color: brandGreen }} className="text-xl font-black uppercase italic group-hover:scale-110 transition-transform">{item.n}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{item.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BOUTONS ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl mb-16">
          <div className="relative group">
            <div className="absolute -top-4 left-10 bg-green-600 text-white text-[10px] font-black px-4 py-1 rounded-full z-10 shadow-xl uppercase italic tracking-widest">
              {t.parentAction}
            </div>
            <button onClick={() => setView('plan')} className="w-full bg-white p-12 rounded-[60px] shadow-2xl transition-all hover:scale-[1.02] text-left border-b-[10px] border-green-700">
              <div className="flex items-center gap-4 mb-4">
                <div style={{ backgroundColor: brandGreen }} className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"><Heart size={30} fill="white" /></div>
                <h2 className="text-4xl font-black text-slate-900 uppercase italic">{t.parentTitle}</h2>
              </div>
              <p className="text-slate-600 text-xl font-bold italic leading-tight">{t.parentDesc}</p>
              <div className="mt-6 flex items-center gap-2 text-green-700 font-black text-xs uppercase underline decoration-2"><Target size={16} /> {t.parentBtn}</div>
            </button>
          </div>

          <div className="relative group">
            <div className="absolute -top-4 left-10 bg-orange-600 text-white text-[10px] font-black px-4 py-1 rounded-full z-10 shadow-xl uppercase italic tracking-widest">
              {t.studentAction}
            </div>
            <button onClick={() => setView('practice')} style={{ backgroundColor: brandOrange }} className="w-full p-12 rounded-[60px] shadow-2xl transition-all hover:scale-[1.02] text-left border-b-[10px] border-orange-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-orange-500 shadow-lg"><Zap size={30} /></div>
                <h2 className="text-4xl font-black text-white uppercase italic">{t.studentTitle}</h2>
              </div>
              <p className="text-white text-xl font-bold italic leading-tight">{t.studentDesc}</p>
              <div className="mt-6 flex items-center gap-2 text-white font-black text-xs uppercase underline decoration-2"><Sparkles size={16} /> {t.studentBtn}</div>
            </button>
          </div>
        </div>

        {/* COACHING & RASSURANCE */}
        <div className="w-full max-w-6xl bg-white rounded-[60px] p-10 md:p-16 mb-8 text-slate-900 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-6xl font-black leading-none uppercase italic">
                {t.assuranceTitle}<br/><span style={{ color: brandOrange }}>{t.assuranceHighlight}</span>
              </h2>
              <p className="text-slate-600 text-lg font-bold leading-relaxed">{t.assuranceText}</p>
              <div className="flex items-center gap-4 p-5 bg-slate-100 rounded-3xl border-l-8 border-green-600">
                <LayoutGrid className="text-green-700" size={32} />
                <p className="text-xs font-black uppercase italic text-slate-700 leading-tight">{t.strategy}</p>
              </div>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-1 gap-4">
               <div className="bg-green-50 p-8 rounded-[40px] border-2 border-green-100 relative">
                  <h4 className="text-green-800 font-black uppercase text-xs mb-4 flex items-center gap-2"><Heart size={16} /> {t.guideTitle}</h4>
                  <ul className="text-slate-700 text-sm font-bold space-y-3">
                    {t.guideList.map((item, idx) => <li key={idx} className="flex items-start gap-2">✅ <span>{item}</span></li>)}
                  </ul>
               </div>
               <div className="bg-[#0F172A] p-8 rounded-[40px] border-2 border-orange-500">
                  <h4 className="text-orange-400 font-black uppercase text-xs mb-4 flex items-center gap-2"><Lightbulb size={16} /> {t.studentRuleTitle}</h4>
                  <p className="text-white text-md font-black uppercase italic leading-tight">{t.studentRuleText}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <header className="bg-white p-5 sticky top-0 z-50 shadow-2xl flex items-center justify-between">
          <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase">
            <ChevronLeft size={24} className="text-orange-500" /> {t.back}
          </button>
          <div className="bg-slate-900 px-6 py-2 rounded-xl text-white font-black uppercase italic text-[10px]">
             {view === 'plan' ? t.headerParent : t.headerStudent}
          </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white text-slate-900 rounded-[60px] shadow-2xl overflow-hidden min-h-[750px] border-4 border-slate-100">
           {view === 'plan' ? <ParentPlan data={planData} lang={lang} /> : <MathExerciseApp lang={lang} />}
        </div>
      </main>
    </div>
  );
};

export default App;