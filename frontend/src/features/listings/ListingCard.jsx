import './listings.css';

function formatDateTime(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
}

export default function ListingCard({ listing, onReserve, reserveDisabled }) {
  const { title, category, portions, district, pickupAddress, availableUntil, status } = listing;
  const isAvailable = status === 'available';
  const icons = { Meals: '🍲', Bakery: '🥖', Produce: '🥬', Other: '🍽️' };
  return <article className="sb-listing-card" aria-labelledby={`listing-${listing.id}`}>
    <div className={`sb-card-illustration category-${String(category).toLowerCase()}`} aria-hidden="true"><span>{icons[category] || icons.Other}</span><i /></div>
    <div className="sb-card-top"><span className="sb-category"><b aria-hidden="true">{icons[category] || icons.Other}</b>{category}</span><span className={`sb-badge ${isAvailable ? 'sb-available' : 'sb-reserved'}`}>{isAvailable ? 'Available' : 'Reserved'}</span></div>
    <h2 id={`listing-${listing.id}`} className="sb-listing-title">{title}</h2>
    <p className="sb-location">⌖ {district}</p>
    <div className="sb-card-details"><p><strong>{portions}</strong> portions</p><p>⌖ {pickupAddress}</p><p>◷ Collect by {formatDateTime(availableUntil)}</p></div>
    <div className="sb-card-footer"><button className="sb-reserve-btn" disabled={!isAvailable || reserveDisabled} onClick={() => onReserve?.(listing)}>{isAvailable ? 'Reserve food' : 'No longer available'}</button></div>
  </article>;
}
