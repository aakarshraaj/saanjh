import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

interface RippleEffectProps {
  onClick: (e: React.MouseEvent) => void;
}

export function RippleEffect({ onClick }: RippleEffectProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [rippleId, setRippleId] = useState(0);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get click position relative to viewport
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create new ripple
    const newRipple: Ripple = {
      id: rippleId,
      x,
      y,
      timestamp: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);
    setRippleId((prev) => prev + 1);

    // Call original onClick handler
    onClick(e);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-30" onClick={handleClick}>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 35,
            }}
            initial={{ scale: 0, opacity: 0.35 }}
            animate={{
              scale: 12,
              opacity: [0.35, 0.15, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5,
              ease: [0.25, 0.1, 0.25, 1], // Gentle ease-out
            }}
          >
            <div
              className="rounded-full border"
              style={{
                width: '120px',
                height: '120px',
                borderColor: 'rgba(200, 180, 160, 0.25)',
                borderWidth: '1.5px',
                boxShadow: '0 0 30px rgba(200, 180, 160, 0.15), inset 0 0 20px rgba(200, 180, 160, 0.1)',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
