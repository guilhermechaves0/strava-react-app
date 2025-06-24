import React from 'react';
import { FiLogIn, FiLogOut, FiTrendingUp } from 'react-icons/fi';

const Header = ({ user }) => { // Agora o Header recebe o usuário como "prop"

  const handleLogout = async () => {
  // A mudança é adicionar o objeto de opções com 'method' e 'credentials'
  await fetch('http://localhost:3000/auth/logout', { 
    method: 'POST',
    credentials: 'include' // <-- AQUI ESTÁ A CORREÇÃO
  });
  window.location.reload(); // Recarrega a página para o App.jsx verificar o status novamente
};

  return (
    <header className="site-header">
      <div className="header-content">
        <div className="logo-container">
          <FiTrendingUp className="logo-icon" />
          <span className="logo-text">Melhora Gui</span>
        </div>

        <div className="user-section">
          {user ? (
            // Se o usuário EXISTE, mostra o perfil e o botão de sair
            <div className="user-profile">
              <img src={user.profile_medium} alt={user.firstname} className="profile-picture" />
              <span>Olá, {user.firstname}</span>
              <button onClick={handleLogout} className="logout-button" title="Sair">
                <FiLogOut />
              </button>
            </div>
          ) : (
            // Se o usuário NÃO existe, mostra o botão de conectar
            <a href="http://localhost:3000/auth/strava" className="login-button">
              <FiLogIn />
              <span>Conectar com o Strava</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;