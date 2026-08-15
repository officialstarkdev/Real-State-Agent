import { useState, useEffect, useRef, useCallback } from 'react';

export default function TestimonialCarousel({ testimonials }) {
  const list = Array.isArray(testimonials) ? testimonials : [];
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const carouselRef = useRef(null);
  const startXRef = useRef(null);
  const slides = list.length || 1;

  const go = useCallback((i) => {
    setIndex(((i % slides) + slides) % slides);
  }, [slides]);

  const restart = useCallback(() => {
    clearInterval(timerRef.current);
    if (slides <= 1) return;
    timerRef.current = setInterval(() => go(index + 1), 4000);
  }, [go, index, slides]);

  useEffect(() => {
    restart();
    return () => clearInterval(timerRef.current);
  }, [restart]);

  if (list.length === 0) return null;

  const handlePrev = () => { go(index - 1); restart(); };
  const handleNext = () => { go(index + 1); restart(); };
  const handleDot = (i) => { go(i); restart(); };

  const handleTouchStart = (e) => { startXRef.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (startXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - startXRef.current;
    if (Math.abs(dx) > 50) { go(index + (dx < 0 ? 1 : -1)); restart(); }
    startXRef.current = null;
  };

  return (
    <div
      className="carousel"
      ref={carouselRef}
      onMouseEnter={() => clearInterval(timerRef.current)}
      onMouseLeave={restart}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {list.map((t, i) => (
          <div className="slide" key={t._id || i}>
            <div className="tcard">
              <span className="quote-mark">&ldquo;</span>
              <div className="stars">{'★'.repeat(t.rating || 5)}</div>
              <blockquote>{t.quote}</blockquote>
              <div className="tmeta">
                <div className="avatar">{t.initials}</div>
                <div className="who">
                  <strong>{t.name}</strong>
                  <span>{t.subtitle}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="car-controls">
        <button className="car-btn" onClick={handlePrev} aria-label="Previous testimonial">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="dots" role="tablist" aria-label="Testimonial slides">
          {list.map((_, i) => (
            <button
              key={i}
              className={`dot${i === index ? ' active' : ''}`}
              onClick={() => handleDot(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button className="car-btn" onClick={handleNext} aria-label="Next testimonial">
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
