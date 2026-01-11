import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface LightPoint {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

const LIGHT_COUNT = 8;
const MIN_DELAY = 2000; // Appear after 2 seconds
const MAX_DELAY = 4000; // Appear within 4 seconds
const MIN_DURATION = 4000; // Fade cycle duration
const MAX_DURATION = 8000;

export function AmbientLights() {
  const [lights, setLights] = useState<LightPoint[]>([]);
  const [shouldShow, setShouldShow] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    // Don't show if user prefers reduced motion
    if (prefersReducedMotion) return;

    // Wait before showing lights
    const initialDelay = setTimeout(() => {
      setShouldShow(true);
    }, MIN_DELAY);

    return () => clearTimeout(initialDelay);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!shouldShow) return;

    // Generate random light points
    const newLights: LightPoint[] = Array.from({ length: LIGHT_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Percentage across width
      y: Math.random() * 100, // Percentage across height
      delay: Math.random() * 1000, // Stagger appearance
      duration: MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION),
      size: 3 + Math.random() * 4, // Size between 3-7px
      opacity: 0.3 + Math.random() * 0.3, // Opacity between 0.3-0.6
    }));

    setLights(newLights);
  }, [shouldShow]);

  if (prefersReducedMotion || !shouldShow || lights.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {lights.map((light) => (
        <motion.div
          key={light.id}
          className="absolute rounded-full"
          style={{
            left: `${light.x}%`,
            top: `${light.y}%`,
            width: `${light.size}px`,
            height: `${light.size}px`,
            backgroundColor: 'rgb(252, 211, 77)', // Warm golden color
            boxShadow: `0 0 ${light.size * 3}px ${light.size * 1.5}px rgba(252, 211, 77, ${light.opacity * 0.8})`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, light.opacity, 0],
            scale: [0, 1, 0.8, 1, 0],
            x: [
              0,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 30,
              (Math.random() - 0.5) * 20,
              0,
            ],
            y: [
              0,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 30,
              (Math.random() - 0.5) * 20,
              0,
            ],
          }}
          transition={{
            duration: light.duration / 1000,
            delay: light.delay / 1000,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
