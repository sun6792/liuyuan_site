import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './CardNav.css';

const CardNav = ({
  items,
  className = '',
  ease = 'power3.out',
  baseColor = 'rgba(8,22,36,0.95)',
  menuColor = '#8cb8d0',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const calcHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 220;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    if (mobile) return window.innerHeight - 80;
    return 220;
  };

  const createTl = () => {
    const navEl = navRef.current;
    if (!navEl) return null;
    gsap.set(navEl, { height: 56, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 30, opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: calcHeight, duration: 0.35, ease });
    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.3, ease, stagger: 0.06 }, '-=0.08');
    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTl();
    tlRef.current = tl;
    return () => { tl?.kill(); tlRef.current = null; };
  }, [ease, items]);

  useLayoutEffect(() => {
    const onResize = () => {
      if (!tlRef.current) return;
      if (isExpanded) {
        gsap.set(navRef.current, { height: calcHeight() });
        tlRef.current.kill();
        const newTl = createTl();
        if (newTl) { newTl.progress(1); tlRef.current = newTl; }
      } else {
        tlRef.current.kill();
        tlRef.current = createTl();
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isExpanded]);

  const toggle = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsOpen(true); setIsExpanded(true); tl.play(0);
    } else {
      setIsOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const scrollTo = (href) => {
    toggle();
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  };

  return (
    <div className={`card-nav-wrap ${className}`}>
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`} style={{ backgroundColor: baseColor, backdropFilter: 'blur(20px)' }}>
        <div className="card-nav-top">
          {/* Logo */}
          <div className="card-nav-logo" onClick={() => scrollTo('#hero')}>
            <span style={{ fontWeight: 800, background: 'linear-gradient(135deg, #3e9ab8, #5e5ea8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.2rem', cursor: 'pointer' }}>LY</span>
          </div>

          {/* Hamburger */}
          <div
            className={`card-hamburger ${isOpen ? 'open' : ''}`}
            onClick={toggle}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            aria-expanded={isExpanded}
            tabIndex={0}
            style={{ color: menuColor }}
          >
            <div className="ham-line" />
            <div className="ham-line" />
          </div>
        </div>

        {/* Expanding cards */}
        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {items.map((item, idx) => (
            <div
              key={item.label}
              className="nav-card"
              ref={el => { if (el) cardsRef.current[idx] = el; }}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map(link => (
                  <a
                    key={link.label}
                    className="nav-card-link"
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  >
                    <span className="nav-card-arrow">→</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
