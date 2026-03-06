import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Wallet2, PersonCircle, BoxArrowRight, Dice5, ClockHistory } from 'react-bootstrap-icons';

const ROXO_VIBRANTE = '#8b5cf6';
const VERDE_MENTA = '#6ee7b7';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      setUser(savedUser);
      fetchBalance(token);
    }
  }, []);

  const fetchBalance = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/wallets/my-balance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return <div className="text-center mt-5">Carregando...</div>;

  return (
    <div className="min-vh-100 bg-light">
      {/* NAVBAR */}
      <nav className="navbar navbar-dark shadow-sm p-3" style={{ backgroundColor: ROXO_VIBRANTE }}>
        <div className="container">
          <span className="navbar-brand fw-bold d-flex align-items-center">
            <Dice5 className="me-2" /> BichoFull
          </span>
          <div className="d-flex align-items-center text-white">
            <PersonCircle size={24} className="me-2" />
            <span className="me-3 d-none d-md-inline">Olá, {user.name}</span>
            <button onClick={handleLogout} className="btn btn-outline-light btn-sm d-flex align-items-center">
              <BoxArrowRight className="me-1" /> Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row g-4">
          
          {/* CARD DE SALDO */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 text-white" 
                 style={{ background: `linear-gradient(135deg, ${ROXO_VIBRANTE}, #a78bfa)`, borderRadius: '1.2rem' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p className="mb-0 opacity-75">Saldo Disponível</p>
                  <h2 className="fw-bold mb-0">
                    R$ {parseFloat(balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h2>
                </div>
                <Wallet2 size={32} className="opacity-50" />
              </div>
              <button className="btn btn-light btn-sm fw-bold w-100 mt-2" style={{ color: ROXO_VIBRANTE }}>
                + Adicionar Fundos
              </button>
            </div>
          </div>

          {/* CARD DE AÇÕES RÁPIDAS */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '1.2rem' }}>
              <h5 className="fw-bold mb-4">O que vamos fazer hoje?</h5>
              <div className="d-flex gap-3 flex-wrap">
                <button className="btn p-3 d-flex flex-column align-items-center justify-content-center shadow-sm"
                        style={{ backgroundColor: '#f3f4f6', border: 'none', borderRadius: '1rem', width: '120px' }}>
                  <Dice5 size={28} className="mb-2" style={{ color: ROXO_VIBRANTE }} />
                  <span className="small fw-bold">Novo Jogo</span>
                </button>
                <button className="btn p-3 d-flex flex-column align-items-center justify-content-center shadow-sm"
                        style={{ backgroundColor: '#f3f4f6', border: 'none', borderRadius: '1rem', width: '120px' }}>
                  <ClockHistory size={28} className="mb-2" style={{ color: VERDE_MENTA }} />
                  <span className="small fw-bold">Histórico</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ÁREA DE JOGO (PREVIEW) */}
        <div className="mt-5 text-center p-5 border-dashed rounded-4" style={{ border: '2px dashed #ccc' }}>
          <h4 className="text-muted">A Arena de Apostas estará disponível em breve!</h4>
          <p className="text-muted small">Estamos preparando os bichos para o sorteio.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;