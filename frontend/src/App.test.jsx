import { render, screen } from '@testing-library/react'
import App from './App'

test('renderiza tela de login', () => {
  render(<App />)

  expect(screen.getByText(/acesse sua conta/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
})