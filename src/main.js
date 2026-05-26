import './style.css'
import initApp from './app.js'
import { initElements, initWatchers } from './view.js'

document.addEventListener('DOMContentLoaded', () => {
  initElements()
  initWatchers()
  initApp()
})
