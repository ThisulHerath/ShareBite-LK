import axios from 'axios'

// Keeping the base URL slash-free prevents accidental double slashes in API paths.
const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '')
const api = axios.create({ baseURL })

export const registerUser = (data) => api.post('/api/auth/register', data)
export const loginUser = (data) => api.post('/api/auth/login', data)
export const getCurrentUser = (token) =>
  api.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
export const changePassword = (data, token) =>
  api.patch('/api/auth/password', data, { headers: { Authorization: `Bearer ${token}` } })
export const deleteAccount = (data, token) =>
  api.delete('/api/auth/account', { data, headers: { Authorization: `Bearer ${token}` } })

export const getListings = () => api.get('/api/listings')
export const getMyListings = (token) =>
  api.get('/api/listings/mine', { headers: { Authorization: `Bearer ${token}` } })
export const createListing = (listing, token) =>
  api.post('/api/listings', listing, { headers: { Authorization: `Bearer ${token}` } })
export const updateListing = (id, listing, token) =>
  api.put(`/api/listings/${id}`, listing, { headers: { Authorization: `Bearer ${token}` } })
export const deleteListing = (id, token) =>
  api.delete(`/api/listings/${id}`, { headers: { Authorization: `Bearer ${token}` } })
export const reserveListing = (id, portions = 1, token) =>
  api.patch(`/api/listings/${id}/reserve`, { portions }, { headers: { Authorization: `Bearer ${token}` } })
export const cancelReservation = (id, token) =>
  api.patch(`/api/listings/${id}/cancel-reservation`, {}, { headers: { Authorization: `Bearer ${token}` } })

export const apiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error.response) return 'Unable to reach the server. Check your connection and try again.'
  return error.response.data?.message || fallback
}

export default api
