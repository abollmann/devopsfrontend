import api from './api'

const getAll = async (token) => {
  const response = await api.get('devices', {headers: {Authorization: `Bearer ${token}`}})
  return response.data
}

export default {getAll}