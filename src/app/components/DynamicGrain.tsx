import { useEffect, useState } from 'react';

interface DynamicGrainProps {
  clickLevel: number;
  maxLevel: number;
}

export function DynamicGrain({ clickLevel, maxLevel }: DynamicGrainProps) {
  const [grainIntensity, setGrainIntensity] = useState(0.04);

  useEffect(() => {
    // Grain intensity increases dramatically with clicks: from 0.04 to 0.25
    const baseIntensity = 0.04;
    const maxIntensity = 0.25;
    const intensity = baseIntensity + (clickLevel / maxLevel) * (maxIntensity - baseIntensity);
    setGrainIntensity(intensity);
  }, [clickLevel, maxLevel]);

  // Create high-quality multi-layer grain texture
  const progress = clickLevel / maxLevel;
  const frequency1 = 0.9 + progress * 0.5;
  const frequency2 = 1.3 + progress * 0.7;
  const frequency3 = 0.6 + progress * 0.4;

  const grainPattern = `
    data:image/svg+xml,${encodeURIComponent(`
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="grain1-${clickLevel}">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="${frequency1}" 
              numOctaves="4" 
              stitchTiles="stitch"
              seed="${clickLevel}"
            />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <filter id="grain2-${clickLevel}">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="${frequency2}" 
              numOctaves="3" 
              stitchTiles="stitch"
              seed="${clickLevel + 10}"
            />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <filter id="grain3-${clickLevel}">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="${frequency3}" 
              numOctaves="5" 
              stitchTiles="stitch"
              seed="${clickLevel + 20}"
            />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#grain1-${clickLevel})" opacity="${grainIntensity}"/>
        <rect width="100%" height="100%" filter="url(#grain2-${clickLevel})" opacity="${grainIntensity * 0.7}"/>
        <rect width="100%" height="100%" filter="url(#grain3-${clickLevel})" opacity="${grainIntensity * 0.5}"/>
      </svg>
    `)}
  `;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-45 transition-opacity duration-1000 ease-out"
      style={{
        opacity: grainIntensity,
        backgroundImage: `url("${grainPattern}")`,
        backgroundRepeat: 'repeat',
        mixBlendMode: 'multiply',
        backgroundSize: '150px 150px',
      }}
    />
  );
}
