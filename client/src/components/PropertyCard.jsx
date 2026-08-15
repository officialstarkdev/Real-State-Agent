import { Link } from 'react-router-dom';

export default function PropertyCard({ property, index = 0 }) {
  if (!property) return null;
  const p = property;
  const delayClass = index % 3 === 1 ? 'd1' : index % 3 === 2 ? 'd2' : '';
  const images = Array.isArray(p.images) ? p.images : typeof p.images === 'string' ? [p.images] : [];
  const imgSrc = images[0]?.replace('w=1400', 'w=900') || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80';

  return (
    <article className={`card reveal ${delayClass}`}>
      <div className="card-media">
        <span className="badge">{p.featured ? 'FEATURED' : (p.status ? String(p.status).toUpperCase() : 'FOR SALE')}</span>
        <span className="market-tag">{p.flag || '📍'} {p.market || 'International'}</span>
        <img src={imgSrc} alt={p.title || 'Property'} loading="lazy" />
        <div className="card-view">
          <Link to={`/property/${p.slug}`}>View Property</Link>
        </div>
      </div>
      <div className="card-body">
        <div className="price">{p.price}</div>
        <div className="card-title">{p.title}</div>
        <div className="card-loc">
          <i className="fa-solid fa-location-dot"></i> {p.loc}
        </div>
        <div className="stats">
          <span><i className="fa-solid fa-bed"></i> {p.beds ?? 0} Beds</span>
          <span><i className="fa-solid fa-bath"></i> {p.baths ?? 0} Baths</span>
          <span><i className="fa-solid fa-car"></i> {p.garage ?? 0} Garage</span>
          <span><i className="fa-solid fa-ruler-combined"></i> {p.area || '—'}</span>
        </div>
      </div>
    </article>
  );
}
