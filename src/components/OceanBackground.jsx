import { useEffect, useRef } from 'react'

// Simple gradient background — no creatures
export default function OceanBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId, w, h

    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)

    const beams = Array.from({ length: 4 }, (_, i) => ({
      x: w*(0.1 + i*0.22), wd: 50+Math.random()*70,
      alpha: 0.006+Math.random()*0.012,
      sw: Math.random()*Math.PI*2, spd: 0.00015+Math.random()*0.0002,
    }))

    const draw = () => {
      // Deep gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#0e2a3a'); bg.addColorStop(0.4, '#092132'); bg.addColorStop(1, '#041620')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)

      // Very subtle light beams only
      beams.forEach(b => {
        b.sw += b.spd; const sx = b.x + Math.sin(b.sw)*14
        const g = ctx.createLinearGradient(sx, 0, sx+b.wd*0.3, h)
        g.addColorStop(0, `rgba(150,210,240,${b.alpha*1.3})`)
        g.addColorStop(0.3, `rgba(110,190,220,${b.alpha})`)
        g.addColorStop(1, 'rgba(50,110,150,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.moveTo(sx-b.wd*0.1, 0); ctx.lineTo(sx+b.wd*0.3, h); ctx.lineTo(sx-b.wd*0.03, h); ctx.lineTo(sx-b.wd*0.2, 0); ctx.closePath(); ctx.fill()
      })

      const vig = ctx.createRadialGradient(w/2, h/2, w*0.5, w/2, h/2, w*0.85)
      vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,0.28)')
      ctx.fillStyle = vig; ctx.fillRect(0, 0, w, h)
      animId = requestAnimationFrame(draw)
    }
    animId = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}
