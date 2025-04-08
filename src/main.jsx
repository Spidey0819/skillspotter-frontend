// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initializeConfig } from './services/config.js'

// Initialize API configuration
initializeConfig().catch(error => {
  console.error('Failed to initialize API configuration:', error);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)