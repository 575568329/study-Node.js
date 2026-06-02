import type { ResumeData } from './types'

const baseProfile = {
  name: '余凤杰',
  location: '武汉',
  phone: '13129937969',
  email: 'yfj575568329@163.com',
}

// 全栈版专用：只保留讯飞一段，叙事视角改为负责人 + 业务规模
const fullstackWorkExperiences = [
  {
    // 对外口径：百得思维派驻科大讯飞
    company: '科大讯飞（百得思维派驻）',
    role: '前端负责人',
    period: '2025.07 - 至今',
    description:
      '讯飞智学网澳门市场资源国际化项目，服务[待补充：学校/用户规模]，项目组约 60 人，前端组[待补充：人数]人。原前端骨干离职后，接手并主导 5 个遗留系统从需求落地到上线验收的全程交付，成为澳门项目前端从 0→1 交付的实际负责人。',
    bullets: [
      '设计并落地资源 I18N 架构：以编译时预处理替代运行时逐请求翻译，通过三轮校对（AI 初筛 → 人工 → 产研）生成静态语言包，消除每用户调用 LLM 的重复成本；澳门与大陆数据通过 languageCode/isMacao 标识隔离，在不破坏大陆原有流程的前提下交付上线。',
      '主导富文本公式编辑器的组件化沉淀：将 Wiris 图片公式、LaTeX、MathJax、图片兜底四条渲染链路抽象为原子组件、通用组件和业务组件三层，解决多系统复用与维护问题；识别系统级风险（子项目互相依赖、组件跨版本兼容）并制定隔离方案，把控代码审查和业务验证质量阀门。',
      '借助 AI 工具（Claude Code / Cursor）提升需求拆解与重复性改造效率，输出方案文档和审查规范；方案判断、架构决策和上线验证均由本人把关。',
    ],
  },
  {
    company: '武汉地大信息工程股份有限公司',
    role: '前端开发工程师',
    period: '2022.06 - 2025.07',
    description:
      '负责地质灾害监测、避险搬迁等 Web 管理端、移动端、小程序多端业务开发，服务甘肃全省约 8000 个监测点。',
    bullets: [
      '负责地灾监测点 GIS 可视化与多端业务开发（Web / uni-app / 小程序），通过分级加载和按需渲染将首页加载提升约 50%；北京地灾项目接入 5s/次实时数据更新和三维模型展示，首屏从 3.5s 优化至 1.8s。',
      '承接 Vue2→Vue3、.NET→Java 系统迁移中的前端改造，适配内网、麒麟、国密、UKey 等信创环境，完成现场交付和客户培训。',
    ],
  },
]

const xunfeiProjectBase = {
  name: '讯飞智学网澳门市场资源加工与题库国际化改造',
  role: '前端负责人 / 前端开发',
  period: '2025.08 - 2026.04',
  stack: ['Vue2', 'Vuex', 'Element UI', 'webpack', 'CKEditor', 'MathJax', 'Angular 4', 'Java Web'],
  description:
    '面向澳门教育市场，对资源管理、题库管理、众包加工、专题教材管理等既有系统进行国际化和澳门业务规则适配，在不影响大陆原流程的前提下支持资源语言、澳门题型、基本学力、澳门知识点等能力。',
}

// 澳门项目 - 全栈版（聚焦 I18N 架构 + 富文本组件两条主线）
const xunfeiProjectFullstack = {
  ...xunfeiProjectBase,
  bullets: [
    '设计并落地资源 I18N 架构：以编译时预处理替代运行时逐请求翻译，通过三轮校对（AI 初筛 → 人工 → 产研）生成静态语言包，消除每用户调用 LLM 的重复成本；澳门与大陆数据通过 languageCode/isMacao 标识隔离。',
    '主导富文本公式编辑器的组件化沉淀：将 Wiris 图片公式、LaTeX、MathJax、图片兜底四条渲染链路抽象为原子/通用/业务组件三层，解决多系统复用与维护问题。',
    '识别系统级风险（子项目互相依赖、组件跨版本兼容）并制定隔离方案，借助 AI 工具提升重复性改造效率，把控代码审查和业务验证质量阀门。',
  ],
}

const gisProjectBase = {
  name: '甘肃 / 北京地质灾害 GIS 可视化项目',
  role: '前端开发',
  period: '2022.06 - 2025.07',
  stack: ['Vue2', 'Vue3', 'OpenLayers', 'ECharts', 'WebSocket', 'Vite', 'uni-app'],
  description:
    '面向地质灾害监测、避险搬迁和综合防治场景，建设 Web 管理端、移动端和地图可视化能力，支撑监测点、预警、三维模型和业务流程展示。',
}

