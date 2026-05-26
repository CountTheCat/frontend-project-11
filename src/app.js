import axios from 'axios'
import validate from './validate.js'
import state from './model.js'
import parseRSS from './parser.js'
import getProxyUrl from './proxy.js'

const loadFeed = (url) => {
  state.form.loading = true

  return getProxyUrl(url)
    .then((contents) => {
      const { feed, posts } = parseRSS(contents)

      const feedId = url
      const newPosts = posts.map(post => ({
        ...post,
        feedId,
      }))

      state.posts = [...state.posts, ...newPosts]
      state.feeds = [...state.feeds, { id: feedId, ...feed }]
      state.feedback.message = 'success'
    })
    .catch((error) => {
      if (error.message === 'parse') {
        state.feedback.message = 'parse'
      }
      else if (axios.isAxiosError(error)) {
        state.feedback.message = 'network'
      }
      else {
        state.feedback.message = 'network'
      }
      state.form.loading = false
    })
}

const handleSubmit = (e) => {
  e.preventDefault()

  const input = document.getElementById('url-input')
  const url = input.value.trim()
  state.form.url = url

  state.feedback.message = null

  validate({ url })
    .then((errors) => {
      if (Object.keys(errors).length > 0) {
        state.form.error = errors.url === 'Не должно быть пустым' ? 'required' : 'url'
        state.form.valid = false
        return
      }

      if (state.feeds.some(feed => feed.id === url)) {
        state.feedback.message = 'duplicate'
        return
      }

      return loadFeed(url)
    })
}

const handleInput = () => {
  state.form.error = null
  state.form.valid = true
  state.feedback.message = null
}

export default () => {
  const form = document.getElementById('rss-form')
  const input = document.getElementById('url-input')

  form.addEventListener('submit', handleSubmit)
  input.addEventListener('input', handleInput)
}
