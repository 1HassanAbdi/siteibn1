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
        distractors: [ getMedia('repas', '1', 'png')] 
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
        distractors: [ getMedia('repas', '4', 'png')] 
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
        distractors: [getMedia('repas', '2', 'png')]
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
        distractors: [getMedia('ecole', '6', 'png')]
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
        distractors: [getMedia('ecole', '5', 'png')]
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
        distractors: [getMedia('ecole', '1', 'png')]
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
        distractors: [getMedia('ecole', '2', 'png')]
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
        distractors: [getMedia('ecole', '4', 'png')]
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
        distractors: [getMedia('ecole', '5', 'png')]
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
        distractors: [getMedia('soupe', '5', 'png')]
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
        distractors: [getMedia('soupe', '1', 'png')]
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
        distractors: [getMedia('soupe', '1', 'png')]
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
        distractors: [getMedia('soupe', '3', 'png')]
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
        distractors: [getMedia('soupe', '2', 'png')]
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
        distractors: [getMedia('soupe', '3', 'png')]
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
  },piqueNique: {
  title: "Le pique-nique",
  items: [
    { 
      id: 1, 
      text: "Gabrielle, Benoît et Mélanie font un pique-nique avec leur classe.", 
      word: "PIQUENIQUE", 
      syllables: ["PIQUE", "NIQUE"], 
      emoji: "🧺", 
      image: getMedia('piqueNique', '1', 'png'), 
      audio: getMedia('piqueNique', '1', 'mp3'),
      wordAudio: getMedia('piqueNique', 'PIQUE-NIQUE', 'mp3'),
      distractors: [getMedia('piqueNique', '3', 'png')]
    },
    { 
      id: 2, 
      text: "Gabrielle mange un croissant au poulet.", 
      word: "CROISSANT", 
      syllables: ["CROIS", "SANT"], 
      emoji: "🥐", 
      image: getMedia('piqueNique', '2', 'png'), 
      audio: getMedia('piqueNique', '2', 'mp3'),
      wordAudio: getMedia('piqueNique', 'CROISSANT', 'mp3'),
      distractors: [getMedia('piqueNique', '1', 'png')]
    },
    { 
      id: 3, 
      text: "Elle boit un jus.", 
      word: "JUS", 
      syllables: ["JUS"], 
      emoji: "🧃", 
      image: getMedia('piqueNique', '3', 'png'), 
      audio: getMedia('piqueNique', '3', 'mp3'),
      wordAudio: getMedia('piqueNique', 'JUS', 'mp3'),
      distractors: [getMedia('piqueNique', '2', 'png')]
    },
    { 
      id: 4, 
      text: "Elle mange aussi une pomme.", 
      word: "POMME", 
      syllables: ["POM", "ME"], 
      emoji: "🍎", 
      image: getMedia('piqueNique', '4', 'png'), 
      audio: getMedia('piqueNique', '4', 'mp3'),
      wordAudio: getMedia('piqueNique', 'POMME', 'mp3'),
      distractors: [getMedia('piqueNique', '12', 'png')]
    },
    { 
      id: 5, 
      text: "Benoît mange un sandwich au jambon.", 
      word: "SANDWICH", 
      syllables: ["SAND", "WICH"], 
      emoji: "🥪", 
      image: getMedia('piqueNique', '5', 'png'), 
      audio: getMedia('piqueNique', '5', 'mp3'),
      wordAudio: getMedia('piqueNique', 'SANDWICH', 'mp3'),
      distractors: [getMedia('piqueNique', '2', 'png')]
    },
    { 
      id: 6, 
      text: "Il mange aussi une poire.", 
      word: "POIRE", 
      syllables: ["POI", "RE"], 
      emoji: "🍐", 
      image: getMedia('piqueNique', '6', 'png'), 
      audio: getMedia('piqueNique', '6', 'mp3'),
      wordAudio: getMedia('piqueNique', 'POIRE', 'mp3'),
      distractors: [getMedia('piqueNique', '4', 'png')]
    },
    { 
      id: 7, 
      text: "Il boit un jus de pomme.", 
      word: "POMME", 
      syllables: ["POM", "ME"], 
      emoji: "🍏", 
      image: getMedia('piqueNique', '7', 'png'), 
      audio: getMedia('piqueNique', '7', 'mp3'),
      wordAudio: getMedia('piqueNique', 'POMME', 'mp3'),
      distractors: [getMedia('piqueNique', '7', 'png')]
    },
    { 
      id: 8, 
      text: "Mélanie a apporté du fromage.", 
      word: "FROMAGE", 
      syllables: ["FRO", "MAGE"], 
      emoji: "🧀", 
      image: getMedia('piqueNique', '8', 'png'), 
      audio: getMedia('piqueNique', '8', 'mp3'),
      wordAudio: getMedia('piqueNique', 'FROMAGE', 'mp3'),
      distractors: [getMedia('piqueNique', '3', 'png')]
    },
    { 
      id: 9, 
      text: "Elle a aussi un croissant au jambon.", 
      word: "JAMBON", 
      syllables: ["JAM", "BON"], 
      emoji: "🥓", 
      image: getMedia('piqueNique', '9', 'png'), 
      audio: getMedia('piqueNique', '9', 'mp3'),
      wordAudio: getMedia('piqueNique', 'JAMBON', 'mp3'),
      distractors: [getMedia('piqueNique', '5', 'png')]
    },
    { 
      id: 10, 
      text: "Elle mange une prune.", 
      word: "PRUNE", 
      syllables: ["PRU", "NE"], 
      emoji: "🍑", 
      image: getMedia('piqueNique', '10', 'png'), 
      audio: getMedia('piqueNique', '10', 'mp3'),
      wordAudio: getMedia('piqueNique', 'PRUNE', 'mp3'),
      distractors: [getMedia('piqueNique', '1', 'png')]
    },
    { 
      id: 11, 
      text: "Ils mangent tous ensemble au parc.", 
      word: "PARC", 
      syllables: ["PARC"], 
      emoji: "🌳", 
      image: getMedia('piqueNique', '11', 'png'), 
      audio: getMedia('piqueNique', '11', 'mp3'),
      wordAudio: getMedia('piqueNique', 'PARC', 'mp3'),
      distractors: [getMedia('piqueNique', '2', 'png')]
    },
    { 
      id: 12, 
      text: "Ensuite, ils iront visiter un musée.", 
      word: "MUSÉE", 
      syllables: ["MU", "SÉE"], 
      emoji: "🏛️", 
      image: getMedia('piqueNique', '12', 'png'), 
      audio: getMedia('piqueNique', '12', 'mp3'),
      wordAudio: getMedia('piqueNique', 'MUSÉE', 'mp3'),
      distractors: [getMedia('piqueNique', '3', 'png')]
    }
  ],

  evaluation: [
    { id: 1, type: "vraiFaux", question: "Les enfants font un pique-nique.", answer: true },
    { id: 2, type: "vraiFaux", question: "Gabrielle mange une banane.", answer: false },
    { id: 3, type: "vraiFaux", question: "Benoît boit un jus de pomme.", answer: true },
    { id: 4, type: "vraiFaux", question: "Mélanie n'a rien apporté.", answer: false },
    { id: 5, type: "vraiFaux", question: "Ils mangent au parc.", answer: true },

    { id: 6, type: "qcm", question: "Que mange Gabrielle ?", options: ["Un croissant au poulet", "Une pizza", "Du riz"], answer: "Un croissant au poulet" },
    { id: 7, type: "qcm", question: "Que boit Benoît ?", options: ["Du lait", "Un jus de pomme", "Du chocolat chaud"], answer: "Un jus de pomme" },
    { id: 8, type: "qcm", question: "Qu'a apporté Mélanie ?", options: ["Du fromage", "Du poisson", "Du riz"], answer: "Du fromage" },
    { id: 9, type: "qcm", question: "Où vont-ils après le pique-nique ?", options: ["Au musée", "À la piscine", "À l'école"], answer: "Au musée" }
  ],

  goal: {
    title: "Module : Le pique-nique",
    description: "Comprendre une histoire simple et le vocabulaire de la nourriture.",
    instructions: ["Lis l'histoire", "Observe les images", "Écoute les audios", "Réponds aux questions"]
  }


},manonChambre: {
  title: "La chambre de Manon",
  items: [
    { 
      id: 1, 
      text: "Manon a une belle chambre.", 
      word: "CHAMBRE", 
      syllables: ["CHAM", "BRE"], 
      emoji: "🛏️", 
      image: getMedia('manonChambre', '1', 'png'), 
      audio: getMedia('manonChambre', '1', 'mp3'),
      wordAudio: getMedia('manonChambre', 'CHAMBRE', 'mp3'),
      distractors: [getMedia('manonChambre', '8', 'png')]
    },
    { 
      id: 2, 
      text: "Elle est grande.", 
      word: "GRANDE", 
      syllables: ["GRAN", "DE"], 
      emoji: "📏", 
      image: getMedia('manonChambre', '2', 'png'), 
      audio: getMedia('manonChambre', '2', 'mp3'),
      wordAudio: getMedia('manonChambre', 'GRANDE', 'mp3'),
      distractors: [getMedia('manonChambre', '8', 'png')]
    },
    { 
      id: 3, 
      text: "Dans la chambre, il y a un lit et un bureau.", 
      word: "BUREAU", 
      syllables: ["BU", "REAU"], 
      emoji: "🪑", 
      image: getMedia('manonChambre', '3', 'png'), 
      audio: getMedia('manonChambre', '3', 'mp3'),
      wordAudio: getMedia('manonChambre', 'BUREAU', 'mp3'),
      distractors: [getMedia('manonChambre', '8', 'png')]
    },
    { 
      id: 4, 
      text: "Il y a des jeux par terre.", 
      word: "JEUX", 
      syllables: ["JEUX"], 
      emoji: "🧸", 
      image: getMedia('manonChambre', '4', 'png'), 
      audio: getMedia('manonChambre', '4', 'mp3'),
      wordAudio: getMedia('manonChambre', 'JEUX', 'mp3'),
      distractors: [getMedia('manonChambre', '8', 'png')]
    },
    { 
      id: 5, 
      text: "Son chat, Kato, a marché sur son jeu de construction.", 
      word: "CHAT", 
      syllables: ["CHAT"], 
      emoji: "🐱", 
      image: getMedia('manonChambre', '5', 'png'), 
      audio: getMedia('manonChambre', '5', 'mp3'),
      wordAudio: getMedia('manonChambre', 'CHAT', 'mp3'),
      distractors: [getMedia('manonChambre', '8', 'png')]
    },
    { 
      id: 6, 
      text: "Il y a des cubes de bois partout.", 
      word: "CUBES", 
      syllables: ["CU", "BES"], 
      emoji: "🧊", 
      image: getMedia('manonChambre', '6', 'png'), 
      audio: getMedia('manonChambre', '6', 'mp3'),
      wordAudio: getMedia('manonChambre', 'CUBES', 'mp3'),
      distractors: [getMedia('manonChambre', '8', 'png')]
    },
    { 
      id: 7, 
      text: "Manon doit ranger sa chambre.", 
      word: "RANGER", 
      syllables: ["RAN", "GER"], 
      emoji: "🧹", 
      image: getMedia('manonChambre', '7', 'png'), 
      audio: getMedia('manonChambre', '7', 'mp3'),
      wordAudio: getMedia('manonChambre', 'RANGER', 'mp3'),
      distractors: [getMedia('manonChambre', '5', 'png')]
    },
    { 
      id: 8, 
      text: "Manon est contente de sa belle chambre propre.", 
      word: "PROPRE", 
      syllables: ["PRO", "PRE"], 
      emoji: "✨", 
      image: getMedia('manonChambre', '8', 'png'), 
      audio: getMedia('manonChambre', '8', 'mp3'),
      wordAudio: getMedia('manonChambre', 'PROPRE', 'mp3'),
      distractors: [getMedia('manonChambre', '8', 'png')]
    }
  ],

  evaluation: [
    { id: 1, type: "vraiFaux", question: "Manon a une belle chambre.", answer: true },
    { id: 2, type: "vraiFaux", question: "La chambre est petite.", answer: false },
    { id: 3, type: "vraiFaux", question: "Il y a un lit dans la chambre.", answer: true },
    { id: 4, type: "vraiFaux", question: "Kato est le chien de Manon.", answer: false },
    { id: 5, type: "vraiFaux", question: "Il y a des cubes de bois partout.", answer: true },

    { id: 6, type: "qcm", question: "Que trouve-t-on dans la chambre ?", options: ["Un lit et un bureau", "Une voiture", "Une piscine"], answer: "Un lit et un bureau" },
    { id: 7, type: "qcm", question: "Qui marche sur le jeu de construction ?", options: ["Manon", "Kato", "Le voisin"], answer: "Kato" },
    { id: 8, type: "qcm", question: "Que doit faire Manon ?", options: ["Dormir", "Ranger sa chambre", "Sortir"], answer: "Ranger sa chambre" },
    { id: 9, type: "qcm", question: "Comment est la chambre à la fin ?", options: ["Sale", "Propre", "Cassée"], answer: "Propre" }
  ],

  goal: {
    title: "Module : La chambre de Manon",
    description: "Comprendre une courte histoire et le vocabulaire de la chambre.",
    instructions: ["Lis l'histoire", "Observe les images", "Réponds aux questions"]
  }
}
,blanchePoule: {
  title: "Blanche la poule",
  items: [
    { 
      id: 1, 
      text: "La poule est dans son nid.", 
      word: "POULE", 
      syllables: ["POU", "LE"], 
      emoji: "🐔", 
      image: getMedia('blanchePoule', '1', 'png'), 
      audio: getMedia('blanchePoule', '1', 'mp3'),
      wordAudio: getMedia('blanchePoule', 'POULE', 'mp3'),
      distractors: [getMedia('blanchePoule', '4', 'png')]
    },
    { 
      id: 2, 
      text: "Elle se nomme Blanche.", 
      word: "BLANCHE", 
      syllables: ["BLAN", "CHE"], 
      emoji: "🤍", 
      image: getMedia('blanchePoule', '2', 'png'), 
      audio: getMedia('blanchePoule', '2', 'mp3'),
      wordAudio: getMedia('blanchePoule', 'BLANCHE', 'mp3'),
      distractors: [getMedia('blanchePoule', '4', 'png')]
    },
    { 
      id: 3, 
      text: "Blanche pond des œufs.", 
      word: "ŒUFS", 
      syllables: ["ŒUFS"], 
      emoji: "🥚", 
      image: getMedia('blanchePoule', '3', 'png'), 
      audio: getMedia('blanchePoule', '3', 'mp3'),
      wordAudio: getMedia('blanchePoule', 'ŒUFS', 'mp3'),
      distractors: [getMedia('blanchePoule', '1', 'png')]
    },
    { 
      id: 4, 
      text: "De bons œufs pour notre déjeuner.", 
      word: "DÉJEUNER", 
      syllables: ["DÉ", "JEU", "NER"], 
      emoji: "🍳", 
      image: getMedia('blanchePoule', '4', 'png'), 
      audio: getMedia('blanchePoule', '4', 'mp3'),
      wordAudio: getMedia('blanchePoule', 'DÉJEUNER', 'mp3'),
      distractors: [getMedia('blanchePoule', '4', 'png')]
    },
    { 
      id: 5, 
      text: "Blanche est contente de se promener dans son enclos.", 
      word: "ENCLOS", 
      syllables: ["EN", "CLOS"], 
      emoji: "🏡", 
      image: getMedia('blanchePoule', '5', 'png'), 
      audio: getMedia('blanchePoule', '5', 'mp3'),
      wordAudio: getMedia('blanchePoule', 'ENCLOS', 'mp3'),
      distractors: [getMedia('blanchePoule', '3', 'png')]
    },
    { 
      id: 6, 
      text: "Blanche mange des grains.", 
      word: "GRAINS", 
      syllables: ["GRAINS"], 
      emoji: "🌾", 
      image: getMedia('blanchePoule', '6', 'png'), 
      audio: getMedia('blanchePoule', '6', 'mp3'),
      wordAudio: getMedia('blanchePoule', 'GRAINS', 'mp3'),
      distractors: [getMedia('blanchePoule', '3', 'png')]
    },
    { 
      id: 7, 
      text: "Blanche est ma poule préférée.", 
      word: "PRÉFÉRÉE", 
      syllables: ["PRÉ", "FÉ", "RÉE"], 
      emoji: "❤️", 
      image: getMedia('blanchePoule', '7', 'png'), 
      audio: getMedia('blanchePoule', '7', 'mp3'),
      wordAudio: getMedia('blanchePoule', 'PRÉFÉRÉE', 'mp3'),
      distractors: [getMedia('blanchePoule', '3', 'png')]
    }
  ],

  evaluation: [
    { id: 1, type: "vraiFaux", question: "La poule est dans son nid.", answer: true },
    { id: 2, type: "vraiFaux", question: "La poule s'appelle Noire.", answer: false },
    { id: 3, type: "vraiFaux", question: "Blanche pond des œufs.", answer: true },
    { id: 4, type: "vraiFaux", question: "Blanche n'aime pas son enclos.", answer: false },
    { id: 5, type: "vraiFaux", question: "Blanche mange des grains.", answer: true },

    { id: 6, type: "qcm", question: "Où est la poule au début ?", options: ["Dans son nid", "Dans la maison", "Dans la forêt"], answer: "Dans son nid" },
    { id: 7, type: "qcm", question: "Que pond Blanche ?", options: ["Des pierres", "Des œufs", "Des plumes"], answer: "Des œufs" },
    { id: 8, type: "qcm", question: "Que mange Blanche ?", options: ["Des bonbons", "Des grains", "Du fromage"], answer: "Des grains" },
    { id: 9, type: "qcm", question: "Comment est Blanche pour toi ?", options: ["Ma poule préférée", "Une poule méchante", "Une poule inconnue"], answer: "Ma poule préférée" }
  ],

  goal: {
    title: "Module : Blanche la poule",
    description: "Comprendre une courte histoire et le vocabulaire de la ferme.",
    instructions: ["Lis l'histoire", "Observe les images", "Écoute les audios", "Réponds aux questions"]
  }
}




};