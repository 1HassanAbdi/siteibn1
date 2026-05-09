import React, { useState } from 'react';
import { BookOpen, Edit3, ChevronRight, ChevronLeft } from 'lucide-react';

const oqreData = {
  titre: "Test en lecture, écriture et mathématiques",
  annee: "2015",
  section: "Partie C1 : Lecture",
  titreTexte: "La précieuse casquette",
  paragraphes: [
    "Pour savourer pleinement la matinée ensoleillée, Nathan, Kyle et Mélodie décident de se rendre à l'école à pied plutôt qu'en autobus scolaire, même si le trajet prend une trentaine de minutes. Chacun des trois amis porte fièrement la casquette représentant son équipe préférée de la Ligue nationale de hockey. On distingue ainsi une casquette des Sénateurs d'Ottawa, une autre des Maple Leafs de Toronto et une troisième des Canadiens de Montréal.",
    "Le trio marche d'un pas rapide, chacun discutant de ses projets d'été.",
    "— J'espère que vous pourrez participer au camp de hockey avec moi comme l'été passé. On a eu tellement de plaisir! s'exclame Kyle.",
    "— J'aimerais bien ça moi aussi, mais mes parents veulent qu'on passe du temps au chalet de mon oncle en juillet, déclare Mélodie.",
    "— Et les miens prévoient rénover la maison, alors je devrai leur donner un coup de main, annonce Nathan. Ils trouvent que j'ai du talent en menuiserie et…"
  ],
  questions: [
    {
      id: 1,
      type: "choix_multiple",
      enonce: "Pourquoi les trois amis marchent-ils « d'un pas rapide » ?",
      options: [
        "Ils veulent faire de l'exercice.",
        "Ils veulent discuter de hockey.",
        "Ils veulent éviter d'être en retard.",
        "Ils veulent profiter du beau temps."
      ]
    },
    {
      id: 2,
      type: "reponse_construite",
      enonce: "Comment sait-on que Nathan tient à sa casquette ? Justifie ta réponse à l'aide de preuves tirées du texte.",
      lignes: 6
    }
  ]
};

const OQREComponent = () => {
  const [answers, setAnswers] = useState({});

  const handleMCQ = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans text-gray-800">
      {/* Header Style OQRE */}
      <header className="max-w-6xl mx-auto bg-white border-b-4 border-blue-600 p-4 mb-6 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight">OQRE - {oqreData.annee}</h1>
          <p className="text-sm text-gray-600">6e année — Français</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
          LIVRET DE LECTURE
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Panneau de Gauche : TEXTE */}
        <section className="bg-white p-8 shadow-md border border-gray-200 rounded-sm overflow-y-auto max-h-[80vh]">
          <div className="flex items-center gap-2 mb-6 text-blue-700">
            <BookOpen size={20} />
            <span className="font-bold uppercase text-sm tracking-widest">{oqreData.section}</span>
          </div>
          
          <h2 className="text-3xl font-serif font-bold mb-8 border-b pb-2 text-black">
            {oqreData.titreTexte}
          </h2>

          <div className="space-y-6 leading-relaxed text-lg font-serif italic">
            {oqreData.paragraphes.map((p, index) => (
              <p key={index} className="relative pl-8">
                <span className="absolute left-0 text-xs text-gray-400 font-sans not-italic">{index + 1}</span>
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Panneau de Droite : QUESTIONS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4 text-green-700">
            <Edit3 size={20} />
            <span className="font-bold uppercase text-sm tracking-widest">Cahier de réponses</span>
          </div>

          {oqreData.questions.map((q, idx) => (
            <div key={q.id} className="bg-white p-6 shadow-sm border-l-4 border-blue-500 rounded-r-md">
              <div className="flex gap-4">
                <span className="bg-blue-100 text-blue-800 font-bold w-8 h-8 flex items-center justify-center rounded-full shrink-0">
                  {q.id}
                </span>
                <div className="w-full">
                  <p className="font-bold text-lg mb-4">{q.enonce}</p>

                  {q.type === "choix_multiple" ? (
                    <div className="space-y-3">
                      {q.options.map((option, i) => (
                        <label key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                            onChange={() => handleMCQ(q.id, option)}
                          />
                          <span className={answers[q.id] === option ? "font-semibold text-blue-700" : ""}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
                        {[...Array(q.lignes)].map((_, i) => (
                          <div key={i} className="h-8 bg-transparent"></div>
                        ))}
                      </div>
                      <textarea 
                        className="w-full -mt-[192px] bg-transparent leading-8 resize-none focus:outline-none p-0 border-none"
                        rows={q.lignes}
                        placeholder="Écris ta réponse ici..."
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <button className="w-full bg-blue-700 text-white font-bold py-4 rounded shadow-lg hover:bg-blue-800 transition-all flex justify-center items-center gap-2">
            Soumettre mes réponses <ChevronRight />
          </button>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 text-center text-gray-500 text-xs border-t pt-4">
        © Office de la qualité et de la responsabilité en éducation (OQRE), {oqreData.annee}
      </footer>
    </div>
  );
};

export default OQREComponent;