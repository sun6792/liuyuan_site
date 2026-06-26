import { useEffect, useRef, useCallback } from 'react';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 80,
  itemScale = 0.03,
  itemStackDistance = 25,
  stackPosition = '25%',
  baseScale = 0.88,
  rotationAmount = 0,
  blurAmount = 0,
}) => {
  const scrollerRef = useRef(null);
  const cardsRef = useRef([]);
  const tickingRef = useRef(false);

  const updateCards = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const scrollTop = window.scrollY;
    const vh = window.innerHeight;
    const stackY = (parseFloat(stackPosition) / 100) * vh;
    const endEl = document.querySelector('.scroll-stack-end');
    const endTop = endEl ? endEl.getBoundingClientRect().top + scrollTop : scrollTop + vh * 2;

    cards.forEach((card, i) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardTop = rect.top + scrollTop;
      const pinStart = cardTop - stackY - itemStackDistance * i;
      const pinEnd = endTop - vh * 0.5;

      let translateY = 0;
      if (scrollTop > pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackY + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackY + itemStackDistance * i;
      }

      const scaleProgress = Math.max(0, Math.min(1, (scrollTop - pinStart) / (stackY * 0.5)));
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;
      const blur = blurAmount && i > 0 ? blurAmount * scaleProgress : 0;

      card.style.transform = `translateY(${Math.round(translateY)}px) scale(${scale.toFixed(3)}) rotate(${rotation.toFixed(1)}deg)`;
      card.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : '';
    });
    tickingRef.current = false;
  }, [itemScale, itemStackDistance, stackPosition, baseScale, rotationAmount, blurAmount]);

  useEffect(() => {
    const selector = '.scroll-stack-card';
    const cards = Array.from(document.querySelectorAll(selector));
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      card.style.transformOrigin = 'top center';
      card.style.willChange = 'transform';
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
    });

    const onScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => updateCards());
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial update
    requestAnimationFrame(() => updateCards());

    return () => {
      window.removeEventListener('scroll', onScroll);
      cardsRef.current = [];
    };
  }, [itemDistance, updateCards]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
