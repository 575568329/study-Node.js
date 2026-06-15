import type { ResumeData } from './types'

const baseProfile = {
  name: '余凤杰',
  location: '武汉',
  phone: '13129937969',
  email: 'yfj575568329@163.com',
  github: 'https://github.com/575568329',
}

// 全栈版专用：只保留讯飞一段，叙事视角改为负责人 + 业务规模
const fullstackWorkExperiences = [
  {
    // 对外口径：百得思维派驻科大讯飞
    company: '科大讯飞（百得思维派驻）',
    role: '前端负责人',
    period: '2025.07 - 至今',
    description:
      '智学网 - 澳门方向，项目组约 60 人。原前端骨干离职后，接手并主导 5 个遗留系统从需求落地到上线验收的全程交付，成为澳门项目前端从 0→1 交付的实际负责人。',
    bullets: [
      '主导资源加工平台 i18n 改造，设计并落地"工作室语言（资源加工区）"与"页面语言（导航/菜单）"双语言体系，统一收口至 resolveBizLocale() 按路由级决策；将 vue-i18n 语言文件按 8 个业务模块拆分为 32 个 JSON（4 语言 × 8 模块）支持多人零冲突协作；自研 i18n-check 卡口脚本接入 husky pre-commit，采用基线增量策略拦截「路径错位 key」与「漏翻」两类问题，把"人工四语言自检"升级为"机器拦截"，在不影响大陆原流程下完成澳门 4 语言（简/繁/英/葡）交付。',
      '主导富文本公式编辑器的组件化沉淀：将 Wiris 图片公式、LaTeX、MathJax、图片兜底四条渲染链路抽象为原子组件、通用组件和业务组件三层，解决多系统复用与维护问题；识别系统级风险（子项目互相依赖、组件跨版本兼容）并制定隔离方案，把控代码审查和业务验证质量阀门。',
      '借助 AI 工具（Claude Code / Cursor）提升需求拆解与重复性改造效率，输出方案文档和审查规范；方案判断、架构决策和上线验证均由本人把关。',
    ],
  },
  {
    company: '武汉地大信息工程股份有限公司',
    role: '前端核心开发 / 前端负责人',
    period: '2022.06 - 2025.07',
    description:
      '负责两条业务线的全链路前端交付：① 多省地质灾害 GIS 可视化项目（约 3000 万规模，甘肃 / 云南 / 广西 / 青海），前端核心开发；② 青海 / 甘肃地质灾害民生搬迁项目（约 500 万规模），前端负责人，承接灾害预防的下游民生闭环。',
    bullets: [
      '可视化项目：主导驾驶舱性能优化（分级加载 + 显示时序），解决十万级监测数据卡顿与三维渲染拥堵问题，首页加载提升约 50%、首屏从约 3.5s 优化至 1.8s，保障省级大屏演示效果与县市级日常调度体验。',
      '搬迁项目：作为前端负责人主导从灾害确定到搬迁完成的全流程闭环（人员信息录入、审核、流转、归档），设计前端展示加密与传输加密方案，保障搬迁人员个人信息合规与安全。',
      '承接 Vue2→Vue3、.NET→Java 系统迁移中的前端改造，适配内网、麒麟、国密、UKey 等信创环境，完成现场交付和客户培训。',
    ],
  },
]

const xunfeiProjectBase = {
  name: '智学网 - 澳门方向',
  role: '前端负责人 / 前端开发',
  period: '2025.08 - 2026.04',
  stack: ['Vue2', 'Vuex', 'Element UI', 'webpack', 'CKEditor', 'MathJax', 'Angular 4', 'Java Web'],
  description:
    '面向澳门教育市场，对资源加工、题库管理等既有系统进行 i18n 改造和澳门业务规则适配，在不影响大陆原流程下支持简/繁/英/葡 4 语言；核心难点为"工作室语言（资源）"与"页面语言（界面）"并存的双语言决策体系。',
}

// 澳门项目 - 全栈版（聚焦 I18N 架构 + 富文本组件两条主线）
const xunfeiProjectFullstack = {
  ...xunfeiProjectBase,
  bullets: [
    '设计并落地双语言决策架构：核心难点在于"工作室语言（资源加工区跟工作室）"与"页面语言（导航/菜单跟用户偏好）"同页面共存，统一收口至 resolveBizLocale() 按路由级判断，并在请求层注入语言上下文请求头使前后端一致。',
    '将 vue-i18n 语言文件按 8 个业务模块拆分为 32 个 JSON（webpack require.context 自动加载、多人零冲突协作）；主导设计自研 i18n-check 卡口脚本（借助 Claude Code / Codex 实现）接入 husky pre-commit，以基线增量策略拦截「路径错位 key」与「漏翻」，把"人工自检"升级为"机器拦截"，存量基线修复至 0。',
    '主导富文本公式编辑器的组件化沉淀：将 Wiris 图片公式、LaTeX、MathJax、图片兜底四条渲染链路抽象为原子/通用/业务组件三层，解决多系统复用与维护问题。',
    '识别系统级风险（子项目互相依赖、组件跨版本兼容）并制定隔离方案，借助 AI 工具提升重复性改造效率，把控代码审查和业务验证质量阀门。',
  ],
}

