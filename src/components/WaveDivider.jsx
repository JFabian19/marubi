import React, { useId } from 'react';

export default function WaveDivider() {
  const waveId = useId();

  return (
    <div className="voltra-wave-divider" aria-hidden="true">
      <svg
        className="waves-animated"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id={waveId}
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="wave-parallax1">
          <use href={`#${waveId}`} x="50" y="3" />
        </g>
        <g className="wave-parallax2">
          <use href={`#${waveId}`} x="50" y="0" />
        </g>
        <g className="wave-parallax3">
          <use href={`#${waveId}`} x="50" y="9" />
        </g>
        <g className="wave-parallax4">
          <use href={`#${waveId}`} x="50" y="6" />
        </g>
      </svg>
    </div>
  );
}
