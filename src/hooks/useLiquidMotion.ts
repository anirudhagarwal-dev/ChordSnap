import { useState, useEffect, useCallback } from 'react';

interface LiquidMotionConfig {
  intensity?: number;
  duration?: number;
  easing?: string;
  reducedMotion?: boolean;
}

const createRipple = (event: React.MouseEvent<HTMLElement>, color: string) => {
  const target = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(target.clientWidth, target.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - target.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - target.offsetTop - radius}px`;
  circle.style.position = 'absolute';
  circle.style.borderRadius = '50%';
  circle.style.background = color;
  circle.style.transform = 'scale(0)';
  circle.style.animation = 'liquidRipple var(--liquid-ripple-duration) linear';
  circle.style.pointerEvents = 'none';

  target.appendChild(circle);

  setTimeout(() => {
    circle.remove();
  }, 800);
};

export const useLiquidMotion = (config: LiquidMotionConfig = {}) => {
  const {
    intensity = 0.5,
    duration = 600,
    easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
    reducedMotion = false,
  } = config;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const shouldReduceMotion = prefersReducedMotion || reducedMotion;

  const getLiquidStyle = useCallback((type: 'wave' | 'morph' | 'ripple' | 'glow' | 'distort' = 'wave') => {
    if (shouldReduceMotion) {
      return {
        transition: 'none',
        animation: 'none',
      };
    }

    const baseStyle = {
      transition: `all ${duration}ms ${easing}`,
    };

    switch (type) {
      case 'wave':
        return {
          ...baseStyle,
          animation: `liquidWave ${duration * 5}ms ${easing} infinite`,
        };
      case 'morph':
        return {
          ...baseStyle,
          animation: `liquidMorph ${duration * 8}ms ${easing} infinite`,
        };
      case 'ripple':
        return {
          ...baseStyle,
          position: 'relative',
          overflow: 'hidden',
        };
      case 'glow':
        return {
          ...baseStyle,
          animation: `liquidGlow ${duration * 3}ms ${easing} infinite`,
        };
      case 'distort':
        return {
          ...baseStyle,
          animation: `liquidDistort ${duration * 10}ms ${easing} infinite`,
        };
      default:
        return baseStyle;
    }
  }, [duration, easing, shouldReduceMotion]);

  return {
    getLiquidStyle,
    createRipple,
    prefersReducedMotion,
    intensity,
    duration,
    easing,
  };
};

export const useLiquidParallax = (intensity: number = 0.1) => {
  const [transform, setTransform] = useState('translate3d(0, 0, 0)');
  const prefersReducedMotion = useLiquidMotion({ reducedMotion: true }).prefersReducedMotion;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;
      setTransform(`translate3d(${x * intensity * 100}px, ${y * intensity * 100}px, 0)`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity, prefersReducedMotion]);

  return { transform };
};
