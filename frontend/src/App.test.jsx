import { render, screen } from '@testing-library/react'
import App from './App'

test('renderiza aplicação', () => {
  render(<App />)
  expect(screen.getByText(/vite/i)).toBeInTheDocument()
})