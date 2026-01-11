import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface HorizonLineProps {
  timeOnPage: number;
}

export function HorizonLine({ timeOnPage }: HorizonLineProps) {
  const [opacity, setOpacity] = useState(0);

  // Gradually reveal horizon line
  useEffect(() => {
    // Show immediately with better visibility
    const baseOpacity = 0.15 + (timeOnPage / 180) * 0.1; // Start at 0.15, go to 0.25
    setOpacity(baseOpacity);
  }, [timeOnPage]);

  // Calculate color shift - subtle warm to cooler as time progresses
  const progress = Math.min(timeOnPage / 180, 1);
  const baseColor = { r: 200, g: 190, b: 175 }; // Warm beige
  const targetColor = { r: 180, g: 175, b: 165 }; // Slightly cooler

  const r = Math.floor(baseColor.r + (targetColor.r - baseColor.r) * progress);
  const g = Math.floor(baseColor.g + (targetColor.g - baseColor.g) * progress);
  const b = Math.floor(baseColor.b + (targetColor.b - baseColor.b) * progress);

  return (
    <motion.div
      className="fixed left-0 right-0 pointer-events-none z-20"
      style={{
        top: '70%',
        height: '2px',
        background: `linear-gradient(to right, 
          transparent 0%, 
          rgba(${r}, ${g}, ${b}, ${opacity}) 20%, 
          rgba(${r}, ${g}, ${b}, ${opacity * 1.2}) 50%, 
          rgba(${r}, ${g}, ${b}, ${opacity}) 80%, 
          transparent 100%
        )`,
        opacity,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 2, ease: 'easeOut' }}
    >
      {/* Subtle glow effect */}
      <div
        className="absolute inset-0 blur-[0.5px]"
        style={{
          background: `linear-gradient(to right, 
            transparent 0%, 
            rgba(${r}, ${g}, ${b}, ${opacity * 0.3}) 20%, 
            rgba(${r}, ${g}, ${b}, ${opacity * 0.5}) 50%, 
            rgba(${r}, ${g}, ${b}, ${opacity * 0.3}) 80%, 
            transparent 100%
          )`,
        }}
      />
    </motion.div>
  );
}
