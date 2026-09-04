import { Link } from 'react-router-dom'
import Header from '../components/Header'
import PageBackground from '../components/PageBackground'

const steps = [
  {
    number: '01',
    title: 'Post Surplus',
    text: 'Food businesses and households list safe surplus items with pickup windows and portion counts.',
  },
  {
    number: '02',
    title: 'Find Nearby',
    text: 'Browse real-time listings filtered by district, category, and available collection deadlines.',
  },
  {
    number: '03',
    title: 'Reserve & Collect',
    text: 'Reserve a portion online, coordinate direct pickup with the donor, and prevent food waste.',
  },
]

const stats = [
  { label: 'Meals Saved', value: '2,400+' },
  { label: 'Active Donors', value: '85+' },
  { label: 'Districts Covered', value: '12 Areas' },
  { label: 'Community Groups', value: '150+' },
]

export default function LandingPage({ user, token, onLogout }) {
  return (
    <div style={{ backgroundColor: '#FFFAF0', color: '#173A35', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden', position: 'relative' }}>
      <PageBackground variant="hero" />
      
      {/* KEYFRAME ANIMATIONS FOR FLOATING ELEMENTS */}
      <style>{`
        @keyframes floatSlow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes floatFast {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(-4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .float-element-1 { animation: floatSlow 5s ease-in-out infinite; }
        .float-element-2 { animation: floatFast 4s ease-in-out infinite; }
      `}</style>

      <Header user={user} token={token} onLogout={onLogout} />

      <main>
        {/* HERO SECTION */}
        <section style={{ position: 'relative', padding: '80px 24px 60px 24px', background: '#FFFAF0' }}>
          
          {/* FLOATING DECORATIVE BACKGROUND ELEMENTS */}
          <div className="float-element-1" style={{ position: 'absolute', top: '10%', left: '3%', background: '#D9ED89', width: '64px', height: '64px', borderRadius: '50%', opacity: 0.6, pointerEvents: 'none', zIndex: 0 }} />
          <div className="float-element-2" style={{ position: 'absolute', bottom: '15%', left: '45%', background: '#176B59', width: '32px', height: '32px', borderRadius: '8px', opacity: 0.2, pointerEvents: 'none', zIndex: 0 }} />
          <div className="float-element-1" style={{ position: 'absolute', top: '20%', right: '5%', background: '#104C40', width: '48px', height: '48px', borderRadius: '50%', opacity: 0.15, pointerEvents: 'none', zIndex: 0 }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            
            {/* Left Copy */}
            <div>
              <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                A kinder way to share food
              </span>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: '800', lineHeight: '1.15', margin: '16px 0 24px 0', color: '#104C40' }}>
                Good food should reach people, <span style={{ background: '#D9ED89', padding: '0 8px', borderRadius: '6px', color: '#104C40' }}>not bins.</span>
              </h1>
              <p style={{ fontSize: '1.125rem', color: '#5D706B', lineHeight: '1.6', marginBottom: '32px' }}>
                ShareBite LK connects Sri Lankan cafés, bakeries, caterers, restaurants, and households with nearby people and community groups to collect safe surplus food in real time.
              </p>
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <Link to="/find-food" style={{ backgroundColor: '#104C40', color: '#FFFAF0', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Find Food Nearby <span>→</span>
                </Link>
                <Link to="/share-food" style={{ backgroundColor: '#D9ED89', color: '#104C40', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', textDecoration: 'none' }}>
                  Share Surplus
                </Link>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#5D706B' }}>Real-time listings • District-based pickup • Direct collection</p>
            </div>

            {/* Right Interactive Visual Listing Mockup */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              
              {/* Floating Badge on Card */}
              <div className="float-element-2" style={{ position: 'absolute', top: '-20px', right: '-10px', background: '#104C40', color: '#D9ED89', padding: '8px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '0.8rem', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', zIndex: 2 }}>
                ⚡ Real-time Reservation
              </div>

              <div style={{ background: '#FFFDF8', border: '2px solid #D9ED89', borderRadius: '24px', padding: '20px', width: '100%', maxWidth: '380px', boxShadow: '0 12px 32px rgba(23, 58, 53, 0.08)' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', height: '180px', marginBottom: '16px', position: 'relative' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" 
                    alt="Freshly baked artisan bread" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#D9ED89', color: '#104C40', fontSize: '0.75rem', fontWeight: '800', padding: '4px 12px', borderRadius: '9999px' }}>
                    Available Now
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#176B59', fontSize: '0.875rem', fontWeight: '700' }}>Bakery Surplus</span>
                  <span style={{ color: '#5D706B', fontSize: '0.875rem', fontWeight: '600' }}>📍 Colombo District</span>
                </div>
                
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#104C40' }}>Fresh Baked Goods & Bread</h3>
                <p style={{ color: '#5D706B', fontSize: '0.875rem', margin: '0 0 16px 0' }}>Collection Deadline: Before 7:30 PM Today</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #FFFAF0' }}>
                  <span style={{ color: '#104C40', fontWeight: '800' }}>5 Portions Left</span>
                  <Link to="/find-food" style={{ backgroundColor: '#176B59', color: '#FFFAF0', padding: '6px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '700', textDecoration: 'none' }}>
                    Reserve
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* METRICS BAND */}
        <section style={{ background: '#104C40', color: '#FFFAF0', padding: '40px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px', textAlign: 'center' }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '2.25rem', fontWeight: '800', color: '#D9ED89' }}>{s.value}</div>
                <div style={{ fontSize: '0.875rem', color: '#FFFAF0', marginTop: '4px', opacity: 0.9 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROBLEM STATEMENT & SOLUTION */}
        <section style={{ padding: '96px 24px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 64px auto' }}>
            <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase' }}>Bridging the Gap</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#104C40', margin: '16px 0 24px 0' }}>Connecting Unused Food with Local Need</h2>
            <p style={{ color: '#5D706B', fontSize: '1.125rem', lineHeight: '1.7', margin: 0 }}>
              Many food businesses prepare surplus items daily with no fast way to reach local collectors before expiration. Meanwhile, households and community groups face food access challenges. ShareBite LK resolves both by making safe surplus visible in real time.
            </p>
          </div>

          {/* Solution Highlight Cards with Images */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              {
                title: 'Food Businesses & Donors',
                desc: 'Cafés, bakeries, caterers, and households post available food details, location, and pickup windows.',
                img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80'
              },
              {
                title: 'Local Recipients',
                desc: 'Neighbours and community organisations filter food by district and reserve items instantly.',
                img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=500&q=80'
              },
              {
                title: 'Direct Coordination',
                desc: 'No middleman delivery fees. Recipients collect food directly from donors within specified deadlines.',
                img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=500&q=80'
              }
            ].map((card, idx) => (
              <div key={idx} style={{ background: '#FFFDF8', borderRadius: '20px', border: '1px solid #176B59', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                <div style={{ height: '160px', overflow: 'hidden' }}>
                  <img src={card.img} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', color: '#104C40' }}>{card.title}</h3>
                  <p style={{ color: '#5D706B', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ background: '#FFFDF8', padding: '96px 24px', borderTop: '1px solid #D9ED89', borderBottom: '1px solid #D9ED89' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase' }}>Three Simple Steps</span>
                <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#104C40', margin: '8px 0 0 0' }}>How ShareBite LK Works</h2>
              </div>
              <Link to="/about" style={{ color: '#104C40', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Read Platform Guidelines <span>→</span>
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {steps.map((step) => (
                <div key={step.title} style={{ background: '#FFFAF0', padding: '32px', borderRadius: '20px', border: '1px solid #176B59', position: 'relative' }}>
                  <span style={{ fontSize: '3rem', fontWeight: '900', color: '#D9ED89', position: 'absolute', top: '16px', right: '24px' }}>{step.number}</span>
                  <h3 style={{ fontSize: '1.5rem', color: '#104C40', margin: '0 0 12px 0', position: 'relative' }}>{step.title}</h3>
                  <p style={{ color: '#5D706B', lineHeight: '1.6', margin: 0, position: 'relative' }}>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION BAND */}
        <section style={{ padding: '96px 24px', textAlign: 'center', background: '#FFFAF0' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', background: '#104C40', padding: '48px 32px', borderRadius: '32px', color: '#FFFAF0', position: 'relative', overflow: 'hidden' }}>
            
            {/* Background Accent Blob inside CTA */}
            <div className="float-element-1" style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', background: '#176B59', borderRadius: '50%', opacity: 0.5, pointerEvents: 'none' }} />

            <span style={{ color: '#D9ED89', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: '800' }}>Start Sharing Today</span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '12px 0 24px 0', color: '#FFFAF0' }}>Have surplus food to share, or looking for meals nearby?</h2>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              <Link to="/find-food" style={{ backgroundColor: '#D9ED89', color: '#104C40', padding: '12px 28px', borderRadius: '12px', fontWeight: '700', textDecoration: 'none' }}>
                Find Food
              </Link>
              <Link to="/share-food" style={{ backgroundColor: '#176B59', color: '#FFFAF0', padding: '12px 28px', borderRadius: '12px', fontWeight: '700', textDecoration: 'none' }}>
                Post Surplus
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #D9ED89', padding: '48px 24px', textAlign: 'center', background: '#FFFDF8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#104C40', display: 'block', marginBottom: '8px' }}>
            ShareBite <em style={{ color: '#176B59', fontStyle: 'normal' }}>LK</em>
          </span>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#5D706B' }}>Connecting surplus food with Sri Lankan communities.</p>
        </div>
      </footer>
    </div>
  )
}