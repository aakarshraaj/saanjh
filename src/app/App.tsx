import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SaanjhLogo } from './components/SaanjhLogo';
import { FilmGrain } from './components/FilmGrain';
import { AmbientLights } from './components/AmbientLights';
import { HorizonLine } from './components/HorizonLine';
import { PaperTexture } from './components/PaperTexture';
import { DynamicGrain } from './components/DynamicGrain';
import { RippleEffect } from './components/RippleEffect';

// Animation duration constants
const ANIMATION_DURATIONS = {
  FAST: 0.5,
  NORMAL: 1.5,
  SLOW: 2,
  VERY_SLOW: 2.5,
} as const;

// Timing constants
const TIMING = {
  QUOTE_ROTATION_INTERVAL: 10000,
  LONG_PRESS_DURATION: 1000,
  TIME_TRACKING_CAP: 180,
  HIDDEN_MESSAGE_DURATION: 5000,
  LOADING_DELAY: 100,
  ANIMATION_DELAY_SHORT: 1,
  ANIMATION_DELAY_MEDIUM: 2,
  ANIMATION_DELAY_LONG: 2.5,
  ANIMATION_DELAY_VERY_LONG: 3,
} as const;

// Color constants
const COLORS = {
  BASE_BACKGROUND: { r: 252, g: 248, b: 242 },
  CLICK_TARGET_BACKGROUND: { r: 210, g: 185, b: 155 }, // Much deeper warm brown/amber at max clicks
  TIME_TARGET_BACKGROUND: { r: 253, g: 246, b: 238 }, // Subtle time-based shift
  TEXT_COLOR: '#1a1a1a',
} as const;

// Click level constants
const CLICK_LEVELS = {
  MAX_LEVEL: 18, // 18 clicks for gradual warm shift
} as const;

const quotes = {
  en: [
    "In the twilight, we find each other.",
    "The evening asks nothing of us but presence.",
    "Dusk is when the world pauses to breathe.",
    "Light fades. Conversations deepen.",
    "Between day and night, we gather."
  ],
  hi: [
    "गोधूलि में, हम एक-दूसरे को पाते हैं।",
    "शाम हमसे सिर्फ़ उपस्थिति माँगती है।",
    "संध्या वह है जब दुनिया साँस लेने रुकती है।",
    "रोशनी फीकी पड़ती है। बातचीत गहरी होती है।",
    "दिन और रात के बीच, हम इकट्ठे होते हैं।"
  ]
};

const content = {
  en: {
    comingSoon: "Coming soon.",
    etymology: "साँझ / sāñjh — twilight, evening gathering",
    langButton: "हिं",
    hiddenMessage: "In every dusk, we remember how to pause."
  },
  hi: {
    comingSoon: "जल्द आ रहा है।",
    etymology: "साँझ / sāñjh — गोधूलि, संध्या की सभा",
    langButton: "EN",
    hiddenMessage: "हर शाम में, हम रुकना फिर से सीखते हैं।"
  }
};

// Get or initialize visitor count - increments on every visit
function getVisitorCount(): number {
  if (typeof window === 'undefined') return 0;
  
  const stored = localStorage.getItem('saanjh_visitor_count');
  const currentCount = stored ? parseInt(stored, 10) : 0;
  const newCount = currentCount + 1;
  
  localStorage.setItem('saanjh_visitor_count', newCount.toString());
  return newCount;
}

