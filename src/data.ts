export type Status = 'production' | 'testing' | 'development'

export type Capability = {
  id: string
  name: string
  category: 'CV' | 'Audio'
  description: string
  status: Status
  models: string[]
  platforms: string[]
  api: string
  consumers: string[]
  metrics: string[]
}

export type Benchmark = {
  capabilityId: string
  hardware: string
  vendor: 'NVIDIA' | 'Ascend'
  model: string
  latencyMs?: number
  throughput?: number
  throughputUnit?: string
  memoryGb?: number
  accuracyLabel?: string
  accuracyValue?: string
  date: string
}

export type Pipeline = {
  id: string
  name: string
  description: string
  capabilities: string[]
  endpoint: string
  consumers: string[]
  status: Status
}

export type Project = {
  id: string
  name: string
  problem: string
  deliverables: string[]
  capabilities: string[]
  impact: string
  status: Status
}

export type TimelineItem = {
  date: string
  title: string
  type: 'capability' | 'benchmark' | 'pipeline' | 'project'
  detail: string
}

export const capabilities: Capability[] = [
  {
    id: 'object-detection',
    name: '目标检测',
    category: 'CV',
    description: '提供统一目标检测推理能力，面向视频与图片业务复用。',
    status: 'production',
    models: ['YOLO family'],
    platforms: ['NVIDIA', 'Ascend'],
    api: '/api/detection',
    consumers: ['视频智能分析聚合服务', '公共安全业务'],
    metrics: ['Latency', 'FPS', '显存', 'mAP'],
  },
  {
    id: 'image-embedding',
    name: '图向量 / 图像检索',
    category: 'CV',
    description: '抽取图像向量并支持相似图检索，为去重、聚类和检索提供基础能力。',
    status: 'production',
    models: ['DELG / DINO family'],
    platforms: ['NVIDIA', 'Ascend'],
    api: '/api/image-embedding',
    consumers: ['图像检索服务', '重复内容检测'],
    metrics: ['Embedding/s', 'Latency', 'Recall@K'],
  },
  {
    id: 'face-recognition',
    name: '人脸识别',
    category: 'CV',
    description: '覆盖人脸检测、特征提取与检索的标准化服务。',
    status: 'production',
    models: ['RetinaFace', 'ArcFace'],
    platforms: ['NVIDIA', 'Ascend'],
    api: '/api/face',
    consumers: ['视频智能分析聚合服务'],
    metrics: ['FPS', 'Latency', 'Recall', '显存'],
  },
  {
    id: 'ocr',
    name: 'OCR',
    category: 'CV',
    description: '统一文字检测与识别接口，支撑图片及视频帧中的文本理解。',
    status: 'production',
    models: ['OCR pipeline'],
    platforms: ['NVIDIA', 'Ascend'],
    api: '/api/ocr',
    consumers: ['视频智能分析聚合服务', '文档/图片解析'],
    metrics: ['FPS', 'Latency', 'Precision', 'Recall'],
  },
  {
    id: 'asr',
    name: 'ASR',
    category: 'Audio',
    description: '提供音视频语音识别能力，面向普通话、方言及弱势语言场景扩展。',
    status: 'testing',
    models: ['Whisper family'],
    platforms: ['NVIDIA', 'Ascend'],
    api: '/api/asr',
    consumers: ['视频智能分析聚合服务', '音视频转写'],
    metrics: ['RTF', 'Latency', 'WER/CER', '显存'],
  },
]

