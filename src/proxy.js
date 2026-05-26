import axios from 'axios'

const PROXY_URL = 'https://allorigins.hexlet.app/get'

export default (url) => {
  const proxyUrl = new URL(PROXY_URL)
  proxyUrl.searchParams.set('disableCache', 'true')
  proxyUrl.searchParams.set('url', url)

  return axios.get(proxyUrl.toString())
    .then(response => response.data.contents)
}
