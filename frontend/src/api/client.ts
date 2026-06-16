import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tcm_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tcm_token')
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

export default api
