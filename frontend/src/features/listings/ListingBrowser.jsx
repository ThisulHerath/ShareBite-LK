import React, { useMemo, useState } from 'react';
import ListingCard from './ListingCard';
import './listings.css';
import { mockListings as defaultMock } from '../../data/mockListings';

export default function ListingBrowser({ listings: externalListings, onReserve }) {
  const listings = externalListings ?? defaultMock;
  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState('');

  const districts = useMemo(() => Array.from(new Set(listings.map(l => l.district))), [listings]);
  const categories = useMemo(() => Array.from(new Set(listings.map(l => l.category))), [listings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter(l => {
      if (district && l.district !== district) return false;
      if (category && l.category !== category) return false;
      if (!q) return true;
      return (l.title + ' ' + (l.description||'')).toLowerCase().includes(q);
    });
  }, [listings, query, district, category]);

  return (
    <div>
      <div className="sb-filters">
        <input aria-label="Search listings" placeholder="Search title or description" value={query} onChange={e=>setQuery(e.target.value)} />

        <select value={district} onChange={e=>setDistrict(e.target.value)}>
          <option value="">All districts</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <button onClick={() => { setQuery(''); setDistrict(''); setCategory(''); }}>Clear</button>
      </div>

      {filtered.length === 0 ? (
        <div style={{padding:20}}>No listings match your search or filters. Try different keywords or clear filters.</div>
      ) : (
        <div className="sb-listings-grid">
          {filtered.map(l => (
            <ListingCard key={l.id} listing={l} onReserve={onReserve} />
          ))}
        </div>
      )}
    </div>
  );
}
