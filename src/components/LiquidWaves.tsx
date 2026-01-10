import React from 'react';

interface LiquidWavesProps {
  count?: number;
  className?: string;
}

export const LiquidWaves: React.FC<LiquidWavesProps> = ({ count = 3, className = '' }) => {
  return (
    <div className={`liquid-waves-container ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="liquid-wave"
          style={{
            '--liquid-animation-duration': `${(i + 1) * 2}s`,
            animationDelay: `${i * 0.5}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
