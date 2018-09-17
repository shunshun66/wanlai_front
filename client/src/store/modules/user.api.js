import Vue from 'vue'

export function login (username, password) {
  return Vue.http.post('user/login', {
    username,
    password
  }).then(res => res.json())
}

export function getUserInfo (token) {
  return new Promise((resolve) => {
    Vue.http.get('user/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(data => data.json()).then(data => {
      resolve(data)
    }).catch(() => {
      resolve({})
    })
  })
}
