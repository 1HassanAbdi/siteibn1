// --- LOGIQUE DE CONJUGAISON (PRÉSENT, FUTUR, IMPARFAIT, PASSÉ COMPOSÉ) ---

export const PRONOMS = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];

export const genererToutesConjugaisons = (verbe, groupe) => {
  const v = verbe.toLowerCase();
  
  return {
    "Indicatif présent": conjuguerPresent(v, groupe),
    "Futur simple": conjuguerFutur(v, groupe),
    "Imparfait": conjuguerImparfait(v, groupe),
    "Passé composé": conjuguerPasseCompose(v, groupe)
  };
};

// 1. PRÉSENT
const conjuguerPresent = (v, groupe) => {
  if (v === "être") return ["suis", "es", "est", "sommes", "êtes", "sont"];
  if (v === "avoir") return ["ai", "as", "a", "avons", "avez", "ont"];
  if (v === "aller") return ["vais", "vas", "va", "allons", "allez", "vont"];

  const rad = v.slice(0, -2);
  if (groupe === 1) {
    let n = rad + "ons";
    if (v.endsWith("ger")) n = rad + "eons"; // Manger -> Mangeons
    if (v.endsWith("cer")) n = v.slice(0, -3) + "çons"; // Avancer -> Avançons
    return [rad + "e", rad + "es", rad + "e", n, rad + "ez", rad + "ent"];
  }
  if (groupe === 2) {
    return [rad + "is", rad + "is", rad + "it", rad + "issons", rad + "issez", rad + "issent"];
  }
  return Array(6).fill(rad + "..."); // Pour le groupe 3 (nécessite une base de données spécifique)
};

// 2. FUTUR SIMPLE
const conjuguerFutur = (v, groupe) => {
  const terminaisons = ["ai", "as", "a", "ons", "ez", "ont"];
  let base = v; // La plupart du temps, l'infinitif complet
  
  if (v === "être") base = "ser";
  if (v === "avoir") base = "aur";
  if (v === "aller") base = "ir";
  if (v === "faire") base = "fer";
  if (v === "venir") base = "viendr";
  
  return terminaisons.map(t => base + t);
};

// 3. IMPARFAIT
const conjuguerImparfait = (v, groupe) => {
  const terminaisons = ["ais", "ais", "ait", "ions", "iez", "aient"];
  let rad = v.slice(0, -2);
  
  if (v === "être") rad = "ét";
  if (v === "avoir") rad = "av";
  if (groupe === 2) rad += "iss"; // Finir -> Finiss-ais
  if (v.endsWith("ger")) rad += "e"; // Manger -> Mangeais (sauf nous/vous géré par terminaison)
  
  return terminaisons.map((t, i) => {
    let r = rad;
    if (v.endsWith("ger") && (i === 3 || i === 4)) r = v.slice(0, -2); // nous mang-ions
    return r + t;
  });
};

// 4. PASSÉ COMPOSÉ
const conjuguerPasseCompose = (v, groupe) => {
  const etreVerbes = ["aller", "arriver", "partir", "sortir", "venir"];
  const auxAvoir = ["ai", "as", "a", "avons", "avez", "ont"];
  const auxEtre = ["suis", "es", "est", "sommes", "êtes", "sont"];
  
  let participe = "";
  if (groupe === 1) participe = v.slice(0, -2) + "é";
  else if (groupe === 2) participe = v.slice(0, -2) + "i";
  else {
    if (v === "être") participe = "été";
    else if (v === "avoir") participe = "eu";
    else if (v === "faire") participe = "fait";
    else participe = v.slice(0, -2) + "u"; // Approximation groupe 3
  }

  const auxiliaire = etreVerbes.includes(v) ? auxEtre : auxAvoir;
  return auxiliaire.map(aux => `${aux} ${participe}`);
};