import React, { useState, useMemo } from "react";
import { BookOpen, Award, Loader2 } from "lucide-react";

// URL DE VOTRE SCRIPT DEPLOYÉ
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzIM-3DctS6eHvL1Egz1WgiD8GPN8jo1w21ZOq0uGxjjyEsOQxuXTv3cF0qoG-Iy59c/exec";

export default function Quiz({ data }) {
  const [etape, setEtape] = useState("lecture");
  const [section, setSection] = useState(1);
  const [reponses, setReponses] = useState({});
  const [score, setScore] = useState(0);
  const [resultats, setResultats] = useState(false);
  const [texteOuvert, setTexteOuvert] = useState(true);
  const [nom, setNom] = useState(""); 
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const today = new Date();

  const texte = useMemo(() => {
    if (!data?.texts) return null;
    return data.texts.find((t) => {
      const start = new Date(t.startDate);
      const end = new Date(t.endDate);
      return start <= today && today <= end;
    });
  }, [data]);

  if (!texte) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Aucun texte cette semaine</h2>
      </div>
    );
  }

  const questions = texte.questions || {};
  const vraiFaux = questions.vraiFaux || [];
  const qcm = questions.qcm || [];
  const reponseCourte = questions.reponseCourte || [];
  const vocabulaire = questions.vocabulaire || [];
  const conjugaison = questions.conjugaison || [];

  const totalQuestions =
    vraiFaux.length + qcm.length + reponseCourte.length + vocabulaire.length + conjugaison.length;

  const handle = (section, index, value) => {
    setReponses((prev) => ({
      ...prev,
      [`${section}-${index}`]: value,
    }));
  };

  const sectionComplete = (sect, qs) => {
    return qs.every((q, i) => reponses[`${sect}-${i}`] !== undefined);
  };

  const envoyerVersGoogleSheet = async (scoreFinal, total, details) => {
    setEnvoiEnCours(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom,
          quiz: texte.title,
          score: scoreFinal,
          total: total,
          details: details 
        }),
      });
      console.log("Données envoyées");
    } catch (error) {
      console.error("Erreur d'envoi:", error);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const calculScore = () => {
    let totalPoints = 0;
    let analyseDetaillee = [];
    let numQuestion = 1;

    const traiterQuestions = (liste, type) => {
      liste.forEach((q, i) => {
        const reponseEleve = reponses[`${type}-${i}`];
        const estJuste = reponseEleve === q.r;
        if (estJuste) totalPoints++;
        analyseDetaillee.push({
          label: "Q" + numQuestion,
          estCorrect: estJuste
        });
        numQuestion++;
      });
    };

    traiterQuestions(vraiFaux, "vraiFaux");
    traiterQuestions(qcm, "qcm");
    traiterQuestions(reponseCourte, "reponseCourte");
    traiterQuestions(vocabulaire, "vocabulaire");
    traiterQuestions(conjugaison, "conjugaison");

    setScore(totalPoints);
    setResultats(true);
    envoyerVersGoogleSheet(totalPoints, totalQuestions, analyseDetaillee);
  };

  const pourcentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  if (etape === "lecture") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-10 h-10 text-amber-600" />
            <h1 className="text-4xl font-bold">{texte.title}</h1>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ton Prénom et Nom :</label>
            <input 
              type="text" 
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full p-3 border-2 border-amber-200 rounded-xl outline-none focus:border-amber-500"
              placeholder="Ex: Jean Dupont"
            />
          </div>
          <div className="bg-amber-50 p-6 rounded-xl mb-8 whitespace-pre-line border border-amber-100 italic">
            {texte.texte}
          </div>
          <button
            onClick={() => setEtape("quiz")}
            disabled={!nom.trim()}
            className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition ${
              nom.trim() ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-[1.02]" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Commencer le quiz
          </button>
        </div>
      </div>
    );
  }

  if (resultats) {
    return (
      <div className="min-h-screen bg-green-100 p-8 flex items-center">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center w-full">
          <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Bravo {nom} !</h1>
          <div className="text-6xl font-bold text-green-600 mb-2">{score}/{totalQuestions}</div>
          <div className="text-2xl text-gray-600">{pourcentage}%</div>
          {envoiEnCours && (
            <div className="flex items-center justify-center gap-2 mt-4 text-blue-600 animate-pulse">
              <Loader2 className="animate-spin" /> Enregistrement...
            </div>
          )}
          <button
            onClick={() => { setEtape("lecture"); setResultats(false); setSection(1); setReponses({}); }}
            className="mt-8 bg-amber-500 text-white px-8 py-3 rounded-xl font-bold"
          >
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-6 text-blue-800">Quiz de compréhension</h1>
        <button onClick={() => setTexteOuvert(!texteOuvert)} className="bg-amber-500 text-white px-4 py-2 rounded-lg mb-4 text-sm">
          {texteOuvert ? "Fermer le texte" : "Ouvrir le texte"}
        </button>
        {texteOuvert && <div className="bg-amber-50 p-4 md:p-6 rounded-xl mb-6 whitespace-pre-line border border-amber-100">{texte.texte}</div>}

        {/* SECTION 1: VRAI FAUX */}
        {section === 1 && vraiFaux.length > 0 && (
          <div className="bg-blue-50 p-4 md:p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Vrai ou Faux</h2>
            {vraiFaux.map((q, i) => (
              <div key={i} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                <p className="font-semibold mb-3">{i + 1}. {q.q}</p>
                <div className="flex gap-4">
                  <button onClick={() => handle("vraiFaux", i, true)} className={`flex-1 py-2 rounded-lg font-bold ${reponses[`vraiFaux-${i}`] === true ? "bg-green-500 text-white" : "bg-green-100"}`}>Vrai</button>
                  <button onClick={() => handle("vraiFaux", i, false)} className={`flex-1 py-2 rounded-lg font-bold ${reponses[`vraiFaux-${i}`] === false ? "bg-red-500 text-white" : "bg-red-100"}`}>Faux</button>
                </div>
              </div>
            ))}
            <button disabled={!sectionComplete("vraiFaux", vraiFaux)} onClick={() => setSection(2)} className={`mt-4 px-10 py-3 rounded-lg text-white font-bold ${sectionComplete("vraiFaux", vraiFaux) ? "bg-blue-600" : "bg-gray-400"}`}>Suivant</button>
          </div>
        )}

        {/* SECTION 2: QCM */}
        {section === 2 && qcm.length > 0 && (
          <div className="bg-purple-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">QCM</h2>
            {qcm.map((q, i) => (
              <div key={i} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                <p className="font-semibold mb-3">{i + 1}. {q.q}</p>
                {q.options.map((opt, j) => (
                  <button key={j} onClick={() => handle("qcm", i, j)} className={`block w-full text-left py-2 px-4 rounded-lg mb-2 ${reponses[`qcm-${i}`] === j ? "bg-purple-600 text-white" : "bg-gray-100"}`}>{opt}</button>
                ))}
              </div>
            ))}
            <button disabled={!sectionComplete("qcm", qcm)} onClick={() => setSection(3)} className={`mt-4 px-10 py-3 rounded-lg text-white font-bold ${sectionComplete("qcm", qcm) ? "bg-purple-600" : "bg-gray-400"}`}>Suivant</button>
          </div>
        )}

        {/* SECTION 3: COMPRÉHENSION */}
        {section === 3 && reponseCourte.length > 0 && (
          <div className="bg-yellow-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-yellow-700">Compréhension</h2>
            {reponseCourte.map((q, i) => (
              <div key={i} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                <p className="font-semibold mb-3">{i + 1}. {q.q}</p>
                {q.options.map((opt, j) => (
                  <button key={j} onClick={() => handle("reponseCourte", i, j)} className={`block w-full text-left py-2 px-4 rounded-lg mb-2 ${reponses[`reponseCourte-${i}`] === j ? "bg-yellow-600 text-white" : "bg-gray-100"}`}>{opt}</button>
                ))}
              </div>
            ))}
            <button disabled={!sectionComplete("reponseCourte", reponseCourte)} onClick={() => setSection(4)} className={`mt-4 px-10 py-3 rounded-lg text-white font-bold ${sectionComplete("reponseCourte", reponseCourte) ? "bg-yellow-600" : "bg-gray-400"}`}>Suivant</button>
          </div>
        )}

        {/* SECTION 4: VOCABULAIRE */}
        {section === 4 && vocabulaire.length > 0 && (
          <div className="bg-green-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Vocabulaire</h2>
            {vocabulaire.map((q, i) => (
              <div key={i} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                <p className="font-semibold mb-3">{i + 1}. {q.q}</p>
                {q.options.map((opt, j) => (
                  <button key={j} onClick={() => handle("vocabulaire", i, j)} className={`block w-full text-left py-2 px-4 rounded-lg mb-2 ${reponses[`vocabulaire-${i}`] === j ? "bg-green-600 text-white" : "bg-gray-100"}`}>{opt}</button>
                ))}
              </div>
            ))}
            <button disabled={!sectionComplete("vocabulaire", vocabulaire)} onClick={() => setSection(5)} className={`mt-4 px-10 py-3 rounded-lg text-white font-bold ${sectionComplete("vocabulaire", vocabulaire) ? "bg-green-600" : "bg-gray-400"}`}>Suivant</button>
          </div>
        )}

        {/* SECTION 5: CONJUGAISON */}
        {section === 5 && conjugaison.length > 0 && (
          <div className="bg-indigo-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Conjugaison</h2>
            {conjugaison.map((q, i) => (
              <div key={i} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                <p className="font-semibold mb-3">{i + 1}. {q.q}</p>
                {q.options.map((opt, j) => (
                  <button key={j} onClick={() => handle("conjugaison", i, j)} className={`block w-full text-left py-2 px-4 rounded-lg mb-2 ${reponses[`conjugaison-${i}`] === j ? "bg-indigo-600 text-white" : "bg-gray-100"}`}>{opt}</button>
                ))}
              </div>
            ))}
            <button disabled={!sectionComplete("conjugaison", conjugaison)} onClick={calculScore} className={`mt-4 w-full py-4 rounded-lg text-white font-bold text-xl shadow-lg ${sectionComplete("conjugaison", conjugaison) ? "bg-indigo-600" : "bg-gray-400"}`}>Terminer</button>
          </div>
        )}
      </div>
    </div>
  );
}