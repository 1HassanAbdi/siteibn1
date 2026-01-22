import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus, Book, Microscope, ArrowRight, Sparkles } from "lucide-react";
import styles from "./Activites.module.css";

const Activite = () => {
  const { annee } = useParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, [annee]);

  const subjects = [
    {
      id: "Mathematiques",
      name: "Mathématiques",
      desc: "Exercices interactifs : additions, soustractions, multiplications et problèmes !",
      icon: <Plus size={32} />,
      color: "#22c55e",
      emoji: "➕"
    },
    {
      id: "Francais",
      name: "Français",
      desc: "Lecture, grammaire, conjugaison et exercices adaptés à ton niveau.",
      icon: <Book size={32} />,
      color: "#3b82f6",
      emoji: "📘"
    },
    {
      id: "sciences",
      name: "Sciences",
      desc: "Découvre le monde à travers des activités amusantes et des expériences simples !",
      icon: <Microscope size={32} />,
      color: "#f97316",
      emoji: "🔬"
    }
  ];

  return (
    <div className={styles.container}>
      {/* HEADER : Identique à l'accueil */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Sparkles size={16} />
            <span>Ton espace personnel</span>
          </div>
          <h1 className={styles.mainTitle}>
            Apprendre en <span className={styles.highlight}>{annee}</span>
          </h1>
          <p className={styles.subtitle}>
            Choisis une matière pour commencer tes exercices interactifs.
          </p>
        </div>
      </header>

      {/* GRILLE D'ACTIVITÉS */}
      <section className={styles.selectionSection}>
        <div className={styles.grid}>
          {subjects.map((subject, i) => (
            <Link
              key={subject.id}
              to={`/activites/${annee}/${subject.id}`}
              className={`${styles.card} ${visible ? styles.cardVisible : ""}`}
              style={{ 
                "--hover-color": subject.color,
                transitionDelay: `${i * 100}ms` 
              }}
            >
              <div className={styles.cardBg} style={{ backgroundColor: subject.color }}></div>
              
              <div className={styles.cardContent}>
                <div className={styles.iconWrapper} style={{ backgroundColor: `${subject.color}15`, color: subject.color }}>
                  {subject.icon}
                </div>
                
                <div className={styles.textContainer}>
                  <h3 className={styles.levelName}>{subject.name}</h3>
                  <p className={styles.levelDesc}>{subject.desc}</p>
                </div>

                <div className={styles.actionBtn} style={{ backgroundColor: subject.color }}>
                  <span className={styles.btnText}>Explorer</span>
                  <ArrowRight size={18} color="white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Activite;