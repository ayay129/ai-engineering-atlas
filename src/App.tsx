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
type GraphNodeType = 'capability' | 'pipeline' | 'project'

type GraphNode = {
  id: string
  label: string
  type: GraphNodeType
  x: number
  y: number
  subtitle?: string
}

type GraphEdge = {
  id: string
  source: string
  target: string
  path: string
}

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

const graphNodes: GraphNode[] = [
  { id: 'object-detection', label: '目标检测', type: 'capability', x: 110, y: 118, subtitle: 'CV' },
  { id: 'image-embedding', label: '图向量', type: 'capability', x: 305, y: 118, subtitle: 'CV' },
  { id: 'face-recognition', label: '人脸识别', type: 'capability', x: 500, y: 118, subtitle: 'CV' },
  { id: 'ocr', label: 'OCR', type: 'capability', x: 695, y: 118, subtitle: 'CV' },
  { id: 'asr', label: 'ASR', type: 'capability', x: 890, y: 118, subtitle: 'Audio' },
  { id: 'video-analysis', label: '视频智能分析聚合服务', type: 'pipeline', x: 430, y: 315, subtitle: 'Aggregated Service' },
  { id: 'video-review-platform', label: '视频智能研判平台', type: 'project', x: 300, y: 520, subtitle: 'Project' },
  { id: 'ascend-adaptation', label: '昇腾算法能力适配', type: 'project', x: 735, y: 520, subtitle: 'Direct Project' },
]

const graphEdges: GraphEdge[] = [
  { id: 'od-pipeline', source: 'object-detection', target: 'video-analysis', path: 'M110 151 C110 230 430 220 430 280' },
  { id: 'embed-pipeline', source: 'image-embedding', target: 'video-analysis', path: 'M305 151 C305 225 430 225 430 280' },
  { id: 'face-pipeline', source: 'face-recognition', target: 'video-analysis', path: 'M500 151 C500 225 430 225 430 280' },
  { id: 'ocr-pipeline', source: 'ocr', target: 'video-analysis', path: 'M695 151 C695 225 430 220 430 280' },
  { id: 'asr-pipeline', source: 'asr', target: 'video-analysis', path: 'M890 151 C890 230 430 210 430 280' },
  { id: 'pipeline-video-project', source: 'video-analysis', target: 'video-review-platform', path: 'M430 350 C430 430 300 430 300 485' },
  { id: 'od-ascend', source: 'object-detection', target: 'ascend-adaptation', path: 'M110 151 C110 340 735 340 735 485' },
  { id: 'embed-ascend', source: 'image-embedding', target: 'ascend-adaptation', path: 'M305 151 C305 330 735 350 735 485' },
  { id: 'face-ascend', source: 'face-recognition', target: 'ascend-adaptation', path: 'M500 151 C500 325 735 365 735 485' },
  { id: 'ocr-ascend', source: 'ocr', target: 'ascend-adaptation', path: 'M695 151 C695 320 735 390 735 485' },
  { id: 'asr-ascend', source: 'asr', target: 'ascend-adaptation', path: 'M890 151 C890 320 735 390 735 485' },
]

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

function getNodeStatus(node: GraphNode): Status | undefined {
  if (node.type === 'capability') return capabilities.find((item) => item.id === node.id)?.status
  if (node.type === 'pipeline') return pipelines.find((item) => item.id === node.id)?.status
  return projects.find((item) => item.id === node.id)?.status
}

function getRelatedGraph(startId: string | null) {
  const nodeIds = new Set<string>()
  const edgeIds = new Set<string>()
  if (!startId) return { nodeIds, edgeIds }

  nodeIds.add(startId)

  const walkUp = (id: string) => {
    graphEdges.filter((edge) => edge.target === id).forEach((edge) => {
      if (edgeIds.has(edge.id)) return
      edgeIds.add(edge.id)
      nodeIds.add(edge.source)
      walkUp(edge.source)
    })
  }

  const walkDown = (id: string) => {
    graphEdges.filter((edge) => edge.source === id).forEach((edge) => {
      if (edgeIds.has(edge.id)) return
      edgeIds.add(edge.id)
      nodeIds.add(edge.target)
      walkDown(edge.target)
    })
  }

  walkUp(startId)
  walkDown(startId)
  return { nodeIds, edgeIds }
}

function ValueGraph() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [lockedNode, setLockedNode] = useState<string | null>(null)
  const focusedNode = hoveredNode ?? lockedNode
  const related = getRelatedGraph(focusedNode)

  return (
    <section className="value-graph-section">
      <div className="graph-header">
        <div>
          <div className="eyebrow">VALUE GRAPH</div>
          <h2>能力如何流向项目</h2>
          <p>聚合服务是可选层。项目既可以使用组合服务，也可以直接复用原子算法。</p>
        </div>
        <div className="graph-summary">{capabilities.length} 原子能力 · {pipelines.length} 聚合服务 · {projects.length} 项目</div>
      </div>

      <div className="graph-scroll">
        <div className="value-graph-canvas" onClick={() => setLockedNode(null)}>
          <div className="graph-layer-label layer-capability">原子算法</div>
          <div className="graph-layer-label layer-pipeline">聚合服务</div>
          <div className="graph-layer-label layer-project">项目交付</div>

          <svg className="graph-lines" viewBox="0 0 1000 600" aria-hidden="true">
            {graphEdges.map((edge) => {
              const isActive = focusedNode ? related.edgeIds.has(edge.id) : false
              const isDimmed = focusedNode ? !isActive : false
              return (
                <path
                  key={edge.id}
                  d={edge.path}
                  className={`graph-edge ${isActive ? 'is-active' : ''} ${isDimmed ? 'is-dimmed' : ''}`}
                />
              )
            })}
          </svg>

          {graphNodes.map((node) => {
            const status = getNodeStatus(node)
            const isRelated = !focusedNode || related.nodeIds.has(node.id)
            const isFocused = focusedNode === node.id
            const isLocked = lockedNode === node.id
            return (
              <button
                key={node.id}
                type="button"
                className={`graph-node graph-node-${node.type} ${isRelated ? '' : 'is-dimmed'} ${isFocused ? 'is-focused' : ''} ${isLocked ? 'is-locked' : ''}`}
                style={{ left: node.x, top: node.y }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={(event) => {
                  event.stopPropagation()
                  setLockedNode((current) => current === node.id ? null : node.id)
                }}
              >
                <span className="graph-node-title">{node.label}</span>
                <span className="graph-node-meta">
                  {status && <span className={`mini-dot status-${status}`} />}
                  {node.subtitle}
                </span>
              </button>
            )
          })}

          <div className="graph-hint">悬停查看上下游路径 · 点击节点可锁定</div>
        </div>
      </div>
    </section>
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
              <h1>让算法工作的价值，<br />一眼可见。</h1>
              <p>从原子能力到业务项目，直接看到用了哪些算法、怎么组合，以及最终支撑了哪些交付。</p>
            </section>

            <ValueGraph />

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
    </div>
  )
}

export default App
