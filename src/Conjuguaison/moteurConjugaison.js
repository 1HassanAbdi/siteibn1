// moteurConjugaison.js
const listes = {
  1: ["Acheter", "Aider", "Aimer", "Ajouter", "Amuser", "Appeler", "Appuyer", "Arpenter", "Arriver", "Arroser", "Avancer", "Balayer", "Changer", "Chanter", "Chercher", "Commencer", "Déclarer", "Décorer", "Déplacer", "Déployer", "Dessiner", "Diriger", "Donner", "Écouter", "Effacer", "Employer", "Envoyer", "Espérer", "Essayer", "Étudier", "Exploser", "Exposer", "Fermer", "Flâner", "Forcer", "Gagner", "Geler", "Goûter", "Immobiliser", "Jaser", "Jeter", "Jouer", "Lancer", "Laver", "Mâcher", "Manger", "Marcher", "Modeler", "Nager", "Nier", "Oublier", "Parler", "Partager", "Payer", "Penser", "Peser", "Placer", "Porter", "Prier", "Regarder", "Relier", "Sauter", "Savourer", "Souhaiter", "Téléphoner", "Tirer", "Tourner", "Travailler", "Trier", "Trouver", "Utiliser"],
  2: ["Agrandir", "Applaudir", "Arrondir", "Bâtir", "Choisir", "Définir", "Élargir", "Finir", "Franchir", "Guérir", "Obéir", "Punir", "Remplir", "Réussir", "Rougir"],
  3: ["Accueillir", "Aller", "Apercevoir", "Asseoir", "Attendre", "Avoir", "Battre", "Boire", "Bouillir", "Céder", "Comprendre", "Conduire", "Connaître", "Construire", "Courir", "Craindre", "Croire", "Cueillir", "Décevoir", "Devenir", "Devoir", "Dire", "Dormir", "Éteindre", "Être", "Faire", "Joindre", "Lire", "Mentir", "Mettre", "Mordre", "Mourir", "Offrir", "Ouvrir", "Paraître", "Partir", "Peindre", "Perdre", "Pouvoir", "Prendre", "Prévoir", "Recevoir", "Réfléchir", "Rejoindre", "Réjouir", "Remettre", "Rendre", "Répondre", "Résoudre", "Revenir", "Rire", "Rompre", "Savoir", "Sentir", "Servir", "Sortir", "Soumettre", "Suffire", "Suivre", "Taire", "Tenir", "Valoir", "Vendre", "Venir", "Vivre", "Voir", "Vouloir"]
};

export const genererConjugaison = (verbe, groupe) => {
  const rad = verbe.slice(0, -2);
  if (groupe === 1) {
    let nous = rad + "ons";
    if (verbe.endsWith("ger")) nous = rad + "eons";
    if (verbe.endsWith("cer")) nous = verbe.slice(0, -3) + "çons";
    return [rad + "e", rad + "es", rad + "e", nous, rad + "ez", rad + "ent"];
  }
  if (groupe === 2) return [rad + "is", rad + "is", rad + "it", rad + "issons", rad + "issez", rad + "issent"];
  
  // Quelques irréguliers du 3e (à compléter)
  const irreg = {
    "Aller": ["vais", "vas", "va", "allons", "allez", "vont"],
    "Être": ["suis", "es", "est", "sommes", "êtes", "sont"],
    "Avoir": ["ai", "as", "a", "avons", "avez", "ont"]
  };
  return irreg[verbe] || [rad, rad, rad, rad, rad, rad];
};

export const TOUS_LES_VERBES = Object.entries(listes).flatMap(([g, verbes]) => 
  verbes.map(v => ({ n: v, g: parseInt(g) }))
).sort((a, b) => a.n.localeCompare(b.n));