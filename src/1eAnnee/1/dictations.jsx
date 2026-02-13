import React, { useState } from 'react';
import { Volume2, Eye, EyeOff, BookOpen, Star } from 'lucide-react';

// Importation des données JSON (simulée ici)
const dictations = [
  { id: 1, title: "L'école", icon: "🏫", theme: "blue", words: ["aller", "dîner", "école", "jeux", "amis", "pupitre", "rédiger"] },
  { id: 2, title: "Le repas", icon: "🥗", theme: "green", words: ["laitue", "légumes", "mange", "monde", "nappe", "plat", "rôti", "table", "tomates"] },
  { id: 3, title: "La chambre", icon: "🛏️", theme: "purple", words: ["bureau", "chambre", "chat", "cube", "grande", "jeux", "lit", "propre", "ranger", "terre"] },
  { id: 4, title: "La lecture", icon: "🚀", theme: "indigo", words: ["aventure", "fusée", "lecture", "livre", "lire", "planète", "soir"] },
  { id: 5, title: "Boubou", icon: "🐦", theme: "yellow", words: ["cage", "canari", "chanter", "des grains", "entendre", "jaune", "sortir"] },
  { id: 6, title: "Mon chien", icon: "🐶", theme: "orange", words: ["blanche", "cacher", "chien", "nourriture", "panier"] }
];

const ThemeColors = {
  blue: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
  green: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
  purple: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
  indigo: "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100",
  yellow: "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100",
  orange: "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100",
};

export default function DictationApp() {
  const [activeCard, setActiveCard] = useState(dictations[0]);
  const [hiddenWords, setHiddenWords] = useState({});

  // Fonction pour lire le mot (Synthèse vocale)
  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9; // Un peu plus lent pour les enfants
    window.speechSynthesis.speak(utterance);
  };

  // Basculer la visibilité d'un mot
  const toggleVisibility = (word) => {
    setHiddenWords(prev => ({ ...prev, [word]: !prev[word] }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          Mes Petites Lectures
        </h1>
        <p className="text-gray-500">Niveau 1 - Entraînement à la dictée</p>
      </header>

      {/* Navigation des chapitres */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {dictations.map((d) => (
          <button
            key={d.id}
            onClick={() => { setActiveCard(d); setHiddenWords({}); }}
            className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 shadow-sm
              ${activeCard.id === d.id ? 'ring-2 ring-offset-2 ring-blue-400 scale-105' : 'opacity-70 hover:opacity-100'}
              ${ThemeColors[d.theme]}
            `}
          >
            <span className="text-lg">{d.icon}</span>
            <span className="font-bold">{d.title}</span>
          </button>
        ))}
      </div>

      {/* Zone principale d'apprentissage */}
      <div className="max-w-4xl mx-auto">
        <div className={`bg-white rounded-3xl shadow-xl border-4 p-8 ${activeCard.theme === 'yellow' ? 'border-yellow-200' : `border-${activeCard.theme}-200`}`}>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
              <span className="text-4xl">{activeCard.icon}</span>
              Liste : {activeCard.title}
            </h2>
            <div className="bg-gray-100 px-4 py-1 rounded-full text-sm font-medium text-gray-500">
              {activeCard.words.length} mots à apprendre
            </div>
          </div>

          {/* Grille des mots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {activeCard.words.map((word, index) => (
              <div 
                key={index} 
                className="group relative bg-white border-2 border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all hover:border-blue-300 flex flex-col items-center justify-center gap-3"
              >
                {/* Bouton Audio */}
                <button 
                  onClick={() => speakWord(word)}
                  className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                  title="Écouter"
                >
                  <Volume2 size={20} />
                </button>

                {/* Le Mot (Visible ou Caché) */}
                <div 
                  className={`text-2xl font-bold tracking-wide mt-4 mb-2 cursor-pointer select-none transition-all
                    ${hiddenWords[word] ? 'blur-md text-gray-300 scale-90' : 'text-gray-800 scale-100'}
                  `}
                  onClick={() => toggleVisibility(word)}
                >
                  {word}
                </div>

                {/* Bouton pour cacher/révéler */}
                <button 
                  onClick={() => toggleVisibility(word)}
                  className="text-xs font-medium text-gray-400 flex items-center gap-1 hover:text-gray-600"
                >
                  {hiddenWords[word] ? (
                    <><Eye size={14}/> Révéler</>
                  ) : (
                    <><EyeOff size={14}/> Cacher</>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-start gap-3 text-blue-800 text-sm">
            <Star className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p>
              <strong>Conseil pédagogique :</strong> Clique sur le haut-parleur pour entendre le mot, puis clique sur "Cacher" pour essayer de l'écrire sur ton cahier sans regarder !
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}