const gisProjectBase = {
  name: '多省地质灾害 GIS 可视化项目',
  role: '前端核心开发',
  period: '2022.06 - 2025.07',
  stack: ['Vue2', 'Vue3', 'OpenLayers', 'ECharts', 'WebSocket', 'Vite', 'uni-app'],
  description:
    '面向甘肃 / 云南 / 广西 / 青海等多省地质灾害监测、避险搬迁和综合防治场景，建设 Web 管理端、移动端和地图可视化能力，支撑监测点、预警、三维模型和业务流程展示。',
}

const gisProjectFullstack = {
  ...gisProjectBase,
  bullets: [
    '主导地灾综合监测驾驶舱前端可视化，基于 OpenLayers + ECharts，将水位、降雨量、探测器读数等监测数据转化为四个维度的前端能力：图表（指标趋势）、二维（灾害点与监测设备分布）、三维（隐患点模型、灾害动画模拟、设备实景定位）、工作指挥（预警调度、舆情管理）。',
    '承接管理后台数据录入端：以表单驱动灾害点与监测设备的录入和维护，建模监测设备与隐患点 / 监测点的关联关系；实现图表 - 地图双向联动和大批量数据导出。',
    '重点负责二三维驾驶舱性能优化：通过分级加载与显示时序控制，应对十万级监测数据展示、三维地图渲染拥堵与前端加载卡顿问题，首页加载提升约 50%、首屏从约 3.5s 优化至 1.8s。',
  ],
}

// AI 资源管理系统(基于 RAG)- 全栈版
const aiProjectFullstack = {
  name: '自研 AI 资源管理系统',
  role: '个人项目',
  period: '2026.04 - 至今',
  url: 'http://nodetime.cn/rag/chat',
  stack: ['LangChain', 'LangGraph', 'RAG', 'Next.js', 'React', 'TypeScript', 'Node.js', 'SSE', 'Chroma', 'Graphology'],
  description:
    '基于 RAG 的本地 AI 资源管理系统，围绕知识库管理、AI 问答、知识图谱三个工作区组织，支持文档上传解析、向量检索、流式问答、来源引用和知识图谱。完整实现从文档到回答的端到端链路，可独立部署演示，已上线可访问。',
  bullets: [
    '设计并落地 RAG 核心链路：文档上传 → 文本切片（按标题分段+固定窗口） → 向量化（批量生成） → 混合检索（向量相似度+关键词） → SSE 流式回答 → 来源引用透出（文件名/章节/相关性分数）；当知识库无相关内容时明确标注为 AI 补充回答，降低用户混淆风险。',
    '解决 RAG 召回不准与幻觉问题的工程拦截：(1) 召回阶段设置相似度阈值，过滤低质量片段；(2) 回答阶段显式区分"知识库引用"与"AI 补充"，避免用户误以为 AI 推测即资料原文；(3) 透出 Top-K 来源和分数供用户验证。',
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
      title: 'AI Agent 全栈工程师',
      summary:
        'AI Agent 全栈工程师 / LangGraph / Claude Code。现主导讯飞智学网澳门出海项目（内地服务 2500+ 学校，新拓港澳市场）试卷试题底层库前端交付，自研基于 LangGraph 的 AI 资源管理系统并端到端落地上线；深度使用 Claude Code / Codex 完成从需求设计、代码实现到审查的全流程，能独立交付从需求拆解、架构决策到上线验收的完整闭环。此前负责甘肃 / 云南 / 广西 / 青海等多省地质灾害 GIS 可视化项目（约 3000 万规模）的全链路前端开发。',
      tags: ['LangChain', 'LangGraph', 'RAG', 'React', 'Next.js', 'Node.js', 'TypeScript', 'SSE', '向量检索', '知识图谱'],
    },
    skillGroups: [
      {
        title: 'AI 应用链路',
        items: ['LangChain', 'LangGraph', 'RAG', 'MCP', 'Prompt Engineering', 'SSE 流式响应', '混合检索', '来源引用', '知识图谱'],
      },
      {
        title: '前端与全栈',
        items: ['Vue2 / Vue3', 'React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', '小程序', 'Web 组件化'],
      },
      {
        title: '工程与数据',
        items: ['文件上传与解析', '本地 JSON 持久化', 'FileStore / Chroma', 'Graphology', 'Webpack / Vite', ],
      },
      {
        title: 'AI 开发工具',
        items: ['Cursor（2024 起使用）', 'Claude Code（2026.01 起，负责需求设计与代码审阅）', 'Codex（2026.03 起，负责代码实现）'],
      },
    ],
    workExperiences: fullstackWorkExperiences,
    projects: [aiProjectFullstack, xunfeiProjectFullstack, gisProjectFullstack],
    education: ['武昌工学院｜计算机科学与技术｜本科｜2021.06'],
  },
]
