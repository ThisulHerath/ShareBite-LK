import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
})

export const registerUser = (data) => api.post('/api/auth/register', data)
export const loginUser = (data) => api.post('/api/auth/login', data)
export const getCurrentUser = (token) =>
  api.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
