import React from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, children }) => {
  // Se o modal não estiver aberto, não renderiza nada.
  if (!isOpen) {
    return null;
  }

  return (
    // O "overlay" é o fundo semi-transparente que cobre a tela inteira.
    // Clicar nele também fecha o modal.
    <div className="modal-overlay" onClick={onClose}>
      {/* O "modal-content" é a janela branca no centro.
          O e.stopPropagation() impede que o clique dentro da janela feche o modal. */}
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        {/* O botão de fechar */}
        <button className="modal-close-button" onClick={onClose}>
          <FiX />
        </button>
        {/* Aqui renderizamos o conteúdo que for passado para o modal */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
