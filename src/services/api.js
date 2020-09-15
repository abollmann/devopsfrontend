import axios from 'axios'

const api = axios.create({
  baseURL: `https://${process.env.REACT_APP_NAMESPACE === 'local' ? 'dev' : process.env.REACT_APP_NAMESPACE}.api.116.203.242.235.xip.io/api/`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// https://${process.env.REACT_APP_NAMESPACE}.api.116.203.242.235.xip.io/api/
// http://127.0.0.1:5000/api/
export default api
