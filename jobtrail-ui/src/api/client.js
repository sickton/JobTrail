import axios from 'axios'

const client = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('jt_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jt_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default client
