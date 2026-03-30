import React, { useState } from 'react';
import { 
  Terminal, BookOpen, PlayCircle, Award, ExternalLink, 
  ChevronRight, MessageSquare, Calendar, Languages, 
  Lightbulb, Play
} from 'lucide-react';

const translations = {
  fr: {
    back: "← Retour",
    title: "Laboratoire de Code",
    weekLabel: "Sem.",
    learn: "Ce qu'on apprend",
    practice: "À faire sur Scratch",
    scenario: "Scénario : La Fourmi & la Cigale",
    final: "Grande Finale",
    presentation: "Présentation à la classe !",
    footer: "Ecole Ibn Batouta • Programme de Codage • 2026",
    data: [
      {
        semaine: 1,
        dates: "28 Mars au 3 Avril",
        titre: "Découverte de Scratch",
        desc: "Premiers pas dans l'univers de la programmation créative.",
        objs: ["Ouvrir Scratch en ligne", "Découvrir l'interface", "Comprendre les blocs"],
        acts: ["Faire bouger un lutin", "Changer le décor", "Faire parler le chat"],
        ressources: [
          { nom: "Tutoriels Scratch", url: "https://scratch.mit.edu/ideas", type: "idea" }
        ],
        color: "bg-blue-500",
        txtColor: "text-blue-600"
      },
      {
        semaine: 2,
        dates: "4 au 10 Avril",
        titre: "Animation Chat",
        desc: "Apprendre à animer un personnage étape par étape.",
        objs: ["Ajouter un lutin chat", "Faire marcher le chat", "Créer un dialogue"],
        acts: ["Ajouter un décor", "Tester l'animation"],
        ressources: [
          { nom: "Tutoriels Scratch", url: "https://scratch.mit.edu/ideas", type: "idea" },
          { nom: "Éditeur Scratch", url: "https://scratch.mit.edu/projects/editor/", type: "play" }
        ],
        color: "bg-orange-500",
        txtColor: "text-orange-600"
      },
      {
        semaine: 3,
        dates: "11 au 17 Avril",
        titre: "Histoire Animée",
        desc: "Mise en scène : La Fourmi et la Cigale.",
        objs: ["Créer les personnages", "Choisir la forêt", "Animer les dialogues"],
        histoire: [
          "Le soleil brille sur la forêt.",
          "La cigale chante et danse.",
          "La fourmi travaille dur.",
          "La cigale demande de l’aide.",
          "La fourmi partage son repas.",
          "Fin heureuse : Au revoir !"
        ],
        acts: ["Changer de scène", "Améliorer l'histoire"],
        ressources: [
          { nom: "Tutoriels Scratch", url: "https://scratch.mit.edu/ideas", type: "idea" }
        ],
        color: "bg-purple-500",
        txtColor: "text-purple-600"
      },
      {
        semaine: 4,
        dates: "18 au 24 Avril",
        titre: "Projet Personnel",
        desc: "Création libre et présentation finale.",
        objs: ["Choisir son idée", "Créer le décor", "Ajouter un score"],
        acts: ["Présenter le projet au tableau"],
        ressources: [
          { nom: "Lancer Scratch", url: "https://scratch.mit.edu/projects/editor/", type: "play" },
          { nom: "Plus d'idées", url: "https://scratch.mit.edu/ideas", type: "idea" }
        ],
        color: "bg-green-500",
        txtColor: "text-green-600"
      }
    ]
  },
  en: {
    back: "← Back",
    title: "Coding Lab",
    weekLabel: "Wk.",
    learn: "What we learn",
    practice: "Tasks on Scratch",
    scenario: "Story: The Ant & the Grasshopper",
    final: "Grand Finale",
    presentation: "Class Presentation!",
    footer: "Ibn Batouta School • Coding Curriculum • 2026",
    data: [
      {
        semaine: 1,
        dates: "March 28 to April 3",
        titre: "Discovering Scratch",
        desc: "First steps into the world of creative programming.",
        objs: ["Open Scratch online", "Explore the interface", "Understand blocks"],
        acts: ["Move a character", "Change backdrop", "Make sprite talk"],
        ressources: [
          { nom: "Scratch Tutorials", url: "https://scratch.mit.edu/ideas", type: "idea" }
        ],
        color: "bg-blue-500",
        txtColor: "text-blue-600"
      },
      {
        semaine: 2,
        dates: "April 4 to 10",
        titre: "Cat Animation",
        desc: "Learn to animate a character step by step.",
        objs: ["Add a cat sprite", "Make the cat walk", "Create a dialogue"],
        acts: ["Add a background", "Test the animation"],
        ressources: [
          { nom: "Scratch Tutorials", url: "https://scratch.mit.edu/ideas", type: "idea" },
          { nom: "Scratch Editor", url: "https://scratch.mit.edu/projects/editor/", type: "play" }
        ],
        color: "bg-orange-500",
        txtColor: "text-orange-600"
      },
      {
        semaine: 3,
        dates: "April 11 to 17",
        titre: "Animated Story",
        desc: "Staging: The Ant and the Grasshopper.",
        objs: ["Create characters", "Choose forest setting", "Animate dialogues"],
        histoire: [
          "The sun shines on the forest.",
          "The grasshopper sings and dances.",
          "The ant works very hard.",
          "The grasshopper asks for help.",
          "The ant shares her food.",
          "Happy ending: Goodbye!"
        ],
        acts: ["Change scenes", "Polish the story"],
        ressources: [
          { nom: "Scratch Tutorials", url: "https://scratch.mit.edu/ideas", type: "idea" }
        ],
        color: "bg-purple-500",
        txtColor: "text-purple-600"
      },
      {
        semaine: 4,
        dates: "April 18 to 24",
        titre: "Personal Project",
        desc: "Free creation and final presentation.",
        objs: ["Choose your idea", "Design the setting", "Add a score"],
        acts: ["Present to class"],
        ressources: [
          { nom: "Start Scratch", url: "https://scratch.mit.edu/projects/editor/", type: "play" },
          { nom: "More Ideas", url: "https://scratch.mit.edu/ideas", type: "idea" }
        ],
        color: "bg-green-500",
        txtColor: "text-green-600"
      }
    ]
  }
};

