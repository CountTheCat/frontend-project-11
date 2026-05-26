import { subscribe } from 'valtio/vanilla'
import i18next from 'i18next'
import state from './model.js'

let input
let feedback
let feedbackMessage
let feedsContainer
let postsContainer
let submitButton

const initElements = () => {
  input = document.getElementById('url-input')
  feedback = document.querySelector('.invalid-feedback')
  feedbackMessage = document.getElementById('feedback-message')
  feedsContainer = document.getElementById('feeds-container')
  postsContainer = document.getElementById('posts-container')
  submitButton = document.getElementById('submit-button')
}

const renderFeeds = () => {
  if (!feedsContainer) return
  if (state.feeds.length === 0) {
    feedsContainer.innerHTML = ''
    return
  }

  feedsContainer.innerHTML = `
    <h2 class="h4 mb-3">${i18next.t('feeds')}</h2>
    ${state.feeds.map(feed => `
      <div class="mb-3">
        <h5 class="fw-bold mb-1">${feed.title}</h5>
        <p class="text-muted small mb-0">${feed.description}</p>
      </div>
    `).join('')}
  `
}

const renderPosts = () => {
  if (!postsContainer) return
  if (state.posts.length === 0) {
    postsContainer.innerHTML = ''
    return
  }

  postsContainer.innerHTML = `
    <h2 class="h4 mb-3">${i18next.t('posts')}</h2>
    <ul class="list-unstyled mb-0">
      ${state.posts.map(post => `
        <li class="d-flex justify-content-between align-items-center mb-2">
          <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="fw-semibold">${post.title}</a>
          <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-sm">${i18next.t('view')}</a>
        </li>
      `).join('')}
    </ul>
  `
}

const initWatchers = () => {
  subscribe(state, () => {
    if (input && feedback && submitButton) {
      if (state.form.loading) {
        submitButton.disabled = true
        submitButton.textContent = 'Загрузка...'
      }
      else {
        submitButton.disabled = false
        submitButton.textContent = i18next.t('button')
      }
      if (state.form.error) {
        input.classList.add('is-invalid')
        feedback.textContent = i18next.t(`errors.${state.form.error}`)
      }
      else {
        input.classList.remove('is-invalid')
        feedback.textContent = ''
      }
    }

    if (feedbackMessage) {
      if (state.feedback.message) {
        const type = state.feedback.message === 'success' ? 'success' : 'danger'
        feedbackMessage.textContent = i18next.t(state.feedback.message)
        feedbackMessage.className = `small mb-0 mt-1 text-${type}`

        if (state.feedback.message === 'success') {
          input.value = ''
          state.form.url = ''
          state.form.error = null
          state.form.valid = true
          state.form.loading = false
          input.focus()
        }
      }
      else {
        feedbackMessage.textContent = ''
        feedbackMessage.className = 'small mb-0 mt-1'
      }
    }

    renderFeeds()
    renderPosts()
  })
}

const resetForm = () => {
  input.value = ''
  state.form.url = ''
  state.form.error = null
  state.form.valid = true
  state.form.loading = false
  input.focus()
}

export { initElements, initWatchers, resetForm }
