import React, { useRef, useEffect } from 'react';
import { useLiquidMotion } from '../hooks/useLiquidMotion';

interface LiquidBackgroundProps {
  intensity?: number;
  speed?: number;
  waveCount?: number;
  particleCount?: number;
}

interface Wave {
  amplitude: number;
  frequency: number;
  speed: number;
  offset: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({ 
  intensity = 0.5, 
  speed = 0.5, 
  waveCount = 4,
  particleCount = 50
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { prefersReducedMotion } = useLiquidMotion();
  const wavesRef = useRef<Wave[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;

    // Initialize waves
    wavesRef.current = Array.from({ length: waveCount }, (_, i) => ({
      amplitude: 20 + Math.random() * 30,
      frequency: 0.01 + Math.random() * 0.02,
      speed: 0.5 + Math.random() * 0.5,
      offset: (Math.PI * 2 * i) / waveCount,
      color: `hsla(${270 + i * 30}, 70%, 60%, ${0.1 * intensity})`
    }));

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 4 + 1,
      color: `hsla(${Math.random() * 60 + 240}, 70%, 70%, ${0.3 * intensity})`,
      life: Math.random()
    }));

    const animateWave = (wave: Wave, t: number) => {
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      
      for (let x = 0; x <= width; x += 5) {
        const y = height / 2 + 
          Math.sin(x * wave.frequency + t * wave.speed + wave.offset) * wave.amplitude +
          Math.sin(x * wave.frequency * 2 + t * wave.speed * 1.5 + wave.offset) * wave.amplitude * 0.5;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = wave.color;
      ctx.fill();
    };

    const updateParticles = () => {
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx * speed;
        particle.y += particle.vy * speed;
        particle.life += 0.01;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Fade effect
        const alpha = Math.sin(particle.life) * 0.3 * intensity;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(/[\d.]+\)/, `${alpha})`);
        ctx.fill();
      });
    };

    const render = () => {
      time += speed * 0.05;
      ctx.clearRect(0, 0, width, height);

      // Draw waves
      wavesRef.current.forEach(wave => animateWave(wave, time));
      
      // Update and draw particles
      updateParticles();

      requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // Reinitialize particles for new dimensions
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 1,
        color: `hsla(${Math.random() * 60 + 240}, 70%, 70%, ${0.3 * intensity})`,
        life: Math.random()
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [prefersReducedMotion, intensity, speed, waveCount, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.4,
        filter: 'blur(40px)',
      }}
    />
  );
};