const gisProjectFullstack = {
  ...gisProjectBase,
  bullets: [
    '负责地灾监测点、图层、图表和实时数据的可视化展示，基于 OpenLayers 和 ECharts 实现分级加载、图层控制、监测点渲染和趋势图联动。',
    '针对大规模监测点场景优化首页加载，通过分级加载和按需渲染将首页加载速度提升约 50%。',
    '在北京地灾项目中接入 5s/次实时数据更新和三维模型展示，配合 Vite/gzip 将首屏从约 3.5s 优化至 1.8s。',
  ],
}

// RAG 项目 - 全栈版（问题导向 + 钩子）
const aiProjectFullstack = {
  name: 'RAG 文档问答系统',
  role: '个人项目',
  period: '2026.04 - 至今',
  url: 'http://nodetime.cn/rag/chat',
  stack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'LangChain', 'LangGraph', 'RAG', 'SSE', 'Chroma', 'Graphology'],
  description:
    '本地 RAG 文档知识管理系统，支持文档上传解析、向量检索、流式问答、来源引用和知识图谱。完整实现从文档到回答的端到端链路，可独立部署演示，已上线可访问。',
  bullets: [
    '设计并落地 RAG 核心链路：文档上传 → 文本切片（按标题分段+固定窗口） → 向量化（批量生成） → 混合检索（向量相似度+关键词） → SSE 流式回答 → 来源引用透出（文件名/章节/相关性分数）；当知识库无相关内容时明确标注为 AI 补充回答，降低用户混淆风险。',
    '解决 RAG 召回不准与幻觉问题的工程拦截：(1) 召回阶段设置相似度阈值，过滤低质量片段；(2) 回答阶段显式区分"知识库引用"与"AI 补充"，避免用户误以为 AI 推测即资料原文；(3) 透出 Top-K 来源和分数供用户验证。[待深化：召回过多/过少的打回策略、与产研定义的预值、大批量并发用户的限频与队列处理]',
    '基于 LangChain 封装可复用 RAG Pipeline（文档加载、切片、向量化、检索），使用 LangGraph 构建支持条件分支、工具调用和状态管理的 AI Agent 工作流；抽象向量存储接口（默认本地 JSON FileStore 持久化，保留 ChromaDB 切换能力）。',
    '实现知识图谱能力：文档上传后异步抽取实体和关系，生成文档节点、实体节点和关系边，支持图谱搜索、节点详情和收藏；基于 Next.js App Router 构建数据/对话/图谱三工作区，通过 kbId 保持知识库选择、文档状态、对话上下文和图谱视图同步。',
  ],
}

export const resumes: ResumeData[] = [
  {
    key: 'nodeFullstack',
    label: 'Node.js 全栈 AI',
    profile: {
      ...baseProfile,
      title: '全栈工程师（前端出身）｜Node.js / React / Next.js｜AI 应用方向',
      summary:
        '6 年前端经验，擅长复杂 B 端跨系统改造、RAG 应用端到端落地和前端性能优化。能独立完成从需求拆解、方案设计、代码实现到上线验收的全程交付，可将 AI 能力做成可演示、可上线的产品闭环。正向 AI 应用全栈方向升级。',
      tags: ['React', 'Next.js', 'Node.js', 'TypeScript', 'RAG', 'LangChain', 'LangGraph', 'SSE', '向量检索', '知识图谱'],
    },
    skillGroups: [
      {
        title: 'AI 应用链路（能讲 3-5 分钟）',
        items: ['MCP', 'OpenClaw', 'RAG', 'LangChain', 'LangGraph', 'Prompt Engineering', 'SSE 流式响应', '混合检索', '来源引用', '知识图谱'],
      },
      {
        title: '前端与全栈',
        items: ['Vue2 / Vue3', 'React', 'Next.js App Router', 'TypeScript', 'Node.js', 'Tailwind CSS', 'uni-app', '小程序', 'Web 组件化'],
      },
      {
        title: '工程与数据',
        items: ['Next.js API Route', '文件上传与解析', '本地 JSON 持久化', 'FileStore / Chroma', 'Graphology', 'Webpack / Vite', 'Docker（了解）', 'K8s（了解云原生）'],
      },
      {
        title: '方法论与质量（SDD / TDD / BDD）',
        items: ['代码审查与验证', '方案文档输出', 'AI 辅助开发（Claude Code / Cursor）', 'Git 协作', '现场交付与客户培训'],
      },
    ],
    workExperiences: fullstackWorkExperiences,
    projects: [aiProjectFullstack, xunfeiProjectFullstack, gisProjectFullstack],
    education: ['武昌工学院｜计算机科学与技术｜本科｜2021.06', '武汉职业技术学院｜专科'],
  },
]
