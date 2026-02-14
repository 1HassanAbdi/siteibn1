import React, { useMemo } from 'react';
import { 
  Calendar, CheckCircle, Trophy, Lightbulb, Star, 
  Target, Flag, ListChecks, Heart, Info
} from 'lucide-react';

const ParentPlan = ({ data, lang = 'fr' }) => {
  if (!data) return null;

  const brandGreen = "#108565"; 
  const brandOrange = "#F59E0B";

  // Traductions de l'interface
  const ui = {
    fr: {
      mission: "Mission en cours",
      evalDay: "🚨 JOUR D'ÉVALUATION",
      evalPlan: "Évaluation prévue",
      today: "AUJOURD'HUI",
      studyDetails: "Détails de l'étude",
      book: "Livre Chenelière",
      pages: "Travailler les pages",
      digital: "Pratique Numérique",
      ixlTarget: "Compétence IXL",
      note: "Note pour le parent coach",
      roadmap: "Plan de route OQRE",
      completed: "Succès acquis",
      modules: "Modules finis",
      coachTitle: "Mission Conseil",
      coachDesc: "Encouragez l'effort ! Vérifiez si les exercices sont faits et regardez la note du jeudi.",
      btnSeen: "Marquer comme lu"
    },
    en: {
      mission: "Current Mission",
      evalDay: "🚨 EVALUATION DAY",
      evalPlan: "Scheduled Evaluation",
      today: "TODAY",
      studyDetails: "Study Details",
      book: "Chenelière Workbook",
      pages: "Work on pages",
      digital: "Digital Practice",
      ixlTarget: "IXL Skill",
      note: "Note for the parent coach",
      roadmap: "EQAO Roadmap",
      completed: "Skills Mastered",
      modules: "Modules finished",
      coachTitle: "Coaching Mission",
      coachDesc: "Encourage the effort! Check if exercises are done and review Thursday's grade.",
      btnSeen: "Mark as read"
    }
  }[lang];

  // Fonction pour parser "6 Feb - 12 Feb" en date JS
  const parseDateRange = (str) => {
    const [startStr, endStr] = str.split(' - ');
    const currentYear = new Date().getFullYear();
    const start = new Date(`${startStr} ${currentYear}`);
    const end = new Date(`${endStr} ${currentYear}`);
    return { start, end };
  };

  // Calcul dynamique du module actuel, next et completed
  const { currentMission, updatedCalendrier, nextFriday, isEvaluationDay } = useMemo(() => {
    const today = new Date();
    
    // 1. Déterminer la prochaine date de transition (vendredi)
    let dayOfWeek = today.getDay(); // 0 = dim, 5 = ven
    let daysUntilFriday = (4 - dayOfWeek + 7) % 7;
    if (daysUntilFriday === 0) daysUntilFriday = 7; // si aujourd'hui vendredi, prochain vendredi
    const nextFridayDate = new Date(today);
    nextFridayDate.setDate(today.getDate() + daysUntilFriday);
    const formattedNextFriday = nextFridayDate.toLocaleDateString(
      lang === 'fr' ? 'fr-FR' : 'en-US',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    );

    // 2. Parcourir le calendrier et mettre à jour les status
    const updated = data.calendrier.map((m) => {
      const { start, end } = parseDateRange(m.dates);
      if (today >= start && today <= end) return { ...m, status: 'current' };
      if (today < start) return { ...m, status: 'next' };
      return { ...m, status: 'completed' };
    });

    const current = updated.find(m => m.status === 'current') || updated.find(m => m.status === 'next');

    return { 
      currentMission: current,
      updatedCalendrier: updated,
      nextFriday: formattedNextFriday,
      isEvaluationDay: today.getDay() === 4 // jeudi
    };
  }, [data, lang]);

  return (
    <div className="animate-in fade-in duration-700 pb-20 p-6 space-y-8 bg-slate-50">
      
      {/* HEADER COACHING */}
      <div 
        className="rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl"
        style={{ backgroundColor: isEvaluationDay ? brandOrange : brandGreen }}
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
               <span className="bg-white text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  {isEvaluationDay ? ui.evalDay : ui.mission}
               </span>
               <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">{currentMission.dates}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
              {currentMission.domaine[lang]}
            </h2>
            <p className="flex items-center gap-2 text-sm font-bold bg-black/20 px-4 py-2 rounded-2xl backdrop-blur-md w-fit">
              <Target size={18} /> {currentMission.objectif[lang]}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[30px] border border-white/20 text-center min-w-[200px]">
            <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-1">{ui.evalPlan}</p>
            <p className="text-2xl font-black">{isEvaluationDay ? ui.today : nextFriday}</p>
          </div>
        </div>
        <Flag className="absolute bottom-[-30px] right-[-20px] text-white/10 w-64 h-64 -rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLONNE GAUCHE */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border-2 border-slate-100 relative">
            <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3 mb-6">
                <ListChecks style={{ color: brandGreen }} size={24} /> {ui.studyDetails}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <p className="text-[10px] font-black uppercase mb-1 tracking-widest text-slate-400">{ui.book}</p>
                    <p className="text-slate-700 font-bold text-sm">{ui.pages} <span className="text-lg font-black" style={{ color: brandGreen }}>{currentMission.livre}</span></p>
                </div>
                <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100">
                    <p className="text-[10px] font-black uppercase mb-1 tracking-widest text-orange-400">{ui.digital}</p>
                    <p className="text-slate-700 font-bold text-sm">{ui.ixlTarget}: <span className="text-lg font-black" style={{ color: brandOrange }}>{currentMission.ixl}</span></p>
                </div>
            </div>

            <div className="mt-6 p-6 rounded-3xl border-2 border-dashed flex gap-4 items-start" style={{ borderColor: brandGreen, backgroundColor: '#F0FDF4' }}>
                <Lightbulb style={{ color: brandGreen }} size={24} className="shrink-0" />
                <div>
                    <h4 className="text-[10px] font-black uppercase mb-1 tracking-widest" style={{ color: brandGreen }}>{ui.note}</h4>
                    <p className="text-slate-900 font-bold italic">"{currentMission.parent_note[lang]}"</p>
                </div>
            </div>
          </div>

          {/* LISTE DU CALENDRIER */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 uppercase px-4">{ui.roadmap}</h3>
            {updatedCalendrier.map((m) => (
              <div key={m.id} className={`p-5 rounded-[28px] border-2 flex items-center justify-between gap-4 ${m.status === 'current' ? 'bg-white border-slate-900 shadow-xl' : 'bg-white/50 border-slate-100 opacity-60'}`}>
                <div className="flex gap-4 items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${m.status === 'current' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                   {m.status === 'current' ? "🟢" : m.status === 'next' ? "⏳" : <CheckCircle size={18} />}

                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.dates}</span>
                    <h4 className="font-black text-slate-900 text-sm uppercase leading-tight">{m.domaine[lang]}</h4>
                  </div>
                </div>
                <div className="hidden md:flex gap-2">
                  <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-lg">p.{m.livre}</span>
                  <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-lg">IXL: {m.ixl}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLONNE DROITE : COACHING */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[40px] p-8 shadow-sm border-2 border-slate-100">
            <h3 className="text-lg font-black text-slate-900 uppercase mb-6 flex items-center gap-2">
                <Trophy style={{ color: brandOrange }} size={22} /> {ui.completed}
            </h3>
            <div className="space-y-4">
                {data.parties_terminees.map((part, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <h4 className="font-black text-slate-900 uppercase text-[11px]">{part.domaine[lang]}</h4>
                        <p className="text-[10px] text-slate-500 italic mt-1">{part.description[lang]}</p>
                    </div>
                ))}
            </div>
          </div>

          {/* CARTE MISSION COACHING */}
          <div className="rounded-[40px] p-8 text-white shadow-xl shadow-green-900/20" style={{ backgroundColor: brandGreen }}>
             <Heart className="mb-4 text-white/50" size={32} fill="white" />
             <h4 className="text-xl font-black uppercase leading-tight mb-2">{ui.coachTitle}</h4>
             <p className="text-white/90 text-sm font-bold leading-relaxed mb-6 italic">
                "{ui.coachDesc}"
             </p>
             <button className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2">
                <CheckCircle size={16} /> {ui.btnSeen}
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParentPlan;