export const benchmarks: Benchmark[] = [
  { capabilityId: 'object-detection', hardware: 'NVIDIA A10', vendor: 'NVIDIA', model: '示例模型', latencyMs: 12.4, throughput: 80.6, throughputUnit: 'FPS', memoryGb: 2.4, accuracyLabel: 'mAP50-95', accuracyValue: '待录入', date: '2026-09-15' },
  { capabilityId: 'object-detection', hardware: 'Ascend 950', vendor: 'Ascend', model: '示例模型', latencyMs: 14.1, throughput: 70.9, throughputUnit: 'FPS', memoryGb: 2.8, accuracyLabel: 'mAP50-95', accuracyValue: '待录入', date: '2026-09-15' },
  { capabilityId: 'ocr', hardware: 'NVIDIA A10', vendor: 'NVIDIA', model: '示例 OCR', latencyMs: 31.8, throughput: 31.4, throughputUnit: 'req/s', memoryGb: 2.1, accuracyLabel: 'Precision', accuracyValue: '待录入', date: '2026-09-15' },
  { capabilityId: 'ocr', hardware: 'Ascend 950', vendor: 'Ascend', model: '示例 OCR', latencyMs: 34.6, throughput: 28.9, throughputUnit: 'req/s', memoryGb: 2.6, accuracyLabel: 'Precision', accuracyValue: '待录入', date: '2026-09-15' },
  { capabilityId: 'asr', hardware: 'NVIDIA A10', vendor: 'NVIDIA', model: '示例 ASR', throughput: 0.18, throughputUnit: 'RTF', memoryGb: 5.3, accuracyLabel: 'WER/CER', accuracyValue: '待录入', date: '2026-09-15' },
  { capabilityId: 'asr', hardware: 'Ascend 950', vendor: 'Ascend', model: '示例 ASR', throughput: 0.23, throughputUnit: 'RTF', memoryGb: 5.8, accuracyLabel: 'WER/CER', accuracyValue: '待录入', date: '2026-09-15' },
]

export const pipelines: Pipeline[] = [
  {
    id: 'video-analysis',
    name: '视频智能分析聚合服务',
    description: '将多个原子算法按业务规则组合，向上层系统提供统一视频分析接口。',
    capabilities: ['object-detection', 'ocr', 'face-recognition', 'asr', 'image-embedding'],
    endpoint: '/api/video/analyse',
    consumers: ['视频研判平台', '公共安全业务'],
    status: 'production',
  },
]

export const projects: Project[] = [
  {
    id: 'video-review-platform',
    name: '视频智能研判平台',
    problem: '大量视频需要统一接入、机器研判、风险界定与人工复核。',
    deliverables: ['实时群组视频接入', '事件分类与风险规则', '重复视频折叠', '沉浸式审查', '人工标记与复核备注'],
    capabilities: ['object-detection', 'ocr', 'face-recognition', 'asr', 'image-embedding'],
    impact: '形成“采集 → AI研判 → 人工审查”的业务闭环。',
    status: 'production',
  },
  {
    id: 'ascend-adaptation',
    name: '昇腾算法能力适配',
    problem: '现有算法能力需要从 NVIDIA 环境扩展到昇腾平台，并完成模型转换、运行时兼容与性能验证。',
    deliverables: ['OCR适配', '图像检索适配', '人脸适配', '目标检测适配', 'ASR适配'],
    capabilities: ['object-detection', 'ocr', 'face-recognition', 'asr', 'image-embedding'],
    impact: '同一套算法能力可覆盖多类算力平台，降低业务对单一硬件的依赖。',
    status: 'testing',
  },
]

export const timeline: TimelineItem[] = [
  { date: '2026-09', title: '算法服务性能与资源测试', type: 'benchmark', detail: '整理单实例性能、资源消耗与硬件差异，逐步形成可追溯 Benchmark 数据库。' },
  { date: '2026-09', title: '视频智能分析聚合服务重构', type: 'pipeline', detail: '拆分任务队列、API 与 Redis 依赖，提升部署与配置灵活性。' },
  { date: '2026-09', title: '昇腾平台持续适配', type: 'capability', detail: '推进 CV 与 ASR 原子算法服务在昇腾环境中的模型转换与推理验证。' },
  { date: '2026-08', title: '视频智能研判平台闭环', type: 'project', detail: '补齐重复视频折叠、沉浸式审查、人工标记和复核备注能力。' },
]

export const capabilityName = (id: string) => capabilities.find((item) => item.id === id)?.name ?? id
