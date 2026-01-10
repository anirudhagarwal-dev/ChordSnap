import React, { useRef, useEffect } from 'react';
import { useLiquidParallax } from '../hooks/useLiquidMotion';

interface LiquidCursorProps {
  children: React.ReactNode;
  intensity?: number;
}

export const LiquidCursor: React.FC<LiquidCursorProps> = ({ children, intensity = 0.1 }) => {
  const { transform } = useLiquidParallax(intensity);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="liquid-cursor"
        style={{
          position: 'fixed',
          top: '-25px',
          left: '-25px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-purple)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'screen',
          filter: 'blur(10px)',
        }}
      />
      <div style={{ transform, transition: 'transform 0.1s linear' }}>
        {children}
      </div>
    </>
  );
};
