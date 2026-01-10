import React, { useRef, useEffect, useState } from 'react';

interface InteractiveLiquidProps {
  children: React.ReactNode;
  intensity?: number;
  stiffness?: number;
  damping?: number;
}

export const InteractiveLiquid: React.FC<InteractiveLiquidProps> = ({
  children,
  intensity = 5,
  stiffness = 0.2,
  damping = 0.9,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPosition({ x, y });
      }
    };

    const onMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('mouseleave', onMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      const dx = position.x - velocity.x;
      const dy = position.y - velocity.y;
      const ax = dx * stiffness;
      const ay = dy * stiffness;

      setVelocity((prev) => ({
        x: (prev.x + ax) * damping,
        y: (prev.y + ay) * damping,
      }));

      if (containerRef.current) {
        containerRef.current.style.setProperty('--liquid-x', `${velocity.x}px`);
        containerRef.current.style.setProperty('--liquid-y', `${velocity.y}px`);
      }

      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [position, stiffness, damping]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        '--liquid-x': '0px',
        '--liquid-y': '0px',
      } as React.CSSProperties}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          top: 'var(--liquid-y)',
          left: 'var(--liquid-x)',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-purple)',
          pointerEvents: 'none',
          zIndex: -1,
          mixBlendMode: 'screen',
          filter: 'blur(20px)',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};
