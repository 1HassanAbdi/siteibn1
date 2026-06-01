import React, { useState } from "react";
import oqreData from "./entrainement.json";

import {
  BookOpen,
  Headphones,
  Volume2,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import QuizOQRE3e6e from "./oqre3e6e/Quiz3e6e";

// Mapping icônes JSON → composants React
const iconMap = {
  BookOpen: <BookOpen className="w-10 h-10 text-blue-600" />,
  Headphones: <Headphones className="w-10 h-10 text-green-600" />,
  Volume2: <Volume2 className="w-10 h-10 text-purple-600" />
};

export default function OQREPractice() {
  const [selectedTest, setSelectedTest] = useState(null);
  const [grade, setGrade] = useState(3);
  const [showQuiz, setShowQuiz] = useState(false); // État pour afficher/masquer le quiz

  const grades = oqreData;

  // -------------------------
  // PAGE DU TEST SÉLECTIONNÉ
  // -------------------------
  if (selectedTest) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="bg-white shadow-lg px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSelectedTest(null)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <div>
            <h2 className="text-xl font-bold text-blue-900">
              {selectedTest.title}
            </h2>
            <p className="text-sm text-gray-500">Exemple officiel de l’OQRE</p>
          </div>
        </div>

        <iframe
          src={selectedTest.link}
          title={selectedTest.title}
          className="w-full h-[calc(100vh-80px)] border-0"
        />
      </div>
    );
  }

  // -------------------------
  // PAGE DU QUIZ (NOUVEAU)
  // -------------------------
  if (showQuiz) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="bg-white shadow-lg px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setShowQuiz(false)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <h2 className="text-xl font-bold text-blue-900">Exercices OQRE</h2>
        </div>
        <QuizOQRE3e6e />
      </div>
    );
  }

  // -------------------------
  // PAGE PRINCIPALE
  // -------------------------
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Sélecteur de niveau */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
            <button
              onClick={() => setGrade(3)}
              className={`px-6 py-3 rounded-xl font-bold transition ${
                grade === 3 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              🎯 3e année
            </button>

            <button
              onClick={() => setGrade(6)}
              className={`px-6 py-3 rounded-xl font-bold transition ${
                grade === 6 ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              🚀 6e année
            </button>

            <button
              onClick={() => setShowQuiz(true)}
              className="px-6 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 transition"
            >
              Exercices
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-10 mb-10 border border-blue-100">
          <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-4">
            {grades[grade].title}
          </h1>

          <p className="text-center text-gray-600 text-lg">
            Familiarisation avec le test en ligne de l’OQRE
          </p>

          <div className="grid md:grid-cols-4 gap-6 mt-10">
            <div className="bg-blue-50 rounded-xl p-5 text-center shadow-sm">
              <div className="text-3xl font-bold text-blue-700">2</div>
              <div>Séances de Français</div>
            </div>

            <div className="bg-green-50 rounded-xl p-5 text-center shadow-sm">
              <div className="text-3xl font-bold text-green-700">
                {grades[grade].frenchQuestions}
              </div>
              <div>Questions Français</div>
            </div>

            <div className="bg-purple-50 rounded-xl p-5 text-center shadow-sm">
              <div className="text-3xl font-bold text-purple-700">2</div>
              <div>Étapes Maths</div>
            </div>

            <div className="bg-orange-50 rounded-xl p-5 text-center shadow-sm">
              <div className="text-3xl font-bold text-orange-700">
                {grades[grade].mathQuestions}
              </div>
              <div>Questions Maths</div>
            </div>
          </div>
        </div>

        {/* Cartes */}
        <div className="grid lg:grid-cols-3 gap-8">
          {grades[grade].tests.map((test, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition duration-300 border border-gray-100"
            >
              <div className="flex justify-center mb-4">
                {iconMap[test.icon]}
              </div>

              <h2 className="text-xl font-bold text-center mb-4 text-blue-900">
                {test.title}
              </h2>

              <p className="text-gray-600 text-center min-h-[120px] leading-relaxed">
                {test.description}
              </p>

              <div className="bg-gray-100 rounded-lg p-3 mt-4 text-center text-sm text-gray-500">
                {test.note}
              </div>

              <button
                onClick={() => setSelectedTest(test)}
                className="w-full mt-5 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Démarrer maintenant
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Informations — VERSION AMÉLIORÉE */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl p-10 mt-12 border border-blue-100">
          <h2 className="text-3xl font-extrabold mb-6 text-blue-900 flex items-center gap-3">
            📚 Ce que les élèves pratiqueront
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Colonne 1 */}
            <ul className="space-y-4 text-lg">
              <li className="flex items-center gap-3">
                <span className="text-green-600 text-2xl">✔</span>
                Questions à choix multiple
              </li>

              <li className="flex items-center gap-3">
                <span className="text-green-600 text-2xl">✔</span>
                Questions à choix unique
              </li>

              <li className="flex items-center gap-3">
                <span className="text-green-600 text-2xl">✔</span>
                Menus déroulants
              </li>

              <li className="flex items-center gap-3">
                <span className="text-green-600 text-2xl">✔</span>
                Glisser-déposer
              </li>
            </ul>

            {/* Colonne 2 */}
            <ul className="space-y-4 text-lg">
              <li className="flex items-center gap-3">
                <span className="text-purple-600 text-2xl">🎧</span>
                Synthèse vocale
              </li>

              <li className="flex items-center gap-3">
                <span className="text-purple-600 text-2xl">🌙</span>
                Mode contraste élevé
              </li>

              <li className="flex items-center gap-3">
                <span className="text-purple-600 text-2xl">🖍️</span>
                Outils de surlignage
              </li>

              <li className="flex items-center gap-3">
                <span className="text-purple-600 text-2xl">🔍</span>
                Agrandir / Réduire le texte
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}