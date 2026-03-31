import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Wallet2, Cash, Trophy, PlayCircle, ClockHistory, LightningCharge, PlusCircle } from 'react-bootstrap-icons';
import ANIMALS from "../components/AnimalsList";
import { getAnimalByNumber, getAnimalEmoji } from '../components/AnimalsEmoji';
import Navbar from '../components/Navbar';
import WinningModal from '../components/WinningModal';
import '../App.css';

const ROXO_VIBRANTE = '#8b5cf6';
const VERDE_MENTA = '#6ee7b7';

const getAnimalByMilhar = (milhar) => {
  if (!milhar) return null;
  const dezena = milhar.slice(-2);
  let dezenaInt = parseInt(dezena);
  if (dezenaInt === 0 && dezena === "00") dezenaInt = 100;
  const group = Math.ceil(dezenaInt / 4).toString().padStart(2, '0');
  return ANIMALS.find(a => a.group === group);
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState('0.00');
  const [draws, setDraws] = useState([]);
  const [betValue, setBetValue] = useState('');
  const [chosenNumber, setChosenNumber] = useState('');
  const [betType, setBetType] = useState('grupo');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winData, setWinData] = useState(null);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchBalance = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/wallets/my-balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(response.data.balance);
    } catch (error) { console.error("Erro ao buscar saldo:", error); }
  };

  const fetchDraws = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/draws`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDraws(response.data);
    } catch (error) { console.error("Erro ao buscar sorteios:", error); }
  };

  useEffect(() => {
  const init = async () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      setUser(savedUser);
      await fetchBalance(token);
      await fetchDraws(token);
    } else {
      navigate('/login');
    }
  };

  init();
}, [navigate]);

  const handleSelectAnimal = (animal) => {
    setBetType('grupo');
    setSelectedAnimal(animal);
    setChosenNumber(animal.group);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceBet = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    let formattedNumber = chosenNumber.toString();
    if (betType === 'grupo' && formattedNumber.length === 1) {
      formattedNumber = formattedNumber.padStart(2, '0');
    }

    try {
      await axios.post(`${apiUrl}/bets`, {
        value: parseFloat(betValue),
        chosenNumber: formattedNumber,
        type: betType,
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert("Aposta realizada com sucesso!");
      setBetValue('');
      setChosenNumber('');
      setSelectedAnimal(null);
      fetchBalance(token);
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao apostar.");
    }
  };

  const handleRunDraw = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${apiUrl}/draws/trigger`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { draw, winners } = response.data;

    const newDraw = {
      id: draw.id,
      winningNumber: draw.winningMilhar,
      allNumbers: draw.results?.join(',') || '',
      createdAt: draw.createdAt
    };
    setDraws(prevDraws => [newDraw, ...prevDraws]);

    const myWin = winners.find(w => {
      const winnerId = w.userId || (w.user && w.user.id) || w.user;
      const myId = user.id || user.userId || user.sub;
      return String(winnerId) === String(myId);
    });

    if (myWin) {  
      const multiplier = myWin.type === 'milhar' ? 4000 : myWin.type === 'dezena' ? 60 : 18;
      
      setWinData({
        type: myWin.type,
        chosenNumber: myWin.chosenNumber,
        prizeValue: myWin.value * multiplier,
        multiplier: multiplier,
        betValue: myWin.value,
        animalName: getAnimalByNumber(myWin.chosenNumber, myWin.type)?.name
      });
      
      setTimeout(() => setShowWinModal(true), 800);
    }

    fetchBalance(token);
    fetchDraws(token);

  } catch (error) {
    console.error("Erro no sorteio:", error);
  }
};

  if (!user) return <div className="text-center mt-5">Carregando...</div>;

  const latestDraw = draws[0];

  return (
    <div className="min-vh-100 bg-light pb-5">
      {/* NAVBAR */}
      <Navbar user={user} balance={balance} />

      <div className="container-fluid px-4">
        <div className="row g-4">
          
          {/* COLUNA ESQUERDA */}
          <div className="col-lg-3">
            {/* CARD DE SALDO */}
            <div className="card border-0 shadow-sm p-4 text-white mb-4" 
                style={{ 
                  background: `linear-gradient(135deg, #6c5ce7, #a78bfa)`, 
                  borderRadius: '1.2rem' 
                }}>
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0 opacity-75 text-white">Saldo Disponível</p>
                <Wallet2 size={24} className="opacity-75" />
              </div>
              
              <h2 className="fw-bold my-3 text-white">
                R$ {parseFloat(balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h2>

              {/* CONTAINER DOS BOTÕES */}
              <div className="d-flex gap-2">
                {/* Botão Adicionar saldo */}
                <button className="btn btn-light btn-sm fw-bold flex-grow-1 d-flex align-items-center justify-content-center py-2" 
                        style={{ color: '#6c5ce7', borderRadius: '0.8rem' }}>
                  <PlusCircle className="me-2" /> Adicionar
                </button>

                {/* Botão Sacar */}
                <button className="btn btn-sm fw-bold flex-grow-1 d-flex align-items-center justify-content-center py-2 text-white" 
                        style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          borderRadius: '0.8rem' 
                        }}>
                  <Cash className="me-2" /> Sacar
                </button>
              </div>
            </div>

            {/* HISTÓRICO DE SORTEIOS */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '1.2rem' }}>
              <div className="card-body">
                <h6 className="fw-bold mb-3 d-flex align-items-center">
                  <ClockHistory className="me-2 text-secondary" /> Historico de Sorteios
                </h6>
                <div className="overflow-auto pe-2" style={{ maxHeight: '450px' }}>
                  {draws.map((d) => {
                    const animal = getAnimalByMilhar(d.winningNumber);
                    return (
                      <div key={d.id} className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded-3 border-bottom">
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                          {new Date(d.createdAt).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'})}, {new Date(d.createdAt).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
                        </small>
                        <div className="fw-bold" style={{ fontSize: '0.9rem' }}>
                          {d.winningNumber} <span className="ms-1">{getAnimalEmoji(animal?.name)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA CENTRAL */}
          <div className="col-lg-6">
            {/* TABELA DE BICHOS */}
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '1.2rem' }}>
              <h5 className="fw-bold mb-4 text-center">Tabela de Bichos <small className="text-muted d-block fs-6">Clique no bicho para apostar</small></h5>
              <div className="row row-cols-3 row-cols-md-5 g-2">
                {ANIMALS.map((a) => (
                  <div key={a.group} className="col">
                    <div onClick={() => handleSelectAnimal(a)}
                         className={`p-2 border rounded-3 text-center h-100 animal-card ${selectedAnimal?.group === a.group ? 'selected shadow' : 'bg-white shadow-sm'}`}>
                      <div className="small text-muted" style={{ fontSize: '0.8rem' }}> {a.group}</div>
                      <div className="fs-2 my-1">{getAnimalEmoji(a.name)}</div>
                      <div className="fw-bold animal-name" style={{ color: ROXO_VIBRANTE, fontSize: '0.85rem' }}>{a.name}</div>
                      <div className="text-secondary" style={{ fontSize: '0.8rem' }}>{a.numbers.join(' ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '1.2rem' }}>
              <h5 className="fw-bold mb-3">Fazer Aposta</h5>
              <div className="d-flex bg-light p-1 rounded-pill mb-4 border" style={{ fontSize: '0.8rem' }}>
                {['grupo', 'dezena', 'milhar'].map(type => (
                  <button key={type} 
                          onClick={() => { setBetType(type); setSelectedAnimal(null); if(type !== 'grupo') setChosenNumber(''); }}
                          className={`btn rounded-pill flex-grow-1 px-2 py-1 ${betType === type ? 'bg-white shadow-sm fw-bold' : 'text-muted border-0'}`}
                          style={{ color: betType === type ? ROXO_VIBRANTE : '' }}>
                    {type.charAt(0).toUpperCase() + type.slice(1)} 
                    <span className="small text-muted ms-1">({type === 'grupo' ? '18x' : type === 'dezena' ? '60x' : '4000x'})</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handlePlaceBet}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="small text-muted fw-bold mb-1">
                      {betType === 'grupo' ? 'Numero do Grupo' : betType === 'dezena' ? 'Sua Dezena' : 'Sua Milhar'}
                    </label>
                    <div className="d-flex gap-2">
                      <input type="number" className="col-lg-3 form-control form-control-lg" placeholder="--" 
                             value={chosenNumber} onChange={(e) => { setChosenNumber(e.target.value); setSelectedAnimal(null); }} required />
                      {betType === 'grupo' && selectedAnimal && (
                        <div className="d-flex align-items-center bg-success bg-opacity-10 text-success fw-bold px-3 rounded-pill border border-success border-opacity-25" style={{ whiteSpace: 'nowrap' }}>
                          <span className="fs-4 me-2">{getAnimalEmoji(selectedAnimal.name)}</span>
                          {selectedAnimal.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row-col-md-6 mb-3">
                    <label className="small text-muted fw-bold mb-1">Valor da Aposta (R$)</label>
                    <input type="number" className="form-control form-control-lg" placeholder="0,00" step="1"
                           value={betValue} onChange={(e) => setBetValue(e.target.value)} required />
                  </div>
                </div>

                <div className="d-flex gap-2 mb-4 flex-wrap">
                  {[5, 10, 20, 50].map(val => (
                    <button key={val} type="button" onClick={() => setBetValue(val)}
                            className="btn btn-outline-secondary btn-sm rounded-pill flex-grow-1 border-light-subtle bg-white text-dark fw-medium">
                      R$ {val}
                    </button>
                  ))}
                </div>

                <button type="submit" className="btn btn-lg w-100 fw-bold border-0" 
                        style={{ backgroundColor: VERDE_MENTA, color: '#065f46', borderRadius: '0.8rem' }}>
                  Confirmar Aposta
                </button>
              </form>
            </div>
            {/* CARD SORTEIO */}
            <div className="card border-0 shadow-sm p-4 mb-4 text-center" style={{ borderRadius: '1.2rem' }}>
              <h5 className="fw-bold mb-3 d-flex align-items-center justify-content-center">
                <LightningCharge className="me-2 text-warning" /> Simular Sorteio
              </h5>
              <p className="small text-muted mb-3">Clique para realizar um sorteio.</p>
              <button onClick={handleRunDraw} className="btn btn-lg fw-bold w-100 border-0 d-flex align-items-center justify-content-center" 
                      style={{ backgroundColor: VERDE_MENTA, color: '#065f46', borderRadius: '0.8rem' }}>
                <PlayCircle className="me-2" /> Realizar Sorteio
              </button>
            </div>

            {/* CARD ÚLTIMO RESULTADO */}
            {latestDraw && (
              <div className="card border-0 shadow-sm" style={{ borderRadius: '1.2rem', backgroundColor: '#fffaf2' }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-4 d-flex align-items-center" style={{ color: '#854d0e' }}>
                    <Trophy className="me-2" /> Ultimo Resultado
                  </h6>
                  
                  <div className="p-3 mb-4 rounded-4 shadow-sm border" style={{ backgroundColor: '#ecf3e0', borderColor: '#d1dbbd' }}>
                    <div className="text-center">
                      <span className="fw-bold text-secondary d-block mb-1" style={{fontSize: '0.8rem'}}>1º Premio (Cabeça)</span>
                      <div className="d-flex justify-content-center align-items-center">
                        <span className="fs-2 fw-bold me-2">{latestDraw.winningNumber}</span>
                        <span className="fs-1">{getAnimalEmoji(getAnimalByMilhar(latestDraw.winningNumber)?.name)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="small text-muted mb-2 fw-bold">CERCADO (2º AO 5º)</div>
                  {(latestDraw.allNumbers?.split(',') || []).slice(1).map((num, idx) => {
                    const animal = getAnimalByMilhar(num);
                    return (
                      <div key={idx} className="d-flex justify-content-between align-items-center p-2 mb-2 rounded-3 bg-white border-bottom">
                        <span className="small text-muted">{idx + 2}º Premio</span>
                        <div className="fw-bold" style={{ fontSize: '0.95rem' }}>
                          {num} <span className="ms-2">{getAnimalEmoji(animal?.name)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* MODAL DE VITÓRIA */}
      <WinningModal
        show={showWinModal} 
        onHide={() => setShowWinModal(false)} 
        winData={winData} 
      />
    </div>
  );
};

export default Dashboard;