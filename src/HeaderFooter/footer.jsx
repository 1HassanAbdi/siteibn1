import React from 'react';
import styles from './footer.module.css';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const Footer1 = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Footer Brand or Name */}
        <div className={styles.column}>
          <h3 className={styles.heading}>Hassan Abdi Galeb</h3>
          <p>Full-Stack Developer | AI Specialist</p>
          <p>Deep knowledge in teaching and accounting</p>
        </div>

        {/* Contact Information */}
        <div className={styles.column}>
          <h3 className={styles.heading}>Contact Information</h3>
          <ul className={styles.list}>
            <li><FaEnvelope /> <a href="hassan.galeb@eibschool.ca">hassan.galeb@eibschool.ca</a></li>
            <li><FaPhone /> +....-....-...</li>
            <li><FaMapMarkerAlt /> Ottawa, Ontario</li>
          </ul>
        </div>

        {/* Key Strengths */}
        <div className={styles.column}>
          <h3 className={styles.heading}>Key Strengths</h3>
          <ul className={styles.list}>
            <li>Advanced AI Modeling</li>
            <li>Full-Stack Development (React, Node.js, etc.)</li>
            <li>Extensive knowledge in teaching techniques</li>
            <li>Expertise in accounting and self-learning</li>
          </ul>
        </div>
      </div>

      {/* Social Media Links */}
      <div className={styles.socialMedia}>
        <h3 className={styles.heading}>Follow Me</h3>
        <ul className={styles.list}>
          <ul className={styles.list}>
            <li><button onClick={() => window.open('', '_blank')}><FaLinkedin /></button></li>
            <li><button onClick={() => window.open('', '_blank')}><FaGithub /></button></li>
            <li><button onClick={() => window.open('', '_blank')}><FaTwitter /></button></li>
          </ul>

        </ul>
      </div>

      {/* Copyright Information */}
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Hassan Abdi Galeb. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer1;
