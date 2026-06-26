import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'motion/react';
import './ShinyText.css';

const ShinyText = ({ text, disabled = false, speed = 2, className = '', color = '#b5b5b5', shineColor = '#ffffff', spread = 120, yoyo = false, pauseOnHover = false, direction = 'left', delay = 0 }) => {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);
  const dirRef = useRef(direction === 'left' ? 1 : -1);
  const animDur = speed * 1000;
  const delayDur = delay * 1000;

  useAnimationFrame(time => {
    if (disabled || isPaused) { lastTimeRef.current = null; return; }
    if (lastTimeRef.current === null) { lastTimeRef.current = time; return; }
    const dt = time - lastTimeRef.current; lastTimeRef.current = time;
    elapsedRef.current += dt;

    if (yoyo) {
      const full = (animDur + delayDur) * 2;
      const ct = elapsedRef.current % full;
      if (ct < animDur) progress.set(dirRef.current === 1 ? (ct/animDur)*100 : 100 - (ct/animDur)*100);
      else if (ct < animDur + delayDur) progress.set(dirRef.current === 1 ? 100 : 0);
      else if (ct < animDur*2 + delayDur) { const rt = ct - animDur - delayDur; progress.set(dirRef.current === 1 ? 100 - (rt/animDur)*100 : (rt/animDur)*100); }
      else progress.set(dirRef.current === 1 ? 0 : 100);
    } else {
      const cd = animDur + delayDur;
      const ct = elapsedRef.current % cd;
      if (ct < animDur) progress.set(dirRef.current === 1 ? (ct/animDur)*100 : 100 - (ct/animDur)*100);
      else progress.set(dirRef.current === 1 ? 100 : 0);
    }
  });

  useEffect(() => { dirRef.current = direction === 'left' ? 1 : -1; elapsedRef.current = 0; progress.set(0); }, [direction]);

  const bgPos = useTransform(progress, p => `${150 - p * 2}% center`);

  const onEnter = useCallback(() => { if (pauseOnHover) setIsPaused(true); }, [pauseOnHover]);
  const onLeave = useCallback(() => { if (pauseOnHover) setIsPaused(false); }, [pauseOnHover]);

  return (
    <motion.span
      className={`shiny-text ${className}`}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text', backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundPosition: bgPos,
      }}
      onMouseEnter={onEnter} onMouseLeave={onLeave}
    >
      {text}
    </motion.span>
  );
};

export default ShinyText;
