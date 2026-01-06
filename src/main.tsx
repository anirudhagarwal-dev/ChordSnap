import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { initScrollEffects } from './utils/scrollEffects'

const rootEl = document.getElementById('root')!
createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

initScrollEffects({ smooth: 1 })
