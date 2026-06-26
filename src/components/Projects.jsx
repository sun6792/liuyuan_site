import { useEffect, useRef, useState } from 'react'
import BorderGlow from './BorderGlow'
import ShinyText from './ShinyText'

const projects = [
  {
    id: 0, num: '01', title: '企业级运维自动化提效',
    tags: ['AI Agent', 'Python/Bash', '监控自动化'],
    bg: '广汽传祺百台服务器运维场景',
    action: '自主搭建AI智能体，优化运维脚本，实现监控自动化',
    result: '整体运维效率提升 40%，生产网络可用性 99.9%+，全程零操作事故',
    stats: [{ v: '40%', l: '效率提升' }, { v: '99.9%+', l: '可用性' }, { v: '0', l: '操作事故' }],
    accent: 'var(--accent-purple)', skillIcon: '🛡️',
  },
  {
    id: 1, num: '02', title: '办公数据自动化处理工具',
    tags: ['Claude Code', 'Python', '大模型'],
    bg: '人工报表2小时 → AI处理5分钟',
    action: '基于Claude Code开发Python脚本，结合大模型实现数据清洗、汇总、报表一键生成',
    result: '处理时长缩短至5分钟，效率提升96%，准确率99%+，累计处理数据5000+条',
    stats: [{ v: '96%', l: '效率提升' }, { v: '5min', l: '处理时长' }, { v: '5000+', l: '累计处理' }],
    accent: 'var(--accent-teal)', skillIcon: '⚡',
  },
  {
    id: 2, num: '03', title: '服务器安全自动化巡检系统',
    tags: ['安全巡检', 'Prompt调优', '报告生成'],
    bg: '人工安全巡检重复度高、报告不规范',
    action: '编写Python巡检脚本覆盖8项核心检测项，通过Prompt调优实现标准化报告自动生成',
    result: '巡检效率提升60%，成果入选专业课程参考模板',
    stats: [{ v: '60%', l: '效率提升' }, { v: '8项', l: '检测覆盖' }, { v: '⭐', l: '课程模板' }],
    accent: 'var(--accent-purple)', skillIcon: '🛡️',
  },
  {
    id: 3, num: '04', title: '大模型API & Prompt工程实践',
    tags: ['API调用', 'Function Calling', 'Prompt模板'],
    bg: '掌握大模型业务应用核心能力',
    action: '搭建Python调用环境，完成多轮对话、结构化输出、Function Calling对接；迭代优化Prompt模板20+版',
    result: '沉淀可复用模板库，覆盖3类场景，结构化输出准确率稳定95%+',
    stats: [{ v: '20+', l: 'Prompt模板' }, { v: '95%+', l: '输出准确率' }, { v: '3类', l: '业务场景' }],
    accent: 'var(--accent-cyan)', skillIcon: '🔮',
  },
  {
    id: 4, num: '05', title: '闲鱼店铺AI运营工具链',
    tags: ['AI文案', 'Python', '数据整理'],
    bg: '个人电商运营人力有限，文案与订单处理效率低',
    action: '用大模型批量生成优化商品标题与详情文案；编写Python脚本自动抓取订单数据、整理选品表格、输出周度运营复盘',
    result: '商品上架效率提升70%，文案点击率提升明显，累计处理订单200+，形成可复用的电商AI运营SOP',
    stats: [{ v: '70%', l: '上架提效' }, { v: '200+', l: '订单处理' }, { v: '📦', l: '运营SOP' }],
    accent: 'var(--accent-orange)', skillIcon: '🛒',
  },
]

export default function Projects({ highlightSkill }) {
  const sectionRef = useRef(null)
  const [highlighted, setHighlighted] = useState(null)

  useEffect(() => {
    if (highlightSkill !== null && highlightSkill !== undefined) {
      setHighlighted(highlightSkill)
      const t = setTimeout(() => setHighlighted(null), 3500)
      return () => clearTimeout(t)
    }
    setHighlighted(null)
  }, [highlightSkill])

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.proj-card-reveal')
    if (!cards) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' })
    cards.forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" className="section" ref={sectionRef}>
      <div className="container">
        <div className="reveal-deep d1" style={{ marginBottom: 48 }}>
          <div className="section-tag">Projects</div>
          <h2 className="section-title">
            <ShinyText text="精选项目" speed={3.5} color="rgba(200,215,230,0.7)" shineColor="#ffffff" spread={110} direction="left" />
          </h2>
          <p className="section-subtitle">每个项目对应一个真实业务问题，用AI + 自动化给出可量化方案</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {projects.map((p, i) => {
            const isHL = highlighted === p.id
            return (
              <BorderGlow
                key={i}
                className="proj-card-reveal proj-card-hover"
                glowColor="195 45 55"
                backgroundColor="rgba(10,24,38,0.84)"
                borderRadius={16}
                glowRadius={35}
                glowIntensity={0.9}
                coneSpread={28}
                colors={['#3e9ab8', '#5e5ea8', '#48a898']}
                fillOpacity={0.4}
                edgeSensitivity={35}
              >
                <div id={`project-${p.id}`} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1.5fr',
                  gap: 40, alignItems: 'center',
                  padding: '36px 44px',
                  position: 'relative',
                }}>
                  {isHL && (
                    <div style={{
                      position: 'absolute', top: -10, right: 32,
                      padding: '4px 16px', borderRadius: 14,
                      background: p.accent, color: '#070c14',
                      fontSize: '0.7rem', fontWeight: 600,
                      fontFamily: 'var(--font-mono)',
                      animation: 'slideIn 0.4s ease',
                      zIndex: 2,
                    }}>
                      {p.skillIcon} 匹配项目
                    </div>
                  )}

                  {/* Left — image placeholder */}
                  <div style={{
                    aspectRatio: '4/3',
                    background: 'rgba(255,255,255,0.015)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: 'var(--radius)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '4rem', fontWeight: 800, color: p.accent,
                    opacity: 0.35, fontFamily: 'var(--font-mono)',
                  }}>
                    {p.num}
                  </div>

                  {/* Right — content */}
                  <div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                      {p.tags.map((t, j) => (
                        <span key={j} style={{
                          fontSize: '0.7rem', padding: '4px 12px', borderRadius: 14,
                          color: p.accent, fontFamily: 'var(--font-mono)',
                          border: `1px solid ${p.accent}25`,
                        }}>{t}</span>
                      ))}
                    </div>

                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 8 }}>
                      <ShinyText text={p.title} speed={3} color="rgba(220,230,240,0.7)" shineColor="#ffffff" spread={100} direction="left" />
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 28 }}>{p.bg}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: p.accent, fontWeight: 500, fontSize: '0.82rem', flexShrink: 0 }}>Action</span>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{p.action}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: p.accent, fontWeight: 500, fontSize: '0.82rem', flexShrink: 0 }}>Result</span>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{p.result}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 40, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      {p.stats.map((st, j) => (
                        <div key={j} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: p.accent, fontFamily: 'var(--font-mono)' }}>
                            {st.v}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{st.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </BorderGlow>
            )
          })}
        </div>
      </div>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 900px) {
          #projects .border-glow-card > div { grid-template-columns: 1fr !important; gap: 32px !important; padding: 32px 28px !important; }
        }
      `}</style>
    </section>
  )
}
