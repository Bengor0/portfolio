import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Try from './Try.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Try />
  </StrictMode>,
)
