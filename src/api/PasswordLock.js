const PasswordLockUrl = '/api/password_lock/password_lock/'

export const searchPasswordLock = (data) => {
  return new Promise(function(resolve, reject) {
    window.axios
      .get(`${PasswordLockUrl}`, { params: data })
      .then((response) => {
        resolve(response)
      })
  })
}

export const selectPasswordLock = (id) => {
  return new Promise(function(resolve, reject) {
    window.axios.get(`${PasswordLockUrl}${id}/`).then((response) => {
      resolve(response.data)
    })
  })
}

export const createPasswordLock = (data) => {
  return new Promise(function(resolve, reject) {
    window.axios.post(`${PasswordLockUrl}`, data).then((response) => {
      resolve(response.data)
    })
  })
}

export const copyPasswordLock = (id, data) => {
  return new Promise(function(resolve, reject) {
    window.axios.post(`${PasswordLockUrl}${id}/`, data).then((response) => {
      resolve(response.data)
    })
  })
}

export const updatePasswordLock = (id, data) => {
  return new Promise(function(resolve, reject) {
    window.axios.put(`${PasswordLockUrl}${id}/`, data).then((response) => {
      resolve(response.data)
    })
  })
}

export const modifyPasswordLock = (id, data) => {
  return new Promise(function(resolve, reject) {
    window.axios.patch(`${PasswordLockUrl}${id}/`, data).then((response) => {
      resolve(response.data)
    })
  })
}

export const deletePasswordLock = (id) => {
  return new Promise(function(resolve, reject) {
    window.axios.delete(`${PasswordLockUrl}${id}/`).then((response) => {
      resolve(response.data)
    })
  })
}
