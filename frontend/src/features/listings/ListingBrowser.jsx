import { useMemo, useState } from 'react'
import ListingCard from './ListingCard'
import './listings.css'
import { mockListings as defaultMock } from '../../data/mockListings'

const CATEGORY_OPTIONS = [
  { label: 'All', value: '', icon: '🍽️' },
  { label: 'Meals', value: 'Meals', icon: '🍲' },
  { label: 'Bakery', value: 'Bakery', icon: '🥖' },
  { label: 'Produce', value: 'Produce', icon: '🥬' },
  { label: 'Other', value: 'Other', icon: '📦' },
]

export default function ListingBrowser({ listings: externalListings, onReserve, reserveDisabled }) {
  const listings = externalListings ?? defaultMock
  const [query, setQuery] = useState('')
  const [district, setDistrict] = useState('')
  const [category, setCategory] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const districts = useMemo(() => {
    return Array.from(new Set(listings.map((item) => item.district).filter(Boolean))).sort()
  }, [listings])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return listings.filter((item) => {
      const matchDistrict = !district || (item.district && item.district.toLowerCase() === district.toLowerCase())
      const matchCategory = !category || item.category === category
      const matchTerm =
        !term ||
        `${item.title || ''} ${item.description || ''} ${item.district || ''} ${item.category || ''}`
          .toLowerCase()
          .includes(term)
      return matchDistrict && matchCategory && matchTerm
    })
  }, [listings, query, district, category])

  const hasActiveFilters = Boolean(query || district || category)
  const clear = () => {
    setQuery('')
    setDistrict('')
    setCategory('')
  }

  return (
    <div>
      <style>{`
        .sb-search-container {
          background: linear-gradient(135deg, rgba(255,253,248,0.95) 0%, rgba(244,250,246,0.95) 100%);
          border: 2px solid #D9ED89;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 8px 32px rgba(23, 58, 53, 0.08), 0 2px 8px rgba(23, 58, 53, 0.04);
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(8px);
        }
        .sb-search-container::before {
          content: '';
          position: absolute;
          top: -40px;
          right: -40px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(217,237,137,0.4) 0%, transparent 70%);
          pointer-events: none;
        }
        .sb-search-container::after {
          content: '';
          position: absolute;
          bottom: -30px;
          left: -20px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(23,107,89,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .sb-search-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .sb-search-icon-wrap {
          background: linear-gradient(135deg, #104C40, #176B59);
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(16, 76, 64, 0.25);
        }
        .sb-search-label-group h3 {
          margin: 0;
          color: #104C40;
          font-size: 1.05rem;
          font-weight: 800;
        }
        .sb-search-label-group p {
          margin: 2px 0 0;
          color: #5D706B;
          font-size: 0.8rem;
        }

        .sb-search-bar-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0;
          background: #FFFAF0;
          border: 2px solid #176B59;
          border-radius: 16px;
          padding: 0 16px;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(23, 107, 89, 0.08);
          overflow: hidden;
          margin-bottom: 20px;
        }
        .sb-search-bar-wrapper.focused {
          border-color: #104C40;
          box-shadow: 0 0 0 3px rgba(23, 107, 89, 0.15), 0 4px 16px rgba(23, 107, 89, 0.1);
          background: #FFFFFF;
        }
        .sb-search-input {
          width: 100%;
          padding: 15px 12px;
          border: none;
          background: transparent;
          outline: none;
          color: #173A35;
          font-size: 1rem;
          font-weight: 500;
          font-family: inherit;
        }
        .sb-search-input::placeholder {
          color: #9CB5AE;
          font-weight: 400;
        }
        .sb-search-clear-btn {
          background: rgba(23, 107, 89, 0.1);
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #104C40;
          cursor: pointer;
          font-weight: 800;
          font-size: 0.8rem;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .sb-search-clear-btn:hover {
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
        }

        .sb-filter-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .sb-filter-chips-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .sb-filter-label {
          font-size: 0.78rem;
          font-weight: 800;
          color: #104C40;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
        .sb-category-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: inherit;
        }
        .sb-category-chip.inactive {
          border: 1.5px solid #D9ED89;
          background: rgba(255,253,248,0.8);
          color: #5D706B;
        }
        .sb-category-chip.inactive:hover {
          border-color: #176B59;
          background: rgba(217,237,137,0.15);
          color: #104C40;
        }
        .sb-category-chip.active {
          border: 1.5px solid #104C40;
          background: linear-gradient(135deg, #104C40, #176B59);
          color: #D9ED89;
          box-shadow: 0 3px 10px rgba(16, 76, 64, 0.25);
        }

        .sb-district-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .sb-district-select {
          padding: 8px 14px;
          border-radius: 12px;
          border: 1.5px solid #176B59;
          background: rgba(255,250,240,0.9);
          color: #104C40;
          font-weight: 600;
          font-size: 0.85rem;
          outline: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 1px 4px rgba(23, 107, 89, 0.08);
        }
        .sb-district-select:focus {
          border-color: #104C40;
          box-shadow: 0 0 0 3px rgba(23, 107, 89, 0.12);
        }
        .sb-reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 12px;
          border: 1.5px solid #fca5a5;
          background: #fef2f2;
          color: #dc2626;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .sb-reset-btn:hover {
          background: #fee2e2;
          border-color: #dc2626;
        }

        .sb-results-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1.5px dashed rgba(217,237,137,0.7);
          font-size: 0.82rem;
          gap: 12px;
          flex-wrap: wrap;
        }
        .sb-results-count {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #5D706B;
        }
        .sb-results-count strong {
          color: #104C40;
          font-size: 1rem;
        }
        .sb-results-badge {
          background: rgba(217,237,137,0.5);
          color: #104C40;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          border: 1px solid rgba(23,107,89,0.15);
        }
        .sb-filter-summary {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #176B59;
          font-weight: 600;
          font-size: 0.78rem;
        }
        .sb-filter-tag {
          background: rgba(23,107,89,0.1);
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 700;
        }
      `}</style>

      {/* SEARCH AND FILTER CONTAINER */}
      <div className="sb-search-container" aria-label="Filter food listings">

        {/* SEARCH HEADER */}
        <div className="sb-search-header">
          <div className="sb-search-icon-wrap" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D9ED89" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div className="sb-search-label-group">
            <h3>Find Available Food</h3>
            <p>Search across today's surplus food listings in your area</p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className={`sb-search-bar-wrapper${searchFocused ? ' focused' : ''}`}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={searchFocused ? '#104C40' : '#9CB5AE'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0, transition: 'stroke 0.2s' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            className="sb-search-input"
            aria-label="Search listings"
            placeholder="Search by food name, description, or pickup location…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />

          {query && (
            <button
              type="button"
              className="sb-search-clear-btn"
              onClick={() => setQuery('')}
              aria-label="Clear search text"
            >
              ✕
            </button>
          )}
        </div>

        {/* BOTTOM FILTERS ROW */}
        <div className="sb-filter-row">
          {/* CATEGORY FILTER CHIPS */}
          <div className="sb-filter-chips-group">
            <span className="sb-filter-label">Category:</span>
            {CATEGORY_OPTIONS.map((opt) => {
              const isSelected = category === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`sb-category-chip ${isSelected ? 'active' : 'inactive'}`}
                  onClick={() => setCategory(opt.value)}
                >
                  <span aria-hidden="true">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              )
            })}
          </div>

          {/* DISTRICT SELECTOR & CLEAR ACTION */}
          <div className="sb-district-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="sb-filter-label" style={{ fontSize: '0.78rem' }}>📍 District:</span>
              <select
                id="district-filter"
                className="sb-district-select"
                aria-label="Filter by district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">All districts</option>
                {districts.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button type="button" className="sb-reset-btn" onClick={clear}>
                <span>✕</span>
                <span>Clear filters</span>
              </button>
            )}
          </div>
        </div>

        {/* RESULTS SUMMARY BAR */}
        <div className="sb-results-bar">
          <div className="sb-results-count">
            <span className="sb-results-badge">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </span>
            <span>
              Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'listing' : 'listings'} available today
            </span>
          </div>
          {hasActiveFilters && (
            <div className="sb-filter-summary">
              <span>Filtered by:</span>
              {query && <span className="sb-filter-tag">"{query}"</span>}
              {category && <span className="sb-filter-tag">{category}</span>}
              {district && <span className="sb-filter-tag">📍 {district}</span>}
            </div>
          )}
        </div>
      </div>

      {/* LISTINGS GRID OR EMPTY STATE */}
      {filtered.length === 0 ? (
        <div
          style={{
            padding: '50px 24px',
            background: 'linear-gradient(135deg, #FFFDF8 0%, #F4FAF6 100%)',
            border: '2px dashed #D9ED89',
            borderRadius: '24px',
            textAlign: 'center',
            color: '#5D706B',
          }}
        >
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🍲</span>
          <h2 style={{ color: '#104C40', fontSize: '1.5rem', fontWeight: '800', margin: '0 0 8px' }}>
            No matching food found
          </h2>
          <p style={{ margin: '0 0 20px', maxWidth: '400px', marginInline: 'auto', fontSize: '0.95rem', color: '#5D706B' }}>
            We couldn&apos;t find any food listings matching your current filters. Try changing your search or clearing your filters.
          </p>
          <button
            type="button"
            onClick={clear}
            style={{
              backgroundColor: '#104C40',
              color: '#FFFAF0',
              padding: '10px 24px',
              borderRadius: '12px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(16, 76, 64, 0.25)',
            }}
          >
            Show All Available Food
          </button>
        </div>
      ) : (
        <div className="sb-listings-grid">
          {filtered.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onReserve={onReserve}
              reserveDisabled={reserveDisabled}
            />
          ))}
        </div>
      )}
    </div>
  )
}
