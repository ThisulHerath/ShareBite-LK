import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ProblemPage from './pages/ProblemPage'
import { CreateListingForm, ListingBrowser } from './features/listings'
import StatusState from './components/StatusState'
import Header from './components/Header'
import { apiErrorMessage, createListing, getCurrentUser, getListings, getMyListings, loginUser, registerUser, reserveListing } from './services/api'

const sessionKey = 'sharebite-session'
const storedSession = () => { try { return JSON.parse(localStorage.getItem(sessionKey) || localStorage.getItem('hacka1-session') || 'null') } catch { return null } }
const withId = (listing) => ({ ...listing, id: listing.id || listing._id })

// COMMON STYLES & LAYOUT HELPER
const pageStyle = { backgroundColor: '#FFFAF0', color: '#173A35', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }
const containerStyle = { maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }

/* --- AUTH PAGE (LOGIN & REGISTER) --- */
function AuthPage({ session, onSession }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isRegister = location.pathname === '/register'
  
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (session?.user) return <Navigate to="/" replace />

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const { data } = await (isRegister ? registerUser(form) : loginUser(form))
      onSession(data)
      navigate(location.state?.from?.pathname || '/')
    } catch (error) {
      setMessage(apiErrorMessage(error, 'We could not sign you in.'))
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1.5px solid #176B59',
    backgroundColor: '#FFFAF0',
    color: '#173A35',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    marginTop: '6px'
  }

  return (
    <div style={pageStyle}>
      <Header />
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
        
        {/* Intro Banner */}
        <div>
          <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase' }}>ShareBite LK Community</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#104C40', margin: '12px 0 16px 0' }}>Good food finds a better next stop.</h1>
          <p style={{ color: '#5D706B', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '24px' }}>Join local businesses, neighbours, and community groups making safe surplus food easier to share across Sri Lanka.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: '#104C40', fontWeight: '700' }}>
            <li>✓ Discover food available nearby</li>
            <li>✓ Reserve in just a few steps</li>
            <li>✓ Share surplus food responsibly</li>
          </ul>
        </div>

        {/* Auth Card Form */}
        <div style={{ background: '#FFFDF8', border: '2px solid #D9ED89', borderRadius: '24px', padding: '36px', boxShadow: '0 8px 24px rgba(23, 58, 53, 0.08)' }}>
          <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>{isRegister ? 'Get Started' : 'Welcome Back'}</span>
          <h2 style={{ color: '#104C40', margin: '4px 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>{isRegister ? 'Create Your Account' : 'Log in to ShareBite'}</h2>
          <p style={{ color: '#5D706B', fontSize: '0.875rem', marginBottom: '24px' }}>{isRegister ? 'Register to share or reserve safe surplus food.' : 'Sign in to share food or reserve a listing.'}</p>
          
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isRegister && (
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#104C40' }}>Full Name</label>
                <input required minLength={2} autoComplete="name" placeholder="Enter your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              </div>
            )}
            
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#104C40' }}>Email Address</label>
              <input required type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#104C40' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input required type={showPassword ? 'text' : 'password'} minLength={6} autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-30%)', background: 'none', border: 'none', color: '#176B59', cursor: 'pointer', fontWeight: '700' }}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {message && <div style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: '600' }}>{message}</div>}

            <button type="submit" disabled={loading} style={{ backgroundColor: '#104C40', color: '#FFFAF0', padding: '14px', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', marginTop: '8px' }}>
              {loading ? 'Please wait…' : isRegister ? 'Create Account' : 'Log In'}
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '0.875rem', color: '#5D706B', textAlign: 'center' }}>
            {isRegister ? 'Already have an account?' : 'New here?'}{' '}
            <button type="button" onClick={() => navigate(isRegister ? '/login' : '/register')} style={{ background: 'none', border: 'none', color: '#104C40', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}>
              {isRegister ? 'Log in' : 'Create an account'}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}

/* --- LISTINGS BROWSER PAGE --- */
function ListingsPage({ session, onExpired, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [listings, setListings] = useState([])
  const [state, setState] = useState('loading')
  const [feedback, setFeedback] = useState(null)
  const [reservingId, setReservingId] = useState('')

  const load = async () => {
    setState('loading')
    setFeedback(null)
    try {
      const { data } = await getListings()
      const next = (data.listings || []).map(withId)
      setListings(next)
      setState(next.length ? 'ready' : 'empty')
    } catch (error) {
      setFeedback({ type: 'error', text: apiErrorMessage(error) })
      setState('error')
    }
  }

  useEffect(() => { if (session?.token) void Promise.resolve().then(load) }, [session?.token])
  if (!session?.token) return <Navigate to="/login" replace state={{ from: location }} />

  const reserve = async (listing) => {
    if (reservingId) return
    setReservingId(listing.id)
    setFeedback(null)
    try {
      const { data } = await reserveListing(listing.id, session.token)
      const updated = withId(data.listing)
      setListings((current) => current.map((item) => item.id === updated.id ? updated : item))
      setFeedback({ type: 'success', text: `Reserved “${updated.title}”. Please collect it before the listed time.` })
    } catch (error) {
      if (error.response?.status === 401) {
        onExpired()
        navigate('/login', { state: { from: location } })
        return
      }
      setFeedback({ type: 'error', text: apiErrorMessage(error, 'We could not reserve this listing.') })
    } finally {
      setReservingId('')
    }
  }

  return (
    <div style={pageStyle}>
      <Header user={session.user} token={session.token} onLogout={onLogout} />
      <main style={containerStyle}>
        <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase' }}>Available Nearby</span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#104C40', margin: '8px 0 12px 0' }}>Find Food to Collect</h1>
        <p style={{ color: '#5D706B', marginBottom: '32px', fontSize: '1.05rem' }}>Browse safe surplus food shared by local Sri Lankan businesses and reserve what you can collect on time.</p>
        
        {feedback && state !== 'error' && (
          <div style={{ backgroundColor: feedback.type === 'success' ? '#D9ED89' : '#fef2f2', color: feedback.type === 'success' ? '#104C40' : '#dc2626', padding: '16px', borderRadius: '12px', fontWeight: '700', marginBottom: '24px' }}>
            {feedback.text}
          </div>
        )}

        {state === 'loading' && <StatusState type="loading" />}
        {state === 'error' && <StatusState type="error" action={<button style={{ backgroundColor: '#104C40', color: '#FFFAF0', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }} onClick={load}>Try again</button>}>{feedback?.text}</StatusState>}
        {state === 'empty' && <StatusState type="empty" />}
        {state === 'ready' && <ListingBrowser listings={listings} onReserve={reserve} reserveDisabled={Boolean(reservingId)} />}
      </main>
    </div>
  )
}

