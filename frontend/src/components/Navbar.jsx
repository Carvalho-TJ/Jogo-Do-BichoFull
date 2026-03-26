import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BoxArrowRight, PersonCircle, Dice5, ClockHistory, List, X } from 'react-bootstrap-icons';
import bichoFullLogo from '../assets/bichofull-logo.png';

const ROXO_PRINCIPAL = '#6c5ce7'; 
const VERDE_HOVER = '#00b894';
const ROXO_FUNDO_SALDO = '#f0edff';

const Navbar = ({ user, balance }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="navbar navbar-light bg-white shadow-sm sticky-top border-bottom py-2 mb-3">
        <div className="container-fluid d-flex align-items-center justify-content-between px-md-5">
          
          {/* LADO ESQUERDO: Logo */}
          <Link to="/dashboard" className="navbar-brand m-0">
            <img src={bichoFullLogo} alt="BichoFull" height="40" className="d-inline-block align-top" />
          </Link>

          {/* CENTRO: Apostar e Histórico */}
          <div className="d-none d-lg-flex position-absolute start-50 translate-middle-x gap-4">
            <Link to="/dashboard" className="nav-link-custom text-decoration-none fw-bold d-flex align-items-center">
              <Dice5 className="me-2 fs-5" /> Apostar
            </Link>
            <Link to="/history" className="nav-link-custom text-decoration-none fw-bold d-flex align-items-center">
              <ClockHistory className="me-2 fs-5" /> Histórico
            </Link>
          </div>

          {/* LADO DIREITO: Usuário e Sair (Desktop) */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <div className="small text-muted">
              <PersonCircle className="me-2 fs-5"/>
              Olá, <strong className="fw-bold" style={{ color: ROXO_PRINCIPAL }}>{user?.name}</strong>
            </div>
            {/* Botão de Sair */}
            <button 
              onClick={handleLogout} 
              className="btn btn-sm btn-outline-danger rounded-pill px-3 border-0 d-flex align-items-center gap-1"
              style={{ backgroundColor: 'rgba(220, 53, 69, 0.05)' }}
            >
              <BoxArrowRight size={16} /> Sair
            </button>
          </div>

          {/* BOTÃO HAMBÚRGUER (Mobile) */}
          <button className="btn d-lg-none border-0 p-0" style={{ color: ROXO_PRINCIPAL }} onClick={() => setIsMenuOpen(true)}>
            <List size={30} />
          </button>
        </div>
      </nav>

      {/* SIDEBAR MOBILE */}
      <div 
        className={`position-fixed top-0 end-0 h-100 bg-white shadow-lg transition-all`} 
        style={{ 
          width: '300px', 
          zIndex: 1050, 
          transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          overflowY: 'auto'
        }}
      >
        <div className="p-4">
          {/* Menu Mobile */}
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
            <img src={bichoFullLogo} alt="Logo" height="35" />
            <button className="btn p-0" style={{ color: ROXO_PRINCIPAL }} onClick={closeMenu}><X size={35} /></button>
          </div>

          {/* Card de Saldo */}
          <div className="small text-muted mb-3">
            Olá, <strong className="fw-bold" style={{ color: ROXO_PRINCIPAL }}>{user?.name}</strong>
          </div>
          <div className="p-3 rounded-4 mb-4" style={{ backgroundColor: ROXO_FUNDO_SALDO }}>
            <small className="text-muted d-block fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Saldo atual</small>
            <span className="fw-black fs-4" style={{ color: ROXO_PRINCIPAL }}>
              R$ {parseFloat(balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Links do Menu Mobile */}
          <div className="list-group list-group-flush">
            <Link to="/dashboard" onClick={closeMenu} className="list-group-item list-group-item-action border-0 py-3 fw-bold d-flex align-items-center nav-mobile-item">
              <Dice5 className="me-3 fs-5" /> Apostar
            </Link>
            <Link to="/history" onClick={closeMenu} className="list-group-item list-group-item-action border-0 py-3 fw-bold d-flex align-items-center nav-mobile-item">
              <ClockHistory className="me-3 fs-5" /> Histórico
            </Link>
            
            {/* Espaçador e Botão Sair no final */}
            <div className="mt-5 pt-3 border-top">
              <button onClick={handleLogout} className="btn btn-link list-group-item list-group-item-action border-0 py-3 text-danger text-decoration-none fw-bold p-0 d-flex align-items-center">
                <BoxArrowRight className="me-3 fs-5" /> Sair da conta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY (Fundo escuro ao abrir o menu) */}
      {isMenuOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-black opacity-50" 
          style={{ zIndex: 1040 }}
          onClick={closeMenu}
        ></div>
      )}

      <style>{`
        /* Estilo para links Desktop */
        .nav-link-custom {
          color: ${ROXO_PRINCIPAL};
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .nav-link-custom:hover {
          color: ${VERDE_HOVER};
          transform: translateY(-1px);
        }
        .nav-link-custom svg {
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        .nav-link-custom:hover svg {
          opacity: 1;
        }

        /* Estilo para links Mobile */
        .nav-mobile-item {
          color: #333;
          border-radius: 8px;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .nav-mobile-item:hover {
          background-color: ${ROXO_FUNDO_SALDO};
          color: ${ROXO_PRINCIPAL} !important;
        }
        .nav-mobile-item svg {
          color: ${ROXO_PRINCIPAL};
        }
      `}</style>
    </>
  );
};

export default Navbar;