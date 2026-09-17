import { useEffect, useMemo, useState } from 'react'
import {
  Boxes,
  ChevronRight,
  CirclePlus,
  Cpu,
  Network,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
} from 'lucide-react'
import {
  algorithms as seedAlgorithms,
  benchmarks,
  pipelines,
  projects,
  timeline,
  type Algorithm,
  type AlgorithmCategory,
  type PlatformImplementation,
  type Status,
} from './data'
import './overview.css'
import './algorithm-editor.css'

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
  deprecated: 'Deprecated',
}

const emptyPlatform = (platform = ''): PlatformImplementation => ({
  id: crypto.randomUUID(),
  platform,
  status: 'development',
  hardware: '',
  serviceVersion: '',
  gitlab: '',
  branch: '',
  modelName: '',
  modelVersion: '',
  runtime: '',
  framework: '',
  image: '',
  containerPort: '',
  healthcheck: '',
})

const emptyAlgorithm = (): Algorithm => ({
  id: crypto.randomUUID(),
  name: '',
  englishName: '',
  category: 'CV',
  status: 'development',
  description: '',
  owner: '',
  api: {
    protocol: 'HTTP',
    method: 'POST',
    endpoint: '',
  },
  implementations: [emptyPlatform('NVIDIA'), emptyPlatform('Ascend')],
  updatedAt: '',
})

function StatusDot({ status }: { status: Status }) {
  return (
    <span className="status-dot-wrap">
      <span className={`status-dot status-${status}`} />
      {statusText[status]}
    </span>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <div className="empty-symbol"><Network size={18} /></div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="editor-field">
      <span className="editor-label">{label}</span>
      {children}
      {hint && <span className="editor-hint">{hint}</span>}
    </label>
  )
}

function PlatformEditor({
  value,
  onChange,
  onRemove,
}: {
  value: PlatformImplementation
  onChange: (value: PlatformImplementation) => void
  onRemove: () => void
}) {
  const patch = (changes: Partial<PlatformImplementation>) => onChange({ ...value, ...changes })

  return (
    <article className="platform-editor-card">
      <header className="platform-editor-head">
        <div>
          <div className="platform-title-line">
            <Cpu size={17} />
            <input
              className="platform-name-input"
              placeholder="平台名称，如 NVIDIA"
              value={value.platform}
              onChange={(event) => patch({ platform: event.target.value })}
            />
          </div>
          <p>这个平台上的独立工程实现。</p>
        </div>
        <div className="platform-actions">
          <select value={value.status} onChange={(event) => patch({ status: event.target.value as Status })}>
            <option value="development">Development</option>
            <option value="testing">Testing</option>
            <option value="production">Production</option>
            <option value="deprecated">Deprecated</option>
          </select>
          <button className="icon-button" type="button" onClick={onRemove} aria-label="删除平台"><Trash2 size={15} /></button>
        </div>
      </header>

      <div className="platform-editor-grid">
        <Field label="支持硬件"><input placeholder="A10 / L20" value={value.hardware} onChange={(e) => patch({ hardware: e.target.value })} /></Field>
        <Field label="服务版本"><input placeholder="v1.4.2" value={value.serviceVersion} onChange={(e) => patch({ serviceVersion: e.target.value })} /></Field>
        <Field label="GitLab"><input placeholder="gitlab.xxx/cv/detection" value={value.gitlab} onChange={(e) => patch({ gitlab: e.target.value })} /></Field>
        <Field label="Branch"><input placeholder="main" value={value.branch} onChange={(e) => patch({ branch: e.target.value })} /></Field>
        <Field label="模型"><input placeholder="YOLO xxx" value={value.modelName} onChange={(e) => patch({ modelName: e.target.value })} /></Field>
        <Field label="模型版本"><input placeholder="例如 2026.09 / v3" value={value.modelVersion} onChange={(e) => patch({ modelVersion: e.target.value })} /></Field>
        <Field label="Runtime"><input placeholder="CUDA 12.x / CANN 8.x" value={value.runtime} onChange={(e) => patch({ runtime: e.target.value })} /></Field>
        <Field label="Framework"><input placeholder="TensorRT / ACL / torch-npu" value={value.framework} onChange={(e) => patch({ framework: e.target.value })} /></Field>
        <Field label="镜像" hint="填写这个平台当前推荐部署的完整镜像地址。">
          <input placeholder="harbor.xxx/cv/detection-nvidia:v1.4.2" value={value.image} onChange={(e) => patch({ image: e.target.value })} />
        </Field>
        <Field label="容器默认端口"><input placeholder="8000" value={value.containerPort} onChange={(e) => patch({ containerPort: e.target.value })} /></Field>
        <Field label="Healthcheck"><input placeholder="/health" value={value.healthcheck} onChange={(e) => patch({ healthcheck: e.target.value })} /></Field>
      </div>
    </article>
  )
}

