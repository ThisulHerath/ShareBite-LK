import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ProblemPage from './pages/ProblemPage'
import { CreateListingForm, ListingBrowser } from './features/listings'
import StatusState from './components/StatusState'
import Header from './components/Header'
import CountdownTimer from './components/CountdownTimer'
import PageBackground from './components/PageBackground'
import { getRemainingTimeBreakdown } from './utils/timeUtils'
import {
  apiErrorMessage,
  cancelReservation,
  createListing,
  deleteListing,
  getCurrentUser,
  getListings,
  getMyListings,
  loginUser,
  registerUser,
  reserveListing,
  updateListing,
} from './services/api'

const sessionKey = 'sharebite-session'
const storedSession = () => {
  try {
    return JSON.parse(localStorage.getItem(sessionKey) || localStorage.getItem('hacka1-session') || 'null')
  } catch {
    return null
  }
}
const withId = (listing) => ({ ...listing, id: listing.id || listing._id })

// COMMON STYLES & LAYOUT HELPER
const pageStyle = {
  backgroundColor: '#FFFAF0',
  color: '#173A35',
  minHeight: '100vh',
  fontFamily: 'system-ui, -apple-system, sans-serif',
}
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
    marginTop: '6px',
  }

  return (
    <div style={{ ...pageStyle, position: 'relative' }}>
      <PageBackground variant="auth" />
      <Header />
      <main
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '60px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}
      >
        {/* Intro Banner */}
        <div>
          <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase' }}>
            ShareBite LK Community
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#104C40', margin: '12px 0 16px 0' }}>
            Good food finds a better next stop.
          </h1>
          <p style={{ color: '#5D706B', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '24px' }}>
            Join local businesses, neighbours, and community groups making safe surplus food easier to share across Sri Lanka.
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              color: '#104C40',
              fontWeight: '700',
            }}
          >
            <li>✓ Discover food available nearby</li>
            <li>✓ Reserve portions in just a few steps</li>
            <li>✓ Cancel before final hour if plans change</li>
          </ul>
        </div>

        {/* Auth Card Form */}
        <div
          style={{
            background: '#FFFDF8',
            border: '2px solid #D9ED89',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 8px 24px rgba(23, 58, 53, 0.08)',
          }}
        >
          <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            {isRegister ? 'Get Started' : 'Welcome Back'}
          </span>
          <h2 style={{ color: '#104C40', margin: '4px 0 8px 0', fontSize: '1.75rem', fontWeight: '800' }}>
            {isRegister ? 'Create Your Account' : 'Log in to ShareBite'}
          </h2>
          <p style={{ color: '#5D706B', fontSize: '0.875rem', marginBottom: '24px' }}>
            {isRegister ? 'Register to share or reserve safe surplus food.' : 'Sign in to share food or reserve a listing.'}
          </p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isRegister && (
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#104C40' }}>Full Name</label>
                <input
                  required
                  minLength={2}
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#104C40' }}>Email Address</label>
              <input
                required
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#104C40' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  minLength={6}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-30%)',
                    background: 'none',
                    border: 'none',
                    color: '#176B59',
                    cursor: 'pointer',
                    fontWeight: '700',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {message && <div style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: '600' }}>{message}</div>}

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#104C40',
                color: '#FFFAF0',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                marginTop: '8px',
              }}
            >
              {loading ? 'Please wait…' : isRegister ? 'Create Account' : 'Log In'}
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '0.875rem', color: '#5D706B', textAlign: 'center' }}>
            {isRegister ? 'Already have an account?' : 'New here?'}{' '}
            <button
              type="button"
              onClick={() => navigate(isRegister ? '/login' : '/register')}
              style={{
                background: 'none',
                border: 'none',
                color: '#104C40',
                fontWeight: '800',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
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

  useEffect(() => {
    if (session?.token) void Promise.resolve().then(load)
  }, [session?.token])

  if (!session?.token) return <Navigate to="/login" replace state={{ from: location }} />

  const reserve = async (listing, portions = 1) => {
    if (reservingId) return
    setReservingId(listing.id)
    setFeedback(null)
    try {
      const { data } = await reserveListing(listing.id, portions, session.token)
      const updated = withId(data.listing)
      setListings((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setFeedback({
        type: 'success',
        text: `Successfully reserved ${portions} portion${portions > 1 ? 's' : ''} of “${updated.title}”. Check your dashboard to view or manage your reservation.`,
      })
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
    <div style={{ ...pageStyle, position: 'relative' }}>
      <PageBackground variant="listings" />
      <Header user={session.user} token={session.token} onLogout={onLogout} />
      <main style={{ ...containerStyle, position: 'relative', zIndex: 1 }}>
        <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase' }}>
          Available Today
        </span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#104C40', margin: '8px 0 12px 0' }}>
          Find Food to Collect
        </h1>
        <p style={{ color: '#5D706B', marginBottom: '32px', fontSize: '1.05rem' }}>
          Browse fresh surplus food shared by local businesses today. Reserve the exact portions you need before the collection deadline.
        </p>

        {feedback && state !== 'error' && (
          <div
            style={{
              backgroundColor: feedback.type === 'success' ? '#D9ED89' : '#fef2f2',
              color: feedback.type === 'success' ? '#104C40' : '#dc2626',
              padding: '16px',
              borderRadius: '12px',
              fontWeight: '700',
              marginBottom: '24px',
            }}
          >
            {feedback.text}
          </div>
        )}

        {state === 'loading' && <StatusState type="loading" />}
        {state === 'error' && (
          <StatusState
            type="error"
            action={
              <button
                style={{
                  backgroundColor: '#104C40',
                  color: '#FFFAF0',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
                onClick={load}
              >
                Try again
              </button>
            }
          >
            {feedback?.text}
          </StatusState>
        )}
        {state === 'empty' && <StatusState type="empty" />}
        {state === 'ready' && (
          <ListingBrowser listings={listings} onReserve={reserve} reserveDisabled={Boolean(reservingId)} />
        )}
      </main>
    </div>
  )
}

/* --- DASHBOARD ACTIVITY LIST ITEM COMPONENTS --- */
function SharedActivityItem({ listing, onEdit, onDelete, deleting }) {
  const total = listing.totalPortions ?? listing.portions ?? 1
  const remaining = listing.remainingPortions ?? (listing.status === 'reserved' ? 0 : (listing.portions ?? 0))

  return (
    <li
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '16px',
        background: '#FFFAF0',
        borderRadius: '14px',
        border: '1px solid #D9ED89',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <strong style={{ display: 'block', color: '#104C40', fontSize: '1.05rem' }}>{listing.title}</strong>
          <span style={{ fontSize: '0.85rem', color: '#5D706B' }}>
            <strong>{remaining}</strong> of {total} portions remaining · {listing.district}
          </span>
          <div style={{ fontSize: '0.82rem', color: '#176B59', marginTop: '4px' }}>
            📍 {listing.pickupAddress}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CountdownTimer targetDate={listing.availableUntil} compact />
          <em
            style={{
              fontStyle: 'normal',
              fontSize: '0.75rem',
              fontWeight: '800',
              background: remaining > 0 ? '#104C40' : '#78909C',
              color: '#D9ED89',
              padding: '4px 8px',
              borderRadius: '6px',
              textTransform: 'uppercase',
            }}
          >
            {remaining > 0 ? `${remaining} Left` : 'Fully Claimed'}
          </em>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '8px',
          marginTop: '6px',
          paddingTop: '10px',
          borderTop: '1px dashed #D9ED89',
        }}
      >
        <button
          type="button"
          onClick={() => onEdit(listing)}
          style={{
            background: '#FFF',
            border: '1.5px solid #176B59',
            color: '#104C40',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '0.82rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          title="Edit listing details"
        >
          ✏️ Edit Listing
        </button>

        <button
          type="button"
          disabled={deleting}
          onClick={() => onDelete(listing)}
          style={{
            background: '#FFF',
            border: '1.5px solid #dc2626',
            color: '#dc2626',
            borderRadius: '8px',
            padding: '5px 12px',
            fontSize: '0.82rem',
            fontWeight: '700',
            cursor: deleting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
          title="Delete this food listing"
        >
          {deleting ? 'Deleting…' : '🗑️ Delete'}
        </button>
      </div>
    </li>
  )
}

function ReservedActivityItem({ listing, onCancel, cancelling }) {
  const timeInfo = getRemainingTimeBreakdown(listing.availableUntil)
  const canCancel = !timeInfo.isExpired && !timeInfo.isLastHour
  const portions = listing.myReservedPortions || listing.portions || 1

  return (
    <li
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '16px',
        background: '#FFFAF0',
        borderRadius: '14px',
        border: '1px solid #D9ED89',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <strong style={{ display: 'block', color: '#104C40', fontSize: '1.05rem' }}>{listing.title}</strong>
          <span style={{ fontSize: '0.85rem', color: '#5D706B' }}>
            🏷️ <strong>{portions}</strong> portion{portions > 1 ? 's' : ''} reserved · ⌖ {listing.district}
          </span>
          <div style={{ fontSize: '0.82rem', color: '#176B59', marginTop: '4px' }}>
            📍 Pickup at: {listing.pickupAddress}
          </div>
        </div>
        <div>
          <CountdownTimer targetDate={listing.availableUntil} />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '6px',
          paddingTop: '10px',
          borderTop: '1px dashed #D9ED89',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '0.78rem', color: '#5D706B' }}>
          {timeInfo.isExpired ? (
            <span style={{ color: '#546E7A', fontWeight: '700' }}>Collection deadline has passed</span>
          ) : timeInfo.isLastHour ? (
            <span style={{ color: '#C62828', fontWeight: '700' }}>
              ⚠️ Final hour: cancellation locked to protect donors
            </span>
          ) : (
            <span style={{ color: '#176B59' }}>
              ✓ You can cancel up to 1 hour before collection
            </span>
          )}
        </span>

        {canCancel && (
          <button
            type="button"
            disabled={cancelling}
            onClick={() => onCancel(listing)}
            style={{
              background: '#FFF',
              border: '1.5px solid #dc2626',
              color: '#dc2626',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: cancelling ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            title="Cancel this reservation and return portions to the community"
          >
            {cancelling ? 'Cancelling…' : 'Cancel Reservation'}
          </button>
        )}
      </div>
    </li>
  )
}

/* --- DASHBOARD PAGE --- */
function DashboardPage({ session, onLogout }) {
  const [activity, setActivity] = useState({ shared: [], reserved: [] })
  const [activityState, setActivityState] = useState('loading')
  const [feedback, setFeedback] = useState(null)
  const [cancellingId, setCancellingId] = useState('')
  const [deletingId, setDeletingId] = useState('')
  const [editingListing, setEditingListing] = useState(null)

  const loadActivity = async () => {
    if (!session?.token) return
    try {
      const { data } = await getMyListings(session.token)
      setActivity({
        shared: (data.shared || []).map(withId),
        reserved: (data.reserved || []).map(withId),
      })
      setActivityState('ready')
    } catch {
      setActivityState('error')
    }
  }

  useEffect(() => {
    void loadActivity()
  }, [session?.token])

  if (!session?.token) return <Navigate to="/login" replace state={{ from: { pathname: '/dashboard' } }} />

  const handleCancelReservation = async (listing) => {
    if (cancellingId) return
    const confirmed = window.confirm(
      `Cancel your reservation for “${listing.title}”? This will return the reserved portions back to the available food pool.`
    )
    if (!confirmed) return

    setCancellingId(listing.id)
    setFeedback(null)
    try {
      await cancelReservation(listing.id, session.token)
      setFeedback({
        type: 'success',
        text: `Reservation for “${listing.title}” was cancelled. Portions are now available for others to claim.`,
      })
      await loadActivity()
    } catch (error) {
      setFeedback({
        type: 'error',
        text: apiErrorMessage(error, 'We could not cancel this reservation. You may be within the last hour before pickup.'),
      })
    } finally {
      setCancellingId('')
    }
  }

  const handleDeleteListing = async (listing) => {
    if (deletingId) return
    const confirmed = window.confirm(`Are you sure you want to permanently delete “${listing.title}”?`)
    if (!confirmed) return

    setDeletingId(listing.id)
    setFeedback(null)
    try {
      await deleteListing(listing.id, session.token)
      setFeedback({
        type: 'success',
        text: `Deleted “${listing.title}” successfully.`,
      })
      await loadActivity()
    } catch (error) {
      setFeedback({
        type: 'error',
        text: apiErrorMessage(error, 'We could not delete this listing.'),
      })
    } finally {
      setDeletingId('')
    }
  }

  const handleUpdateListing = async (updatedData) => {
    if (!editingListing) return
    try {
      await updateListing(editingListing.id, updatedData, session.token)
      setFeedback({
        type: 'success',
        text: `Updated “${updatedData.title}” successfully.`,
      })
      setEditingListing(null)
      await loadActivity()
    } catch (error) {
      throw new Error(apiErrorMessage(error, 'We could not update this listing.'), { cause: error })
    }
  }

  const user = session.user || {}
  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'ShareBite member'

  return (
    <div style={{ ...pageStyle, position: 'relative' }}>
      <PageBackground variant="dashboard" />
      <Header user={user} token={session.token} onLogout={onLogout} />
      <main style={{ ...containerStyle, position: 'relative', zIndex: 1 }}>
        {/* User Hero Banner */}
        <section
          style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            background: '#FFFDF8',
            padding: '24px',
            borderRadius: '24px',
            border: '2px solid #D9ED89',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              background: '#104C40',
              color: '#D9ED89',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: '900',
            }}
          >
            {user.name?.trim().charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              Your ShareBite Space
            </span>
            <h1 style={{ margin: '4px 0 0 0', color: '#104C40', fontSize: '1.75rem', fontWeight: '800' }}>
              Welcome, {user.name?.split(' ')[0] || 'neighbour'}.
            </h1>
          </div>
        </section>

        {feedback && (
          <div
            style={{
              backgroundColor: feedback.type === 'success' ? '#D9ED89' : '#fef2f2',
              color: feedback.type === 'success' ? '#104C40' : '#dc2626',
              padding: '16px',
              borderRadius: '12px',
              fontWeight: '700',
              marginBottom: '24px',
            }}
          >
            {feedback.text}
          </div>
        )}

        {/* Account Details & Actions */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          <article style={{ background: '#FFFDF8', padding: '24px', borderRadius: '20px', border: '1px solid #176B59' }}>
            <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              Profile Details
            </span>
            <h2 style={{ color: '#104C40', margin: '4px 0 16px 0', fontSize: '1.25rem' }}>Your Account</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div>
                <strong style={{ color: '#104C40' }}>Full Name:</strong>{' '}
                <span style={{ color: '#5D706B' }}>{user.name || '—'}</span>
              </div>
              <div>
                <strong style={{ color: '#104C40' }}>Email Address:</strong>{' '}
                <span style={{ color: '#5D706B' }}>{user.email || '—'}</span>
              </div>
              <div>
                <strong style={{ color: '#104C40' }}>Member Since:</strong>{' '}
                <span style={{ color: '#5D706B' }}>{joined}</span>
              </div>
            </div>
          </article>

          <article style={{ background: '#104C40', color: '#FFFAF0', padding: '24px', borderRadius: '20px' }}>
            <span style={{ color: '#D9ED89', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              Quick Actions
            </span>
            <h2 style={{ color: '#FFFAF0', margin: '4px 0 12px 0', fontSize: '1.25rem' }}>Make an Impact Today</h2>
            <p style={{ color: '#FFFAF0', opacity: 0.9, fontSize: '0.9rem', marginBottom: '20px' }}>
              Every safe listing and timely collection helps good food go further across Sri Lanka.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/share-food"
                style={{
                  backgroundColor: '#D9ED89',
                  color: '#104C40',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}
              >
                Share Surplus →
              </Link>
              <Link
                to="/find-food"
                style={{
                  backgroundColor: '#176B59',
                  color: '#FFFAF0',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}
              >
                Find Food →
              </Link>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Shared Food Column */}
              <article
                style={{
                  background: '#FFFDF8',
                  border: '1px solid #176B59',
                  borderRadius: '20px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    color: '#104C40',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>Food You Shared</span>
                  <span
                    style={{
                      background: '#D9ED89',
                      color: '#104C40',
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                    }}
                  >
                    {activity.shared.length}
                  </span>
                </h3>
                {activity.shared.length ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activity.shared.map((listing) => (
                      <SharedActivityItem
                        key={listing.id}
                        listing={listing}
                        onEdit={(item) => setEditingListing(item)}
                        onDelete={handleDeleteListing}
                        deleting={deletingId === listing.id}
                      />
                    ))}
                  </ul>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#5D706B' }}>
                    <p style={{ margin: '0 0 12px 0' }}>You have not shared any food yet.</p>
                    <Link to="/share-food" style={{ color: '#176B59', fontWeight: '700', textDecoration: 'none' }}>
                      Share food →
                    </Link>
                  </div>
                )}
              </article>

              {/* Reserved Food Column */}
              <article
                style={{
                  background: '#FFFDF8',
                  border: '1px solid #176B59',
                  borderRadius: '20px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    color: '#104C40',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>Food You Reserved</span>
                  <span
                    style={{
                      background: '#D9ED89',
                      color: '#104C40',
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                    }}
                  >
                    {activity.reserved.length}
                  </span>
                </h3>
                {activity.reserved.length ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activity.reserved.map((listing) => (
                      <ReservedActivityItem
                        key={listing.id}
                        listing={listing}
                        onCancel={handleCancelReservation}
                        cancelling={cancellingId === listing.id}
                      />
                    ))}
                  </ul>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#5D706B' }}>
                    <p style={{ margin: '0 0 12px 0' }}>You have not reserved any food yet.</p>
                    <Link to="/find-food" style={{ color: '#176B59', fontWeight: '700', textDecoration: 'none' }}>
                      Find food →
                    </Link>
                  </div>
                )}
              </article>
            </div>
          )}
        </section>
      </main>

      {/* EDIT LISTING MODAL */}
      {editingListing && (
        <div
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditingListing(null)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
            background: 'rgba(16, 76, 64, 0.45)',
            zIndex: 200,
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              width: 'min(100%, 640px)',
              background: '#FFFDF8',
              border: '2px solid #D9ED89',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(23, 58, 53, 0.25)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Manage Listing
                </span>
                <h2 style={{ color: '#104C40', margin: '4px 0 0', fontSize: '1.5rem', fontWeight: '800' }}>
                  Edit Food Listing
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingListing(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#5D706B',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </div>

            <CreateListingForm
              initialValues={editingListing}
              isEdit={true}
              onSubmit={handleUpdateListing}
              onCancel={() => setEditingListing(null)}
            />
          </div>
        </div>
      )}
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
    <div style={{ ...pageStyle, position: 'relative' }}>
      <PageBackground variant="share" />
      <Header user={session.user} token={session.token} onLogout={onLogout} />
      <main style={{ padding: '40px 24px', position: 'relative', zIndex: 1 }}>
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
    getCurrentUser(token)
      .then(({ data }) => {
        setSession((current) => {
          const next = { ...current, user: data.user }
          localStorage.setItem(sessionKey, JSON.stringify(next))
          return next
        })
      })
      .catch(logout)
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