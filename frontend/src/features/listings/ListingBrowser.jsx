import { useMemo, useState } from 'react';
import ListingCard from './ListingCard';
import './listings.css';
import { mockListings as defaultMock } from '../../data/mockListings';

export default function ListingBrowser({ listings: externalListings, onReserve, reserveDisabled }) {
  const listings = externalListings ?? defaultMock;
  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState('');
  const districts = useMemo(() => Array.from(new Set(listings.map((item) => item.district))), [listings]);
  const categories = useMemo(() => Array.from(new Set(listings.map((item) => item.category))), [listings]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return listings.filter((item) => (!district || item.district === district) && (!category || item.category === category) && (!term || `${item.title} ${item.description || ''}`.toLowerCase().includes(term)));
  }, [listings, query, district, category]);
  const clear = () => { setQuery(''); setDistrict(''); setCategory(''); };

  return <div>
    <div className="sb-filters" aria-label="Filter food listings">
      <div className="sb-search"><span aria-hidden="true">⌕</span><input aria-label="Search listings" placeholder="Search food, category, or description" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
      <div className="sb-filter-controls">
        <select aria-label="Filter by district" value={district} onChange={(event) => setDistrict(event.target.value)}><option value="">All districts</option>{districts.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <button className="sb-clear" type="button" onClick={clear}>Clear filters</button>
      </div>
    </div>
    {filtered.length === 0 ? <div className="sb-empty-filter"><span aria-hidden="true">⌕</span><h2>Nothing matches yet</h2><p>Try a different search or clear your filters to see all available food.</p><button className="sb-clear" type="button" onClick={clear}>Show all listings</button></div> : <div className="sb-listings-grid">{filtered.map((listing) => <ListingCard key={listing.id} listing={listing} onReserve={onReserve} reserveDisabled={reserveDisabled} />)}</div>}
  </div>;
}
