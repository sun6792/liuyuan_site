import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsapInit'
import TextPressure from './TextPressure'

export default function Hero() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const btnsRef = useRef(null)
  const maskRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.2 })

      // Mask reveal — curtain opens from center
      tl.fromTo(maskRef.current,
        { scaleX: 1, transformOrigin: 'center center' },
        { scaleX: 0, duration: 1.4, ease: 'power3.inOut' }
      )
      // Title compresses from wide then settles
      tl.fromTo(titleRef.current,
        { scaleX: 1.15, scaleY: 0.85, opacity: 0.3, filter: 'blur(8px)' },
        { scaleX: 1, scaleY: 1, opacity: 1, filter: 'blur(0px)', duration: 1.6, ease: 'expo.out' },
        '-=1.0'
      )
      // Subtitle slides up from below
      tl.fromTo(subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
        '-=0.6'
      )
      // Buttons fade in with stagger
      tl.fromTo(btnsRef.current.children,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
        '-=0.4'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section ref={sectionRef} id="hero" style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '0 48px 80px', overflow: 'hidden',
    }}>
      {/* Video background — poster shown while video loads */}
      <video autoPlay muted loop playsInline preload="metadata" poster="/ocean-hero-poster.jpg" style={{
        position: 'absolute', inset: 0, zIndex: 1,
        width: '100%', height: '100%', objectFit: 'cover',
        pointerEvents: 'none', filter: 'brightness(0.85)',
      }}>
        <source src="/ocean-hero.mp4" type="video/mp4" />
      </video>

      {/* Curtain mask — opens to reveal content */}
      <div ref={maskRef} style={{
        position: 'absolute', inset: 0, zIndex: 3,
        background: '#061018',
        pointerEvents: 'none',
      }} />

      {/* Bottom gradient */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(180deg, transparent 50%, rgba(6,16,24,0.55) 82%, rgba(6,16,24,0.88) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* TextPressure — LIUYUAN */}
        <div ref={titleRef} style={{ width: '90vw', maxWidth: 1100, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TextPressure
            text="LIUYUAN"
            fontFamily="Roboto Flex"
            fontUrl="/fonts/fonts.css"
            flex={true} alpha={false} stroke={false}
            width={true} weight={true} italic={true}
            textColor="rgba(230,240,250,0.92)"
            minFontSize={42}
          />
        </div>

        {/* Subtitle + buttons */}
        <div ref={subtitleRef} style={{ marginTop: 12 }}>
          <p style={{
            fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
            color: 'rgba(160,200,220,0.75)', marginBottom: 28,
            letterSpacing: '1px',
          }}>AI应用与安全工程师</p>
          <div ref={btnsRef} style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => scrollTo('#projects')}
              style={{ fontSize: '0.82rem', padding: '10px 24px' }}>探索项目</button>
            <button className="btn btn-outline" onClick={() => scrollTo('#contact')}
              style={{ fontSize: '0.82rem', padding: '10px 24px' }}>联系我</button>
          </div>
        </div>
      </div>
    </section>
  )
}
