import validate from './validate.js'
import state from './model.js'
import { resetForm } from './view.js'

const handleSubmit = (e) => {
  e.preventDefault()

  const input = document.getElementById('url-input')
  const url = input.value.trim()
  state.form.url = url

  state.feedback.message = null
  state.feedback.type = null

  validate({ url })
    .then((errors) => {
      if (Object.keys(errors).length > 0) {
        state.form.error = errors.url
        state.form.valid = false
        return
      }

      if (state.feeds.includes(url)) {
        state.feedback.message = 'RSS уже существует'
        state.feedback.type = 'danger'
        resetForm()
        return
      }

      state.feeds = [...state.feeds, url]
      state.feedback.message = 'RSS успешно загружен'
      state.feedback.type = 'success'
      resetForm()
    })
}

const handleInput = () => {
  state.form.error = null
  state.form.valid = true
  state.feedback.message = null
  state.feedback.type = null
}

export default () => {
  const form = document.getElementById('rss-form')
  const input = document.getElementById('url-input')

  form.addEventListener('submit', handleSubmit)
  input.addEventListener('input', handleInput)
}
