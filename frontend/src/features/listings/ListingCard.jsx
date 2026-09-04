import { useState } from 'react'
import CountdownTimer from '../../components/CountdownTimer'
import { getRemainingTimeBreakdown } from '../../utils/timeUtils'
import './listings.css'

function formatDateTime(iso) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ListingCard({ listing, onReserve, reserveDisabled }) {
  const { title, category, district, pickupAddress, availableUntil, status } = listing
  const total = listing.totalPortions ?? listing.portions ?? 1
  const remaining = listing.remainingPortions ?? (status === 'reserved' ? 0 : (listing.portions ?? 0))
  
  const timeInfo = getRemainingTimeBreakdown(availableUntil)
  const isExpired = timeInfo.isExpired
  const isAvailable = status === 'available' && remaining > 0 && !isExpired

  const [quantity, setQuantity] = useState(1)

  const icons = { Meals: '🍲', Bakery: '🥖', Produce: '🥬', Other: '🍽️' }

  const handleQuantityChange = (e) => {
    const val = Math.max(1, Math.min(remaining, Number(e.target.value) || 1))
    setQuantity(val)
  }

  const handleReserve = () => {
    onReserve?.(listing, quantity)
  }

  return (
    <article className="sb-listing-card" aria-labelledby={`listing-${listing.id}`}>
      <div className={`sb-card-illustration category-${String(category).toLowerCase()}`} aria-hidden="true">
        <span>{icons[category] || icons.Other}</span>
        <i />
      </div>

      <div className="sb-card-top">
        <span className="sb-category">
          <b aria-hidden="true">{icons[category] || icons.Other}</b>
          {category}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <CountdownTimer targetDate={availableUntil} compact />
          <span className={`sb-badge ${isAvailable ? 'sb-available' : 'sb-reserved'}`}>
            {isExpired ? 'Expired' : isAvailable ? 'Available' : 'Reserved'}
          </span>
        </div>
      </div>

      <h2 id={`listing-${listing.id}`} className="sb-listing-title">{title}</h2>
      <p className="sb-location">⌖ {district}</p>

      <div className="sb-card-details">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F4FAF6', padding: '6px 10px', borderRadius: '8px', border: '1px solid #D1E7DD' }}>
          <span style={{ fontSize: '0.8rem', color: '#104C40', fontWeight: '700' }}>
            Portions:
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: remaining > 0 ? '#176B59' : '#dc2626' }}>
            {remaining} of {total} left
          </span>
        </div>

        <p>⌖ {pickupAddress}</p>
        <p>◷ Collect by <strong>{formatDateTime(availableUntil)}</strong> today</p>
      </div>

      <div className="sb-card-footer">
        {isAvailable && remaining > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <label htmlFor={`portions-select-${listing.id}`} style={{ fontSize: '0.8rem', fontWeight: '700', color: '#104C40' }}>
              Claim:
            </label>
            <select
              id={`portions-select-${listing.id}`}
              value={quantity}
              onChange={handleQuantityChange}
              disabled={reserveDisabled}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1.5px solid #176B59',
                backgroundColor: '#FFFAF0',
                color: '#104C40',
                fontWeight: '700',
                fontSize: '0.85rem',
                flex: 1,
                cursor: 'pointer',
              }}
            >
              {Array.from({ length: Math.min(remaining, 50) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'portion' : 'portions'}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className="sb-reserve-btn"
          disabled={!isAvailable || reserveDisabled}
          onClick={handleReserve}
        >
          {isExpired
            ? 'Listing expired'
            : !isAvailable
            ? 'Fully reserved'
            : `Reserve ${remaining > 1 ? `${quantity} portion${quantity > 1 ? 's' : ''}` : 'food'}`}
        </button>
      </div>
    </article>
  )
}
