import Header from '../components/Header'
import '../styles/sharebite.css'

const audiences = [
  ['Food businesses', 'Cafés, bakeries, caterers, and restaurants can give safe surplus a meaningful destination instead of letting it go to waste.'],
  ['Community groups', 'Local organisations can discover available food and connect it with people they support.'],
  ['Households', 'Individuals and families can look for food nearby and reserve what they can collect in time.'],
]

export default function ProblemPage({ user, onLogout }) {
  return (
    <div className="site-page">
      <Header user={user} onLogout={onLogout} />
      <main>
        <section className="page-hero"><div className="shell narrow"><p className="kicker">The reason we exist</p><h1>Food waste and food access should not sit side by side.</h1><p>ShareBite LK makes it easier for safe surplus food to move from businesses to people nearby who can use it.</p></div></section>
        <section className="section"><div className="shell"><div className="section-heading"><div><p className="kicker">Who it supports</p><h2>A shared challenge, with room for everyone to help.</h2></div></div><div className="audience-grid">{audiences.map(([title, text], index) => <article key={title}><span className="audience-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
        <section className="section section-tint"><div className="shell solution-grid"><div><p className="kicker">The ShareBite approach</p><h2>Make sharing food a simple, timely local habit.</h2></div><div><p>Businesses post a listing with the food details and collection deadline. Nearby users browse, reserve, and collect within that window. It is a practical way to make the most of food that is still good to share.</p><a href="/share-food" className="button button-primary">Share food today <span aria-hidden="true">→</span></a></div></div></section>
        <section className="section"><div className="shell safety-note"><div className="safety-icon" aria-hidden="true">✓</div><div><p className="kicker">Food safety comes first</p><h2>Share only what is safe to collect and eat.</h2><p>Anyone posting food must confirm it is safe for collection. People reserving food should collect it before the listed time and consume it before that deadline. When in doubt, do not share or consume it.</p></div></div></section>
      </main>
      <footer className="site-footer"><div className="shell"><span className="brand">ShareBite <em>LK</em></span><p>Making room for good food and good neighbours.</p></div></footer>
    </div>
  )
}

