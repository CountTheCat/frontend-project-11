import { proxy } from 'valtio/vanilla'

const state = proxy({
  form: {
    url: '',
    error: null,
    valid: true,
  },
  feeds: [],
  feedback: {
    message: null,
  },
})

export default state
