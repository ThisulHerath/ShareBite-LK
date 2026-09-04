import React from 'react';
import './listings.css';

function formatDateTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (e) {
    return iso;
  }
}

export default function ListingCard({ listing, onReserve, reserveDisabled }) {
  const { title, category, portions, district, pickupAddress, availableUntil, status } = listing;
  const isAvailable = status === 'available';

  return (
    <div className="sb-listing-card" role="article" aria-labelledby={listing.id}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div id={listing.id} className="sb-listing-title">{title}</div>
          <div className="sb-listing-meta">{category} • {district}</div>
        </div>
        <div>
          <span className={`sb-badge ${isAvailable? 'sb-available':'sb-reserved'}`}>{isAvailable? 'Available':'Reserved'}</span>
        </div>
      </div>

      <div className="sb-listing-meta">Portions: {portions} • Pickup: {pickupAddress}</div>
      <div className="sb-listing-meta">Available until: {formatDateTime(availableUntil)}</div>

      <div style={{marginTop:'auto'}}>
        <button
          className="sb-reserve-btn"
          disabled={!isAvailable || reserveDisabled}
          onClick={() => onReserve && onReserve(listing)}
        >Reserve</button>
      </div>
    </div>
  );
}
