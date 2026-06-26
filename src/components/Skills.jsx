import { useEffect, useRef } from 'react'
import ScrollStack, { ScrollStackItem } from './ScrollStack'
import ShinyText from './ShinyText'

const skills = [
  {
    id: 'prompt', icon: '🔮', title: '提示词工程与大模型应用', tag: '核心能力',
    tagBg: 'rgba(62,154,184,0.12)', tagColor: '#3e9ab8', tagBorder: 'rgba(62,154,184,0.25)',
    color: '#3e9ab8', matchProject: 3,
    items: [
      '精通多场景Prompt设计与迭代调优，沉淀20+可复用模板',
      '结构化输出准确率95%+，覆盖电商、运维、安全、数据四大场景',
      '熟练掌握大模型API调用、Function Calling、多轮对话逻辑',
    ],
    keywords: ['Prompt Design', 'Function Calling', '结构化输出', '模板库20+'],
  },
  {
    id: 'automation', icon: '⚡', title: 'AI自动化开发', tag: '工具链',
    tagBg: 'rgba(72,168,152,0.12)', tagColor: '#48a898', tagBorder: 'rgba(72,168,152,0.25)',
    color: '#48a898', matchProject: 1,
    items: [
      '独立搭建AI Agent智能体，结合Python脚本实现自动化落地',
      '熟练使用Claude Code，完成需求拆解→开发→测试→部署全闭环',
      '代表成果：报表效率提升96%，巡检效率提升60%',
      'GitHub持续积累：AI工具、自动化脚本、安全巡检等项目开源实践',
    ],
    keywords: ['AI Agent', 'Python', 'Claude Code', 'GitHub', '全闭环开发'],
  },
  {
    id: 'security', icon: '🛡️', title: '网络安全与运维', tag: '安全底盘',
    tagBg: 'rgba(94,94,168,0.12)', tagColor: '#5e5ea8', tagBorder: 'rgba(94,94,168,0.25)',
    color: '#5e5ea8', matchProject: 0,
    items: [
      '百台级服务器运维，生产环境可用性99.9%+，零操作事故',
      '精通Web漏洞攻防、告警分析、应急响应、钓鱼邮件防护',
      '熟悉防火墙/WAF/IDS/堡垒机，参与等保合规与AI安全评估',
    ],
    keywords: ['Web攻防', '应急响应', '等保合规', 'AI安全评估'],
  },
  {
    id: 'ecommerce', icon: '🛒', title: '电商技术赋能', tag: '探索中',
    tagBg: 'rgba(176,112,80,0.12)', tagColor: '#b07050', tagBorder: 'rgba(176,112,80,0.25)',
    color: '#b07050', matchProject: 4,
    items: [
      '独立运营闲鱼店铺，掌握选品、上架、转化全流程逻辑',
      '用AI与自动化能力优化电商运营全链路',
      '关注跨境电商，研究AI在外贸选品、客服、营销中的落地',
    ],
    keywords: ['闲鱼运营', 'AI文案', '跨境电商', '数据复盘'],
  },
]

export default function Skills({ onSkillClick }) {
  const sectionRef = useRef(null)

  const handleClick = (skill) => {
    if (onSkillClick && skill.matchProject !== null) {
      onSkillClick(skill.matchProject)
      setTimeout(() => {
        const target = document.querySelector(`#project-${skill.matchProject}`)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 200)
    }
  }

  return (
    <section id="skills" className="section" ref={sectionRef}>
      <div className="container">
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div className="section-tag">Strengths</div>
          <h2 className="section-title">
            <ShinyText text="个人优势" speed={3.5} color="rgba(200,215,230,0.7)" shineColor="#ffffff" spread={110} direction="left" />
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            安全底座 × AI能力 × 业务场景<br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              下滑堆叠 · 点击探索项目
            </span>
          </p>
        </div>

        <ScrollStack
          itemDistance={60}
          itemScale={0.02}
          itemStackDistance={20}
          stackPosition="20%"
          baseScale={0.9}
          useWindowScroll={true}
        >
          {skills.map((s, i) => (
            <ScrollStackItem key={i}>
              <div
                data-cursor="glow"
                onClick={() => handleClick(s)}
                style={{
                  padding: '36px 32px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  height: '100%',
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div style={{ fontSize: '2rem', marginBottom: 16 }}>{s.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>
                    <ShinyText text={s.title} speed={4} color="rgba(210,220,235,0.65)" shineColor="#ffffff" spread={90} direction="left" />
                  </h3>
                  <span style={{ fontSize: '0.65rem', padding: '4px 10px', borderRadius: 12, color: s.tagColor, fontFamily: 'var(--font-mono)', background: s.tagBg, border: `1px solid ${s.tagBorder}`, fontWeight: 500 }}>{s.tag}</span>
                </div>
                <ul style={{ listStyle: 'none', marginTop: 16 }}>
                  {s.items.map((item, j) => (
                    <li key={j} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '6px 0', lineHeight: 1.7 }}>
                      <span style={{ color: s.tagColor, marginRight: 8, opacity: 0.7 }}>—</span>{item}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20 }}>
                  {s.keywords.map((kw, j) => (
                    <span key={j} style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.02)' }}>{kw}</span>
                  ))}
                </div>
                {s.id === 'automation' && (
                  <a href="https://github.com/sun6792" target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.76rem', color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-mono)', fontWeight: 600, justifyContent: 'center', padding: '10px 18px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.25)'; }}
                    onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                  >
                    ⌘ github.com/sun6792 <span style={{ fontSize: '0.8rem' }}>↗</span>
                  </a>
                )}
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.76rem', color: s.tagColor, fontFamily: 'var(--font-mono)', fontWeight: 600, justifyContent: 'center', padding: '10px 18px', borderRadius: 20, background: s.tagBg, border: `1px solid ${s.tagBorder}` }}>
                  点击探索对应项目 <span>→</span>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  )
}
