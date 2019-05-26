import request from './request.js'

const PasswordLockUrl = '/api/password_lock/password_lock/'

export const getPasswordLock = (id) => {
  return new Promise(function(resolve, reject) {
    request.get(`${PasswordLockUrl}${id}/`).then((response) => {
      resolve(response)
    })
  })
}

export const getPasswordLocklist = () => {
  return new Promise(function(resolve, reject) {
    request.get(`${PasswordLockUrl}`).then((response) => {
      resolve(response)
    })
  })
}

export const createPasswordLock = (data) => {
  return new Promise(function(resolve, reject) {
    request.post(`${PasswordLockUrl}`, data).then((response) => {
      resolve(response)
    })
  })
}

export const deletePasswordLock = (id) => {
  return new Promise(function(resolve, reject) {
    request.delete(`${PasswordLockUrl}${id}/`).then((response) => {
      resolve(response)
    })
  })
}
