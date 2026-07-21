# career — 求职资产

求职准备材料的总目录。

## 结构

| 目录 | 用途 |
|------|------|
| [`resume-web/`](./resume-web) | 网页简历项目（Vite + React 19 + TS + Tailwind，3 个版本：general / frontend / nodeFullstack）|
| [`resumes/`](./resumes) | 简历成品（HTML）、简历评价、方向调研、个人背景、原始简历 |
| [`interview/`](./interview) | 面试讲稿、追问清单、八股文、自我介绍、模拟面试记录 |
| [`work-projects/`](./work-projects) | 公司项目讲稿（讯飞澳门、GIS、资源加工 i18n）|
| [`projects/`](./projects) | 个人项目面试材料（RAG 讲稿/追问/架构设计）|

## 网页简历运行

```bash
cd resume-web
npm install
npm run dev      # 开发服务器
npm run build    # 构建验证（改完简历必须跑）
```

简历内容在 `resume-web/src/resumeVersions.ts`，不改组件。

---
**最后更新**: 2026-07-21
