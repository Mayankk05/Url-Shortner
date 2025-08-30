import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/variables.css'   // Design tokens first
import './styles/globals.css'     // Global styles  
import './styles/components.css'  // Component styles
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)