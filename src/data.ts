export type Status = 'production' | 'testing' | 'development' | 'deprecated'

export type AlgorithmCategory = 'CV' | 'Audio' | 'Multimodal' | 'NLP' | 'Other'

export type PlatformImplementation = {
  id: string
  platform: string
  status: Status
  hardware: string
  serviceVersion: string
  gitlab: string
  branch: string
  modelName: string
  modelVersion: string
  runtime: string
  framework: string
  image: string
  containerPort: string
  healthcheck: string
}

export type Algorithm = {
  id: string
  name: string
  englishName: string
  category: AlgorithmCategory
  status: Status
  description: string
  owner: string
  api: {
    protocol: string
    method: string
    endpoint: string
  }
  implementations: PlatformImplementation[]
  updatedAt: string
}

export type Benchmark = {
  algorithmId: string
  platform: string
  hardware: string
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
  algorithmIds: string[]
  endpoint: string
  status: Status
}

export type Project = {
  id: string
  name: string
  description: string
  status: Status
}

export type TimelineItem = {
  date: string
  title: string
  type: 'algorithm' | 'benchmark' | 'pipeline' | 'project'
  detail: string
}

// Real data will be entered through the UI. Keep these collections empty until then.
export const algorithms: Algorithm[] = []
export const benchmarks: Benchmark[] = []
export const pipelines: Pipeline[] = []
export const projects: Project[] = []
export const timeline: TimelineItem[] = []
