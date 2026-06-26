import { useEffect, useState, useRef } from 'react'
import CardNav from './components/CardNav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import OceanBackground from './components/OceanBackground'
import MagicRings from './components/MagicRings'
import Particles from './components/Particles'

export default function App() {
  const [activeSkill, setActiveSkill] = useState(null)
  const cursorRef = useRef({ x: 0, y: 0 })
  const trailRef = useRef([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }])
  const rafRef = useRef(null)

  useEffect(() => {
    const fishes = Array.from({ length: 4 }, (_, i) => {
      const el = document.createElement('div')
      el.innerHTML = i === 0 ? '🐟' : '·'
      el.style.cssText = `position:fixed;pointer-events:none;z-index:${9997-i};font-size:${i===0?'22px':'8px'};transform:translate(-50%,-50%);opacity:${i===0?0.9:0.35-i*0.08};filter:drop-shadow(0 0 ${i===0?6:2}px rgba(120,180,210,${i===0?0.5:0.3}));`
      document.body.appendChild(el); return el
    })
    const aura = document.createElement('div')
    aura.style.cssText = 'position:fixed;pointer-events:none;z-index:9996;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,rgba(120,180,210,0.07),transparent 70%);transform:translate(-50%,-50%);'
    document.body.appendChild(aura)

    const onMove = (e) => { cursorRef.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove, { passive: true })

    const animate = () => {
      const { x, y } = cursorRef.current
      const t = trailRef.current
      t[0].x += (x-t[0].x)*0.25; t[0].y += (y-t[0].y)*0.25
      for (let i=1; i<t.length; i++) { t[i].x += (t[i-1].x-t[i].x)*0.2; t[i].y += (t[i-1].y-t[i].y)*0.2 }
      const dx = x-(t[0].x-(x-t[0].x)), dy = y-(t[0].y-(y-t[0].y))
      const angle = Math.atan2(dy,dx)*(180/Math.PI)
      fishes[0].style.left = t[0].x+'px'; fishes[0].style.top = t[0].y+'px'
      fishes[0].style.transform = `translate(-50%,-50%) rotate(${angle+90}deg)`
      for (let i=1; i<fishes.length; i++) { fishes[i].style.left = t[i].x+'px'; fishes[i].style.top = t[i].y+'px' }
      aura.style.left = t[0].x+'px'; aura.style.top = t[0].y+'px'
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current); fishes.forEach(f=>f.remove()); aura.remove() }
  }, [])

  return (
    <>
      {/* Layer 0: Gradient background */}
      <OceanBackground />

      {/* Layer 1: MagicRings — fixed full-screen */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <MagicRings
          color="#3e9ab8" colorTwo="#5e5ea8"
          ringCount={5} speed={0.6} attenuation={10}
          lineThickness={2} baseRadius={0.25} radiusStep={0.12}
          scaleRate={0.05} opacity={0.4} blur={2.5} noiseAmount={0.05}
          ringGap={1.5} fadeIn={0.5} fadeOut={0.5}
          followMouse={true} mouseInfluence={0.1}
          hoverScale={1.1} parallax={0.03} clickBurst={true}
        />
      </div>

      {/* Layer 2: Particles — fixed full-screen */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <Particles
          particleColors={['#3e9ab8', '#5e5ea8', '#48a898']}
          particleCount={120}
          particleSpread={12}
          speed={0.06}
          particleBaseSize={100}
          sizeRandomness={0.7}
          moveParticlesOnHover={true}
          particleHoverFactor={0.6}
          alphaParticles={true}
          cameraDistance={24}
          disableRotation={false}
        />
      </div>

      {/* Layer 3: Content */}
      <CardNav
        items={[
          {
            label: '关于',
            bgColor: 'rgba(62,154,184,0.15)',
            textColor: '#b8d8e8',
            links: [
              { label: '个人经历', href: '#about' },
              { label: '联系方式', href: '#contact' },
            ],
          },
          {
            label: '能力',
            bgColor: 'rgba(94,94,168,0.15)',
            textColor: '#c8c8f0',
            links: [
              { label: '个人优势', href: '#skills' },
              { label: '点击探索项目', href: '#skills' },
            ],
          },
          {
            label: '项目',
            bgColor: 'rgba(72,168,152,0.15)',
            textColor: '#b8e8d8',
            links: [
              { label: '精选项目', href: '#projects' },
              { label: '电商运营', href: '#project-4' },
            ],
          },
        ]}
        baseColor="rgba(7,24,40,0.94)"
        menuColor="#8cb8d0"
        ease="power3.out"
      />
      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <About />
        <Skills onSkillClick={setActiveSkill} />
        <Projects highlightSkill={activeSkill} />
        <Contact />
      </main>
    </>
  )
}
