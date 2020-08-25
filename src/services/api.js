import axios from 'axios'

const api = axios.create({
  baseURL: 'https://dev.api.116.203.242.235.xip.io/api/',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
