import { useEffect, useRef, useState } from 'react'

export default function Contact() {
  const sectionRef = useRef(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.reveal').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 150)
          })
        }
      })
    }, { threshold: 0.3 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const copyWechat = () => {
    navigator.clipboard.writeText('17264522561')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" ref={sectionRef} style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '80px 48px',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
        <div className="reveal">
          <div className="section-tag" style={{ justifyContent: 'center' }}>Get In Touch</div>
        </div>

        <div className="reveal">
          <h2 style={{
            fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900,
            letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 20,
          }}>
            Let's Work<br />
            <span style={{ background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Together
            </span>
          </h2>
        </div>

        <div className="reveal">
          <p style={{
            fontSize: '1.1rem', color: 'var(--text-secondary)',
            marginBottom: 48, lineHeight: 1.7,
          }}>
            开放远程协作与现场工作机会<br />
            如果你正在寻找一位兼具<strong style={{ color: 'var(--accent-cyan)' }}>AI能力</strong>与<strong style={{ color: 'var(--accent-purple)' }}>安全底盘</strong>的跨界实践者
          </p>
        </div>

        <div className="reveal" style={{
          display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap',
          marginBottom: 60,
        }}>
          <a href="mailto:2969630697@qq.com" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '16px 32px', borderRadius: 40,
            background: 'var(--gradient-1)', color: '#fff',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem',
            boxShadow: '0 4px 24px rgba(0,212,255,0.2)',
            transition: 'var(--transition)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            ✉ 发送邮件
          </a>

          <button onClick={copyWechat} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '16px 32px', borderRadius: 40,
            background: copied ? 'rgba(0,230,118,0.1)' : 'transparent',
            border: copied ? '1px solid rgba(0,230,118,0.3)' : '1px solid rgba(255,255,255,0.15)',
            color: copied ? 'var(--accent-green)' : '#fff',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
            fontFamily: 'var(--font-sans)',
            transition: 'var(--transition)',
          }}
          onMouseEnter={e => { if (!copied) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
          onMouseLeave={e => { if (!copied) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
          >
            {copied ? '✅ 已复制: 17264522561' : '💬 微信: 17264522561'}
          </button>
        </div>

        <div className="reveal" style={{
          display: 'flex', gap: 32, justifyContent: 'center',
          color: 'var(--text-muted)', fontSize: '0.85rem',
          fontFamily: 'var(--font-mono)',
        }}>
          <a href="https://github.com/sun6792" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
            ⌘ GitHub
          </a>
          <span>✉ 2969630697@qq.com</span>
          <span>📱 17264522561</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '28px 48px', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        color: 'var(--text-muted)', fontSize: '0.78rem',
        fontFamily: 'var(--font-mono)',
      }}>
        © 2026 刘袁 · AI Designer & Brand Creator
      </div>

      <style>{`
        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}</style>
    </section>
  )
}
