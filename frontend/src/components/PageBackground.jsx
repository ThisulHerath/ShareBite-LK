/**
 * PageBackground – decorative blurred gradient blobs that sit behind page content.
 * Accepts a `variant` prop to pick color themes per page.
 * All blobs use pointer-events:none and aria-hidden so they are invisible to assistive tech.
 */
export default function PageBackground({ variant = 'default' }) {
  const configs = {
    default: [
      { top: '5%', left: '-8%', w: 380, h: 380, color: 'rgba(217,237,137,0.35)', blur: 80, shape: '60% 40% 55% 45% / 45% 55% 45% 55%' },
      { top: '45%', right: '-10%', w: 340, h: 340, color: 'rgba(23,107,89,0.12)', blur: 90, shape: '50% 50% 50% 50%' },
      { bottom: '10%', left: '20%', w: 260, h: 260, color: 'rgba(16,76,64,0.08)', blur: 70, shape: '45% 55% 60% 40% / 55% 45% 55% 45%' },
    ],
    hero: [
      { top: '-5%', right: '5%', w: 450, h: 450, color: 'rgba(217,237,137,0.4)', blur: 100, shape: '50% 50% 50% 50%' },
      { top: '30%', left: '-5%', w: 300, h: 300, color: 'rgba(23,107,89,0.15)', blur: 80, shape: '60% 40% 55% 45% / 45% 55% 45% 55%' },
      { bottom: '5%', right: '15%', w: 200, h: 200, color: 'rgba(16,76,64,0.1)', blur: 60, shape: '50% 50%' },
    ],
    auth: [
      { top: '10%', right: '-5%', w: 400, h: 400, color: 'rgba(217,237,137,0.3)', blur: 90, shape: '50% 50% 50% 50%' },
      { bottom: '15%', left: '-8%', w: 350, h: 350, color: 'rgba(23,107,89,0.12)', blur: 80, shape: '40% 60% 50% 50% / 55% 45% 55% 45%' },
      { top: '50%', left: '40%', w: 200, h: 200, color: 'rgba(16,76,64,0.06)', blur: 60, shape: '50% 50%' },
    ],
    dashboard: [
      { top: '0%', right: '0%', w: 420, h: 420, color: 'rgba(217,237,137,0.25)', blur: 100, shape: '50% 50% 50% 50%' },
      { top: '40%', left: '-5%', w: 320, h: 320, color: 'rgba(23,107,89,0.1)', blur: 80, shape: '60% 40% 55% 45%' },
      { bottom: '10%', right: '10%', w: 250, h: 250, color: 'rgba(16,76,64,0.07)', blur: 70, shape: '50% 50%' },
    ],
    listings: [
      { top: '2%', right: '-4%', w: 380, h: 380, color: 'rgba(217,237,137,0.3)', blur: 90, shape: '50% 50% 50% 50%' },
      { top: '55%', left: '-6%', w: 300, h: 300, color: 'rgba(23,107,89,0.1)', blur: 80, shape: '45% 55% 60% 40%' },
      { bottom: '5%', left: '35%', w: 220, h: 220, color: 'rgba(16,76,64,0.07)', blur: 60, shape: '50% 50%' },
    ],
    share: [
      { top: '0%', left: '-6%', w: 360, h: 360, color: 'rgba(217,237,137,0.32)', blur: 90, shape: '55% 45% 50% 50% / 45% 55% 45% 55%' },
      { bottom: '10%', right: '-5%', w: 320, h: 320, color: 'rgba(23,107,89,0.12)', blur: 80, shape: '50% 50%' },
      { top: '45%', right: '25%', w: 180, h: 180, color: 'rgba(16,76,64,0.06)', blur: 50, shape: '50% 50%' },
    ],
  }

  const blobs = configs[variant] || configs.default

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: b.top,
            bottom: b.bottom,
            left: b.left,
            right: b.right,
            width: b.w,
            height: b.h,
            background: b.color,
            borderRadius: b.shape || '50%',
            filter: `blur(${b.blur}px)`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
