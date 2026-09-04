import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { apiErrorMessage, changePassword, deleteAccount } from '../services/api'

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Find Food', href: '/find-food' },
  { label: 'Share Food', href: '/share-food' },
]

/** A responsive site header styled with inline CSS matching the ShareBite LK palette. */
export default function Header({ user, token, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [dialog, setDialog] = useState(null)
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '', password: '', confirmation: '' })
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const profileRef = useRef(null)

  const closeMenu = () => {
    setIsOpen(false)
    setProfileOpen(false)
  }

  const closeDialog = () => {
    setDialog(null)
    setFeedback('')
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '', password: '', confirmation: '' })
  }

  const submitDialog = async (event) => {
    event.preventDefault()
    setFeedback('')
    if (dialog === 'logout') {
      closeDialog()
      onLogout?.()
      return
    }
    if (dialog === 'password' && form.newPassword !== form.confirmPassword) {
      setFeedback('New passwords do not match.')
      return
    }
    setSaving(true)
    try {
      if (dialog === 'password') {
        await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword }, token)
        closeDialog()
        window.alert('Your password was changed successfully.')
      } else {
        await deleteAccount({ password: form.password, confirmation: form.confirmation }, token)
        closeDialog()
        onLogout?.()
      }
    } catch (error) {
      setFeedback(apiErrorMessage(error, 'We could not complete that request.'))
    } finally {
      setSaving(false)
    }
  }

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      style={{
        backgroundColor: '#FFFDF8',
        borderBottom: '2px solid #D9ED89',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 12px rgba(23, 58, 53, 0.04)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* BRAND / LOGO */}
        <Link
          to="/"
          aria-label="ShareBite LK home"
          onClick={closeMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: '#104C40',
            fontWeight: '800',
            fontSize: '1.25rem',
          }}
        >
          <span
            style={{
              backgroundColor: '#D9ED89',
              color: '#104C40',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '1.2rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            }}
            aria-hidden="true"
          >
            S
          </span>
          <span>
            ShareBite <em style={{ color: '#176B59', fontStyle: 'normal' }}>LK</em>
          </span>
        </Link>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          type="button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((open) => !open)}
          style={{
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'space-around',
            width: '32px',
            height: '32px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            zIndex: 101,
          }}
          className="mobile-toggle-btn"
        >
          <span style={{ width: '100%', height: '3px', backgroundColor: '#104C40', borderRadius: '2px', transition: 'all 0.3s' }} />
          <span style={{ width: '100%', height: '3px', backgroundColor: '#104C40', borderRadius: '2px', transition: 'all 0.3s' }} />
          <span style={{ width: '100%', height: '3px', backgroundColor: '#104C40', borderRadius: '2px', transition: 'all 0.3s' }} />
        </button>

        {/* RESPONSIVE MEDIA QUERY HELPER */}
        <style>{`
          @media (max-width: 768px) {
            .mobile-toggle-btn { display: flex !important; }
            .primary-nav-wrapper {
              display: ${isOpen ? 'flex' : 'none'} !important;
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              background-color: #FFFDF8;
              flex-direction: column;
              padding: 24px;
              border-bottom: 2px solid #D9ED89;
              box-shadow: 0 12px 24px rgba(23, 58, 53, 0.08);
              align-items: flex-start !important;
              gap: 20px !important;
            }
            .primary-nav-wrapper ul {
              flex-direction: column !important;
              width: 100%;
              gap: 16px !important;
            }
            .primary-nav-wrapper ul li { width: 100%; }
          }
        `}</style>

        {/* NAVIGATION & USER ACCOUNT */}
        <nav
          id="primary-navigation"
          className="primary-nav-wrapper"
          aria-label="Primary navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <ul
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={closeMenu}
                  style={{
                    color: '#5D706B',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#104C40')}
                  onMouseLeave={(e) => (e.target.style.color = '#5D706B')}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* USER ACCOUNT SECTION */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            {user ? (
              <div>
                <button
                  type="button"
                  aria-expanded={profileOpen}
                  aria-controls="profile-panel"
                  onClick={() => setProfileOpen((open) => !open)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#FFFAF0',
                    border: '1.5px solid #176B59',
                    borderRadius: '9999px',
                    padding: '6px 14px 6px 6px',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <span
                    style={{
                      backgroundColor: '#104C40',
                      color: '#D9ED89',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                    }}
                    aria-hidden="true"
                  >
                    {user.name?.trim().charAt(0).toUpperCase() || 'U'}
                  </span>
                  <span style={{ fontWeight: '700', color: '#104C40', fontSize: '0.875rem' }}>
                    {user.name}
                  </span>
                  <span style={{ color: '#176B59', fontSize: '0.75rem', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} aria-hidden="true">
                    ▼
                  </span>
                </button>

                {/* PROFILE DROPDOWN PANEL */}
                {profileOpen && (
                  <div
                    id="profile-panel"
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginTop: '8px',
                      width: '220px',
                      backgroundColor: '#FFFDF8',
                      border: '1.5px solid #D9ED89',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0 12px 32px rgba(23, 58, 53, 0.12)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      zIndex: 102,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '800', color: '#104C40', fontSize: '0.95rem' }}>{user.name}</div>
                      <div style={{ color: '#5D706B', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                    </div>

                    <div style={{ height: '1px', backgroundColor: '#D9ED89', margin: '2px 0' }} />

                    <Link
                      to="/dashboard"
                      onClick={() => { setProfileOpen(false); closeMenu() }}
                      style={{
                        color: '#104C40',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        padding: '6px 0',
                      }}
                    >
                      My Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={() => { setDialog('password'); setProfileOpen(false) }}
                      style={{ background: 'transparent', color: '#104C40', border: 'none', textAlign: 'left', padding: '6px 0', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}
                    >
                      Change Password
                    </button>

                    <button
                      type="button"
                      onClick={() => { setDialog('delete'); setProfileOpen(false) }}
                      style={{ background: 'transparent', color: '#dc2626', border: 'none', textAlign: 'left', padding: '6px 0', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer' }}
                    >
                      Delete Account
                    </button>

                    <button
                      type="button"
                      onClick={() => { setProfileOpen(false); setDialog('logout') }}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#dc2626',
                        border: 'none',
                        textAlign: 'left',
                        padding: '6px 0',
                        fontWeight: '700',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                style={{
                  backgroundColor: '#104C40',
                  color: '#FFFAF0',
                  padding: '8px 20px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Log In
              </Link>
            )}
          </div>
        </nav>
      </div>

      {dialog && (
        <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog() }} style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', padding: '24px', background: 'rgba(16, 76, 64, 0.38)', zIndex: 200 }}>
          <form onSubmit={submitDialog} style={{ width: 'min(100%, 420px)', background: '#FFFDF8', border: '2px solid #D9ED89', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 50px rgba(23, 58, 53, 0.2)' }}>
            <h2 style={{ color: '#104C40', margin: '0 0 8px', fontSize: '1.5rem' }}>{dialog === 'password' ? 'Change Password' : dialog === 'delete' ? 'Delete Account' : 'Log Out'}</h2>
            <p style={{ color: '#5D706B', fontSize: '0.9rem', margin: '0 0 20px' }}>{dialog === 'password' ? 'Enter your current password and choose a new one.' : dialog === 'delete' ? 'This permanently removes your account and listings. Enter your password and type DELETE to confirm.' : 'Are you sure you want to log out of ShareBite LK?'}</p>
            {dialog === 'password' ? (
              <>
                <label style={{ display: 'block', color: '#104C40', fontWeight: '700', fontSize: '0.85rem', marginBottom: '12px' }}>Current Password<input required type="password" value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} style={dialogInputStyle} /></label>
                <label style={{ display: 'block', color: '#104C40', fontWeight: '700', fontSize: '0.85rem', marginBottom: '12px' }}>New Password<input required minLength={6} type="password" value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} style={dialogInputStyle} /></label>
                <label style={{ display: 'block', color: '#104C40', fontWeight: '700', fontSize: '0.85rem' }}>Confirm New Password<input required minLength={6} type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} style={dialogInputStyle} /></label>
              </>
            ) : dialog === 'delete' ? (
              <>
                <label style={{ display: 'block', color: '#104C40', fontWeight: '700', fontSize: '0.85rem', marginBottom: '12px' }}>Password<input required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} style={dialogInputStyle} /></label>
                <label style={{ display: 'block', color: '#104C40', fontWeight: '700', fontSize: '0.85rem' }}>Type DELETE to confirm<input required value={form.confirmation} onChange={(event) => setForm({ ...form, confirmation: event.target.value })} style={dialogInputStyle} /></label>
              </>
            ) : null}
            {feedback && <p style={{ color: '#b13c28', fontWeight: '600', fontSize: '0.85rem', margin: '14px 0 0' }}>{feedback}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
              <button type="button" onClick={closeDialog} style={dialogButtonStyle}>Cancel</button>
              <button type="submit" disabled={saving} style={{ ...dialogButtonStyle, color: '#FFFDF8', background: dialog === 'delete' ? '#dc2626' : '#104C40', borderColor: dialog === 'delete' ? '#dc2626' : '#104C40' }}>{saving ? 'Please wait...' : dialog === 'delete' ? 'Delete Account' : dialog === 'logout' ? 'Log Out' : 'Change Password'}</button>
            </div>
          </form>
        </div>
      )}
    </header>
  )
}

const dialogInputStyle = { display: 'block', width: '100%', boxSizing: 'border-box', marginTop: '6px', padding: '10px 12px', border: '1px solid #b9ccc0', borderRadius: '9px', background: '#fff', color: '#173a35' }
const dialogButtonStyle = { padding: '10px 14px', border: '1px solid #b9ccc0', borderRadius: '9px', color: '#104C40', background: '#fff', fontWeight: '700', cursor: 'pointer' }