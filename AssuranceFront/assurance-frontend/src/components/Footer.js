import React from 'react';
import '../footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Assurance - Tous droits réservés</p>
        <div className="footer-links">
          <a href="/about">À propos</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Mentions légales</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
