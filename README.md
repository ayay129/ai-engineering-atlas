# AI Engineering Atlas

一个面向公司内网的个人 AI 工程价值地图。

目标不是做传统博客或周报，而是把工作从“做过哪些事情”转化为一条可追溯的价值链：

> 原子算法能力 → 硬件适配与 Benchmark → 聚合服务 → 业务项目 → 可复用价值

## 当前模块

- Overview：价值总览、复用关系、价值链
- Capabilities：目标检测、图向量、人脸识别、OCR、ASR 等原子能力
- Benchmarks：NVIDIA / Ascend 性能、资源与精度数据
- Pipelines：算法聚合服务与统一业务接口
- Projects：独立项目和业务闭环 Case Study
- Timeline：工程交付历史

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 数据入口

当前第一版为静态数据驱动，核心数据位于：

```text
src/data.ts
```

其中包含：

- `Capability`
- `Benchmark`
- `Pipeline`
- `Project`
- `TimelineItem`

目前 Benchmark 数值仅用于展示页面结构，不应视为正式测试结果。

## 设计原则

1. **Evidence first**：任何能力、性能或价值结论最终都应关联来源。
2. **Agent 不创造事实**：Agent 只负责读取 Git、Benchmark、README、OpenAPI、测试报告并生成候选更新。
3. **先数据模型，后自动化**：先稳定展示结构，再接入数据库和 Agent。
4. **展示复用，而不是流水账**：核心问题是某项能力被多少服务、多少项目重复使用。
5. **跨硬件是一级维度**：NVIDIA 与 Ascend 的适配和 Benchmark 需要长期沉淀。

## Roadmap

### v0.1

- [x] 六个核心模块
- [x] 静态数据模型
- [x] 响应式暗色内网 Dashboard
- [x] 原子能力 → Pipeline → Project 价值关系
- [x] NVIDIA / Ascend Benchmark Matrix

### v0.2

- [ ] 将 `src/data.ts` 拆为 JSON / YAML 数据目录
- [ ] Capability 详情页
- [ ] Benchmark 详情与版本追溯
- [ ] 项目详情页
- [ ] Repo / Commit / Test report evidence links

### v0.3

- [ ] Engineering Atlas Agent
- [ ] 扫描多个内部 Git 仓库
- [ ] 提取 commit / README / OpenAPI / benchmark 变化
- [ ] 生成候选 Atlas 更新
- [ ] 人工确认后入库
- [ ] 自动生成周报 / 月报

## Agent 预期数据流

```text
Git repositories
      │
      ├── commits
      ├── README
      ├── OpenAPI
      ├── capability.yaml
      └── benchmark/*.json
              │
              ▼
       Atlas Collector
              │
              ▼
      Engineering Agent
              │
         normalize + evidence
              │
              ▼
        Atlas data store
              │
              ▼
          Web Portal
```

## Benchmark 推荐字段

```json
{
  "capability_id": "ocr",
  "model": "model-name",
  "hardware": "NVIDIA A10",
  "runtime": {
    "cuda": "xx",
    "cann": null,
    "docker_image": "image:tag"
  },
  "input": {
    "batch_size": 1,
    "shape": "..."
  },
  "performance": {
    "latency_ms": 0,
    "throughput": 0,
    "throughput_unit": "req/s",
    "memory_gb": 0
  },
  "accuracy": {
    "metric": "precision",
    "value": 0
  },
  "evidence": {
    "repo": "owner/repo",
    "commit": "sha",
    "test_date": "YYYY-MM-DD"
  }
}
```
