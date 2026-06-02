import type { ResumeData } from './types'

const baseProfile = {
  name: '余凤杰',
  location: '武汉',
  phone: '13129937969',
  email: 'yfj575568329@163.com',
}

const workExperiences = [
  {
    company: '讯飞智学网项目组（百得思维派驻）',
    role: '前端负责人 / 前端开发工程师',
    period: '2025.07 - 至今',
    description: '参与讯飞智学网澳门市场资源加工与题库国际化改造，本组约 20 人，整体项目预估约 60 人。',
    bullets: [
      '个人负责澳门项目相关前端模块，覆盖资源管理、资源平台、题库、众包加工和专题教材等多个系统。',
      '围绕资源 I18N、澳门业务参数链路和富文本公式链路进行前端改造，支撑澳门项目从需求落地到上线验证。',
      '参与上线和页面路径验证，使用 AI 辅助需求拆解、代码生成、问题定位和回归验证，并负责代码审查和业务验证。',
    ],
  },
  {
    company: '武汉地大信息工程股份有限公司',
    role: '前端开发工程师',
    period: '2022.06 - 2025.07',
    description: '负责气象监测、地灾监测、避险搬迁等 Web、App、小程序多端业务开发。',
    bullets: [
      '参与甘肃、北京等地灾项目建设，负责地图可视化、监测点展示、图表分析、三维展示和移动端业务模块。',
      '参与 Vue2 到 Vue3、.NET 到 Java 的系统迁移，维护公共组件并支持内网、麒麟、国密、UKey 等环境适配。',
      '参与现场交付、客户培训和问题排查，能在复杂行业项目中推进前端交付和联调。',
    ],
  },
  {
    company: '武汉英泰斯特电子技术有限公司',
    role: '前端开发工程师',
    period: '2020.12 - 2022.04',
    description: '参与 Web、移动端、车载终端项目开发，处理 IoT 实时数据和车机 H5 交互。',
    bullets: [
      '开发 Vue2 后台管理、uni-app 移动应用和小程序，支撑车载终端状态展示和业务交互。',
      '处理 10 万+ WebSocket 实时数据回传，通过分段回传、数据缓冲和批量渲染降低页面刷新压力。',
      '参与车机系统中 H5 与 Android 原生能力交互，通过 JS-Bridge 完成车机终端能力调用和页面通信。',
    ],
  },
]

const compactWorkExperiences = workExperiences.map((work) => ({
  ...work,
  bullets: work.bullets.slice(0, 2),
}))

const xunfeiProjectBase = {
  name: '讯飞智学网澳门市场资源加工与题库国际化改造',
  role: '前端负责人 / 前端开发',
  period: '2025.08 - 2026.04',
  stack: ['Vue2', 'Vuex', 'Element UI', 'webpack', 'CKEditor', 'MathJax', 'Angular 4', 'Java Web'],
  description:
    '面向澳门教育市场，对资源管理、题库管理、众包加工、专题教材管理等既有系统进行国际化和澳门业务规则适配，在不影响大陆原流程的前提下支持资源语言、澳门题型、基本学力、澳门知识点等能力。',
}

const xunfeiProjectGeneral = {
  ...xunfeiProjectBase,
  bullets: [
    '作为澳门项目相关前端负责人，覆盖 rmp、rpp-web、tkms-fresh-web、crowdsourced-new-web、gxh-erm 5 个系统，完成 270+ 次非合并提交与 900+ 文件变更。',
    '设计并落地 macaoParams 参数传递链路，将业务来源、资源语言、知识点标签等信息贯通到众包任务、题目编辑器、题目展示、解析对比和接口层。',
    '围绕资源 I18N 改造语言联动能力，在图书、教辅、需求管理、众包任务等页面透传 languageCode、isMacao、isMacaoStudio，实现澳门与大陆数据隔离。',
    '适配基本学力第一/第二语言、澳门知识点、澳门题型和试题来源，支撑审核、校对、标注、纠错、解析对比、相似题/同类题等众包流程。',
    '围绕富文本公式编辑与展示链路沉淀原子组件、通用组件和业务组件，兼容 Wiris 图片公式、LaTeX、MathJax 和图片兜底。',
  ],
}

const xunfeiProjectFullstack = {
  ...xunfeiProjectBase,
  bullets: [
    '在多系统遗留工程中负责前端链路改造，围绕澳门业务参数、资源语言和知识点体系完成跨页面、跨接口的数据贯通。',
    '参与 Java Web 下拉数据和前端展示联调，处理资源语言、题型、试题来源等接口字段在不同系统中的兼容与隔离。',
    '使用 AI 辅助进行需求拆解、代码定位、重复性改造和回归检查，个人负责方案判断、代码审查、业务验证和最终质量把控。',
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
    '负责地灾监测点、图层、图表和实时数据展示，覆盖甘肃全省约 8000 个监测点，具备复杂数据可视化和业务状态展示经验。',
    '基于 OpenLayers 和 ECharts 处理分级加载、图层控制、监测点渲染和趋势图联动，首页加载速度优化后提升约 50%。',
    '在北京地灾项目中接入 5s/次实时数据更新和三维模型展示，配合 Vite/gzip 将首屏从约 3.5s 优化至 1.8s。',
  ],
}

