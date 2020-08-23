export const isAdmin = userData => {
  try {
    return userData.resourceAccess['api-gateway-login'].roles.includes('admin')
  } catch {
    return false
  }
}

export const timeConverter = timestamp => {
  const a = new Date(timestamp)
  const months = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez']
  const year = a.getFullYear()
  const month = months[a.getMonth()]
  const date = a.getDate()
  const hour = a.getHours()
  const min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes()
  const sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds()
  return `${date} ${month} ${year} ${hour}:${min}:${sec}`
}
