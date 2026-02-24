import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react'; 
import styles from './Header.module.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo et titre */}
        <Link to="/" className={styles.logoContainer} onClick={closeMenu}>
          <div className={styles.logoWrapper}>
             <img src="/logo1.png" alt="Logo" className={styles.logo} />
          </div>
          <div className={styles.textContent}>
            <h1>Ibn Batouta</h1>
            <p>Espace Apprentissage</p>
          </div>
        </Link>

        {/* Menu de navigation Desktop */}
        <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
          <ul className={styles.navList}>
            <li><Link to="/" onClick={closeMenu}>Accueil</Link></li>
            <li><Link to="/Multiplication" onClick={closeMenu}>Multiplication</Link></li>
           
            <li><Link to="/test" onClick={closeMenu}>OQRE</Link></li>
            <li><Link to="/ens" onClick={closeMenu}>Portail</Link></li>
            <li><Link to="/Concours3" className={styles.specialLink} onClick={closeMenu}>Concours 🏆</Link></li>
            <li><Link to="/Concours2" className={styles.specialLink} onClick={closeMenu}>Concourscka 🏆</Link></li>
          </ul>
        </nav>

        {/* Bouton Hamburger Mobile */}
        <button className={styles.hamburger} onClick={toggleMenu}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>
    </header>
  );
};

export default Header;