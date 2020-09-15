import api from './api'

const getAll = async (token) => {
  const response = await api.get('devices', {headers: {Authorization: `Bearer ${token}`}})
  return response.data
}

const resetMeterValue = async (token, data) => {
  const response = await api.put('devices', data, {headers: {Authorization: `Bearer ${token}`}})
  return response.status
}

export default {getAll, resetMeterValue}