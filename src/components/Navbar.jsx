import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: '关于', href: '#about' },
    { label: '项目', href: '#projects' },
    { label: '优势', href: '#skills' },
    { label: '联系', href: '#contact' },
  ]

  const scrollTo = (e, href) => {
    e.preventDefault()
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 48px', height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(5,5,16,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}
    >
      <a href="#hero" onClick={(e) => scrollTo(e, '#hero')} style={{
        fontSize: '1.3rem', fontWeight: 800, textDecoration: 'none',
        background: 'var(--gradient-1)', WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px',
      }}>
        LY<span style={{ fontWeight: 400, fontSize: '0.8rem', marginLeft: 2 }}>·PORTFOLIO</span>
      </a>

      <ul className="nav-links" style={{
        display: 'flex', gap: 6, listStyle: 'none',
      }}>
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href} onClick={(e) => scrollTo(e, l.href)} style={{
              color: 'var(--text-secondary)', textDecoration: 'none',
              padding: '8px 20px', borderRadius: 22, fontSize: '0.85rem',
              fontWeight: 500, transition: 'var(--transition)',
            }}
            onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent' }}
            >{l.label}</a>
          </li>
        ))}
      </ul>

      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} style={{
        display: 'none', background: 'none', border: 'none', color: '#fff',
        fontSize: '1.5rem', cursor: 'pointer',
      }}>☰</button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 72, left: 0, right: 0,
              background: 'rgba(5,5,16,0.97)', backdropFilter: 'blur(24px)',
              padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}
          >
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={(e) => scrollTo(e, l.href)} style={{
                color: '#fff', textDecoration: 'none', padding: '14px 20px',
                fontSize: '1rem', fontWeight: 500, textAlign: 'center',
                borderRadius: 12, background: 'rgba(255,255,255,0.03)',
              }}>{l.label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .mobile-toggle { display: block !important; }
          .navbar { padding: 0 24px !important; }
        }
      `}</style>
    </motion.nav>
  )
}
