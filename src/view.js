import { subscribe } from 'valtio/vanilla'
import state from './model.js'

let input
let feedback
let feedbackMessage
let feedsContainer

const initElements = () => {
  input = document.getElementById('url-input')
  feedback = document.querySelector('.invalid-feedback')
  feedbackMessage = document.getElementById('feedback-message')
  feedsContainer = document.getElementById('feeds-container')
}

const initWatchers = () => {
  subscribe(state.form, () => {
    if (!input || !feedback) return
    if (state.form.error) {
      input.classList.add('is-invalid')
      feedback.textContent = state.form.error
    }
    else {
      input.classList.remove('is-invalid')
      feedback.textContent = ''
    }
  })

  subscribe(state.feeds, () => {
    if (!feedsContainer) return
    feedsContainer.innerHTML = ''
    state.feeds.forEach((url) => {
      const feedCard = document.createElement('div')
      feedCard.className = 'card mb-3'
      feedCard.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${url}</h5>
          <p class="card-text text-muted">Поток добавлен</p>
        </div>
      `
      feedsContainer.appendChild(feedCard)
    })
  })

  subscribe(state.feedback, () => {
    if (!feedbackMessage) return
    if (state.feedback.message) {
      feedbackMessage.textContent = state.feedback.message
      feedbackMessage.className = `small mb-0 mt-1 text-${state.feedback.type}`
    }
    else {
      feedbackMessage.textContent = ''
      feedbackMessage.className = 'small mb-0 mt-1'
    }
  })
}

const resetForm = () => {
  input.value = ''
  state.form.url = ''
  state.form.error = null
  state.form.valid = true
  input.focus()
}

export { initElements, initWatchers, resetForm }
