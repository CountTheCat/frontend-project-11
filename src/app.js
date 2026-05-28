import axios from 'axios'
import validate from './validate.js'
import state from './model.js'
import parseRSS from './parser.js'
import getProxyUrl from './proxy.js'

const UPDATE_INTERVAL = 5000

const loadFeed = (url) => {
  state.form.loading = true

  return getProxyUrl(url)
    .then((contents) => {
      const { feed, posts } = parseRSS(contents)

      const feedId = url
      const newPosts = posts.map(post => ({
        ...post,
        feedId,
        isNew: true,
      }))

      state.posts = [...newPosts, ...state.posts]
      state.feeds = [...state.feeds, { id: feedId, ...feed }]
      state.feedback.message = 'success'
    })
    .catch((error) => {
      if (error.message === 'parse') {
        state.feedback.message = 'parseError'
      }
      else if (axios.isAxiosError(error)) {
        state.feedback.message = 'networkError'
      }
      else {
        state.feedback.message = 'networkError'
      }
      state.form.loading = false
    })
}

const updateFeeds = () => {
  if (state.feeds.length === 0) {
    setTimeout(updateFeeds, UPDATE_INTERVAL)
    return
  }

  const promises = state.feeds.map((feed) => {
    return getProxyUrl(feed.id)
      .then((contents) => {
        const { posts } = parseRSS(contents)

        const newPosts = posts.filter(
          post => !state.posts.some(existingPost => existingPost.id === post.id),
        )

        if (newPosts.length > 0) {
          const postsWithFeedId = newPosts.map(post => ({
            ...post,
            feedId: feed.id,
            isNew: true,
          }))
          state.posts = [...postsWithFeedId, ...state.posts]
        }
      })
      .catch(() => {})
  })

  return Promise.all(promises).then(() => {
    setTimeout(updateFeeds, UPDATE_INTERVAL)
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

  setTimeout(updateFeeds, UPDATE_INTERVAL)
}
