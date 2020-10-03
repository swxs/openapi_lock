const TokenKey = 'home_token'
const RefreshTokenKey = 'home_refreshToken'

export function getToken() {
  let token = localStorage.getItem(TokenKey)
  return token
}

export function getRefreshToken() {
  let refreshToken = localStorage.getItem(RefreshTokenKey)
  return refreshToken
}

export function setToken(token) {
  localStorage.setItem(TokenKey, token)
}

export function setRefreshToken(token) {
  localStorage.setItem(RefreshTokenKey, token)
}

export function removeToken() {
  localStorage.removeItem(TokenKey)
}

export function removeRefreshToken() {
  localStorage.removeItem(RefreshTokenKey)
}

export function base2obj(str) {
  let baseStr = str.split('.')[1]
  if (!baseStr) {
    return ''
  }
  return JSON.parse(window.atob(baseStr))
}
