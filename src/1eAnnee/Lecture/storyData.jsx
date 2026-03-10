// Fonction utilitaire pour charger les médias depuis le même dossier
const getMedia = (theme, name, ext) => {
  try {
    return new URL(`../${theme}/${name}.${ext}`, import.meta.url).href;
  } catch (e) {
    console.error(`Erreur de chargement : ${theme}/${name}.${ext}`);
    return "";
  }
};

export const allStories = {
  repas: {
    title: "Le Repas",
    items: [
      { 
        id: 1, 
        text: "Maman lave les tomates.", 
        word: "TOMATES", 
        syllables: ["TO", "MA", "TES"], 
        emoji: "🍅", 
        image: getMedia('repas', '1', 'png'), 
        audio: getMedia('repas', '1', 'mp3'),
        wordAudio: getMedia('repas', 'tomates', 'mp3'),
        distractors: [ getMedia('repas', '6', 'png')] 
      },
      { 
        id: 2, 
        text: "Mario lave la laitue et les légumes.", 
        word: "LÉGUMES", 
        syllables: ["LÉ", "GU", "MES"], 
        emoji: "🥦", 
        image: getMedia('repas', '2', 'png'), 
        audio: getMedia('repas', '2', 'mp3'),
        wordAudio: getMedia('repas', 'legumes', 'mp3'),
        distractors: [ getMedia('repas', '9', 'png')] 
      },
      { 
        id: 3, 
        text: "Maman coupe les tomates et les légumes.", 
        word: "COUPE", 
        syllables: ["COU", "PE"], 
        emoji: "🔪", 
        image: getMedia('repas', '3', 'png'), 
        audio: getMedia('repas', '3', 'mp3'),
        wordAudio: getMedia('repas', 'coupe', 'mp3'),
        distractors: [ getMedia('repas', '1', 'png')] 
      },
      { 
        id: 4, 
        text: "Papa coupe le rôti.", 
        word: "RÔTI", 
        syllables: ["RÔ", "TI"], 
        emoji: "🍖", 
        image: getMedia('repas', '4', 'png'), 
        audio: getMedia('repas', '4', 'mp3'),
        wordAudio: getMedia('repas', 'roti', 'mp3'),
        distractors: [ getMedia('repas', '2', 'png')] 
      },
      { 
        id: 5, 
        text: "Valérie met la nappe et les plats sur la table.", 
        word: "NAPPE", 
        syllables: ["NAP", "PE"], 
        emoji: "🧺", 
        image: getMedia('repas', '5', 'png'), 
        audio: getMedia('repas', '5', 'mp3'),
        wordAudio: getMedia('repas', 'nappe', 'mp3'),
        distractors: [ getMedia('repas', '7', 'png')] 
      },
      { 
        id: 6, 
        text: "Tout le monde mange.", 
        word: "MANGE", 
        syllables: ["MAN", "GE"], 
        emoji: "🍽️", 
        image: getMedia('repas', '6', 'png'), 
        audio: getMedia('repas', '6', 'mp3'),
        wordAudio: getMedia('repas', 'mange', 'mp3'),
        distractors: [getMedia('repas', '10', 'png')]
      },
      { 
        id: 7, 
        text: "C'est bon !", 
        word: "BON", 
        syllables: ["BON"], 
        emoji: "😋", 
        image: getMedia('repas', '7', 'png'), 
        audio: getMedia('repas', '7', 'mp3'),
        wordAudio: getMedia('repas', 'bon', 'mp3'),
        distractors: [getMedia('repas', '4', 'png')]
      },
    ],
    evaluation: [
      { id: 1, type: "vraiFaux", question: "Maman lave les tomates.", answer: true },
      { id: 2, type: "vraiFaux", question: "Mario lave les voitures.", answer: false },
      { id: 3, type: "vraiFaux", question: "Papa coupe le rôti.", answer: true },
      { id: 4, type: "vraiFaux", question: "Valérie met la nappe sur la table.", answer: true },
      { id: 5, type: "vraiFaux", question: "Tout le monde dort.", answer: false },
      { id: 6, type: "qcm", question: "Qui lave la laitue ?", options: ["Maman", "Mario", "Papa"], answer: "Mario" },
      { id: 7, type: "qcm", question: "Que coupe Maman ?", options: ["Le rôti", "Les légumes", "La nappe"], answer: "Les légumes" },
      { id: 8, type: "qcm", question: "Qui met les plats sur la table ?", options: ["Valérie", "Mario", "Maman"], answer: "Valérie" },
      { id: 9, type: "qcm", question: "À la fin, tout le monde...", options: ["Chante", "Lave", "Mange"], answer: "Mange" },
      { id: 10, type: "qcm", question: "Comment est le repas ?", options: ["C'est bon !", "C'est froid", "C'est fini"], answer: "C'est bon !" }
    ],
    goal: {
      title: "Module : Le Repas",
      description: "Apprendre le vocabulaire de la cuisine.",
      instructions: ["Lis les phrases", "Recompose les mots", "Remets l'ordre"]
    }
  },
  ecole: {
    title: "L'École",
    items: [
      { 
        id: 1, 
        text: "Rémi va à l'école.", 
        word: "ÉCOLE", 
        syllables: ["É", "CO", "LE"], 
        emoji: "🏫", 
        image: getMedia('ecole', '1', 'png'), 
        audio: getMedia('ecole', '1', 'mp3'),
        wordAudio: getMedia('ecole', 'ecole', 'mp3'),
        distractors: [getMedia('repas', '9', 'png')]
      },
      { 
        id: 2, 
        text: "Il lit.", 
        word: "LIT", 
        syllables: ["LIT"], 
        emoji: "📖", 
        image: getMedia('ecole', '2', 'png'), 
        audio: getMedia('ecole', '2', 'mp3'),
        wordAudio: getMedia('ecole', 'lit', 'mp3'),
        distractors: [getMedia('repas', '9', 'png')]
      },
      { 
        id: 3, 
        text: "Il aime lire.", 
        word: "LIRE", 
        syllables: ["LI", "RE"], 
        emoji: "📚", 
        image: getMedia('ecole', '3', 'png'), 
        audio: getMedia('ecole', '3', 'mp3'),
        wordAudio: getMedia('ecole', 'lire', 'mp3'),
        distractors: [getMedia('repas', '9', 'png')]
      },
      { 
        id: 4, 
        text: "Il parle avec des amis.", 
        word: "AMIS", 
        syllables: ["A", "MIS"], 
        emoji: "🧑‍🤝‍🧑", 
        image: getMedia('ecole', '4', 'png'), 
        audio: getMedia('ecole', '4', 'mp3'),
        wordAudio: getMedia('ecole', 'amis', 'mp3'),
        distractors: [getMedia('repas', '9', 'png')]
      },
      { 
        id: 5, 
        text: "Il a un pupitre.", 
        word: "PUPITRE", 
        syllables: ["PU", "PI", "TRE"], 
        emoji: "🪑", 
        image: getMedia('ecole', '5', 'png'), 
        audio: getMedia('ecole', '5', 'mp3'),
        wordAudio: getMedia('ecole', 'pupitre', 'mp3'),
        distractors: [getMedia('repas', '9', 'png')]
      },
      { 
        id: 6, 
        text: "Il rédige des phrases.", 
        word: "PHRASES", 
        syllables: ["PHRA", "SES"], 
        emoji: "📝", 
        image: getMedia('ecole', '6', 'png'), 
        audio: getMedia('ecole', '6', 'mp3'),
        wordAudio: getMedia('ecole', 'phrases', 'mp3'),
        distractors: [getMedia('repas', '9', 'png')]
      }
    ],
    evaluation: [
      { id: 1, type: "vraiFaux", question: "Rémi va au marché.", answer: false },
      { id: 2, type: "vraiFaux", question: "Rémi aime lire.", answer: true },
      { id: 3, type: "vraiFaux", question: "Rémi parle avec des amis.", answer: true },
      { id: 4, type: "vraiFaux", question: "Il a un pupitre dans la chambre.", answer: false },
      { id: 5, type: "vraiFaux", question: "Rémi rédige des phrases.", answer: true },
      { id: 6, type: "qcm", question: "Où va Rémi ?", options: ["À la mer", "À l'école", "Au parc"], answer: "À l'école" },
      { id: 7, type: "qcm", question: "Que fait Rémi avec les livres ?", options: ["Il les jette", "Il les colorie", "Il les lit"], answer: "Il les lit" },
      { id: 8, type: "qcm", question: "Avec qui Rémi parle-t-il ?", options: ["Avec des amis", "Avec un chat", "Tout seul"], answer: "Avec des amis" },
      { id: 9, type: "qcm", question: "Sur quoi Rémi travaille-t-il ?", options: ["Sur un tapis", "Sur un pupitre", "Sur un banc"], answer: "Sur un pupitre" },
      { id: 10, type: "qcm", question: "Que rédige Rémi ?", options: ["Des dessins", "Des phrases", "Des calculs"], answer: "Des phrases" }
    ],
    goal: {
      title: "Module : L'École",
      description: "Le vocabulaire de la classe.",
      instructions: ["Lis les actions", "Écris les mots", "Comprends l'histoire"]
    }
  },  soupe: {
    title: "La Soupe",
    items: [
      { 
        id: 1, 
        text: "Papa décide de faire sa fameuse soupe aux légumes.", 
        word: "SOUPE", 
        syllables: ["SOU", "PE"], 
        emoji: "🥣", 
        image: getMedia('soupe', '1', 'png'), 
        audio: getMedia('soupe', '1', 'mp3'),
        wordAudio: getMedia('soupe', 'soupe', 'mp3'),
        distractors: [getMedia('repas', '4', 'png')]
      },
      { 
        id: 2, 
        text: "Mélanie lave les carottes et le céleri.", 
        word: "CAROTTES", 
        syllables: ["CA", "ROT", "TES"], 
        emoji: "🥕", 
        image: getMedia('soupe', '2', 'png'), 
        audio: getMedia('soupe', '2', 'mp3'),
        wordAudio: getMedia('soupe', 'CAROTTES', 'mp3'),
        distractors: [getMedia('repas', '1', 'png')]
      },
      { 
        id: 3, 
        text: "Dans le bouillon de poulet,Rémi ajoute des morceaux de poireaux.", 
        word: "POIREAUX", 
        syllables: ["POI", "REAUX"], 
        emoji: "🥬", 
        image: getMedia('soupe', '3', 'png'), 
        audio: getMedia('soupe', '3', 'mp3'),
        wordAudio: getMedia('soupe', 'POIREAUX', 'mp3'),
        distractors: [getMedia('repas', '2', 'png')]
      },
      { 
        id: 4, 
        text: "Papa ajoute une boîte de tomates coupées en dés.", 
        word: "TOMATES", 
        syllables: ["TO", "MA", "TES"], 
        emoji: "🍅", 
        image: getMedia('soupe', '4', 'png'), 
        audio: getMedia('soupe', '4', 'mp3'),
        wordAudio: getMedia('soupe', 'TOMATES', 'mp3'),
        distractors: [getMedia('repas', '5', 'png')]
      },
      { 
        id: 5, 
        text: "Papa, Mélanie et Rémi regardent la soupe qui mijote.", 
        word: "MIJOTE", 
        syllables: ["MI", "JO", "TE"], 
        emoji: "🔥", 
        image: getMedia('soupe', '5', 'png'), 
        audio: getMedia('soupe', '5', 'mp3'),
        wordAudio: getMedia('soupe', 'MIJOTE', 'mp3'),
        distractors: [getMedia('repas', '7', 'png')]
      },
      { 
        id: 6, 
        text: "Toute la famille se régale pour le dîner.", 
        word: "FAMILLE", 
        syllables: ["FA", "MI", "LLE"], 
        emoji: "👨‍👩‍👧‍👦", 
        image: getMedia('soupe', '6', 'png'), 
        audio: getMedia('soupe', '6', 'mp3'),
        wordAudio: getMedia('soupe', 'FAMILLE', 'mp3'),
        distractors: [getMedia('repas', '10', 'png')]
      }
    ],
    evaluation: [
      { id: 1, type: "vraiFaux", question: "Papa prépare une soupe.", answer: true },
      { id: 2, type: "vraiFaux", question: "Mélanie lave les pommes.", answer: false },
      { id: 3, type: "vraiFaux", question: "Rémi ajoute des poireaux.", answer: true },
      { id: 4, type: "vraiFaux", question: "Papa ajoute des tomates.", answer: true },
      { id: 5, type: "vraiFaux", question: "La soupe est froide.", answer: false },

      { id: 6, type: "qcm", question: "Qui lave les carottes ?", options: ["Mélanie", "Rémi", "Papa"], answer: "Mélanie" },
      { id: 7, type: "qcm", question: "Que met Rémi dans la soupe ?", options: ["Du fromage", "Des poireaux", "Du pain"], answer: "Des poireaux" },
      { id: 8, type: "qcm", question: "Que met Papa dans la soupe ?", options: ["Des tomates", "Du riz", "Du sucre"], answer: "Des tomates" },
      { id: 9, type: "qcm", question: "Que fait la soupe ?", options: ["Elle dort", "Elle mijote", "Elle vole"], answer: "Elle mijote" },
      { id: 10, type: "qcm", question: "Qui mange la soupe ?", options: ["La famille", "Les voisins", "Le chat"], answer: "La famille" }
    ],
    goal: {
      title: "Module : La Soupe",
      description: "Comprendre une courte histoire et le vocabulaire de la cuisine.",
      instructions: ["Lis l'histoire", "Observe les images", "Réponds aux questions"]
    }
  }
};