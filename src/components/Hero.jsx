import { useEffect, useState } from 'react'
import TextPressure from './TextPressure'

export default function Hero() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1800)
    return () => clearTimeout(t)
  }, [])

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="hero" style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '0 48px 80px', overflow: 'hidden',
    }}>
      {/* Video background */}
      <video autoPlay muted loop playsInline style={{
        position: 'absolute', inset: 0, zIndex: 1,
        width: '100%', height: '100%', objectFit: 'cover',
        pointerEvents: 'none', filter: 'brightness(0.85)',
      }}>
        <source src="/ocean-hero.mp4" type="video/mp4" />
      </video>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(180deg, transparent 50%, rgba(6,16,24,0.55) 82%, rgba(6,16,24,0.88) 100%)',
        pointerEvents: 'none',
      }} />

      {/* TextPressure — interactive LIUYUAN */}
      {ready && (
        <div style={{
          position: 'relative', zIndex: 2,
          width: '90%', maxWidth: 1100, height: 160,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <TextPressure
            text="LIUYUAN"
            fontFamily="Roboto Flex"
            fontUrl="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="rgba(230,240,250,0.92)"
            minFontSize={42}
          />
        </div>
      )}

      {/* Subtitle + buttons — subtle, below the name */}
      {ready && (
        <div style={{
          position: 'relative', zIndex: 2,
          marginTop: 12,
          opacity: 0, animation: 'fadeIn 1.5s ease 0.5s forwards',
        }}>
          <p style={{
            fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
            color: 'rgba(160,200,220,0.75)', marginBottom: 28,
            letterSpacing: '1px',
          }}>AI应用与安全工程师</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => scrollTo('#projects')}
              style={{ fontSize: '0.82rem', padding: '10px 24px' }}>探索项目</button>
            <button className="btn btn-outline" onClick={() => scrollTo('#contact')}
              style={{ fontSize: '0.82rem', padding: '10px 24px' }}>联系我</button>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </section>
  )
}
