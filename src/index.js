import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceworker.js').then(
      registration => {
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope
        )
      },
      err => {
        console.log('ServiceWorker registration failed: ', err)
      }
    )
  })
}

ReactDOM.render(
  <App aos={window.location.href.includes('aos')} />,
  document.getElementById('root')
)
