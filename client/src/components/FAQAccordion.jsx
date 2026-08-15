import { useState } from 'react';

export default function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  return (
    <div className="faq-list">
      {faqs.map((faq, i) => (
        <div key={i} className={`faq${openIndex === i ? ' open' : ''}`}>
          <button
            className="faq-q"
            aria-expanded={openIndex === i}
            onClick={() => toggle(i)}
          >
            {faq.question}
            <span className="fx"><i className="fa-solid fa-plus"></i></span>
          </button>
          <div
            className="faq-a"
            style={{ maxHeight: openIndex === i ? '300px' : '0' }}
          >
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
