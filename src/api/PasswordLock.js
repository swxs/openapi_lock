import Vue from 'vue'

const PasswordLockUrl = '/api/password_lock/password_lock/'
const PasswordLockSearchUrl = '/api/password_lock/searcher/'

export async function searchPasswordLock(data){
  return Vue.axios.get(`${PasswordLockSearchUrl}self`, { params: data })
}

export async function selectPasswordLock(id){
  return Vue.axios.get(`${PasswordLockUrl}${id}/`)
}

export async function createPasswordLock(data){
  return Vue.axios.post(`${PasswordLockUrl}`, data)
}

export async function copyPasswordLock(id, data){
  return Vue.axios.post(`${PasswordLockUrl}${id}/`, data)
}

export async function updatePasswordLock(id, data){
  return Vue.axios.put(`${PasswordLockUrl}${id}/`, data)
}

export async function deletePasswordLock(id){
  return Vue.axios.delete(`${PasswordLockUrl}${id}/`)
}
