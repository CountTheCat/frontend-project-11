import { subscribe } from 'valtio/vanilla'
import i18next from 'i18next'
import { Modal } from 'bootstrap'
import state from './model.js'

let input
let validationFeedback
let feedbackMessage
let feedsContainer
let postsContainer
let submitButton
let modal
let modalTitle
let modalDescription
let modalLink

const initElements = () => {
  input = document.getElementById('url-input')
  validationFeedback = document.getElementById('validation-feedback')
  feedbackMessage = document.getElementById('feedback-message')
  feedsContainer = document.getElementById('feeds-container')
  postsContainer = document.getElementById('posts-container')
  submitButton = document.getElementById('submit-button')
  modal = new Modal(document.getElementById('modal'))
  modalTitle = document.getElementById('modal-title')
  modalDescription = document.getElementById('modal-description')
  modalLink = document.getElementById('modal-link')
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
        <h3 class="h5 fw-bold mb-1">${feed.title}</h3>
        <p class="text-muted small mb-0">${feed.description}</p>
      </div>
    `).join('')}
  `
}

const handlePostClick = (postId) => {
  const post = state.posts.find(p => p.id === postId)
  if (!post) return

  if (!state.readPosts.includes(postId)) {
    state.readPosts = [...state.readPosts, postId]
  }

  modalTitle.textContent = post.title
  modalDescription.textContent = post.description || 'Нет описания'
  modalLink.href = post.link
  modal.show()
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
      ${state.posts.map((post) => {
        const isRead = state.readPosts.includes(post.id)
        const isNew = post.isNew
        return `
          <li class="d-flex justify-content-between align-items-center mb-2 p-2 ${isNew ? 'border border-danger rounded' : ''}">
            <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="${isRead ? 'fw-normal link-secondary' : 'fw-bold'}">${post.title}</a>
            <button class="btn btn-outline-primary btn-sm" data-post-id="${post.id}">${i18next.t('view')}</button>
          </li>
        `
      }).join('')}
    </ul>
  `

  const buttons = postsContainer.querySelectorAll('button[data-post-id]')
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const postId = button.dataset.postId
      handlePostClick(postId)
    })
  })

  setTimeout(() => {
    state.posts.forEach((post) => {
      post.isNew = false
    })
  }, 5000)
}

const initWatchers = () => {
  subscribe(state, () => {
    if (input && validationFeedback && submitButton) {
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
        validationFeedback.style.display = 'block'
        validationFeedback.textContent = i18next.t(`errors.${state.form.error}`)
      }
      else {
        input.classList.remove('is-invalid')
        validationFeedback.style.display = 'none'
        validationFeedback.textContent = ''
      }
    }

    if (feedbackMessage) {
      if (state.feedback.message) {
        const type = state.feedback.message === 'success' ? 'success' : 'danger'
        feedbackMessage.textContent = i18next.t(state.feedback.message)
        feedbackMessage.className = `feedback small mb-0 mt-1 text-${type}`

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
        feedbackMessage.className = 'feedback small mb-0 mt-1'
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
