
import React from 'react';

const GhibliFilter: React.FC = () => {
  return (
    <svg width="0" height="0" className="hidden">
      <filter id="ghibli-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" seed="1" />
        <feDisplacementMap in="SourceGraphic" scale="3" />
      </filter>
    </svg>
  );
};

export default GhibliFilter;
