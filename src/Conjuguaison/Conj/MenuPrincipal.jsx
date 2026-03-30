import React from "react";
import { 
  Play, 
  BookOpen, 
  Trophy, 
  Star, 
  ClipboardCheck, 
  AlertCircle, 
  ShieldCheck 
} from "lucide-react";

export default function MenuPrincipal({ email, setEmail, grade, setGrade, onNavigate }) {
  const gradesScolaires = [2, 3, 4, 5, 6, 7, 8];
  const DOMAINE_REQUIS = "@eibschool.ca";
  const CODE_PROF = "prof2026";
  
  // Logique de validation
  const estProf = email.toLowerCase().trim() === CODE_PROF;
  const emailValide = email.toLowerCase().trim().endsWith(DOMAINE_REQUIS) || estProf;
  const gradeSelectionne = grade !== "" && grade !== null;
  
  // Accès autorisé si (Email OK + Grade choisi) OU si c'est le Prof
  const peutAcceder = estProf || (emailValide && gradeSelectionne);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#E0F2FE] via-[#F0F9FF] to-[#ECFDF5] flex flex-col overflow-hidden">
      
      {/* HEADER OFFICIEL */}
      <header className="bg-[#1e40af] p-4 shadow-lg text-white flex justify-between items-center shrink-0 border-b-4 border-blue-900">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <BookOpen size={24} className="text-blue-100" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">EIB SCHOOL</h1>
            <p className="text-[9px] font-bold tracking-[0.2em] opacity-80">ECOLE IBN BATOUTA</p>
          </div>
        </div>
        <Star className="text-yellow-300 fill-yellow-300 animate-pulse" size={24} />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white/95 rounded-[45px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 md:p-10 border border-white">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-blue-900 uppercase italic tracking-tight">
              {estProf ? "Mode Administration" : "Bonjour ! 👋"}
            </h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
              {estProf ? "Accès réservé aux enseignants" : "Identifie-toi pour progresser"}
            </p>
          </div>

          <div className="space-y-5">
            {/* CHAMP IDENTIFIANT (Email ou Code Prof) */}
            <div>
              <label className="text-[10px] font-black text-blue-500 uppercase ml-2 mb-1 block italic">Email École</label>
              <input 
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom.nom@eibschool.ca"
                className={`w-full p-4 text-base font-bold rounded-2xl border-2 outline-none transition-all ${
                  emailValide ? 'border-green-400 bg-green-50 text-green-700' : 'border-slate-100 bg-slate-50 focus:border-blue-400'
                }`}
              />
            </div>

            {/* SÉLECTEUR DE GRADE (Masqué si Prof) */}
            {!estProf && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block italic">Ton Niveau Scolaire</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className={`w-full p-4 text-base font-black rounded-2xl border-2 outline-none appearance-none cursor-pointer transition-all ${
                    gradeSelectionne ? 'border-blue-500 bg-blue-600 text-white shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-400'
                  }`}
                >
                  <option value="">-- CHOISIS TON GRADE --</option>
                  {gradesScolaires.map(g => <option key={g} value={g.toString()}>GRADE {g}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* SECTION DYNAMIQUE DES BOUTONS */}
          <div className="mt-8 min-h-[120px]">
            {peutAcceder ? (
              <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-500">
                
                {estProf ? (
                  /* BOUTON PROFESSEUR */
                  <button 
                    onClick={() => onNavigate("prof")}
                    className="w-full py-6 rounded-3xl bg-slate-900 border-b-8 border-black text-white flex items-center justify-center gap-4 shadow-xl hover:bg-blue-900 transition-all active:border-b-0 active:translate-y-2"
                  >
                    <ShieldCheck size={32} className="text-blue-400" />
                    <span className="text-2xl font-black uppercase italic tracking-tight">Cahier de Bord Prof</span>
                  </button>
                ) : (
                  /* BOUTONS ÉLÈVES */
                  <>
                    <button 
                      onClick={() => onNavigate("tableau-bord")}
                      className="w-full py-5 rounded-2xl bg-[#4ECDC4] border-b-8 border-[#3ba8a0] text-white flex items-center justify-center gap-3 shadow-lg hover:brightness-105 active:border-b-0 active:translate-y-2 transition-all"
                    >
                      <ClipboardCheck size={28} />
                      <span className="text-xl font-black uppercase italic">Mon Cahier de Réussite</span>
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => onNavigate("etudier")}
                        className="py-5 rounded-2xl bg-blue-600 border-b-8 border-blue-800 text-white flex flex-col items-center gap-1 shadow-lg active:border-b-0 active:translate-y-2 transition-all"
                      >
                        <Play size={24} className="fill-current" />
                        <span className="text-xs font-black uppercase italic text-blue-100">Apprendre</span>
                      </button>

                      <button 
                        onClick={() => onNavigate("entrainer")}
                        className="py-5 rounded-2xl bg-[#FF9F1C] border-b-8 border-[#e68a00] text-white flex flex-col items-center gap-1 shadow-lg active:border-b-0 active:translate-y-2 transition-all"
                      >
                        <Trophy size={24} />
                        <span className="text-xs font-black uppercase italic text-orange-100">S'entraîner</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* ÉTAT INITIAL : MESSAGE D'AIDE */
              <div className="p-6 border-2 border-dashed border-slate-100 rounded-[35px] bg-slate-50/50 flex flex-col items-center justify-center gap-3 opacity-60">
                 <AlertCircle size={28} className="text-slate-300" />
                 <p className="text-[11px] font-bold text-slate-400 uppercase text-center leading-relaxed">
                   Saisis tes accès pour débloquer <br/>
                   <span className="text-blue-400 font-black tracking-widest text-[9px]">ton espace personnel</span>
                 </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="p-4 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
          © 2026 Ibn Batouta Digital Tool
        </p>
      </footer>
    </div>
  );
}