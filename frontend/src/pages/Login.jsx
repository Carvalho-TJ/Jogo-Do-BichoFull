import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Envelope, Lock, Eye, EyeSlash, BoxArrowInRight } from 'react-bootstrap-icons';
import Logo from "../assets/bichofull-logo.png"

// Definindo as cores da paleta
const ROXO_VIBRANTE = '#8b5cf6';
const VERDE_MENTA = '#6ee7b7';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100" style={{ backgroundColor: ROXO_VIBRANTE }}>
      <div className="card p-4 p-sm-5 shadow-lg border-0" style={{ borderRadius: '1rem', maxWidth: '450px', width: '100%' }}>
        <div className="text-center mb-4">
            <div className="rounded-circle d-inline-flex justify-content-center align-items-center mb-3 overflow-hidden"
                style={{ width: '50%', height: '50%', backgroundColor: '#ece7e7' }}>
                    <img
                        src={Logo}
                        alt="BichoFull Icon"
                        className="img-fluid w-100 h-100 object-fit-contain"
                    />
            </div>
            <p className="text-muted">Acesse sua conta e vamos apostar!</p>
        </div>

        <form>
            <div className="mb-3">
                <label
                htmlFor="emailInput"
                className="form-label fw-bold mb-1"
                style={{ color: '#555' }}
                >
                E-mail
                </label>

                <div className="position-relative">
                <Envelope
                    className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                    size={18}
                />

                <input
                    type="email"
                    className="form-control ps-5"
                    id="emailInput"
                    placeholder="seu@email.com"
                    style={{ borderRadius: '0.5rem' }}
                />
                </div>
            </div>

            <div className="mb-4">
                <label
                htmlFor="passwordInput"
                className="form-label fw-bold mb-1"
                style={{ color: '#555' }}
                >
                Senha
                </label>

                <div className="position-relative">
                <Lock
                    className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                    size={18}
                />

                <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control ps-5 pe-5"
                    id="passwordInput"
                    placeholder="........"
                    style={{ borderRadius: '0.5rem' }}
                />

                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="btn position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent p-0"
                >
                    {showPassword ? <EyeSlash className="text-muted" /> : <Eye className="text-muted" />}
                </button>
                </div>
            </div>

            <button
                type="submit"
                className="btn w-100 py-2 fw-bold text-white d-flex align-items-center justify-content-center"
                style={{
                backgroundColor: ROXO_VIBRANTE,
                borderRadius: '0.5rem'
                }}
            >
                <BoxArrowInRight className="me-2" size={20} /> Entrar
            </button>
        </form>

        <div className="my-4 d-flex align-items-center">
          <hr className="flex-grow-1" />
          <span className="mx-2 text-muted">ou</span>
          <hr className="flex-grow-1" />
        </div>

        <div className="text-center mb-4">
            <span className="text-muted">Não tem uma conta? </span>
            <Link to="/register" className="fw-bold text-decoration-none" style={{ color: VERDE_MENTA }}>
            Cadastre-se
            </Link>
        </div>
      </div>
        <div className="text-center mt-3">
            <small className="text-light">
            Este sistema é apenas para fins educacionais. Não envolve dinheiro real.
            </small>
        </div>
    </div>
  );
};

export default LoginPage;