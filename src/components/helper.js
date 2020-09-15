export const getRole = userData => {
  try {
    return userData.resource_access[`api-gateway-login-${window.REACT_APP_ENV}`].roles.includes('admin') ? 'Administrator' : 'Mieter'
  } catch {
    return 'Mieter'
  }
}

export const timeConverter = timestamp => {
  const a = new Date(timestamp)
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  const year = a.getFullYear()
  const month = months[a.getMonth()]
  const date = a.getDate()
  const hour = a.getHours()
  const min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes()
  const sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds()
  return `${date} ${month} ${year} ${hour}:${min}:${sec}`
}

export const concatAddress = building => {
  return `${building.city_code} ${building.city}, ${building.street} 
    ${building.house_number}${building.house_number_add !== undefined ? building.house_number_add : ''}`
}