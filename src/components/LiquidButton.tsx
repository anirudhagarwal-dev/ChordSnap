import React from 'react';
import { useLiquidMotion } from '../hooks/useLiquidMotion';

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({ children, ...props }) => {
  const { createRipple } = useLiquidMotion();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e, 'var(--accent-purple)');
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button className="liquid-fill" {...props} onClick={handleClick}>
      <span>{children}</span>
    </button>
  );
};