function AlgorithmEditor({
  algorithm,
  onChange,
  onSave,
  onCancel,
}: {
  algorithm: Algorithm
  onChange: (algorithm: Algorithm) => void
  onSave: () => void
  onCancel: () => void
}) {
  const patch = (changes: Partial<Algorithm>) => onChange({ ...algorithm, ...changes })

  return (
    <div className="algorithm-editor">
      <div className="editor-toolbar">
        <button className="back-button" type="button" onClick={onCancel}>算法能力</button>
        <ChevronRight size={14} />
        <span>{algorithm.name || '新建算法'}</span>
        <ChevronRight size={14} />
        <span>编辑</span>
        <div className="editor-toolbar-spacer" />
        <button className="save-button" type="button" onClick={onSave}><Save size={15} />保存</button>
      </div>

      <header className="editor-hero">
        <div className="eyebrow">ALGORITHM CAPABILITY</div>
        <h1>{algorithm.name || '新建算法能力'}</h1>
        <p>公共信息描述“这是什么能力”；平台实现描述“它在不同算力平台上如何实现”。</p>
      </header>

      <section className="editor-section">
        <div className="editor-section-head">
          <div><span>01</span><h2>基础信息</h2></div>
          <p>与硬件平台无关的公共信息。</p>
        </div>
        <div className="editor-panel editor-grid">
          <Field label="名称"><input placeholder="目标检测" value={algorithm.name} onChange={(e) => patch({ name: e.target.value })} /></Field>
          <Field label="英文名"><input placeholder="Object Detection" value={algorithm.englishName} onChange={(e) => patch({ englishName: e.target.value })} /></Field>
          <Field label="分类">
            <select value={algorithm.category} onChange={(e) => patch({ category: e.target.value as AlgorithmCategory })}>
              <option value="CV">CV</option><option value="Audio">Audio</option><option value="Multimodal">Multimodal</option><option value="NLP">NLP</option><option value="Other">Other</option>
            </select>
          </Field>
          <Field label="状态">
            <select value={algorithm.status} onChange={(e) => patch({ status: e.target.value as Status })}>
              <option value="development">Development</option><option value="testing">Testing</option><option value="production">Production</option><option value="deprecated">Deprecated</option>
            </select>
          </Field>
          <Field label="Owner"><input placeholder="负责人" value={algorithm.owner} onChange={(e) => patch({ owner: e.target.value })} /></Field>
          <Field label="描述"><textarea placeholder="图片 / 视频目标检测能力" value={algorithm.description} onChange={(e) => patch({ description: e.target.value })} /></Field>
        </div>
      </section>

      <section className="editor-section">
        <div className="editor-section-head">
          <div><span>02</span><h2>标准接口</h2></div>
          <p>不同平台尽量保持一致的业务调用契约。</p>
        </div>
        <div className="editor-panel editor-grid api-grid">
          <Field label="Protocol"><input placeholder="HTTP" value={algorithm.api.protocol} onChange={(e) => patch({ api: { ...algorithm.api, protocol: e.target.value } })} /></Field>
          <Field label="Method"><input placeholder="POST" value={algorithm.api.method} onChange={(e) => patch({ api: { ...algorithm.api, method: e.target.value } })} /></Field>
          <Field label="Endpoint"><input placeholder="/api/detection" value={algorithm.api.endpoint} onChange={(e) => patch({ api: { ...algorithm.api, endpoint: e.target.value } })} /></Field>
        </div>
      </section>

      <section className="editor-section">
        <div className="editor-section-head platform-section-head">
          <div><span>03</span><h2>平台实现</h2></div>
          <button
            className="add-platform-button"
            type="button"
            onClick={() => patch({ implementations: [...algorithm.implementations, emptyPlatform()] })}
          ><Plus size={15} />添加平台</button>
        </div>

        <div className="platform-editor-list">
          {algorithm.implementations.map((implementation, index) => (
            <PlatformEditor
              key={implementation.id}
              value={implementation}
              onChange={(next) => {
                const implementations = [...algorithm.implementations]
                implementations[index] = next
                patch({ implementations })
              }}
              onRemove={() => patch({ implementations: algorithm.implementations.filter((_, itemIndex) => itemIndex !== index) })}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function AlgorithmDetail({
  algorithm,
  onBack,
  onEdit,
}: {
  algorithm: Algorithm
  onBack: () => void
  onEdit: () => void
}) {
  const [platformId, setPlatformId] = useState(algorithm.implementations[0]?.id ?? '')
  const activePlatform = algorithm.implementations.find((item) => item.id === platformId) ?? algorithm.implementations[0]
  const sharedPort = algorithm.implementations.find((item) => item.containerPort)?.containerPort || '—'
  const endpoint = algorithm.api.endpoint || '/'
  const callAddress = sharedPort === '—' ? `http://<host>${endpoint}` : `http://<host>:${sharedPort}${endpoint}`

  return (
    <div className="algorithm-detail compact-detail">
      <div className="editor-toolbar">
        <button className="back-button" type="button" onClick={onBack}>算法能力</button>
        <ChevronRight size={14} />
        <span>{algorithm.name}</span>
        <div className="editor-toolbar-spacer" />
        <button className="detail-edit-button" type="button" onClick={onEdit}><Pencil size={14} />编辑</button>
      </div>

      <header className="compact-detail-hero">
        <div className="compact-title-row">
          <div>
            <h1>{algorithm.name}</h1>
            <p>{algorithm.englishName || '—'} · {algorithm.category}</p>
          </div>
          <StatusDot status={algorithm.status} />
        </div>
        {algorithm.description && <p className="compact-description">{algorithm.description}</p>}
      </header>

      <section className="compact-call-section">
        <h2>如何调用</h2>
        <div className="call-card">
          <div className="call-command">
            <span className="method-badge">{algorithm.api.method || 'POST'}</span>
            <code>{callAddress}</code>
          </div>
          <div className="call-meta">
            <span><small>Protocol</small><strong>{algorithm.api.protocol || '—'}</strong></span>
            <span><small>Port</small><strong>{sharedPort}</strong></span>
            <span><small>Endpoint</small><strong>{endpoint}</strong></span>
          </div>
        </div>
      </section>

      <section className="compact-platform-section">
        <div className="compact-section-head">
          <h2>平台实现</h2>
          <div className="platform-tabs" role="tablist" aria-label="平台实现">
            {algorithm.implementations.map((implementation) => (
              <button
                key={implementation.id}
                type="button"
                role="tab"
                aria-selected={activePlatform?.id === implementation.id}
                className={activePlatform?.id === implementation.id ? 'active' : ''}
                onClick={() => setPlatformId(implementation.id)}
              >
                {implementation.platform || '未命名平台'}
              </button>
            ))}
          </div>
        </div>

        {activePlatform ? (
          <div className="platform-summary-card">
            <div className="platform-summary-head">
              <div className="platform-summary-title"><Cpu size={17} /><strong>{activePlatform.platform || '未命名平台'}</strong></div>
              <StatusDot status={activePlatform.status} />
            </div>
            <dl className="platform-summary-list">
              <div><dt>支持硬件</dt><dd>{activePlatform.hardware || '—'}</dd></div>
              <div><dt>服务版本</dt><dd>{activePlatform.serviceVersion || '—'}</dd></div>
              <div><dt>Runtime</dt><dd>{activePlatform.runtime || '—'}</dd></div>
              <div><dt>Framework</dt><dd>{activePlatform.framework || '—'}</dd></div>
              <div><dt>模型</dt><dd>{activePlatform.modelName || '—'}</dd></div>
              <div><dt>模型版本</dt><dd>{activePlatform.modelVersion || '—'}</dd></div>
              <div className="wide"><dt>镜像</dt><dd><code>{activePlatform.image || '—'}</code></dd></div>
              <div className="wide"><dt>GitLab</dt><dd><code>{activePlatform.gitlab || '—'}</code></dd></div>
              <div><dt>Branch</dt><dd><code>{activePlatform.branch || '—'}</code></dd></div>
              <div><dt>Healthcheck</dt><dd><code>{activePlatform.healthcheck || '—'}</code></dd></div>
            </dl>
          </div>
        ) : (
          <div className="platform-summary-card empty-platform-summary">还没有平台实现</div>
        )}
      </section>
    </div>
  )
}

function App() {
  const [section, setSection] = useState<Section>('overview')
  const [query, setQuery] = useState('')
  const [algorithms, setAlgorithms] = useState<Algorithm[]>(() => {
    const local = localStorage.getItem('atlas.algorithms')
    if (local) {
      try { return JSON.parse(local) as Algorithm[] } catch { return seedAlgorithms }
    }
    return seedAlgorithms
  })
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Algorithm | null>(null)

  useEffect(() => {
    localStorage.setItem('atlas.algorithms', JSON.stringify(algorithms))
  }, [algorithms])

  const filteredAlgorithms = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return algorithms
    return algorithms.filter((item) => [item.name, item.englishName, item.category, item.description, ...item.implementations.map((p) => p.platform)].join(' ').toLowerCase().includes(value))
  }, [algorithms, query])

  const viewingAlgorithm = viewingId ? algorithms.find((item) => item.id === viewingId) ?? null : null

  const saveAlgorithm = () => {
    if (!editing) return
    const saved: Algorithm = { ...editing, updatedAt: new Date().toISOString().slice(0, 10) }
    setAlgorithms((current) => current.some((item) => item.id === saved.id)
      ? current.map((item) => item.id === saved.id ? saved : item)
      : [...current, saved])
    setViewingId(saved.id)
    setEditing(null)
  }

  const changeSection = (next: Section) => {
    setSection(next)
    setViewingId(null)
    setEditing(null)
  }

  return (
    <div className="app-shell">
      <header className="glass-nav">
        <button className="brand-button" onClick={() => changeSection('overview')} aria-label="返回总览">
          <span className="brand-symbol"><Network size={16} strokeWidth={2} /></span>
          <span>AI Engineering Atlas</span>
        </button>
        <nav className="nav-tabs" aria-label="主导航">
          {sections.map((item) => (
            <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => changeSection(item.id)}>{item.label}</button>
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
              <p>数据已清空。先从算法能力开始录入，后续项目、部署关系和 Benchmark 会基于这些真实数据建立。</p>
            </section>
            <EmptyState title="还没有项目关系" description="完成算法能力录入后，再开始项目和部署信息。" />
          </div>
        )}

        {section === 'capabilities' && !viewingAlgorithm && !editing && (
          <div className="page">
            <div className="capability-page-head">
              <div>
                <div className="eyebrow">CAPABILITIES</div>
                <h1>算法能力</h1>
                <p>先建立“我有哪些算法能力”，平台实现作为主要工程维度。</p>
              </div>
              <button className="new-algorithm-button" type="button" onClick={() => { setViewingId(null); setEditing(emptyAlgorithm()) }}><CirclePlus size={16} />新建算法</button>
            </div>

            {algorithms.length > 0 && (
              <div className="search-field"><Search size={16} /><input placeholder="搜索算法或平台" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
            )}

            {algorithms.length === 0 ? (
              <EmptyState title="还没有算法能力" description="点击“新建算法”，从目标检测、OCR、ASR 等真实能力开始录入。" />
            ) : (
              <div className="algorithm-list">
                {filteredAlgorithms.map((item) => (
                  <button className="algorithm-list-row" key={item.id} onClick={() => setViewingId(item.id)}>
                    <span className="row-icon large"><Boxes size={19} /></span>
                    <span className="algorithm-list-main">
                      <span className="algorithm-name-line"><strong>{item.name}</strong><StatusDot status={item.status} /></span>
                      <small>{item.englishName || '—'} · {item.category}</small>
                    </span>
                    <span className="platform-badges">
                      {item.implementations.map((p) => <span key={p.id}>{p.platform || '未命名平台'}</span>)}
                    </span>
                    <span className="algorithm-updated">{item.updatedAt || '未保存'}</span>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {section === 'capabilities' && viewingAlgorithm && !editing && (
          <div className="page detail-page">
            <AlgorithmDetail
              algorithm={viewingAlgorithm}
              onBack={() => setViewingId(null)}
              onEdit={() => setEditing(structuredClone(viewingAlgorithm))}
            />
          </div>
        )}

        {section === 'capabilities' && editing && (
          <div className="page editor-page">
            <AlgorithmEditor
              algorithm={editing}
              onChange={setEditing}
              onSave={saveAlgorithm}
              onCancel={() => setEditing(null)}
            />
          </div>
        )}

        {section === 'benchmarks' && <div className="page"><EmptyState title="还没有 Benchmark" description={`${benchmarks.length} 条数据。完成算法能力后再录入性能与精度。`} /></div>}
        {section === 'pipelines' && <div className="page"><EmptyState title="还没有聚合服务" description={`${pipelines.length} 条数据。后续从已有算法能力中组合。`} /></div>}
        {section === 'projects' && <div className="page"><EmptyState title="还没有项目" description={`${projects.length} 条数据。项目页后续填写算法部署节点、实例和端口。`} /></div>}
        {section === 'timeline' && <div className="page"><EmptyState title="还没有时间线" description={`${timeline.length} 条数据。后续由真实变更和交付记录产生。`} /></div>}
      </main>
    </div>
  )
}

export default App
