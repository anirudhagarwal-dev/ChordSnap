import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLiquidMotion } from '../hooks/useLiquidMotion';

interface LiquidTransitionProps {
  children: React.ReactNode;
  duration?: number;
  morphIntensity?: number;
}

export const LiquidTransition: React.FC<LiquidTransitionProps> = ({ 
  children, 
  duration = 800,
  morphIntensity = 0.3 
}) => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [key, setKey] = useState(location.pathname);
  const [prevChildren, setPrevChildren] = useState(children);
  const { prefersReducedMotion } = useLiquidMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setKey(location.pathname);
      return;
    }

    if (location.pathname !== key) {
      setIsAnimating(true);
      setPrevChildren(children);
      
      const timer = setTimeout(() => {
        setKey(location.pathname);
        setIsAnimating(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [location, key, duration, prefersReducedMotion, children]);

  return (
    <div ref={containerRef} className="liquid-transition-container">
      <div
        key={key}
        className={`liquid-page-transition ${isAnimating ? 'animating-in' : ''}`}
        style={{
          '--liquid-morph-intensity': morphIntensity,
          '--liquid-transition-duration': `${duration}ms`
        } as React.CSSProperties}
      >
        {children}
      </div>
      
      {isAnimating && (
        <div
          className="liquid-transition-overlay"
          style={{
            animationDuration: `${duration}ms`
          }}
        />
      )}
    </div>
  );
};
