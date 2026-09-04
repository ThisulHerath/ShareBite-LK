import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ProblemPage from './pages/ProblemPage'
import { CreateListingForm, ListingBrowser } from './features/listings'
import StatusState from './components/StatusState'
import Header from './components/Header'
import { apiErrorMessage, createListing, getCurrentUser, getListings, loginUser, registerUser, reserveListing } from './services/api'
import './App.css'
import './styles/sharebite.css'

const sessionKey = 'sharebite-session'
const storedSession = () => {
  try { return JSON.parse(localStorage.getItem(sessionKey) || localStorage.getItem('hacka1-session') || 'null') } catch { return null }
}
const withId = (listing) => ({ ...listing, id: listing.id || listing._id })

function AuthPage({ session, onSession }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isRegister = location.pathname === '/register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  if (session?.user) return <Navigate to="/" replace />

  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setMessage('')
    try {
      const { data } = await (isRegister ? registerUser(form) : loginUser(form))
      onSession(data)
      navigate(location.state?.from?.pathname || '/')
    } catch (error) { setMessage(apiErrorMessage(error, 'We could not sign you in.')) } finally { setLoading(false) }
  }
  return <main className="auth-page"><section className="auth-card">
    <p className="eyebrow">SHAREBITE LK</p><h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
    <p className="subtitle">{isRegister ? 'Register to share or reserve safe surplus food.' : 'Sign in to share food or reserve a listing.'}</p>
    <form onSubmit={submit}>
      {isRegister && <label>Name<input required minLength="2" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>}
      <label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
      <label>Password<input required type="password" minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
      {message && <p className="error" role="alert">{message}</p>}
      <button className="primary" disabled={loading}>{loading ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}</button>
    </form>
    <p className="switch">{isRegister ? 'Already have an account?' : 'New here?'} <button onClick={() => navigate(isRegister ? '/login' : '/register')}>{isRegister ? 'Log in' : 'Register'}</button></p>
  </section></main>
}

function ListingsPage({ session, onExpired, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [listings, setListings] = useState([])
  const [state, setState] = useState('loading')
  const [feedback, setFeedback] = useState(null)
  const [reservingId, setReservingId] = useState('')
  const load = async () => {
    setState('loading'); setFeedback(null)
    try {
      const { data } = await getListings()
      const next = (data.listings || []).map(withId)
      setListings(next); setState(next.length ? 'ready' : 'empty')
    } catch (error) { setFeedback({ type: 'error', text: apiErrorMessage(error) }); setState('error') }
  }
  useEffect(() => { void Promise.resolve().then(load) }, [])
  const reserve = async (listing) => {
    if (!session?.token) { navigate('/login', { state: { from: location } }); return }
    if (reservingId) return
    setReservingId(listing.id); setFeedback(null)
    try {
      const { data } = await reserveListing(listing.id, session.token)
      const updated = withId(data.listing)
      setListings((current) => current.map((item) => item.id === updated.id ? updated : item))
      setFeedback({ type: 'success', text: `Reserved “${updated.title}”. Please collect it before the listed time.` })
    } catch (error) {
      if (error.response?.status === 401) { onExpired(); navigate('/login', { state: { from: location } }); return }
      setFeedback({ type: 'error', text: apiErrorMessage(error, 'We could not reserve this listing.') })
    } finally { setReservingId('') }
  }
  return <div className="site-page"><Header user={session?.user} onLogout={onLogout} /><main className="listing-page shell">
    <p className="kicker">Available nearby</p><h1>Find food to collect</h1><p className="listing-intro">Browse safe surplus food shared by local businesses and reserve what you can collect on time.</p>
    {feedback && state !== 'error' && <StatusState type={feedback.type}>{feedback.text}</StatusState>}
    {state === 'loading' && <StatusState type="loading" />}
    {state === 'error' && <StatusState type="error" action={<button className="retry-button" onClick={load}>Try again</button>}>{feedback?.text}</StatusState>}
    {state === 'empty' && <StatusState type="empty" />}
    {state === 'ready' && <ListingBrowser listings={listings} onReserve={reserve} reserveDisabled={Boolean(reservingId)} />}
  </main></div>
}

function ShareFoodPage({ session, onExpired, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  if (!session?.token) return <Navigate to="/login" replace state={{ from: location }} />
  const submit = async (listing) => {
    try { await createListing(listing, session.token) }
    catch (error) {
      if (error.response?.status === 401) { onExpired(); navigate('/login', { state: { from: location } }); throw new Error('Your session has expired. Please log in again.', { cause: error }) }
      throw new Error(apiErrorMessage(error, 'We could not create this listing.'), { cause: error })
    }
  }
  return <div className="site-page"><Header user={session?.user} onLogout={onLogout} /><main className="listing-page form-page shell"><p className="kicker">Share safe surplus</p><h1>Post food for your community</h1><p className="listing-intro">Only list food that is safe to collect and consume before the stated deadline.</p><CreateListingForm onSubmit={submit} /></main></div>
}

export default function App() {
  const [session, setSession] = useState(storedSession)
  const token = session?.token
  const save = (next) => { localStorage.setItem(sessionKey, JSON.stringify(next)); setSession(next) }
  const logout = () => { localStorage.removeItem(sessionKey); setSession(null) }
  useEffect(() => {
    if (!token) return
    getCurrentUser(token).then(({ data }) => {
      setSession((current) => {
        const next = { ...current, user: data.user }
        localStorage.setItem(sessionKey, JSON.stringify(next))
        return next
      })
    }).catch(logout)
  }, [token])
  const shared = { user: session?.user, onLogout: logout }
  return <Routes>
    <Route path="/" element={<LandingPage {...shared} />} />
    <Route path="/find-food" element={<ListingsPage session={session} onExpired={logout} onLogout={logout} />} />
    <Route path="/share-food" element={<ShareFoodPage session={session} onExpired={logout} onLogout={logout} />} />
    <Route path="/about" element={<ProblemPage {...shared} />} />
    <Route path="/login" element={<AuthPage session={session} onSession={save} />} />
    <Route path="/register" element={<AuthPage session={session} onSession={save} />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
