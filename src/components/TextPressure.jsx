import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

const dist = (a, b) => { const dx = b.x - a.x; const dy = b.y - a.y; return Math.sqrt(dx*dx + dy*dy); };
const getAttr = (distance, maxDist, minVal, maxVal) => { const val = maxVal - Math.abs((maxVal * distance) / maxDist); return Math.max(minVal, val + minVal); };

const TextPressure = ({
  text = 'LIUYUAN',
  fontFamily = 'Roboto Flex',
  fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  textColor = '#ffffff',
  strokeColor = '#FF0000',
  className = '',
  minFontSize = 24,
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(minFontSize);

  const chars = text.split('');

  useEffect(() => {
    const onMouse = e => { cursorRef.current.x = e.clientX; cursorRef.current.y = e.clientY; };
    window.addEventListener('mousemove', onMouse);
    if (containerRef.current) {
      const { left, top, width: w, height: h } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + w/2; mouseRef.current.y = top + h/2;
      cursorRef.current.x = mouseRef.current.x; cursorRef.current.y = mouseRef.current.y;
    }
    return () => window.removeEventListener('mousemove', onMouse);
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current) return;
    const { width: cw } = containerRef.current.getBoundingClientRect();
    setFontSize(Math.max(cw / (chars.length / 1.8), minFontSize));
  }, [chars.length, minFontSize]);

  useEffect(() => {
    setSize();
    const onResize = () => setSize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setSize]);

  useEffect(() => {
    let raf;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 12;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 12;

      if (titleRef.current) {
        const maxDist = titleRef.current.getBoundingClientRect().width / 2;
        spansRef.current.forEach(span => {
          if (!span) return;
          const rect = span.getBoundingClientRect();
          const center = { x: rect.x + rect.width/2, y: rect.y + rect.height/2 };
          const d = dist(mouseRef.current, center);
          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const ital = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
          const a = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;
          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${ital}`;
          if (alpha) span.style.opacity = a;
        });
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [width, weight, italic, alpha]);

  const styleEl = useMemo(() => (
    <style>{`
      @import url('${fontUrl}');
      .tp-flex { display: flex; justify-content: space-between; }
      .tp-title { color: ${textColor}; }
    `}</style>
  ), [fontFamily, fontUrl, textColor]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', background: 'transparent' }}>
      {styleEl}
      <h1 ref={titleRef} className={`tp-title ${flex ? 'tp-flex' : ''} ${className}`} style={{
        fontFamily, textTransform: 'uppercase', fontSize, lineHeight: 1,
        margin: 0, textAlign: 'center', userSelect: 'none',
        whiteSpace: 'nowrap', fontWeight: 100, width: '100%',
      }}>
        {chars.map((char, i) => (
          <span key={i} ref={el => spansRef.current[i] = el} style={{ display: 'inline-block' }}>
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
