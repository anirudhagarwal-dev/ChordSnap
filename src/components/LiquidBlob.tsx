import React from 'react';
import { useLiquidParallax } from '../hooks/useLiquidMotion';

interface LiquidBlobProps {
  size?: number;
  color?: string;
  speed?: number;
  className?: string;
}

export const LiquidBlob: React.FC<LiquidBlobProps> = ({
  size = 200,
  color = 'var(--accent-purple)',
  speed = 1,
  className = '',
}) => {
  const { transform } = useLiquidParallax(speed * 0.1);

  return (
    <div
      className={`liquid-morph ${className}`}
      style={{
        position: 'fixed',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        filter: 'blur(50px)',
        opacity: 0.5,
        transform,
        transition: 'transform 0.2s linear',
        zIndex: -2,
      }}
    />
  );
};
