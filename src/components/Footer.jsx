import React from 'react';
import { FiGithub } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="site-footer">
      <p>&copy; 2025 Melhora Gui. Criado por Guilherme Chaves.</p>
      <div className="footer-links">
        <a href="https://github.com/guilhermechaves0" target="_blank" rel="noopener noreferrer"> {/* <-- TROQUE PELO SEU GITHUB */}
          <FiGithub />
        </a>
        {/* Você pode adicionar mais links aqui, como para o seu LinkedIn */}
      </div>
    </footer>
  );
};

export default Footer;