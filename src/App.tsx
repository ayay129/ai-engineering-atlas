import { useMemo, useState } from 'react'
import {
  Activity,
  AudioLines,
  Boxes,
  ChevronRight,
  Cpu,
  GitBranch,
  Layers3,
  MonitorCog,
  Network,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react'
import {
  benchmarks,
  capabilities,
  capabilityName,
  pipelines,
  projects,
  timeline,
  type Status,
} from './data'

type Section = 'overview' | 'capabilities' | 'benchmarks' | 'pipelines' | 'projects' | 'timeline'

const sections: { id: Section; label: string; icon: typeof Activity }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'capabilities', label: 'Capabilities', icon: Boxes },
  { id: 'benchmarks', label: 'Benchmarks', icon: MonitorCog },
  { id: 'pipelines', label: 'Pipelines', icon: Workflow },
  { id: 'projects', label: 'Projects', icon: Layers3 },
  { id: 'timeline', label: 'Timeline', icon: GitBranch },
]

const statusText: Record<Status, string> = {
  production: 'Production',
  testing: 'Testing',
  development: 'Development',
}

function StatusBadge({ status }: { status: Status }) {
  return <span className={`status status-${status}`}>{statusText[status]}</span>
}

function MetricCard({ label, value, hint, icon: Icon }: { label: string; value: string | number; hint: string; icon: typeof Activity }) {
  return (
    <article className="metric-card panel">
      <div className="metric-icon"><Icon size={18} /></div>
      <div>
        <div className="metric-label">{label}</div>
        <div className="metric-value">{value}</div>
        <div className="metric-hint">{hint}</div>
      </div>
    </article>
  )
}

