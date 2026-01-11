import { useEffect, useState } from 'react';

interface PaperTextureProps {
  dimLevel: number;
  timeOnPage: number;
}

export function PaperTexture({ dimLevel, timeOnPage }: PaperTextureProps) {
  const [baseOpacity, setBaseOpacity] = useState(0.02);

  // Gradually increase texture visibility with time and dim level
  useEffect(() => {
    // Base opacity starts more visible (from 0.05 to 0.08)
    const timeOpacity = 0.05 + (timeOnPage / 180) * 0.03;
    // Dim level adds more visibility (0%, 5%, 10%, 15% additional)
    const dimOpacity = dimLevel * 0.05;
    setBaseOpacity(Math.min(timeOpacity + dimOpacity, 0.2)); // Cap at 20%
  }, [dimLevel, timeOnPage]);

  // Create paper texture using SVG pattern
  const paperTexturePattern = `
    data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="paper" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <!-- Horizontal fibers -->
            <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(0,0,0,0.08)" stroke-width="0.8"/>
            <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(0,0,0,0.08)" stroke-width="0.8"/>
            <line x1="0" y1="60" x2="100" y2="60" stroke="rgba(0,0,0,0.08)" stroke-width="0.8"/>
            <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(0,0,0,0.08)" stroke-width="0.8"/>
            <!-- Vertical fibers -->
            <line x1="20" y1="0" x2="20" y2="100" stroke="rgba(0,0,0,0.08)" stroke-width="0.8"/>
            <line x1="40" y1="0" x2="40" y2="100" stroke="rgba(0,0,0,0.08)" stroke-width="0.8"/>
            <line x1="60" y1="0" x2="60" y2="100" stroke="rgba(0,0,0,0.08)" stroke-width="0.8"/>
            <line x1="80" y1="0" x2="80" y2="100" stroke="rgba(0,0,0,0.08)" stroke-width="0.8"/>
            <!-- Texture dots -->
            <circle cx="10" cy="10" r="1" fill="rgba(0,0,0,0.06)"/>
            <circle cx="30" cy="25" r="1" fill="rgba(0,0,0,0.06)"/>
            <circle cx="50" cy="15" r="1" fill="rgba(0,0,0,0.06)"/>
            <circle cx="70" cy="30" r="1" fill="rgba(0,0,0,0.06)"/>
            <circle cx="90" cy="20" r="1" fill="rgba(0,0,0,0.06)"/>
            <circle cx="15" cy="45" r="0.8" fill="rgba(0,0,0,0.05)"/>
            <circle cx="55" cy="55" r="0.8" fill="rgba(0,0,0,0.05)"/>
            <circle cx="85" cy="75" r="0.8" fill="rgba(0,0,0,0.05)"/>
          </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#paper)"/>
      </svg>
    `)}
  `;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-700"
      style={{
        opacity: baseOpacity,
        backgroundImage: `url("${paperTexturePattern}")`,
        backgroundRepeat: 'repeat',
        mixBlendMode: 'multiply',
      }}
    />
  );
}
