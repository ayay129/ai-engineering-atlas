import { useMemo, useState } from 'react'
import {
  AudioLines,
  Boxes,
  ChevronRight,
  Cpu,
  Layers3,
  Network,
  Search,
  Workflow,
  X,
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
import './overview.css'

type Section = 'overview' | 'capabilities' | 'benchmarks' | 'pipelines' | 'projects' | 'timeline'

type ProjectRoute = {
  projectId: string
  capabilityIds: string[]
  pipelineId?: string
}

const sections: { id: Section; label: string }[] = [
  { id: 'overview', label: '总览' },
  { id: 'capabilities', label: '算法能力' },
  { id: 'benchmarks', label: 'Benchmark' },
  { id: 'pipelines', label: '聚合服务' },
  { id: 'projects', label: '项目' },
  { id: 'timeline', label: '时间线' },
]

const projectRoutes: ProjectRoute[] = [
  {
    projectId: 'video-review-platform',
    capabilityIds: ['object-detection', 'image-embedding', 'face-recognition', 'ocr', 'asr'],
    pipelineId: 'video-analysis',
  },
  {
    projectId: 'ascend-adaptation',
    capabilityIds: ['object-detection', 'image-embedding', 'face-recognition', 'ocr', 'asr'],
  },
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

function MiniProjectGraph({ route }: { route: ProjectRoute }) {
  const project = projects.find((item) => item.id === route.projectId)!
  const pipeline = route.pipelineId ? pipelines.find((item) => item.id === route.pipelineId) : undefined

  return (
    <div className={`mini-project-graph ${pipeline ? 'has-pipeline' : 'direct-project'}`}>
      <div className="mini-layer mini-capabilities">
        {route.capabilityIds.map((id) => (
          <span className="mini-node" key={id}>{capabilityName(id)}</span>
        ))}
      </div>

      <div className="mini-connectors" aria-hidden="true">
        {route.capabilityIds.map((_, index) => <i key={index} />)}
      </div>

      {pipeline ? (
        <>
          <div className="mini-layer mini-pipeline"><span>{pipeline.name}</span></div>
          <div className="mini-trunk" aria-hidden="true" />
        </>
      ) : (
        <div className="mini-direct-label">Direct</div>
      )}

      <div className="mini-layer mini-project"><span>{project.name}</span></div>
    </div>
  )
}

function ProjectGraphCard({ route, onOpen }: { route: ProjectRoute; onOpen: () => void }) {
  const project = projects.find((item) => item.id === route.projectId)!
  const pipeline = route.pipelineId ? pipelines.find((item) => item.id === route.pipelineId) : undefined

  return (
    <button className="project-graph-card" type="button" onClick={onOpen}>
      <div className="project-card-top">
        <div>
          <div className="eyebrow">PROJECT</div>
          <h3>{project.name}</h3>
        </div>
        <StatusDot status={project.status} />
      </div>

      <MiniProjectGraph route={route} />

      <div className="project-card-foot">
        <span>{route.capabilityIds.length} 个算法{pipeline ? ` · 1 个聚合服务` : ' · 直接组合'}</span>
        <span className="open-label">展开 <ChevronRight size={14} /></span>
      </div>
    </button>
  )
}

function ExpandedProjectGraph({ route, onClose }: { route: ProjectRoute; onClose: () => void }) {
  const project = projects.find((item) => item.id === route.projectId)!
  const pipeline = route.pipelineId ? pipelines.find((item) => item.id === route.pipelineId) : undefined
  const xs = [120, 310, 500, 690, 880]
  const capabilityNodes = route.capabilityIds.map((id, index) => ({ id, x: xs[index] ?? 120 + index * 150 }))
  const targetX = pipeline ? 500 : 690
  const targetY = pipeline ? 310 : 510

  return (
    <div className="project-modal-backdrop" onClick={onClose}>
      <section className="project-modal" onClick={(event) => event.stopPropagation()}>
        <header className="project-modal-header">
          <div>
            <div className="eyebrow">PROJECT VALUE GRAPH</div>
            <h2>{project.name}</h2>
            <p>{project.problem}</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="关闭"><X size={18} /></button>
        </header>

        <div className="expanded-graph-canvas">
          <div className="graph-layer-label graph-label-capability">原子算法</div>
          <div className="graph-layer-label graph-label-pipeline">聚合服务</div>
          <div className="graph-layer-label graph-label-project">项目交付</div>

          <svg className="expanded-lines" viewBox="0 0 1000 600" aria-hidden="true">
            {capabilityNodes.map((node) => (
              <path
                key={`${node.id}-main`}
                d={`M${node.x} 150 C${node.x} 230 ${targetX} 230 ${targetX} ${targetY - 35}`}
                className="expanded-edge"
              />
            ))}
            {pipeline && <path d="M500 345 C500 425 500 425 500 485" className="expanded-edge strong" />}
          </svg>

          {capabilityNodes.map((node) => {
            const capability = capabilities.find((item) => item.id === node.id)!
            return (
              <div className="expanded-node capability" style={{ left: node.x, top: 116 }} key={node.id}>
                <strong>{capability.name}</strong>
                <span><i className={`mini-dot status-${capability.status}`} />{capability.category}</span>
              </div>
            )
          })}

          {pipeline && (
            <div className="expanded-node pipeline" style={{ left: 500, top: 310 }}>
              <strong>{pipeline.name}</strong>
              <span><i className={`mini-dot status-${pipeline.status}`} />Aggregated Service</span>
            </div>
          )}

          <div className="expanded-node project" style={{ left: pipeline ? 500 : 690, top: 520 }}>
            <strong>{project.name}</strong>
            <span><i className={`mini-dot status-${project.status}`} />{pipeline ? 'Project' : 'Direct Project'}</span>
          </div>
        </div>
      </section>
    </div>
  )
}

function App() {
  const [section, setSection] = useState<Section>('overview')
  const [query, setQuery] = useState('')
  const [openProjectId, setOpenProjectId] = useState<string | null>(null)

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

  const openedRoute = openProjectId ? projectRoutes.find((item) => item.projectId === openProjectId) : undefined

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
            <section className="overview-hero overview-hero-compact">
              <div className="eyebrow">ENGINEERING VALUE</div>
              <h1>项目用了什么，<br />一眼可见。</h1>
              <p>按项目查看算法组合。每张卡片是一条缩略价值链，点击后展开完整的原子算法 → 聚合服务 → 项目关系。</p>
            </section>

            <section className="project-overview-section">
              <div className="project-overview-head">
                <div>
                  <div className="eyebrow">SUPPORTED PROJECTS</div>
                  <h2>项目关系总览</h2>
                </div>
                <span>{projectRoutes.length} 个项目</span>
              </div>

              <div className="project-graph-grid">
                {projectRoutes.map((route) => (
                  <ProjectGraphCard key={route.projectId} route={route} onOpen={() => setOpenProjectId(route.projectId)} />
                ))}
              </div>
            </section>

            <section className="recent-work overview-recent">
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

      {openedRoute && <ExpandedProjectGraph route={openedRoute} onClose={() => setOpenProjectId(null)} />}
    </div>
  )
}

export default App
