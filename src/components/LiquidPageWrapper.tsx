import React from 'react';

interface LiquidPageWrapperProps {
  children: React.ReactNode;
}

export const LiquidPageWrapper: React.FC<LiquidPageWrapperProps> = ({ children }) => {
  return <div className="liquid-page-wrapper">{children}</div>;
};
