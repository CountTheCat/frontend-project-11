import { proxy } from 'valtio/vanilla'

const state = proxy({
  form: {
    url: '',
    error: null,
    valid: true,
    loading: false,
  },
  feeds: [],
  posts: [],
  feedback: {
    message: null,
  },
})

export default state
