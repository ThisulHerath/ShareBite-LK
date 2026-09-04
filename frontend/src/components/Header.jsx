import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/sharebite.css'

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Find Food', href: '/find-food' },
  { label: 'Share Food', href: '/share-food' },
]

/** A responsive site header. Pass user and onLogout when a session is available. */
export default function Header({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" to="/" aria-label="ShareBite LK home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>ShareBite <em>LK</em></span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>

        <nav id="primary-navigation" className={`primary-nav ${isOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}><Link to={item.href} onClick={closeMenu}>{item.label}</Link></li>
            ))}
          </ul>
          <div className="nav-account">
            {user ? (
              <div className="profile-menu">
                <button className="profile-trigger" type="button" aria-expanded={profileOpen} aria-controls="profile-panel" onClick={() => setProfileOpen((open) => !open)}>
                  <span className="profile-avatar" aria-hidden="true">{user.name?.trim().charAt(0).toUpperCase() || 'U'}</span>
                  <span className="profile-name">{user.name}</span><span className="profile-chevron" aria-hidden="true">⌄</span>
                </button>
                {profileOpen && <div id="profile-panel" className="profile-panel">
                  <span className="profile-panel-name">{user.name}</span>
                  <span className="profile-panel-email">{user.email}</span>
                  <Link to="/dashboard" onClick={() => { setProfileOpen(false); closeMenu() }}>My dashboard</Link>
                  <button type="button" onClick={() => { setProfileOpen(false); onLogout?.() }}>Log out</button>
                </div>}
              </div>
            ) : (
              <Link className="button button-small button-primary" to="/login" onClick={closeMenu}>Log in</Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

