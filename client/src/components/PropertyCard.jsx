import { Link } from 'react-router-dom';

export default function PropertyCard({ property, index = 0 }) {
  const p = property;
  const delayClass = index % 3 === 1 ? 'd1' : index % 3 === 2 ? 'd2' : '';
  const imgSrc = p.images?.[0]?.replace('w=1400', 'w=900') || '';

  return (
    <article className={`card reveal ${delayClass}`}>
      <div className="card-media">
        <span className="badge">{p.featured ? 'FEATURED' : p.status?.toUpperCase()}</span>
        <span className="market-tag">{p.flag} {p.market}</span>
        <img src={imgSrc} alt={p.title} loading="lazy" />
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
          <span><i className="fa-solid fa-bed"></i> {p.beds} Beds</span>
          <span><i className="fa-solid fa-bath"></i> {p.baths} Baths</span>
          <span><i className="fa-solid fa-car"></i> {p.garage} Garage</span>
          <span><i className="fa-solid fa-ruler-combined"></i> {p.area}</span>
        </div>
      </div>
    </article>
  );
}
