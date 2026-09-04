
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import PageBackground from '../components/PageBackground'

const audiences = [
  {
    title: 'Food Businesses',
    text: 'Cafés, bakeries, caterers, and restaurants give safe surplus a meaningful destination instead of letting it go to waste.',
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Community Groups',
    text: 'Local organisations discover available food and connect it with people they support everyday.',
    img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Households',
    text: 'Individuals and families browse food nearby and reserve items they can collect in time.',
    img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
  },
]

export default function ProblemPage({ user, token, onLogout }) {
  return (
    <div style={{ backgroundColor: '#FFFAF0', color: '#173A35', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden', position: 'relative' }}>
      <PageBackground variant="default" />
      
      {/* KEYFRAME ANIMATIONS FOR FLOATING DECORATIONS */}
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
        .float-1 { animation: floatSlow 5s ease-in-out infinite; }
        .float-2 { animation: floatFast 4s ease-in-out infinite; }
      `}</style>

      <Header user={user} token={token} onLogout={onLogout} />

      <main>
        {/* PAGE HERO */}
        <section style={{ position: 'relative', padding: '80px 24px 60px 24px', background: '#FFFAF0', textAlign: 'center' }}>
          
          {/* FLOATING DECORATIVE BACKGROUND BLOBS */}
          <div className="float-1" style={{ position: 'absolute', top: '15%', left: '5%', background: '#D9ED89', width: '56px', height: '56px', borderRadius: '50%', opacity: 0.6, pointerEvents: 'none' }} />
          <div className="float-2" style={{ position: 'absolute', bottom: '10%', right: '8%', background: '#104C40', width: '40px', height: '40px', borderRadius: '8px', opacity: 0.15, pointerEvents: 'none' }} />

          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              The Reason We Exist
            </span>
            <h1 style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', fontWeight: '800', lineHeight: '1.2', margin: '16px 0 24px 0', color: '#104C40' }}>
              Food waste and food access should <span style={{ background: '#D9ED89', padding: '0 8px', borderRadius: '6px', color: '#104C40' }}>not sit side by side.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#5D706B', lineHeight: '1.6', margin: '0 auto 32px auto', maxWidth: '650px' }}>
              ShareBite LK makes it easier for safe surplus food to move from Sri Lankan businesses to nearby people and community groups who can use it.
            </p>
          </div>
        </section>

        {/* WHO IT SUPPORTS (AUDIENCE CARDS WITH IMAGES) */}
        <section style={{ padding: '60px 24px 96px 24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textTransform: 'center', textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase' }}>Who It Supports</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#104C40', margin: '8px 0 0 0' }}>A shared challenge with room for everyone to help.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {audiences.map((item, index) => (
              <div key={item.title} style={{ background: '#FFFDF8', borderRadius: '24px', border: '1px solid #176B59', overflow: 'hidden', boxShadow: '0 8px 24px rgba(23, 58, 53, 0.05)', position: 'relative' }}>
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#D9ED89', color: '#104C40', fontSize: '0.875rem', fontWeight: '900', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    0{index + 1}
                  </span>
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '1.35rem', color: '#104C40' }}>{item.title}</h3>
                  <p style={{ color: '#5D706B', fontSize: '0.925rem', lineHeight: '1.6', margin: 0 }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* THE SHAREBITE APPROACH */}
        <section style={{ background: '#FFFDF8', padding: '96px 24px', borderTop: '1px solid #D9ED89', borderBottom: '1px solid #D9ED89' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#176B59', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase' }}>The ShareBite Approach</span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#104C40', margin: '12px 0 0 0', lineHeight: '1.2' }}>Make sharing food a simple, timely local habit.</h2>
            </div>
            
            <div style={{ background: '#FFFAF0', padding: '32px', borderRadius: '24px', border: '1px solid #176B59' }}>
              <p style={{ color: '#5D706B', fontSize: '1.05rem', lineHeight: '1.7', margin: '0 0 24px 0' }}>
                Businesses post a listing with food details and collection deadlines. Nearby users browse, reserve, and collect within that window. It is a practical way to make the most of food that is still good to share.
              </p>
              <Link to="/share-food" style={{ backgroundColor: '#104C40', color: '#FFFAF0', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Share Surplus Today <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* FOOD SAFETY NOTE */}
        <section style={{ padding: '96px 24px', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ background: '#104C40', borderRadius: '24px', padding: '40px', color: '#FFFAF0', display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
            
            {/* Background Accent Circle */}
            <div className="float-1" style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '100px', height: '100px', background: '#176B59', borderRadius: '50%', opacity: 0.4, pointerEvents: 'none' }} />

            <div style={{ background: '#D9ED89', color: '#104C40', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', flexShrink: 0 }}>
              ✓
            </div>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <span style={{ color: '#D9ED89', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase' }}>Food Safety Comes First</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '8px 0 16px 0', color: '#FFFAF0' }}>Share only what is safe to collect and eat.</h2>
              <p style={{ color: '#FFFAF0', opacity: 0.9, lineHeight: '1.6', margin: 0, fontSize: '0.95rem' }}>
                Anyone posting food must confirm it is safe for collection. People reserving food should collect it before the listed time and consume it before that deadline. When in doubt, do not share or consume it.
              </p>
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