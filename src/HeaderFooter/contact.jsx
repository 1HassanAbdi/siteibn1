import React from 'react';
import styles from './Contact.module.css'; // Import du module CSS

const Contact = () => {
  return (
    <div className={styles.contactPage}>
      <div className={styles.contactContainer}>
        <h1>📞 Contact</h1>
        <p className={styles.constructionMessage}>🚧 Cette page est actuellement en construction 🚧</p>
        <p>Merci de votre patience, nous travaillons à la rendre disponible très bientôt !</p>
      </div>
    </div>
  );
};

export default Contact;