const aiProject = {
  name: '智能知识管理平台 / RAG 文档问答系统',
  role: '个人项目',
  period: '2026.04 - 至今',
  stack: ['Next.js App Router', 'React', 'TypeScript', 'RAG', 'SSE', 'LangChain.js', 'LangGraph.js', 'GLM', 'Chroma', 'Graphology'],
  description:
    '面向个人或小团队的 RAG 文档知识管理平台，围绕知识库管理、文档解析、向量检索、AI 问答和知识图谱三个工作区组织，支持本地持久化和可演示部署。',
  bullets: [
    '基于 Next.js App Router 搭建数据、对话、图谱三工作区，通过 kbId 保持知识库选择、文档状态、对话上下文和图谱视图同步。',
    '实现多知识库创建、删除、选择与状态刷新，支持 .txt、.md、.pdf、.docx、.xlsx 文档上传，完成文件校验、同名去重、文本解析和处理状态展示。',
    '设计文档切片与检索链路，按标题分段结合固定窗口切片，批量生成向量并保存文档、切片和来源元数据。',
    '抽象向量存储接口，默认使用本地 JSON FileStore 持久化向量数据，同时保留 ChromaDB 切换能力，支持向量写入、相似度检索和集合删除。',
    '实现 RAG 流式问答接口，将最近对话历史拼接为检索查询，结合向量相似度与关键词混合检索 Top-K 片段，并通过 SSE 返回流式回答。',
    '在回答中透出来源引用、文件名、章节和相关性分数；当知识库无相关内容时明确标注为 AI 补充回答，降低回答与资料混淆风险。',
    '接入实体关系抽取和知识图谱能力，文档上传后异步生成文档节点、实体节点和关系边，图谱页支持节点数量、关系状态、搜索、收藏和节点详情查看。',
    '基于 LangChain.js 封装文档加载、文本切片、向量化与检索链路，实现可复用的 RAG Pipeline；使用 LangGraph.js 构建多步骤 AI Agent 工作流，支持条件分支、工具调用和状态管理。',
  ],
}

const aiProjectGeneral = {
  ...aiProject,
  bullets: [
    '基于 Next.js App Router 搭建数据、对话、图谱三工作区，通过 kbId 保持知识库选择、文档状态、对话上下文和图谱视图同步。',
    '支持 .txt、.md、.pdf、.docx、.xlsx 文档上传，完成文件校验、同名去重、文本解析、切片、向量化和来源元数据保存。',
    '基于 LangChain.js 封装 RAG Pipeline（文档加载、切片、向量化、检索），使用 LangGraph.js 构建 AI Agent 多步骤工作流。',
    '实现 RAG 流式问答接口，结合向量相似度与关键词混合检索 Top-K 片段，通过 SSE 返回回答并展示来源引用。',
    '接入实体关系抽取和知识图谱能力，文档上传后异步生成文档节点、实体节点和关系边，支持搜索、收藏和节点详情查看。',
  ],
}

export const resumes: ResumeData[] = [
  {
    key: 'general',
    label: '通用版',
    profile: {
      ...baseProfile,
      title: '全栈型前端工程师｜Vue / React / Node.js｜AI 应用实践',
      summary:
        '前端出身，擅长复杂 B 端、跨系统改造、RAG 应用落地和可视化性能优化，具备从需求拆解到上线验证的交付经验。',
      tags: ['全栈型前端', 'Vue2/Vue3', 'React', 'TypeScript', 'Node.js', 'RAG', 'LangChain.js', 'LangGraph.js', '复杂 B 端'],
    },
    skillGroups: [
      { title: 'AI 与全栈', items: ['RAG Pipeline', 'LangChain.js', 'LangGraph.js', 'SSE 流式响应', '混合检索', '来源引用', 'Next.js API Route', 'Node.js', '文件上传与解析'] },
      { title: '前端开发', items: ['Vue2 / Vue3', 'React', 'TypeScript', 'Vue Router', 'Vuex / Pinia', 'Tailwind CSS', '组件化'] },
      { title: '工程与业务', items: ['Webpack', 'Vite', 'Git / SVN', '资源 I18N', '富文本公式', 'WebSocket 实时数据', 'OpenLayers / ECharts'] },
    ],
    workExperiences,
    projects: [xunfeiProjectGeneral, aiProjectGeneral, gisProjectFullstack],
    education: ['武昌工学院｜计算机科学与技术｜本科｜2021.06', '武汉职业技术学院｜专科'],
  },
  {
    key: 'nodeFullstack',
    label: 'Node.js 全栈 AI',
    profile: {
      ...baseProfile,
      title: '全栈型前端工程师｜React / Next.js / Node.js｜AI 应用方向',
      summary:
        '具备 5-6 年前端复杂业务交付经验，正在向 AI 应用全栈方向升级。可基于 React/Next.js/TypeScript 承担前端工作台、API Route、文档上传解析、向量检索、流式问答、来源引用和知识图谱等 AI 应用闭环，定位为能端到端落地 AI 产品能力的全栈型前端。',
      tags: ['Next.js', 'React', 'Node.js', 'API Route', 'RAG', 'LangChain.js', 'LangGraph.js', '向量检索', '知识图谱'],
    },
    skillGroups: [
      { title: '前端与全栈', items: ['React', 'Next.js App Router', 'TypeScript', 'Tailwind CSS', 'Node.js', 'API Route'] },
      { title: 'AI 应用链路', items: ['RAG Pipeline', 'LangChain.js', 'LangGraph.js', 'SSE 流式响应', '混合检索', '来源引用', '知识图谱', '多轮上下文检索'] },
      { title: '数据与工程', items: ['文件上传', '文档解析', '本地 JSON 持久化', 'FileStore / Chroma', 'Graphology', '代码审查与验证'] },
    ],
    workExperiences: compactWorkExperiences,
    projects: [aiProject, xunfeiProjectFullstack, gisProjectFullstack],
    education: ['武昌工学院｜计算机科学与技术｜本科｜2021.06', '武汉职业技术学院｜专科'],
  },
]
