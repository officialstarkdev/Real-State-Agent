import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import PropertyCard from '../components/PropertyCard';

export default function ListingsPage() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    market: searchParams.get('market') || '',
    status: searchParams.get('status') || '',
  });

  const fetchProperties = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 9 };
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.market) params.market = filters.market;
      if (filters.status) params.status = filters.status;
      const { data } = await API.get('/properties', { params });
      setProperties(data.properties);
      setTotal(data.total);
      setPages(data.pages);
      setPage(data.page);
    } catch { setProperties([]); }
    setLoading(false);
  };

  useEffect(() => { fetchProperties(); }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [properties]);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProperties(1);
  };

  return (
    <div className="page-transition">
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Portfolio</span>
          <h1>Property Listings</h1>
          <p>Browse luxury properties across Australia, the US, the UK and the Gulf</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <form className="listings-page-filters" onSubmit={handleFilter}>
            <div className="field">
              <label>Search</label>
              <input
                type="text" placeholder="City, suburb or keyword"
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Property Type</label>
              <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
                <option value="">All Types</option>
                <option>House</option><option>Apartment</option>
                <option>Villa</option><option>Penthouse</option><option>Commercial</option>
              </select>
            </div>
            <div className="field">
              <label>Market</label>
              <select value={filters.market} onChange={e => setFilters({ ...filters, market: e.target.value })}>
                <option value="">All Markets</option>
                <option>Sydney</option><option>Miami</option><option>London</option>
                <option>Dubai</option><option>Riyadh</option><option>Manchester</option>
              </select>
            </div>
            <button type="submit" className="btn btn-gold"><i className="fa-solid fa-magnifying-glass"></i> Filter</button>
          </form>

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : properties.length > 0 ? (
            <>
              <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '.9rem' }}>
                Showing {properties.length} of {total} properties
              </p>
              <div className="grid-listings">
                {properties.map((p, i) => (
                  <PropertyCard key={p._id} property={p} index={i} />
                ))}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  <button disabled={page <= 1} onClick={() => fetchProperties(page - 1)}>
                    <i className="fa-solid fa-arrow-left"></i> Prev
                  </button>
                  {Array.from({ length: pages }, (_, i) => (
                    <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => fetchProperties(i + 1)}>
                      {i + 1}
                    </button>
                  ))}
                  <button disabled={page >= pages} onClick={() => fetchProperties(page + 1)}>
                    Next <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <i className="fa-solid fa-house-circle-xmark"></i>
              <h3>No properties found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
