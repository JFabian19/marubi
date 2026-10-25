import React from 'react';
import { TICKER_ITEMS } from '../data/templateData';

export default function TickerBar({ ariaLabel = 'Promociones destacadas' }) {
  const repeatedItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="horizontal-ticker" role="region" aria-label={ariaLabel}>
      <div className="horizontal-ticker__track">
        <div className="horizontal-ticker__container">
          {repeatedItems.map((item, idx) => (
            <p key={`t1-${idx}`} className="horizontal-ticker__item">
              {item}
            </p>
          ))}
        </div>
        <div className="horizontal-ticker__container" aria-hidden="true">
          {repeatedItems.map((item, idx) => (
            <p key={`t2-${idx}`} className="horizontal-ticker__item">
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
