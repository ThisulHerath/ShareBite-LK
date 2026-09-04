import { useState } from 'react'
import '../styles/sharebite.css'

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'Find Food', href: '/find-food' },
  { label: 'Share Food', href: '/share-food' },
  { label: 'About', href: '/about' },
]

/** A responsive site header. Pass user and onLogout when a session is available. */
export default function Header({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="/" aria-label="ShareBite LK home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>ShareBite <em>LK</em></span>
        </a>

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
              <li key={item.href}><a href={item.href} onClick={closeMenu}>{item.label}</a></li>
            ))}
          </ul>
          <div className="nav-account">
            {user ? (
              <>
                <span className="user-greeting">Hi, {user.name}</span>
                <button className="button button-small button-outline" type="button" onClick={onLogout}>Log out</button>
              </>
            ) : (
              <a className="button button-small button-primary" href="/login" onClick={closeMenu}>Log in</a>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

