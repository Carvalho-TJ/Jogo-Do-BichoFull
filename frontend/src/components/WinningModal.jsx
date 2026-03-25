import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { TrophyFill, StarFill } from 'react-bootstrap-icons';
import Confetti from 'react-confetti';
import { getAnimalEmoji } from '../components/AnimalsEmoji';

const WinningModal = ({ show, onHide, winData }) => {
  if (!winData) return null;

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      size="md"
      contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      style={{ zIndex: 1060 }}
    >
      {show && <Confetti numberOfPieces={200} recycle={false} />}

      <Modal.Body className="text-center p-5 position-relative">
        <div className="mb-4">
          <TrophyFill size={80} color="#facc15" className="drop-shadow" />
        </div>
        
        <h2 className="fw-bold mb-2">Parabéns, Você Ganhou!</h2>
        <p className="text-muted mb-4 text-uppercase fw-medium letter-spacing-1">
          Resultado do Sorteio
        </p>

        <div className="bg-light p-4 rounded-4 mb-4 border border-dashed border-primary border-opacity-25">
          <div className="fs-1 mb-2">
            {getAnimalEmoji(winData.animalName || '🎲')}
          </div>
          <h3 className="fw-bold m-0">{winData.type}: {winData.chosenNumber}</h3>
          <div className="badge bg-primary bg-opacity-10 text-primary mt-2">
             Multiplicador: {winData.multiplier}x
          </div>
        </div>

        <div className="mb-4">
          <small className="text-muted d-block">Seu Prêmio:</small>
          <span className="display-6 fw-bold text-success">
            R$ {parseFloat(winData.prizeValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <Button 
          variant="primary" 
          onClick={onHide}
          className="w-100 py-3 rounded-3 fw-bold border-0 shadow-sm"
          style={{ backgroundColor: '#8b5cf6' }}
        >
          OBRIGADO!
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default WinningModal;