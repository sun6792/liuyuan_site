import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './ProfileCard.css';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#1a3a508c 0%,#3e9ab844 100%)';
const ANIMATION_CONFIG = { INITIAL_DURATION: 1200, INITIAL_X_OFFSET: 70, INITIAL_Y_OFFSET: 60, DEVICE_BETA_OFFSET: 20, ENTER_TRANSITION_MS: 180 };
const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, p = 3) => parseFloat(v.toFixed(p));
const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

const ProfileCardComponent = ({
  avatarUrl,
  iconUrl,
  grainUrl,
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor = 'rgba(62,154,184,0.5)',
  behindGlowSize = '50%',
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = '刘袁',
  title = 'AI设计师 & 品牌创造者',
  handle = 'lyuan',
  status = 'Open to Work',
  contactText = '联系我',
  showUserInfo = true,
  onContactClick,
}) => {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);
  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);

  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;
    let rafId = null, running = false, lastTs = 0;
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
    const DEFAULT_TAU = 0.14, INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVars = (x, y) => {
      const shell = shellRef.current, wrap = wrapRef.current;
      if (!shell || !wrap) return;
      const w = shell.clientWidth || 1, h = shell.clientHeight || 1;
      const px = clamp((100 / w) * x), py = clamp((100 / h) * y);
      const cx = px - 50, cy = py - 50;
      const vars = {
        '--pointer-x': `${px}%`, '--pointer-y': `${py}%`,
        '--background-x': `${adjust(px, 0, 100, 35, 65)}%`, '--background-y': `${adjust(py, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(py - 50, px - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${py / 100}`, '--pointer-from-left': `${px / 100}`,
        '--rotate-x': `${round(-(cx / 5))}deg`, '--rotate-y': `${round(cy / 4)}deg`,
      };
      for (const [k, v] of Object.entries(vars)) wrap.style.setProperty(k, v);
    };

    const step = ts => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000; lastTs = ts;
      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);
      currentX += (targetX - currentX) * k; currentY += (targetY - currentY) * k;
      setVars(currentX, currentY);
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05 || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else { running = false; lastTs = 0; if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
    };

    return {
      setImmediate(x, y) { currentX = x; currentY = y; setVars(currentX, currentY); },
      setTarget(x, y) { targetX = x; targetY = y; if (!running) { running = true; lastTs = 0; rafId = requestAnimationFrame(step); } },
      toCenter() { const s = shellRef.current; if (s) this.setTarget(s.clientWidth / 2, s.clientHeight / 2); },
      beginInitial(d) { initialUntil = performance.now() + d; if (!running) { running = true; lastTs = 0; rafId = requestAnimationFrame(step); } },
      getCurrent() { return { x: currentX, y: currentY, tx: targetX, ty: targetY }; },
      cancel() { if (rafId) cancelAnimationFrame(rafId); rafId = null; running = false; lastTs = 0; },
    };
  }, [enableTilt]);

  const getOffsets = (evt, el) => { const r = el.getBoundingClientRect(); return { x: evt.clientX - r.left, y: evt.clientY - r.top }; };

  const handlePointerMove = useCallback(e => { const s = shellRef.current; if (!s || !tiltEngine) return; const { x, y } = getOffsets(e, s); tiltEngine.setTarget(x, y); }, [tiltEngine]);
  const handlePointerEnter = useCallback(e => {
    const s = shellRef.current; if (!s || !tiltEngine) return;
    s.classList.add('active', 'entering');
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    enterTimerRef.current = setTimeout(() => s.classList.remove('entering'), ANIMATION_CONFIG.ENTER_TRANSITION_MS);
    const { x, y } = getOffsets(e, s); tiltEngine.setTarget(x, y);
  }, [tiltEngine]);
  const handlePointerLeave = useCallback(() => {
    const s = shellRef.current; if (!s || !tiltEngine) return;
    tiltEngine.toCenter();
    const check = () => { const { x, y, tx, ty } = tiltEngine.getCurrent(); if (Math.hypot(tx - x, ty - y) < 0.6) { s.classList.remove('active'); leaveRafRef.current = null; } else { leaveRafRef.current = requestAnimationFrame(check); } };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(check);
  }, [tiltEngine]);

  useEffect(() => {
    if (!enableTilt || !tiltEngine) return;
    const s = shellRef.current; if (!s) return;
    s.addEventListener('pointerenter', handlePointerEnter);
    s.addEventListener('pointermove', handlePointerMove);
    s.addEventListener('pointerleave', handlePointerLeave);
    const ix = (s.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    tiltEngine.setImmediate(ix, ANIMATION_CONFIG.INITIAL_Y_OFFSET);
    tiltEngine.toCenter(); tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);
    return () => {
      s.removeEventListener('pointerenter', handlePointerEnter);
      s.removeEventListener('pointermove', handlePointerMove);
      s.removeEventListener('pointerleave', handlePointerLeave);
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel(); s.classList.remove('entering');
    };
  }, [enableTilt, tiltEngine, handlePointerMove, handlePointerEnter, handlePointerLeave]);

  const cardStyle = useMemo(() => ({
    '--icon': iconUrl ? `url(${iconUrl})` : 'none',
    '--grain': grainUrl ? `url(${grainUrl})` : 'none',
    '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT,
    '--behind-glow-color': behindGlowColor,
    '--behind-glow-size': behindGlowSize,
  }), [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]);

  return (
    <div ref={wrapRef} className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
      {behindGlowEnabled && <div className="pc-behind" />}
      <div ref={shellRef} className="pc-card-shell">
        <section className="pc-card">
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            <div className="pc-content pc-avatar-content">
              <img className="avatar" src={avatarUrl} alt={name} loading="lazy" onError={e => { if (!e.target.src.endsWith('.jpg')) { e.target.src = './avatar.jpg'; } else { e.target.style.opacity = '0.3'; } }} />
              {showUserInfo && (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      <img src={miniAvatarUrl || avatarUrl} alt={name} loading="lazy" onError={e => { if (!e.target.src.endsWith('.jpg')) { e.target.src = './avatar.jpg'; } else { e.target.style.opacity = '0.5'; } }} />
                    </div>
                    <div className="pc-user-text">
                      <div className="pc-handle">@{handle}</div>
                      <div className="pc-status">{status}</div>
                    </div>
                  </div>
                  <button className="pc-contact-btn" onClick={onContactClick} type="button" aria-label={`Contact ${name}`}>
                    {contactText}
                  </button>
                </div>
              )}
            </div>
            <div className="pc-content">
              <div className="pc-details">
                <h3>{name}</h3>
                <p>{title}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
