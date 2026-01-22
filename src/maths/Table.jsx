import React, { useState } from 'react';

// --- Styles CSS PROFESSIONNELS (Utilisation d'un objet JS pour la démonstration) ---
const styles = {
    // -----------------------------------------------------------------
    // Conteneur Principal
    // -----------------------------------------------------------------
    container: {
        maxWidth: '1200px',
        margin: '30px auto',
        padding: '30px',
        fontFamily: 'Roboto, Arial, sans-serif',
        backgroundColor: '#ffffff', // Blanc pur
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', // Ombre douce et profonde
    },
    header: {
        textAlign: 'center',
        color: '#3f51b5', // Bleu Indigo Material Design
        fontSize: '2.5em',
        fontWeight: 500,
        marginBottom: '10px',
    },
    subHeader: {
        textAlign: 'center',
        color: '#666',
        fontSize: '1.1em',
        marginBottom: '40px',
    },
    
    // -----------------------------------------------------------------
    // Grille des Tables
    // -----------------------------------------------------------------
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px',
    },

    // -----------------------------------------------------------------
    // Carte de Table (Accordéon)
    // -----------------------------------------------------------------
    tableCard: {
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
        }
    },
    
    // -----------------------------------------------------------------
    // En-tête de Table
    // -----------------------------------------------------------------
    tableHeader: {
        padding: '18px 20px',
        fontWeight: 'bold',
        fontSize: '1.3em',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        userSelect: 'none', // Empêche la sélection de texte au clic
        transition: 'background-color 0.3s',
    },
    
    // Styles spécifiques pour les tables 1-10 (Primaire)
    primaryHeader: {
        backgroundColor: '#4caf50', // Vert Matériel
        color: 'white',
    },
    
    // Styles spécifiques pour les tables 11-20 (Avancé)
    advancedHeader: {
        backgroundColor: '#ff9800', // Orange Ambre Matériel
        color: 'white',
    },

    // -----------------------------------------------------------------
    // Contenu de la Table
    // -----------------------------------------------------------------
    tableContent: {
        padding: '0 20px',
        maxHeight: '0', // Initialement fermé
        overflow: 'hidden',
        transition: 'max-height 0.4s ease-in-out, padding 0.4s ease-in-out',
        backgroundColor: '#f9f9f9',
    },
    tableContentOpen: {
        maxHeight: '350px', // Hauteur suffisante pour afficher tout
        padding: '15px 20px',
    },
    tableItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px dashed #e0e0e0',
        fontSize: '1.1em',
    },
    result: {
        fontWeight: 700,
        color: '#3f51b5',
    }
};

/**
 * Génère le contenu JSX pour une seule table de multiplication (1 à 10)
 */
const generateTableContent = (n) => {
    const content = [];
    for (let i = 1; i <= 10; i++) {
        content.push(
            <div key={i} style={styles.tableItem}>
                <span>{n} x {String(i).padStart(2, ' ')} =</span>
                <span style={styles.result}>{n * i}</span>
            </div>
        );
    }
    return content;
};

// =================================================================
// Composant principal
// =================================================================
const MultiplicationRevision = () => {
    const [openTable, setOpenTable] = useState(null); 

    const toggleTable = (tableNumber) => {
        setOpenTable(openTable === tableNumber ? null : tableNumber);
    };

    const tableNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

    return (
        <div style={styles.container}>
              
            <h1 style={styles.header}>

                ✅ Maîtrise des Tables de Multiplication (1 à 20)
            </h1>
            <p style={styles.subHeader}>
                Cliquez sur l'en-tête de la table pour réviser. Un excellent moyen de préparer votre concours !
            </p>

            <div style={styles.grid}>
                {tableNumbers.map((n) => {
                    const isOpen = openTable === n;
                    const isPrimary = n <= 10;
                    
                    // Combinez les styles de l'en-tête (commun + spécifique)
                    const headerStyle = {
                        ...styles.tableHeader,
                        ...(isPrimary ? styles.primaryHeader : styles.advancedHeader)
                    };

                    // Combinez les styles du contenu (commun + ouvert/fermé)
                    const contentStyle = {
                        ...styles.tableContent,
                        ...(isOpen ? styles.tableContentOpen : {})
                    };

                    return (
                        <div 
                            key={n} 
                            style={styles.tableCard}
                            // Note: Le 'hover' doit souvent être géré via CSS ou des événements JS/React plus avancés
                            // pour une implémentation professionnelle. Nous utilisons les événements ici pour rester pur JS.
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.tableCard['&:hover'])}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.tableCard)}
                        >
                            {/* En-tête cliquable */}
                            <div 
                                style={headerStyle}
                                onClick={() => toggleTable(n)}
                            >
                                Table de **{n}** {isPrimary ? '✨' : '🔥'}
                                <span>{isOpen ? '−' : '+'}</span> {/* Icône d'état plus simple */}
                            </div>

                            {/* Contenu de la table */}
                            <div style={contentStyle}>
                                {generateTableContent(n)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MultiplicationRevision;