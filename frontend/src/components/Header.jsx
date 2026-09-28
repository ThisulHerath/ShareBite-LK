import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { apiErrorMessage, changePassword, deleteAccount } from '../services/api'
import { useLocale } from '../i18n/LocaleContext'

export default function Header({ user, token, onLogout }) {
  const { language, setLanguage, t } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [dialog, setDialog] = useState(null)
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '', password: '', confirmation: '' })
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const profileRef = useRef(null)
  const role = user?.role || 'recipient'
  const nav = [
    { label: t('home'), href: '/' }, { label: t('about'), href: '/about' },
    ...(!user || role === 'recipient' || role === 'admin' ? [{ label: t('findFood'), href: '/find-food' }] : []),
    ...(!user || role === 'donor' || role === 'admin' ? [{ label: t('shareFood'), href: '/share-food' }] : []),
  ]
  const closeAll = () => { setMenuOpen(false); setProfileOpen(false) }
  const closeDialog = () => {
    setDialog(null); setFeedback('')
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '', password: '', confirmation: '' })
  }

  useEffect(() => {
    const close = (event) => profileRef.current && !profileRef.current.contains(event.target) && setProfileOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const submitDialog = async (event) => {
    event.preventDefault(); setFeedback('')
    if (dialog === 'logout') { closeDialog(); onLogout?.(); return }
    if (dialog === 'password' && form.newPassword !== form.confirmPassword) { setFeedback('New passwords do not match.'); return }
    setSaving(true)
    try {
      if (dialog === 'password') {
        await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword }, token)
        closeDialog(); window.alert('Your password was changed successfully.')
      } else {
        await deleteAccount({ password: form.password, confirmation: form.confirmation }, token)
        closeDialog(); onLogout?.()
      }
    } catch (error) { setFeedback(apiErrorMessage(error, 'We could not complete that request.')) }
    finally { setSaving(false) }
  }

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link className="app-brand" to="/" onClick={closeAll} aria-label="ShareBite LK home">
          <span className="app-brand__mark" aria-hidden="true"><span>●</span><i>⌁</i></span>
          <span>ShareBite <em>LK</em><small>බෙදාගමු</small></span>
        </Link>
        <button className="app-menu-button" type="button" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span /><span /><span /></button>
        <nav className={`app-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <div className="app-nav__links">
            {nav.map((item) => <NavLink key={item.href} to={item.href} onClick={closeAll} className={({ isActive }) => isActive ? 'is-active' : ''}>{item.label}</NavLink>)}
          </div>
          <div className="language-switch" aria-label={t('language')}>
            <button className={language === 'en' ? 'is-active' : ''} onClick={() => setLanguage('en')} type="button">EN</button>
            <button className={language === 'si' ? 'is-active' : ''} onClick={() => setLanguage('si')} type="button">සිං</button>
          </div>
          {user ? (
            <div className="profile-menu" ref={profileRef}>
              <button className="profile-menu__trigger" type="button" onClick={() => setProfileOpen((v) => !v)} aria-expanded={profileOpen}>
                <span className="profile-avatar">{user.name?.trim().charAt(0).toUpperCase() || 'U'}</span>
                <span><strong>{user.name?.split(' ')[0]}</strong><small>{t(role)}</small></span><i>⌄</i>
              </button>
              {profileOpen && <div className="profile-menu__panel">
                <div className="profile-menu__identity"><strong>{user.name}</strong><span>{user.email}</span><em>{t(role)}</em></div>
                <Link to="/dashboard" onClick={closeAll}>{t('dashboard')}</Link>
                <button type="button" onClick={() => { setDialog('password'); setProfileOpen(false) }}>{t('changePassword')}</button>
                <button className="danger-link" type="button" onClick={() => { setDialog('delete'); setProfileOpen(false) }}>{t('deleteAccount')}</button>
                <button className="danger-link" type="button" onClick={() => { setDialog('logout'); setProfileOpen(false) }}>{t('logout')}</button>
              </div>}
            </div>
          ) : <Link className="header-login" to="/login" onClick={closeAll}>{t('login')} <span>→</span></Link>}
        </nav>
      </div>

      {dialog && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && closeDialog()}>
        <form className="account-modal" onSubmit={submitDialog}>
          <div className="modal-icon">{dialog === 'delete' ? '!' : dialog === 'logout' ? '→' : '◆'}</div>
          <h2>{dialog === 'password' ? t('changePassword') : dialog === 'delete' ? t('deleteAccount') : t('logout')}</h2>
          <p>{dialog === 'password' ? 'Enter your current password and choose a strong new password.' : dialog === 'delete' ? 'This permanently removes your account and listings.' : 'Are you sure you want to log out?'}</p>
          {dialog === 'password' && <><label>Current password<input required type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} /></label><label>New password<input required minLength={8} type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} /></label><label>Confirm new password<input required minLength={8} type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /></label></>}
          {dialog === 'delete' && <><label>Password<input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><label>Type DELETE to confirm<input required value={form.confirmation} onChange={(e) => setForm({ ...form, confirmation: e.target.value })} /></label></>}
          {feedback && <div className="form-alert error">{feedback}</div>}
          <div className="modal-actions"><button type="button" className="btn-secondary" onClick={closeDialog}>Cancel</button><button type="submit" className={dialog === 'delete' ? 'btn-danger' : 'btn-primary'} disabled={saving}>{saving ? 'Please wait…' : dialog === 'delete' ? t('deleteAccount') : dialog === 'logout' ? t('logout') : t('changePassword')}</button></div>
        </form>
      </div>}
    </header>
  )
}
