import api from './api'


const getAll = async (token) => {
  const response = await api.get('tenants', {headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

const create = async (token, body) => {
  const response = await api.post('tenants', body, {headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

const distributeDevices = async (token, body) => {
  const response = await api.put('tenants', body, {headers: { Authorization: `Bearer ${token}` }})
  return response.data
}

export default {getAll, create, distributeDevices}