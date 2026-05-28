import './style.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import i18next from 'i18next'
import ru from './locales/ru.js'
import initApp from './app.js'
import { initElements, initWatchers } from './view.js'

export default i18next.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru,
  },
}).then(() => {
  document.addEventListener('DOMContentLoaded', () => {
    initElements()
    initWatchers()
    initApp()
  })
})
