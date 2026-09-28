import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { useLocale } from '../i18n/LocaleContext'

export default function LandingPage({ user, token, onLogout }) {
  const { t } = useLocale()
  const role = user?.role || null
  const primaryPath = role === 'donor' ? '/share-food' : '/find-food'
  const features = [
    ['⌁', t('liveListings'), t('liveText')], ['✓', t('safeSharing'), t('safeText')], ['LK', t('islandReady'), t('islandText')],
  ]
  const steps = [[t('step1'), t('step1Text')], [t('step2'), t('step2Text')], [t('step3'), t('step3Text')]]
  const roles = [['donor', t('donorText'), '↗'], ['recipient', t('recipientText'), '⌖'], ['admin', t('adminText'), '◇']]

  return <div className="professional-page landing-v2">
    <Header user={user} token={token} onLogout={onLogout} />
    <main>
      <section className="landing-hero">
        <div className="landing-shell landing-hero__grid">
          <div className="landing-hero__copy">
            <span className="eyebrow"><i /> {t('heroKicker')}</span>
            <h1>{t('heroTitle')}</h1>
            <p>{t('heroText')}</p>
            <div className="hero-cta-row">
              <Link className="cta-primary" to={primaryPath}>{role === 'donor' ? t('postSurplus') : t('findNearby')} <span>→</span></Link>
              {!user && <Link className="cta-secondary" to="/register">{t('getStarted')}</Link>}
              {user && role === 'admin' && <Link className="cta-secondary" to="/dashboard">{t('dashboard')}</Link>}
            </div>
            <div className="trust-row"><span>✓ Role-secured access</span><span>✓ 25 districts</span><span>✓ English + සිංහල</span></div>
          </div>
          <div className="landing-hero__visual" aria-label="Food sharing illustration">
            <div className="hero-photo" />
            <div className="floating-card floating-card--top"><span className="pulse-dot" /><div><strong>12 portions available</strong><small>Colombo 07 · collect by 6:30 PM</small></div></div>
            <div className="floating-card floating-card--bottom"><span>✓</span><div><strong>Reserved successfully</strong><small>Collection details are ready</small></div></div>
            <div className="hero-location">⌖ Sri Lanka</div>
          </div>
        </div>
      </section>

      <section className="feature-strip"><div className="landing-shell feature-grid">
        {features.map(([icon, title, text]) => <article key={title}><span>{icon}</span><div><h2>{title}</h2><p>{text}</p></div></article>)}
      </div></section>

      <section className="landing-section process-section"><div className="landing-shell">
        <div className="section-heading-v2"><div><span className="eyebrow"><i /> {t('howWorks')}</span><h2>{t('howTitle')}</h2></div><Link to="/about">Platform guidelines <span>→</span></Link></div>
        <div className="process-grid">{steps.map(([title, text], index) => <article key={title}><span className="step-index">0{index + 1}</span><div className="step-line" /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div></section>

      <section className="landing-section role-section"><div className="landing-shell role-layout">
        <div className="role-intro"><span className="eyebrow light"><i /> Role-based platform</span><h2>{t('roleTitle')}</h2><p>Each account only sees the tools it needs. That keeps sharing simpler, safer, and easier to manage.</p><Link to="/register" className="cta-light">{t('getStarted')} <span>→</span></Link></div>
        <div className="role-cards">{roles.map(([key, text, icon]) => <article key={key}><span>{icon}</span><div><h3>{t(key)}</h3><p>{text}</p></div></article>)}</div>
      </div></section>

      <section className="landing-cta"><div className="landing-shell"><div><span className="eyebrow"><i /> ShareBite LK</span><h2>{t('footerText')}</h2></div><div className="hero-cta-row"><Link className="cta-primary" to="/register">{t('getStarted')} <span>→</span></Link><Link className="cta-secondary" to="/login">{t('memberAlready')} {t('login')}</Link></div></div></section>
    </main>
    <footer className="footer-v2"><div className="landing-shell"><div className="app-brand footer-brand"><span className="app-brand__mark"><span>●</span><i>⌁</i></span><span>ShareBite <em>LK</em><small>බෙදාගමු</small></span></div><p>© 2026 ShareBite LK · {t('footerText')}</p><div><Link to="/about">Safety</Link><Link to="/about">How it works</Link></div></div></footer>
  </div>
}
