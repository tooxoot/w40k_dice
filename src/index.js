import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('/serviceworker.js')
  )
}

ReactDOM.render(
  <App aos={window.location.href.includes('aos')} />,
  document.getElementById('root')
)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistration()
    .then(registration => registration && registration.update())
}
