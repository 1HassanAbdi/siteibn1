import React, { useState, useMemo } from 'react';
import Quiz from './quiz';
import data4 from './date4.json';
import data5 from './date5.json';

export default function QuizSelector() {
  const [quizSelectionne, setQuizSelectionne] = useState(null);
  const today = new Date();

  const quizzes = useMemo(() => {
    const allQuizzes = [
      { id: 'level-4', titre: 'texte de la semaine niveau 4e année', data: data4 },
      { id: 'level-5', titre: 'Le Lion et le Rat', data: data5 }
    ];

    return allQuizzes.filter(q => {
      // Vérifie que q.data.texts existe et n'est pas vide
      if (!q.data?.texts) return false;

      return q.data.texts.some(t => {
        const start = new Date(t.startDate);
        const end = new Date(t.endDate);
        return start <= today && today <= end;
      });
    });
  }, [today]);

  if (quizSelectionne) {
    return <Quiz data={quizSelectionne} />;
  }

  if (quizzes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-700">Aucun quiz disponible cette semaine.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-12 text-gray-800">Choisis ton quiz</h1>
      <div className="flex flex-col gap-6 w-full max-w-xl">
        {quizzes.map((q) => (
          <button
            key={q.id}
            onClick={() => setQuizSelectionne(q.data)}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition transform hover:scale-105"
          >
            {q.titre}
          </button>
        ))}
      </div>
    </div>
  );
}