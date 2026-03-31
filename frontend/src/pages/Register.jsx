import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Envelope, Lock, Eye, EyeSlash, Person, PersonPlus } from 'react-bootstrap-icons';
import Logo from "../assets/bichofull-logo.png";

const ROXO_VIBRANTE = '#8b5cf6';
const VERDE_MENTA = '#6ee7b7';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Enviando os dados para a rota
      const response = await axios.post('http://localhost:3000/users', {
        name,
        email,
        password
      });

      console.log('Usuário criado com sucesso:', response.data);
      alert('Conta criada com sucesso! Agora faça seu login.');

      navigate('/login');

    } catch (error) {
      console.error('Erro no cadastro:', error.response?.data);
      alert(error.response?.data?.message || 'Erro ao criar conta. Tente outro e-mail.');
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100" style={{ backgroundColor: ROXO_VIBRANTE }}>
      <div className="card p-4 p-sm-5 shadow-lg border-0" style={{ borderRadius: '1rem', maxWidth: '450px', width: '100%' }}>
        
        <div className="text-center mb-4">
            <div className="rounded-circle d-inline-flex justify-content-center align-items-center mb-3 overflow-hidden"
                style={{ width: '40%', height: '40%', backgroundColor: '#ece7e7' }}>
                <img src={Logo} alt="Logo" className="img-fluid" />
            </div>
            <h3 className="fw-bold">Criar Conta</h3>
            <p className="text-muted">Cadastre-se para começar a jogar!</p>
        </div>

        <form onSubmit={handleRegister}>
          {/* Campo Nome */}
          <div className="mb-3">
            <label className="form-label fw-bold mb-1">Nome Completo</label>
            <div className="position-relative">
              <Person className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo E-mail */}
          <div className="mb-3">
            <label className="form-label fw-bold mb-1">E-mail</label>
            <div className="position-relative">
              <Envelope className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
              <input
                type="email"
                className="form-control ps-5"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div className="mb-4">
            <label className="form-label fw-bold mb-1">Senha</label>
            <div className="position-relative">
              <Lock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control ps-5 pe-5"
                placeholder="Crie uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent p-0"
              >
                {showPassword ? <EyeSlash className="text-muted" /> : <Eye className="text-muted" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 py-2 fw-bold text-white d-flex align-items-center justify-content-center"
            style={{ backgroundColor: ROXO_VIBRANTE, borderRadius: '0.5rem' }}
          >
            <PersonPlus className="me-2" size={20} /> Criar Minha Conta
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">Já tem uma conta? </span>
          <Link to="/login" className="fw-bold text-decoration-none" style={{ color: VERDE_MENTA }}>
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;