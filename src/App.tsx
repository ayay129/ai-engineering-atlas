import { useMemo, useState } from 'react'
import {
  AudioLines,
  Boxes,
  ChevronRight,
  Cpu,
  GitBranch,
  Layers3,
  MonitorCog,
  Network,
  Search,
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

const sections: { id: Section; label: string }[] = [
  { id: 'overview', label: '总览' },
  { id: 'capabilities', label: '算法能力' },
  { id: 'benchmarks', label: 'Benchmark' },
  { id: 'pipelines', label: '聚合服务' },
  { id: 'projects', label: '项目' },
  { id: 'timeline', label: '时间线' },
]

const statusText: Record<Status, string> = {
  production: 'Production',
  testing: 'Testing',
  development: 'Development',
}

function StatusDot({ status }: { status: Status }) {
  return (
    <span className="status-dot-wrap">
      <span className={`status-dot status-${status}`} />
      {statusText[status]}
    </span>
  )
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="section-intro">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
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
      <header className="glass-nav">
        <button className="brand-button" onClick={() => setSection('overview')} aria-label="返回总览">
          <span className="brand-symbol"><Network size={16} strokeWidth={2} /></span>
          <span>AI Engineering Atlas</span>
        </button>

        <nav className="nav-tabs" aria-label="主导航">
          {sections.map((item) => (
            <button
              key={item.id}
              className={section === item.id ? 'active' : ''}
              onClick={() => setSection(item.id)}
              aria-current={section === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="nav-meta">Internal</div>
      </header>

      <main className="main-content">
        {section === 'overview' && (
          <div className="page overview-page">
            <section className="overview-hero">
              <div className="eyebrow">ENGINEERING VALUE</div>
              <h1>让算法工作的价值，<br />一眼可见。</h1>
              <p>从原子算法、硬件适配和测试验证，到聚合服务与项目交付。这里记录的是能力如何被复用并产生业务价值。</p>
            </section>

            <section className="value-strip" aria-label="工程价值链">
              <button className="value-step" onClick={() => setSection('capabilities')}>
                <span className="value-number">{capabilities.length}</span>
                <span className="value-label">原子算法能力</span>
                <small>CV · Audio</small>
              </button>
              <span className="value-arrow">→</span>
              <button className="value-step" onClick={() => setSection('benchmarks')}>
                <span className="value-number">2</span>
                <span className="value-label">算力平台</span>
                <small>NVIDIA · Ascend</small>
              </button>
              <span className="value-arrow">→</span>
              <button className="value-step" onClick={() => setSection('pipelines')}>
                <span className="value-number">{pipelines.length}</span>
                <span className="value-label">聚合服务</span>
                <small>统一业务接口</small>
              </button>
              <span className="value-arrow">→</span>
              <button className="value-step" onClick={() => setSection('projects')}>
                <span className="value-number">{projects.length}</span>
                <span className="value-label">项目交付</span>
                <small>{consumerCount} 个可见业务消费者</small>
              </button>
            </section>

            <section className="overview-columns">
              <div className="content-group">
                <div className="group-title">
                  <div>
                    <div className="eyebrow">CAPABILITIES</div>
                    <h2>基础能力</h2>
                  </div>
                  <button className="text-button" onClick={() => setSection('capabilities')}>查看全部 <ChevronRight size={15} /></button>
                </div>

                <div className="plain-list">
                  {capabilities.map((item) => {
                    const pipelineUse = pipelines.filter((p) => p.capabilities.includes(item.id)).length
                    const projectUse = projects.filter((p) => p.capabilities.includes(item.id)).length
                    return (
                      <button className="plain-row" key={item.id} onClick={() => setSection('capabilities')}>
                        <span className="row-icon">{item.category === 'Audio' ? <AudioLines size={17} /> : <Boxes size={17} />}</span>
                        <span className="row-main">
                          <strong>{item.name}</strong>
                          <small>{item.models.join(' · ')}</small>
                        </span>
                        <span className="row-note">{pipelineUse} 聚合 · {projectUse} 项目</span>
                        <StatusDot status={item.status} />
                        <ChevronRight className="row-chevron" size={16} />
                      </button>
                    )
                  })}
                </div>
              </div>

              <aside className="signal-panel">
                <div className="eyebrow">CURRENT FOCUS</div>
                <h2>跨硬件工程化</h2>
                <p>同一套算法能力覆盖 NVIDIA 与昇腾环境，并持续沉淀性能、精度和资源消耗数据。</p>
                <div className="platform-pair">
                  <span><Cpu size={17} /> NVIDIA</span>
                  <span><Cpu size={17} /> Ascend</span>
                </div>
                <button className="primary-link" onClick={() => setSection('benchmarks')}>查看 Benchmark <ChevronRight size={15} /></button>
              </aside>
            </section>

            <section className="recent-work">
              <div className="group-title">
                <div>
                  <div className="eyebrow">RECENT</div>
                  <h2>最近产出</h2>
                </div>
                <button className="text-button" onClick={() => setSection('timeline')}>完整时间线 <ChevronRight size={15} /></button>
              </div>
              <div className="recent-grid">
                {timeline.slice(0, 3).map((item, index) => (
                  <article key={`${item.date}-${index}`}>
                    <span>{item.date}</span>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {section === 'capabilities' && (
          <div className="page">
            <SectionIntro eyebrow="CAPABILITIES" title="算法能力" description="每个能力只呈现四件事：做什么、跑在哪里、如何调用、被谁复用。" />
            <div className="search-field">
              <Search size={16} />
              <input placeholder="搜索能力、模型或平台" value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>

            <div className="detail-list">
              {filteredCapabilities.map((item) => (
                <article className="detail-row" key={item.id}>
                  <div className="detail-primary">
                    <span className="row-icon large">{item.category === 'Audio' ? <AudioLines size={19} /> : <Boxes size={19} />}</span>
                    <div>
                      <div className="detail-title-line"><h2>{item.name}</h2><StatusDot status={item.status} /></div>
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <dl className="detail-meta">
                    <div><dt>Model</dt><dd>{item.models.join(' · ')}</dd></div>
                    <div><dt>Platform</dt><dd>{item.platforms.join(' · ')}</dd></div>
                    <div><dt>API</dt><dd><code>{item.api}</code></dd></div>
                    <div><dt>Consumers</dt><dd>{item.consumers.join(' · ')}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        )}

        {section === 'benchmarks' && (
          <div className="page">
            <SectionIntro eyebrow="BENCHMARKS" title="性能与精度" description="同一能力在不同硬件上的结果放在一张表里，减少解释成本。当前数值仅为页面结构示例。" />
            <div className="table-shell">
              <table>
                <thead>
                  <tr><th>能力</th><th>硬件</th><th>模型</th><th>Latency</th><th>Throughput</th><th>Memory</th><th>Accuracy</th><th>日期</th></tr>
                </thead>
                <tbody>
                  {benchmarks.map((item, index) => (
                    <tr key={`${item.capabilityId}-${item.hardware}-${index}`}>
                      <td><strong>{capabilityName(item.capabilityId)}</strong></td>
                      <td><span className="hardware-label"><Cpu size={14} />{item.hardware}</span></td>
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
          </div>
        )}

        {section === 'pipelines' && (
          <div className="page">
            <SectionIntro eyebrow="PIPELINES" title="聚合服务" description="把原子算法组合成业务真正可以直接调用的接口。" />
            <div className="detail-list">
              {pipelines.map((item) => (
                <article className="pipeline-row" key={item.id}>
                  <div className="pipeline-heading">
                    <span className="row-icon large"><Workflow size={19} /></span>
                    <div>
                      <div className="detail-title-line"><h2>{item.name}</h2><StatusDot status={item.status} /></div>
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <div className="pipeline-chain">
                    <span>业务输入</span><ChevronRight size={15} />
                    <span className="pipeline-capabilities">{item.capabilities.map((id) => capabilityName(id)).join(' · ')}</span>
                    <ChevronRight size={15} /><code>{item.endpoint}</code>
                  </div>
                  <div className="secondary-line">Consumers · {item.consumers.join(' · ')}</div>
                </article>
              ))}
            </div>
          </div>
        )}

        {section === 'projects' && (
          <div className="page">
            <SectionIntro eyebrow="PROJECTS" title="项目交付" description="不是罗列功能，而是说明问题、工程实现和最终形成的价值。" />
            <div className="project-list">
              {projects.map((item) => (
                <article className="project-row" key={item.id}>
                  <header>
                    <div>
                      <div className="detail-title-line"><h2>{item.name}</h2><StatusDot status={item.status} /></div>
                      <p>{item.problem}</p>
                    </div>
                    <Layers3 size={20} />
                  </header>
                  <div className="project-body">
                    <div>
                      <span className="meta-label">Engineering</span>
                      <ul>{item.deliverables.map((value) => <li key={value}>{value}</li>)}</ul>
                    </div>
                    <div>
                      <span className="meta-label">Capabilities</span>
                      <p>{item.capabilities.map((id) => capabilityName(id)).join(' · ')}</p>
                    </div>
                    <div>
                      <span className="meta-label">Impact</span>
                      <p className="impact-text">{item.impact}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {section === 'timeline' && (
          <div className="page">
            <SectionIntro eyebrow="TIMELINE" title="工程时间线" description="按时间留下可追溯的能力建设、测试、重构与交付记录。" />
            <div className="timeline-list">
              {timeline.map((item, index) => (
                <article className="timeline-row" key={`${item.date}-${item.title}-${index}`}>
                  <div className="timeline-date">{item.date}</div>
                  <div className="timeline-line"><span /></div>
                  <div className="timeline-copy">
                    <div className="timeline-type">{item.type}</div>
                    <h2>{item.title}</h2>
                    <p>{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
