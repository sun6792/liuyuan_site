import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsapInit'
import ProfileCard from './ProfileCard'

export default function About() {
  const sectionRef = useRef(null)
  const enTitleRef = useRef(null)
  const gridRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Big English title — slides in from left, compressed→normal
      gsap.fromTo(enTitleRef.current,
        { x: -120, scaleX: 1.3, opacity: 0, filter: 'blur(6px)' },
        {
          x: 0, scaleX: 1, opacity: 1, filter: 'blur(0px)',
          duration: 1.4, ease: 'power3.out',
          scrollTrigger: {
            trigger: enTitleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      )

      // Grid items — staggered rise with parallax feel
      const gridItems = gridRef.current?.querySelectorAll('.about-grid-item')
      if (gridItems) {
        gsap.fromTo(gridItems,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 1.2, stagger: 0.2, ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 78%',
              toggleActions: 'play none none none',
            }
          }
        )
      }

      // Stats row — rise with delay
      const statCards = statsRef.current?.querySelectorAll('.stat-card')
      if (statCards) {
        gsap.fromTo(statCards,
          { y: 50, opacity: 0, scale: 0.92 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 1, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const stats = [
    { value: '96%', label: '效率提升', color: '#3e9ab8' },
    { value: '99.9%+', label: '系统可用性', color: '#48a898' },
    { value: '20+', label: 'Prompt模板', color: '#5e5ea8' },
    { value: '5000+', label: '数据处理量', color: '#b07050' },
  ]

  return (
    <section ref={sectionRef} id="about" className="section">
      <div className="container">
        {/* Big English title — dramatic entrance */}
        <div ref={enTitleRef} style={{ marginBottom: 48, overflow: 'hidden' }}>
          <div style={{
            fontSize: 'clamp(3rem, 7vw, 7rem)', fontWeight: 900,
            letterSpacing: '-3px', lineHeight: 0.9,
            color: 'rgba(255,255,255,0.04)',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            marginBottom: -20,
          }}>ABOUT</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-tag">About</div>
            <h2 className="section-title">个人经历</h2>
            <p className="section-subtitle">从安全底座到AI应用前沿</p>
          </div>
        </div>

        <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }}>
          {/* Left — ProfileCard */}
          <div className="about-grid-item" style={{ display: 'flex', justifyContent: 'center' }}>
            <ProfileCard
              avatarUrl="/avatar.jpg"
              name="刘袁"
              title="AI应用与安全工程师"
              handle="lyuan"
              status="Open to Work"
              contactText="联系我"
              enableTilt={true}
              behindGlowEnabled={true}
              behindGlowColor="rgba(62,154,184,0.5)"
              innerGradient="linear-gradient(145deg, rgba(26,58,80,0.55) 0%, rgba(62,154,184,0.25) 100%)"
              onContactClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            />
          </div>

          {/* Right — Bio */}
          <div className="about-grid-item">
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 2, marginBottom: 16 }}>
              21岁，<strong style={{ color: '#3e9ab8' }}>湖南常德</strong>人，网络安全专业，<strong style={{ color: '#3e9ab8' }}>NISP二级</strong>持有者。
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 2, marginBottom: 16 }}>
              从传统网络安全切入AI交叉领域，兼具<strong style={{ color: '#3e9ab8' }}>企业级百台服务器实战经验</strong>与自主项目研发能力。相信技术服务于业务，热衷探索「安全 + AI + 电商」的跨界可能。
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 2 }}>
              强自驱力，持续跟进行业前沿，习惯用落地成果验证技术价值。现居广东珠海，开放远程与现场工作机会。
            </p>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="https://github.com/sun6792" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '8px 20px', textDecoration: 'none' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>⌘</span> GitHub
              </a>
              <a href="mailto:2969630697@qq.com" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '8px 20px', textDecoration: 'none' }}>
                ✉ 2969630697@qq.com
              </a>
              <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '8px 20px' }}
                onClick={() => { navigator.clipboard.writeText('17264522561'); alert('微信已复制: 17264522561') }}>
                💬 微信: 17264522561
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
          marginTop: 64, paddingTop: 40,
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{
              textAlign: 'center', padding: '24px 12px',
              background: 'rgba(255,255,255,0.012)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: 12,
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #about .container > div:nth-child(2) { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  )
}
