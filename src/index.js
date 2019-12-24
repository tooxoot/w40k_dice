import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

ReactDOM.render(
  <App aos={window.location.href.includes('aos')} />,
  document.getElementById('root')
)
