import React from 'react';

export const LiquidFilters: React.FC = () => {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} xmlns="http://www.w3.org/2000/svg" version="1.1">
      <defs>
        <filter id="liquid-distortion-1">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="3" result="warp" />
          <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="40" in="SourceGraphic" in2="warp" />
        </filter>
        <filter id="liquid-distortion-2">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves="3" result="warp" />
          <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="50" in="SourceGraphic" in2="warp" />
        </filter>
        <filter id="liquid-distortion-3">
          <feTurbulence type="fractalNoise" baseFrequency="0.03 0.01" numOctaves="3" result="warp" />
          <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="45" in="SourceGraphic" in2="warp" />
        </filter>
      </defs>
    </svg>
  );
};
