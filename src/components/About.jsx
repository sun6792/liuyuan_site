import { useEffect, useRef } from 'react'
import ProfileCard from './ProfileCard'

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.reveal-deep').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 150)
          })
        }
      })
    }, { threshold: 0.12 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const stats = [
    { value: '96%', label: '效率提升', color: '#60b8d0' },
    { value: '99.9%+', label: '系统可用性', color: '#58b8a8' },
    { value: '20+', label: 'Prompt模板', color: '#7878c0' },
    { value: '5000+', label: '数据处理量', color: '#c08060' },
  ]

  return (
    <section id="about" className="section" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <div className="reveal-deep" style={{ marginBottom: 56 }}>
          <div className="section-tag">About</div>
          <h2 className="section-title">个人经历</h2>
          <p className="section-subtitle">从安全底座到AI设计前沿</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }}>
          {/* Left — ProfileCard with 3D tilt */}
          <div className="reveal-deep" style={{ display: 'flex', justifyContent: 'center' }}>
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
          <div>
            <div className="reveal-deep">
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 2, marginBottom: 16 }}>
                21岁，<strong style={{ color: '#60b8d0' }}>湖南常德</strong>人，网络安全专业，<strong style={{ color: '#60b8d0' }}>NISP二级</strong>持有者。
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 2, marginBottom: 16 }}>
                从传统网络安全切入AI交叉领域，兼具<strong style={{ color: '#60b8d0' }}>企业级百台服务器实战经验</strong>与自主项目研发能力。相信技术服务于业务，热衷探索「安全 + AI + 电商」的跨界可能。
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 2 }}>
                强自驱力，持续跟进行业前沿，习惯用落地成果验证技术价值。现居广东珠海，开放远程与现场工作机会。
              </p>
            </div>

            <div className="reveal-deep" style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', alignItems: 'center' }}>
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
        <div className="reveal-deep" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
          marginTop: 64, paddingTop: 40,
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
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
          #about .container > div:first-of-type { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  )
}
