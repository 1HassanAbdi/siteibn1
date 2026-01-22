import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, GraduationCap, ArrowRight } from "lucide-react"; // Utilisation de Lucide pour des icônes pros
import niveaux from "./Accueil.json";
import styles from "./Accueil.module.css";

const Accueil = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Petit délai pour déclencher l'animation d'entrée
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      {/* SECTION HÉRO : ACCUEIL CHALEUREUX */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Sparkles size={16} />
            <span>Apprendre en s'amusant</span>
          </div>
          <h1 className={styles.mainTitle}>
            Bienvenue dans ton <span className={styles.highlight}>Espace Aventure</span> 🧠
          </h1>
          <p className={styles.subtitle}>
            ...
          </p>
        </div>
      </header>

      {/* SECTION GRILLE : SÉLECTION DU NIVEAU */}
      <section className={styles.selectionSection}>
        <div className={styles.sectionHeader}>
          <GraduationCap size={32} className={styles.sectionIcon} />
          <h2>Choisis ton année scolaire</h2>
        </div>

        <div className={styles.grid}>
          {niveaux.map((n, i) => (
            <Link
              key={i}
              to={`/activites/${n.niveau}`}
              className={`${styles.card} ${visible ? styles.cardVisible : ""}`}
              style={{ 
                "--hover-color": n.color,
                transitionDelay: `${i * 100}ms` // Apparition en cascade
              }}
            >
              {/* Cercle décoratif en arrière-plan */}
              <div className={styles.cardBg} style={{ backgroundColor: n.color }}></div>
              
              <div className={styles.cardContent}>
                <div className={styles.iconWrapper} style={{ backgroundColor: `${n.color}22`, color: n.color }}>
                  <span className={styles.emojiIcon}>{n.icon}</span>
                </div>
                
                <div className={styles.textContainer}>
                  <h3 className={styles.levelName}>{n.niveau.replace("-", " ")}</h3>
                  <p className={styles.levelDesc}>Accéder aux exercices</p>
                </div>

                <div className={styles.actionBtn} style={{ backgroundColor: n.color }}>
                  <ArrowRight size={20} color="white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Accueil;