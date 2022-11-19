import { useEffect } from 'react';
import css from './Modal.module.css';

export default function Modal({ closeModal, modalImage }) {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleKeyDown = event => {
    if (event.code === `Escape`) {
      closeModal();
    }
  };

  const handleBackdropClick = event => {
    if (event.target.nodeName === 'DIV') {
      closeModal();
    }
  };

  return (
    <div className={css.Overlay} onClick={handleBackdropClick}>
      <div className={css.Modal}>
        <img src={modalImage} alt="something" />
      </div>
    </div>
  );
}