export default function PlanCodage({ onBack }) {
  const [lang, setLang] = useState('fr');
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-12">
        <button onClick={onBack} className="px-6 py-2 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-600 font-black text-xs uppercase hover:bg-slate-100 transition-all active:scale-95">
          {t.back}
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg hover:bg-blue-700 transition-all"
          >
            <Languages size={14} />
            {lang === 'fr' ? "English" : "Français"}
          </button>
          
          <div className="hidden sm:flex items-center gap-2">
            <Terminal className="text-blue-600" size={24} />
            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">{t.title}</h2>
          </div>
        </div>
      </div>

      {/* LISTE DES SEMAINES */}
      <div className="max-w-4xl mx-auto space-y-12">
        {t.data.map((item) => (
          <div key={item.semaine} className="flex flex-col md:flex-row gap-6 group">
            
            {/* BADGE SEMAINE */}
            <div className="flex flex-row md:flex-col items-center gap-3 shrink-0">
               <div className={`w-20 h-20 rounded-[28px] ${item.color} flex flex-col items-center justify-center text-white shadow-xl transform group-hover:scale-105 transition-transform`}>
                <span className="text-[10px] font-bold uppercase opacity-80">{t.weekLabel}</span>
                <span className="font-black text-3xl italic leading-none">{item.semaine}</span>
              </div>
              <span className={`text-[9px] font-black uppercase ${item.txtColor} bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-1`}>
                <Calendar size={10} /> {item.dates}
              </span>
            </div>

            {/* CARTE CONTENU */}
            <div className="flex-1 bg-white rounded-[35px] p-6 md:p-10 shadow-sm border border-slate-100 hover:shadow-2xl transition-all border-b-8 border-slate-200/50 overflow-hidden">
              
              <div className="mb-6">
                <h3 className="text-2xl font-black text-slate-800 uppercase italic leading-none">{item.titre}</h3>
                <p className="text-slate-400 text-[11px] font-bold uppercase mt-1">{item.desc}</p>
              </div>

              {/* ZONE HISTOIRE SEMAINE 3 */}
              {item.semaine === 3 && (
                <div className="mb-10 p-6 bg-purple-50/50 rounded-[30px] border-2 border-purple-100/50">
                  <div className="flex items-center gap-2 mb-5 text-purple-600">
                    <MessageSquare size={18} />
                    <span className="font-black text-[11px] uppercase tracking-[0.2em]">{t.scenario}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {item.histoire.map((etape, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-purple-100 flex items-center gap-3 shadow-sm">
                        <span className="bg-purple-600 text-white text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center shrink-0">{idx + 1}</span>
                        <p className="text-[11px] font-bold text-slate-600 italic leading-tight">{etape}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* OBJECTIFS ET PRATIQUE */}
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-blue-500 font-black text-[11px] uppercase tracking-widest border-b border-blue-100 pb-1">
                    <BookOpen size={16} /> {t.learn}
                  </div>
                  <ul className="space-y-3">
                    {item.objs.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600 font-bold leading-snug">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" /> {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-orange-500 font-black text-[11px] uppercase tracking-widest border-b border-orange-100 pb-1">
                    <PlayCircle size={16} /> {t.practice}
                  </div>
                  <ul className="space-y-2">
                    {item.acts.map((act, i) => (
                      <li key={i} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl text-[11px] font-black text-slate-500 italic border border-slate-100">
                        <ChevronRight size={14} className="text-orange-400" /> {act}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* PIED DE CARTE - RESSOURCES */}
              <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-wrap gap-3">
                  {item.ressources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase transition-all shadow-lg hover:scale-105 ${
                        res.type === 'play' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white'
                      }`}
                    >
                      {res.type === 'play' ? <Play size={14} /> : <Lightbulb size={14} />}
                      {res.nom}
                    </a>
                  ))}
                </div>

                {item.semaine === 4 && (
                  <div className="flex items-center gap-4 px-6 py-3 bg-emerald-50 rounded-[20px] border-2 border-emerald-100">
                    <Award className="text-emerald-500" size={24} />
                    <div className="text-left">
                      <p className="text-[11px] font-black text-emerald-700 uppercase italic leading-none">{t.final}</p>
                      <p className="text-[9px] font-bold text-emerald-600/70 uppercase">{t.presentation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-20 text-center opacity-30 text-[10px] font-black uppercase tracking-[0.5em] pb-10">
        {t.footer}
      </footer>
    </div>
  );
}