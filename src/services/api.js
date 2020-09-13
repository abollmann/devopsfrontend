import axios from 'axios'

const api = axios.create({
  baseURL: `http://127.0.0.1:5000/api/`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// https://${process.env.REACT_APP_NAMESPACE}.api.116.203.242.235.xip.io/api/
// http://127.0.0.1:5000/api/
export default api
