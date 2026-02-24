import React, { useState, useRef, useEffect } from "react";

const dictations = [
  {
    id: 1,
    title: "L'école",
    icon: "🏫",
    color: "bg-blue-100 border-blue-400 text-blue-800",
    words: ["aller", "dîner", "école", "jeux", "amis", "pupitre", "rédiger"]
  },
  {
    id: 2,
    title: "Le repas",
    icon: "🥗",
    color: "bg-green-100 border-green-400 text-green-800",
    words: ["laitue", "légumes", "mange", "monde", "nappe", "plat", "rôti", "table", "tomates"]
  },
  {
    id: 3,
    title: "La chambre",
    icon: "🛏️",
    color: "bg-purple-100 border-purple-400 text-purple-800",
    words: ["bureau", "chambre", "chat", "cube", "grande", "jeux", "lit", "propre", "ranger", "terre"]
  },
  {
    id: 4,
    title: "La lecture",
    icon: "🚀",
    color: "bg-indigo-100 border-indigo-400 text-indigo-800",
    words: ["aventure", "fusée", "lecture", "livre", "lire", "planète", "soir"]
  },
  {
    id: 5,
    title: "Boubou",
    icon: "🐦",
    color: "bg-yellow-100 border-yellow-400 text-yellow-800",
    words: ["cage", "canari", "chanter", "des grains", "entendre", "jaune", "sortir"]
  },
  {
    id: 6,
    title: "Mon chien",
    icon: "🐶",
    color: "bg-orange-100 border-orange-400 text-orange-800",
    words: ["blanche", "cacher", "chien", "nourriture", "panier"]
  }
];

export default function DictationExercise() {
  const [selected, setSelected] = useState(dictations[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const audioRef = useRef(null);

  // 🔊 Lecture auto quand le mot change
  useEffect(() => {
    if (!finished) {
      speakWord(selected.words[currentIndex]);
    }
  }, [currentIndex, selected]);

  const speakWord = (word) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const path = `/audio1a/${encodeURIComponent(word)}.mp3`;
    const audio = new Audio(path);
    audioRef.current = audio;

    audio.play().catch(() => {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "fr-FR";
      utterance.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  };

  const checkWord = () => {
    const correctWord = selected.words[currentIndex];

    if (input.trim().toLowerCase() === correctWord.toLowerCase()) {
      setScore(score + 1);
    }

    if (currentIndex + 1 < selected.words.length) {
      setCurrentIndex(currentIndex + 1);
      setInput("");
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setScore(0);
    setInput("");
    setFinished(false);
  };

  // ⭐ Calcul étoiles
  const stars = Math.round((score / selected.words.length) * 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8 animate-bounce">
        ✏️ Super Dictée
      </h1>

      {/* Choix liste */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {dictations.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setSelected(d);
              restart();
            }}
            className={`px-4 py-2 rounded-full border-2 shadow-md hover:scale-105 transition ${d.color}`}
          >
            {d.icon} {d.title}
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-2xl text-center border-4 border-yellow-200">

        {!finished ? (
          <>
            <p className="text-lg mb-4 font-semibold text-gray-600">
              Mot {currentIndex + 1} / {selected.words.length}
            </p>

            <button
              onClick={() => speakWord(selected.words[currentIndex])}
              className="mb-6 px-8 py-4 bg-blue-500 text-white rounded-2xl text-lg font-bold hover:scale-105 transition"
            >
              🔊 Écouter
            </button>

            {/* Lettres animées */}
            <div className="flex justify-center gap-2 mb-6">
              {input.split("").map((letter, i) => (
                <span
                  key={i}
                  className={`text-3xl font-bold animate-bounce ${
                    "éèêàùôîç".includes(letter) ? "text-red-500" : "text-blue-600"
                  }`}
                >
                  {letter}
                </span>
              ))}
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border-4 border-blue-200 rounded-2xl p-4 text-center text-2xl font-bold focus:ring-4 focus:ring-blue-300"
              placeholder="Écris ici..."
            />

            <button
              onClick={checkWord}
              className="mt-6 px-8 py-4 bg-green-500 text-white rounded-2xl text-lg font-bold hover:scale-105 transition"
            >
              ✅ Valider
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-4 text-purple-700 animate-pulse">
              🎉 Bravo !
            </h2>

            <div className="text-6xl mb-4">🏆</div>

            <p className="text-2xl font-bold mb-4">
              Score : {score} / {selected.words.length}
            </p>

            {/* Étoiles */}
            <div className="text-4xl mb-6">
              {"⭐".repeat(stars)}
            </div>

            <button
              onClick={restart}
              className="px-8 py-4 bg-purple-500 text-white rounded-2xl text-lg font-bold hover:scale-105 transition"
            >
              🔄 Recommencer
            </button>
          </>
        )}
      </div>
    </div>
  );
}