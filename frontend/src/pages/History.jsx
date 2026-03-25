import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ArrowLeft, ClockHistory, CheckCircle, XCircle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { getAnimalByNumber, getAnimalEmoji } from '../components/AnimalsEmoji';

const History = () => {
  const [bets, setBets] = useState([]);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!token) return navigate('/login');
    
    setUser(savedUser);
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      const [betsRes, walletRes] = await Promise.all([
        axios.get('http://localhost:3000/bets/my-bets', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:3000/wallets/my-balance', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setBets(betsRes.data);
      setBalance(walletRes.data.balance);
    } catch (err) { console.error(err); }
  };

  // Cálculos para os Cards
  const totalBets = bets.length;
  const wins = bets.filter(b => b.status === 'WON');
  const totalWon = wins.reduce((acc, b) => acc + (b.value * (b.type === 'grupo' ? 18 : b.type === 'dezena' ? 60 : 4000)), 0);
  const totalLost = bets.filter(b => b.status === 'LOST').reduce((acc, b) => acc + Number(b.value), 0);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar user={user} balance={balance} />
      
      <div className="container py-4">
        <button onClick={() => navigate('/dashboard')} className="btn btn-link text-dark text-decoration-none mb-3 p-0">
          <ArrowLeft className="me-2" /> Voltar para Apostas
        </button>
        
        <h3 className="fw-bold mb-4"><ClockHistory className="me-2" /> Histórico de Apostas</h3>

        {/* Cards de Métricas */}
        <div className="row g-3 mb-5">
          {[
            { label: 'Total de Apostas', val: totalBets, color: 'dark' },
            { label: 'Total Ganho', val: `R$ ${totalWon.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: 'success' },
            { label: 'Total Perdido', val: `R$ ${totalLost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: 'danger' }
          ].map((card, i) => (
            <div key={i} className="col-md-4">
              <div className="card border-0 shadow-sm p-3 rounded-4 h-100">
                <small className="text-muted fw-medium">{card.label}</small>
                <h2 className={`fw-bold mt-2 text-${card.color}`}>{card.val}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Lista de Apostas */}
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h5 className="fw-bold mb-4">Suas Apostas</h5>
          <div className="d-flex flex-column gap-3">
            {bets.map(bet => {
              const animal = getAnimalByNumber(bet.chosenNumber, bet.type);

              return (
                <div key={bet.id} className="d-flex align-items-center justify-content-between p-3 bg-white rounded-4 border mb-3 shadow-sm">
                  <div className="d-flex align-items-center">
                    <div className="fs-1 me-3 bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                      {getAnimalEmoji(animal?.name)}
                    </div>
                    
                    <div>
                      <div className="fw-bold text-capitalize">
                        {bet.type}: {bet.chosenNumber} <span className="text-muted fw-normal">({animal?.name})</span>
                      </div>
                      <small className="text-muted">
                        {new Date(bet.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-4">
                    <div className="text-end d-none d-md-block">
                      <div className="small text-muted">Apostado</div>
                      <div className="fw-bold">R$ {parseFloat(bet.value).toFixed(2)}</div>
                    </div>

                    {bet.status === 'WON' && (
                      <div className="text-end d-none d-md-block">
                        <div className="small text-muted">Prêmio</div>
                        <div className="fw-bold text-success">
                          R$ {(bet.value * (bet.type === 'grupo' ? 18 : bet.type === 'dezena' ? 60 : 4000)).toFixed(2)}
                        </div>
                      </div>
                    )}

                    <div className={`badge rounded-pill p-2 ${bet.status === 'WON' ? 'bg-success text-success' : 'bg-danger text-danger'} bg-opacity-10`} style={{ minWidth: '100px' }}>
                      {bet.status === 'WON' ? <><CheckCircle className="me-1"/> Ganhou</> : <><XCircle className="me-1"/> Perdeu</>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;