function App() {
  const [section, setSection] = useState<Section>('overview')
  const [query, setQuery] = useState('')

  const filteredCapabilities = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return capabilities
    return capabilities.filter((item) =>
      [item.name, item.description, item.category, ...item.models, ...item.platforms]
        .join(' ')
        .toLowerCase()
        .includes(value),
    )
  }, [query])

  const consumerCount = new Set([
    ...capabilities.flatMap((item) => item.consumers),
    ...pipelines.flatMap((item) => item.consumers),
  ]).size

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Network size={19} /></div>
          <div>
            <div className="brand-title">AI Engineering Atlas</div>
            <div className="brand-subtitle">Engineering value, mapped.</div>
          </div>
        </div>

        <nav className="nav-list">
          {sections.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.id} className={`nav-item ${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id)}>
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-foot">
          <div className="eyebrow">Core idea</div>
          <p>原子能力 → 硬件验证 → 聚合服务 → 业务项目 → 可复用价值</p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="eyebrow">Internal Engineering Portal</div>
            <h1>{sections.find((item) => item.id === section)?.label}</h1>
          </div>
          <div className="topbar-chip"><ShieldCheck size={15} /> Data-driven · Evidence-first</div>
        </header>

        {section === 'overview' && (
          <div className="content-stack">
            <section className="hero panel">
              <div className="hero-copy">
                <div className="eyebrow">VALUE MAP</div>
                <h2>把“做了很多算法工作”变成一张可追溯的工程价值地图。</h2>
                <p>从算法能力、跨硬件适配、性能与精度验证，一直串到聚合服务和最终业务项目。这里展示的不是工作流水账，而是能力如何被复用、组合并产生业务价值。</p>
              </div>
              <div className="hero-badge">
                <Sparkles size={22} />
                <strong>Atlas v0.1</strong>
                <span>Static data model first</span>
              </div>
            </section>

            <section className="metric-grid">
              <MetricCard label="原子算法能力" value={capabilities.length} hint="CV + Audio" icon={Boxes} />
              <MetricCard label="聚合服务" value={pipelines.length} hint="统一业务接口" icon={Workflow} />
              <MetricCard label="项目 / 交付" value={projects.length} hint="独立项目与业务闭环" icon={Layers3} />
              <MetricCard label="业务消费者" value={consumerCount} hint="可见的复用范围" icon={ServerCog} />
            </section>

            <section className="grid-2">
              <article className="panel section-card">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow">VALUE CHAIN</div>
                    <h3>工程价值关系</h3>
                  </div>
                  <Network size={19} />
                </div>
                <div className="value-chain">
                  <div className="chain-group project-layer">
                    <div className="chain-kicker">Projects</div>
                    {projects.map((item) => <div className="chain-node" key={item.id}>{item.name}</div>)}
                  </div>
                  <div className="chain-arrow">↓</div>
                  <div className="chain-group pipeline-layer">
                    <div className="chain-kicker">Pipelines</div>
                    {pipelines.map((item) => <div className="chain-node" key={item.id}>{item.name}</div>)}
                  </div>
                  <div className="chain-arrow">↓</div>
                  <div className="capability-cloud">
                    {capabilities.map((item) => <span key={item.id}>{item.name}</span>)}
                  </div>
                  <div className="chain-arrow">↓</div>
                  <div className="hardware-row">
                    <span><Cpu size={15} /> NVIDIA</span>
                    <span><Cpu size={15} /> Ascend</span>
                  </div>
                </div>
              </article>

              <article className="panel section-card">
                <div className="section-heading">
                  <div>
                    <div className="eyebrow">REUSE</div>
                    <h3>能力复用视角</h3>
                  </div>
                  <GitBranch size={19} />
                </div>
                <div className="reuse-list">
                  {capabilities.map((item) => {
                    const pipelineUse = pipelines.filter((p) => p.capabilities.includes(item.id)).length
                    const projectUse = projects.filter((p) => p.capabilities.includes(item.id)).length
                    return (
                      <div className="reuse-row" key={item.id}>
                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.category} · {item.platforms.join(' / ')}</span>
                        </div>
                        <div className="reuse-numbers">
                          <span>{pipelineUse} 聚合</span>
                          <span>{projectUse} 项目</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </article>
            </section>
          </div>
        )}

        {section === 'capabilities' && (
          <div className="content-stack">
            <div className="toolbar">
              <div className="search-box"><Search size={16} /><input placeholder="搜索能力、模型、平台..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
              <div className="toolbar-note">每个能力都应关联 API、平台、Benchmark 和下游消费者。</div>
            </div>
            <section className="card-grid">
              {filteredCapabilities.map((item) => (
                <article className="panel capability-card" key={item.id}>
                  <div className="card-topline">
                    <span className="category-chip">{item.category === 'Audio' ? <AudioLines size={14} /> : <Boxes size={14} />}{item.category}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="detail-block"><span>Models</span><strong>{item.models.join(' · ')}</strong></div>
                  <div className="chip-row">{item.platforms.map((platform) => <span key={platform}>{platform}</span>)}</div>
                  <div className="detail-block"><span>API</span><code>{item.api}</code></div>
                  <div className="detail-block"><span>Consumers</span><strong>{item.consumers.join(' / ')}</strong></div>
                  <div className="metric-tags">{item.metrics.map((metric) => <span key={metric}>{metric}</span>)}</div>
                </article>
              ))}
            </section>
          </div>
        )}

        {section === 'benchmarks' && (
          <div className="content-stack">
            <section className="panel section-card">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">PERFORMANCE MATRIX</div>
                  <h3>NVIDIA × Ascend Benchmark</h3>
                </div>
                <MonitorCog size={19} />
              </div>
              <p className="muted">当前数值均为页面结构示例，不代表正式生产测试结果。后续应由 benchmark JSON 或 Agent 自动写入。</p>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>能力</th><th>硬件</th><th>模型</th><th>Latency</th><th>Throughput</th><th>Memory</th><th>Accuracy</th><th>日期</th></tr>
                  </thead>
                  <tbody>
                    {benchmarks.map((item, index) => (
                      <tr key={`${item.capabilityId}-${item.hardware}-${index}`}>
                        <td><strong>{capabilityName(item.capabilityId)}</strong></td>
                        <td><span className={`vendor vendor-${item.vendor.toLowerCase()}`}>{item.hardware}</span></td>
                        <td>{item.model}</td>
                        <td>{item.latencyMs ? `${item.latencyMs} ms` : '—'}</td>
                        <td>{item.throughput !== undefined ? `${item.throughput} ${item.throughputUnit ?? ''}` : '—'}</td>
                        <td>{item.memoryGb ? `${item.memoryGb} GB` : '—'}</td>
                        <td>{item.accuracyLabel}: {item.accuracyValue}</td>
                        <td>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {section === 'pipelines' && (
          <div className="content-stack">
            {pipelines.map((item) => (
              <article className="panel section-card" key={item.id}>
                <div className="section-heading">
                  <div><div className="eyebrow">AGGREGATED SERVICE</div><h3>{item.name}</h3></div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="lead">{item.description}</p>
                <div className="pipeline-flow">
                  <div className="pipeline-source">Business Input</div>
                  <ChevronRight size={18} />
                  <div className="pipeline-capabilities">{item.capabilities.map((id) => <span key={id}>{capabilityName(id)}</span>)}</div>
                  <ChevronRight size={18} />
                  <div className="pipeline-endpoint"><code>{item.endpoint}</code><small>统一业务接口</small></div>
                </div>
                <div className="detail-block"><span>Consumers</span><strong>{item.consumers.join(' / ')}</strong></div>
              </article>
            ))}
          </div>
        )}

        {section === 'projects' && (
          <div className="content-stack">
            <section className="card-grid project-grid">
              {projects.map((item) => (
                <article className="panel project-card" key={item.id}>
                  <div className="section-heading"><div><div className="eyebrow">CASE STUDY</div><h3>{item.name}</h3></div><StatusBadge status={item.status} /></div>
                  <div className="project-section"><span>Problem</span><p>{item.problem}</p></div>
                  <div className="project-section"><span>Engineering</span><ul>{item.deliverables.map((value) => <li key={value}>{value}</li>)}</ul></div>
                  <div className="project-section"><span>Capabilities</span><div className="chip-row">{item.capabilities.map((id) => <span key={id}>{capabilityName(id)}</span>)}</div></div>
                  <div className="impact-box"><strong>Impact</strong><p>{item.impact}</p></div>
                </article>
              ))}
            </section>
          </div>
        )}

        {section === 'timeline' && (
          <div className="content-stack">
            <section className="panel section-card">
              <div className="section-heading"><div><div className="eyebrow">ENGINEERING HISTORY</div><h3>交付时间线</h3></div><GitBranch size={19} /></div>
              <div className="timeline">
                {timeline.map((item, index) => (
                  <div className="timeline-item" key={`${item.date}-${item.title}-${index}`}>
                    <div className="timeline-marker" />
                    <div className="timeline-date">{item.date}</div>
                    <div className="timeline-content"><span>{item.type}</span><h4>{item.title}</h4><p>{item.detail}</p></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
