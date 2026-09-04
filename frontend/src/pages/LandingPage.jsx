import Header from '../components/Header'
import '../styles/sharebite.css'

const steps = [
  ['01', 'Post', 'Food businesses share safe surplus food with a pickup time and clear details.'],
  ['02', 'Find', 'People and community groups browse what is available nearby.'],
  ['03', 'Reserve', 'Reserve a listing, collect it on time, and give good food a better next stop.'],
]

export default function LandingPage({ user, onLogout }) {
  return (
    <div className="site-page">
      <Header user={user} onLogout={onLogout} />
      <main>
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="kicker">A kinder way to share food</p>
              <h1>Good food should reach people, <span>not bins.</span></h1>
              <p className="hero-lede">ShareBite LK helps Sri Lankan cafés, bakeries, caterers, and restaurants connect their safe surplus food with nearby people and community groups.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="/find-food">Find Food <span aria-hidden="true">→</span></a>
                <a className="button button-secondary" href="/share-food">Share Surplus</a>
              </div>
              <p className="hero-note">Simple to post. Free to explore. Designed for local communities.</p>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="sun" />
              <div className="food-card card-one"><span>Fresh today</span><strong>Made to share</strong></div>
              <div className="food-card card-two">🥖</div>
              <div className="leaf leaf-one">●</div><div className="leaf leaf-two">●</div>
            </div>
          </div>
        </section>

        <section className="problem-intro section">
          <div className="shell narrow centered">
            <p className="kicker">Small actions, meaningful impact</p>
            <h2>When good food goes unused, everyone loses.</h2>
            <p>Every day, food businesses may have perfectly usable items left after service, while households and community organisations are looking for affordable meal options. ShareBite LK gives that food a practical, local path forward.</p>
          </div>
        </section>

        <section className="how-it-works section section-tint">
          <div className="shell">
            <div className="section-heading"><div><p className="kicker">How it works</p><h2>From surplus to shared in three steps.</h2></div><a href="/about" className="text-link">Why ShareBite LK? <span>→</span></a></div>
            <ol className="steps">
              {steps.map(([number, title, text]) => <li key={title}><span className="step-number">{number}</span><h3>{title}</h3><p>{text}</p></li>)}
            </ol>
          </div>
        </section>

        <section className="impact section">
          <div className="shell impact-grid">
            <div><p className="kicker">What sharing can do</p><h2>Local food deserves a local second chance.</h2><p>Every listing can help a business reduce avoidable waste, help a neighbour access food, and help a community build more thoughtful habits around what we already have.</p></div>
            <div className="impact-cards" aria-label="Potential impacts of food sharing">
              <article><span aria-hidden="true">♻</span><h3>Less waste</h3><p>Keep safe, usable food in circulation.</p></article>
              <article><span aria-hidden="true">♥</span><h3>More access</h3><p>Make nearby food easier to discover.</p></article>
              <article><span aria-hidden="true">⌂</span><h3>Stronger communities</h3><p>Build helpful local connections.</p></article>
            </div>
          </div>
        </section>

        <section className="cta-band"><div className="shell"><div><p className="kicker">Start where you are</p><h2>Have food to share, or need food nearby?</h2></div><div className="hero-actions"><a className="button button-light" href="/find-food">Find Food</a><a className="button button-ghost" href="/share-food">Share Surplus</a></div></div></section>
      </main>
      <footer className="site-footer"><div className="shell"><span className="brand">ShareBite <em>LK</em></span><p>Making room for good food and good neighbours.</p></div></footer>
    </div>
  )
}

