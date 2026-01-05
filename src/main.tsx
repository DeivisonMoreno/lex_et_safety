import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { ModalProvider } from './context/ModalContext'

createRoot(document.getElementById('root')!).render(
  <ModalProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ModalProvider>,
)