/* --- DASHBOARD ACTIVITY LIST COMPONENT --- */
function ActivityList({ title, items, empty, link, linkLabel }) {
  return (
    <article style={{ background: '#FFFDF8', border: '1px solid #176B59', borderRadius: '20px', padding: '24px', flex: 1 }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#104C40', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}</span>
        <span style={{ background: '#D9ED89', color: '#104C40', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.85rem' }}>{items.length}</span>
      </h3>
      {items.length ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((listing) => (
            <li key={listing.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#FFFAF0', borderRadius: '10px', border: '1px solid #D9ED89' }}>
              <div>
                <strong style={{ display: 'block', color: '#104C40' }}>{listing.title}</strong>
                <span style={{ fontSize: '0.85rem', color: '#5D706B' }}>{listing.portions} portions · {listing.district}</span>
              </div>
              <em style={{ fontStyle: 'normal', fontSize: '0.75rem', fontWeight: '800', background: '#104C40', color: '#D9ED89', padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                {listing.status}
              </em>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#5D706B' }}>
          <p style={{ margin: '0 0 12px 0' }}>{empty}</p>
          <Link to={link} style={{ color: '#176B59', fontWeight: '700', textDecoration: 'none' }}>{linkLabel} →</Link>
        </div>
      )}
    </article>
  )
}

/* --- DASHBOARD PAGE --- */
function DashboardPage({ session, onLogout }) {
  const [activity, setActivity] = useState({ shared: [], reserved: [] })
  const [activityState, setActivityState] = useState('loading')

  useEffect(() => {
    if (!session?.token) return
    getMyListings(session.token).then(({ data }) => {
      setActivity({ shared: (data.shared || []).map(withId), reserved: (data.reserved || []).map(withId) })
      setActivityState('ready')
    }).catch(() => setActivityState('error'))
  }, [session?.token])

  if (!session?.token) return <Navigate to="/login" replace state={{ from: { pathname: '/dashboard' } }} />

  const user = session.user || {}
  const joined = user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'ShareBite member'

  return (
    <div style={pageStyle}>
      <Header user={user} token={session.token} onLogout={onLogout} />
      <main style={containerStyle}>
        
        {/* User Hero Banner */}
        <section style={{ display: 'flex', gap: '20px', alignItems: 'center', background: '#FFFDF8', padding: '24px', borderRadius: '24px', border: '2px solid #D9ED89', marginBottom: '32px' }}>
          <div style={{ background: '#104C40', color: '#D9ED89', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900' }}>
            {user.name?.trim().charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>Your ShareBite Space</span>
            <h1 style={{ margin: '4px 0 0 0', color: '#104C40', fontSize: '1.75rem', fontWeight: '800' }}>Welcome, {user.name?.split(' ')[0] || 'neighbour'}.</h1>
          </div>
        </section>

        {/* Account Details & Actions */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <article style={{ background: '#FFFDF8', padding: '24px', borderRadius: '20px', border: '1px solid #176B59' }}>
            <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>Profile Details</span>
            <h2 style={{ color: '#104C40', margin: '4px 0 16px 0', fontSize: '1.25rem' }}>Your Account</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div><strong style={{ color: '#104C40' }}>Full Name:</strong> <span style={{ color: '#5D706B' }}>{user.name || '—'}</span></div>
              <div><strong style={{ color: '#104C40' }}>Email Address:</strong> <span style={{ color: '#5D706B' }}>{user.email || '—'}</span></div>
              <div><strong style={{ color: '#104C40' }}>Member Since:</strong> <span style={{ color: '#5D706B' }}>{joined}</span></div>
            </div>
          </article>

          <article style={{ background: '#104C40', color: '#FFFAF0', padding: '24px', borderRadius: '20px' }}>
            <span style={{ color: '#D9ED89', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>Quick Actions</span>
            <h2 style={{ color: '#FFFAF0', margin: '4px 0 12px 0', fontSize: '1.25rem' }}>Make an Impact Today</h2>
            <p style={{ color: '#FFFAF0', opacity: 0.9, fontSize: '0.9rem', marginBottom: '20px' }}>Every safe listing and timely collection helps good food go further.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/share-food" style={{ backgroundColor: '#D9ED89', color: '#104C40', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem' }}>Share Surplus →</Link>
              <Link to="/find-food" style={{ backgroundColor: '#176B59', color: '#FFFAF0', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem' }}>Find Food →</Link>
            </div>
          </article>
        </section>

        {/* Activity Status Columns */}
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#104C40', marginBottom: '16px', fontSize: '1.5rem' }}>Your Food Sharing Activity</h2>
          {activityState === 'loading' ? (
            <p style={{ color: '#5D706B' }}>Loading your activity…</p>
          ) : activityState === 'error' ? (
            <p style={{ color: '#dc2626' }}>We could not load your activity right now.</p>
          ) : (
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <ActivityList title="Food You Shared" items={activity.shared} empty="You have not shared any food yet." link="/share-food" linkLabel="Share food" />
              <ActivityList title="Food You Reserved" items={activity.reserved} empty="You have not reserved any food yet." link="/find-food" linkLabel="Find food" />
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

/* --- POST FOOD FORM WRAPPER PAGE --- */
function ShareFoodPage({ session, onExpired, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  if (!session?.token) return <Navigate to="/login" replace state={{ from: location }} />

  const submit = async (listing) => {
    try {
      await createListing(listing, session.token)
    } catch (error) {
      if (error.response?.status === 401) {
        onExpired()
        navigate('/login', { state: { from: location } })
        throw new Error('Your session has expired. Please log in again.', { cause: error })
      }
      throw new Error(apiErrorMessage(error, 'We could not create this listing.'), { cause: error })
    }
  }

  return (
    <div style={pageStyle}>
      <Header user={session.user} token={session.token} onLogout={onLogout} />
      <main style={{ padding: '40px 24px' }}>
        <CreateListingForm onSubmit={submit} />
      </main>
    </div>
  )
}

/* --- MAIN APP ROUTER CONFIGURATION --- */
export default function App() {
  const [session, setSession] = useState(storedSession)
  const token = session?.token

  const save = (next) => {
    localStorage.setItem(sessionKey, JSON.stringify(next))
    setSession(next)
  }

  const logout = () => {
    localStorage.removeItem(sessionKey)
    setSession(null)
  }

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

  const shared = { user: session?.user, token: session?.token, onLogout: logout }

  return (
    <Routes>
      <Route path="/" element={<LandingPage {...shared} />} />
      <Route path="/find-food" element={<ListingsPage session={session} onExpired={logout} onLogout={logout} />} />
      <Route path="/share-food" element={<ShareFoodPage session={session} onExpired={logout} onLogout={logout} />} />
      <Route path="/dashboard" element={<DashboardPage session={session} onLogout={logout} />} />
      <Route path="/about" element={<ProblemPage {...shared} />} />
      <Route path="/login" element={<AuthPage session={session} onSession={save} />} />
      <Route path="/register" element={<AuthPage session={session} onSession={save} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}