export default function App() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [dimLevel, setDimLevel] = useState(0); // 0 to 3 clicks
  const [showHiddenMessage, setShowHiddenMessage] = useState(false);
  const [visitorCount] = useState(() => getVisitorCount());
  const [isLoading, setIsLoading] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // Loading state - wait for fonts to load
  useEffect(() => {
    const loadFonts = async () => {
      try {
        if ('fonts' in document) {
          await document.fonts.ready;
        }
        // Small additional delay to ensure smooth rendering
        setTimeout(() => setIsLoading(false), TIMING.LOADING_DELAY);
      } catch (error) {
        // Fallback to simple timeout if font loading API fails
        console.warn('Font loading check failed, using timeout fallback:', error);
        setTimeout(() => setIsLoading(false), TIMING.LOADING_DELAY * 2);
      }
    };
    
    loadFonts();
  }, []);
  
  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'hi' : 'en');
  };

  const handleLanguageToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dimming when toggling language
    toggleLanguage();
  };
  
  const text = content[lang];
  const currentQuote = quotes[lang][quoteIndex];

  // Rotate quotes every N seconds
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes[lang].length);
    }, TIMING.QUOTE_ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [lang, prefersReducedMotion]);

  // Track time on page for color shift
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnPage((prev) => Math.min(prev + 1, TIMING.TIME_TRACKING_CAP));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Click to shift background color
  const handlePageClick = () => {
    setDimLevel((prev) => (prev + 1) % (CLICK_LEVELS.MAX_LEVEL + 1));
  };

  // Long press handlers
  const handleLogoMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setShowHiddenMessage(true);
      setTimeout(() => setShowHiddenMessage(false), TIMING.HIDDEN_MESSAGE_DURATION);
    }, TIMING.LONG_PRESS_DURATION);
  };

  const handleLogoMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleLogoTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setShowHiddenMessage(true);
      setTimeout(() => setShowHiddenMessage(false), TIMING.HIDDEN_MESSAGE_DURATION);
    }, TIMING.LONG_PRESS_DURATION);
  };

  const handleLogoTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Calculate background color shift - combines time-based and click-based shifts
  const getBackgroundColor = () => {
    // Time-based subtle shift
    const timeProgress = timeOnPage / TIMING.TIME_TRACKING_CAP;
    
    // Click-based yellow/brown shift - use exponential curve for more noticeable progression
    const linearProgress = dimLevel / CLICK_LEVELS.MAX_LEVEL;
    // Exponential curve: makes early clicks MUCH more noticeable
    // Using 0.5 makes it very steep - first few clicks show big change
    const clickProgress = Math.pow(linearProgress, 0.5);
    
    // Combine both: start with base, add time shift, then add click shift
    const timeR = COLORS.BASE_BACKGROUND.r + 
      (COLORS.TIME_TARGET_BACKGROUND.r - COLORS.BASE_BACKGROUND.r) * timeProgress;
    const timeG = COLORS.BASE_BACKGROUND.g + 
      (COLORS.TIME_TARGET_BACKGROUND.g - COLORS.BASE_BACKGROUND.g) * timeProgress;
    const timeB = COLORS.BASE_BACKGROUND.b + 
      (COLORS.TIME_TARGET_BACKGROUND.b - COLORS.BASE_BACKGROUND.b) * timeProgress;
    
    // Apply click-based yellow/brown shift - much more dramatic color difference
    const clickRShift = (COLORS.CLICK_TARGET_BACKGROUND.r - COLORS.BASE_BACKGROUND.r) * clickProgress;
    const clickGShift = (COLORS.CLICK_TARGET_BACKGROUND.g - COLORS.BASE_BACKGROUND.g) * clickProgress;
    const clickBShift = (COLORS.CLICK_TARGET_BACKGROUND.b - COLORS.BASE_BACKGROUND.b) * clickProgress;
    
    const r = Math.floor(timeR + clickRShift);
    const g = Math.floor(timeG + clickGShift);
    const b = Math.floor(timeB + clickBShift);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Animation durations that respect reduced motion
  const getDuration = (duration: number) => {
    return prefersReducedMotion ? 0.01 : duration;
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen"
        style={{ 
          backgroundColor: `rgb(${COLORS.BASE_BACKGROUND.r}, ${COLORS.BASE_BACKGROUND.g}, ${COLORS.BASE_BACKGROUND.b})` 
        }}
      />
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden transition-colors duration-1000 ease-out cursor-default"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <RippleEffect onClick={handlePageClick} />
      {/* Background texture layers */}
      <PaperTexture dimLevel={dimLevel} timeOnPage={timeOnPage} />
      <HorizonLine timeOnPage={timeOnPage} />
      <AmbientLights />
      <FilmGrain />
      <DynamicGrain clickLevel={dimLevel} maxLevel={CLICK_LEVELS.MAX_LEVEL} />
      
      {/* Language Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: ANIMATION_DURATIONS.SLOW, delay: TIMING.ANIMATION_DELAY_SHORT }}
        whileHover={{ opacity: 0.6 }}
        onClick={handleLanguageToggle}
        className="fixed top-8 right-8 text-sm tracking-wider transition-opacity duration-300"
        style={{ fontFamily: 'EB Garamond, serif' }}
      >
        {text.langButton}
      </motion.button>

      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-8 relative pb-16">
        <div className="max-w-2xl w-full">
          
          {/* Etymology - Above Logo */}
          <motion.div 
            className="text-center text-sm opacity-50 tracking-wide pb-6"
            style={{ fontFamily: 'EB Garamond, serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: ANIMATION_DURATIONS.VERY_SLOW, delay: TIMING.ANIMATION_DELAY_SHORT }}
          >
            {text.etymology}
          </motion.div>

          {/* Grouped: Logo + Quote */}
          <div className="text-center">
            {/* Logo */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.01, delay: 0.1 }}
              ref={logoRef}
              onMouseDown={handleLogoMouseDown}
              onMouseUp={handleLogoMouseUp}
              onTouchStart={handleLogoTouchStart}
              onTouchEnd={handleLogoTouchEnd}
            >
              <SaanjhLogo prefersReducedMotion={prefersReducedMotion} />
            </motion.div>

            {/* Rotating Quote - Close to Logo */}
            <motion.div
              className="flex items-center justify-center"
              style={{ 
                fontFamily: 'EB Garamond, serif',
                color: COLORS.TEXT_COLOR,
                textShadow: '0 0 0.5px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.05)' // Ink bleed effect
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: ANIMATION_DURATIONS.VERY_SLOW, delay: TIMING.ANIMATION_DELAY_SHORT }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  className="text-xl leading-loose opacity-60 italic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: ANIMATION_DURATIONS.NORMAL }}
                >
                  {currentQuote}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Coming Soon - Separate group, further down */}
          <motion.p 
            className="text-center text-lg pt-16 opacity-50 italic"
            style={{ fontFamily: 'EB Garamond, serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: ANIMATION_DURATIONS.VERY_SLOW, delay: TIMING.ANIMATION_DELAY_MEDIUM }}
          >
            {text.comingSoon}
          </motion.p>

          {/* Visitor Counter - At bottom of viewport */}
          <motion.div 
            className="fixed bottom-8 left-0 right-0 text-center text-xs opacity-30 tracking-wider"
            style={{ 
              fontFamily: 'EB Garamond, serif',
              color: COLORS.TEXT_COLOR,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: getDuration(ANIMATION_DURATIONS.VERY_SLOW), delay: TIMING.ANIMATION_DELAY_VERY_LONG }}
          >
            {lang === 'en' ? `You're the ${visitorCount}${getOrdinalSuffix(visitorCount)} visitor` : `आप ${visitorCount}वें आगंतुक हैं`}
          </motion.div>
        </div>
      </div>
      
      {/* Hidden Message on Long Press */}
      <AnimatePresence>
        {showHiddenMessage && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: getDuration(ANIMATION_DURATIONS.FAST) }}
          >
            <motion.div
              className="px-8 py-4 max-w-md text-center"
              style={{ 
                fontFamily: 'EB Garamond, serif',
                color: COLORS.TEXT_COLOR,
                textShadow: '0 0 1px rgba(0,0,0,0.15)',
              }}
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: getDuration(ANIMATION_DURATIONS.FAST) }}
            >
              <p className="text-lg italic opacity-70 leading-relaxed">
                {text.hiddenMessage}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function for ordinal suffix
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}