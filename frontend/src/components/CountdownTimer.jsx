import { useEffect, useState } from 'react'
import { getRemainingTimeBreakdown } from '../utils/timeUtils'

export default function CountdownTimer({ targetDate, compact = false, showLabel = true }) {
  const [breakdown, setBreakdown] = useState(() => getRemainingTimeBreakdown(targetDate))

  useEffect(() => {
    setBreakdown(getRemainingTimeBreakdown(targetDate))
    const timer = setInterval(() => {
      setBreakdown(getRemainingTimeBreakdown(targetDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const { isExpired, isLastHour, text, urgency } = breakdown

  // Style variations based on urgency
  const colors = {
    normal: { bg: '#E8F5E9', text: '#1B5E20', border: '#A5D6A7' },
    warning: { bg: '#FFF8E1', text: '#E65100', border: '#FFE082' },
    urgent: { bg: '#FFEBEE', text: '#C62828', border: '#EF9A9A' },
    expired: { bg: '#ECEFF1', text: '#546E7A', border: '#CFD8DC' },
  }

  const currentTheme = colors[urgency] || colors.normal

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
        border: `1px solid ${currentTheme.border}`,
        padding: compact ? '2px 8px' : '4px 10px',
        borderRadius: '999px',
        fontSize: compact ? '0.75rem' : '0.8rem',
        fontWeight: '700',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '0.02em',
      }}
      title={isLastHour ? 'Less than 1 hour remaining! Cannot cancel within this window.' : undefined}
    >
      <span aria-hidden="true" style={{ fontSize: '0.9em' }}>
        {isExpired ? '⌛' : isLastHour ? '🔥' : '⏱️'}
      </span>
      <span>{text}</span>
      {isLastHour && !compact && showLabel && (
        <span style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: '800', marginLeft: '2px' }}>
          (Last hour)
        </span>
      )}
    </span>
  )
}
