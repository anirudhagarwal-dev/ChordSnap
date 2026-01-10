import React from 'react';
import { useLiquidMotion } from '../hooks/useLiquidMotion';

interface LiquidRippleProps {
  children: React.ReactNode;
  color?: string;
}

export const LiquidRipple: React.FC<LiquidRippleProps> = ({ children, color = 'var(--accent-purple)' }) => {
  const { createRipple } = useLiquidMotion();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    createRipple(e, color);
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }} onClick={handleClick}>
      {children}
    </div>
  );
};
