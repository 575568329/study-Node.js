---
name: resume-html-migration
description: "改简历改 简历相关/resume.html(单文件HTML),不要再动 React 版 resume-web"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5086e38f-e132-438c-ad58-2dd81d8c49d8
---

简历维护入口从 React 数据驱动(`简历相关/resume-web/`)切换到**单文件 HTML**:`简历相关/resume.html`(CSS 全内联,双击打开,Ctrl+P 打印 PDF)。

**Why**:简历当前只有单版本(nodeFullstack),React 数据驱动的多版本抽象是 YAGNI;且"纯字符串数据 × 富文本(加粗)"天然冲突——字符串塞 `**` + `renderBold()` 正则解析很别扭。单页静态简历用纯 HTML 更顺手(`<strong>` 直接写、刷新即看、不用 build)。

**How to apply**:以后改简历内容/措辞/加粗,直接 Edit `简历相关/resume.html`(加粗用 `<strong>`,不要用 `**`)。React 版 `resume-web/` 暂保留不动(待用户确认效果后可能删)。排版主题色在文件顶部 `:root`(`--accent #1d4f91` / `--accent-dark #172b4d` / `--accent-soft #edf4ff` / `--accent-border #bfd2ee`)。打印 PDF:Ctrl+P → A4 → 边距选"无"(CSS @page margin 已设 10mm 12mm) → 勾"背景图形"(否则蓝条/卡片底色/圆点丢)。

简历加粗方式(**领词式**,2026-07-12 用户定):每条 bullet 开头加粗**总结性领词** + 冒号(如「**i18n 双语言架构：**」「**驾驶舱性能优化：**」「**防幻觉机制：**」),后接具体内容;**descriptions 和 skill-level 不加粗**(段落中间加粗会碎裂显乱)。领词精炼(2-7 字)、概括这条讲什么,方便 HR/面试官扫读。**不用句中加粗**(一句冒几个深色词 = 视觉碎裂,用户明确否决过)。自造函数名/团队黑话(`resolveBizLocale`、"收口")要业务化或直接删,通用技术术语(webpack/husky/Spring AOP)保留。

**简历内容事实约束(避免写错,2026-07-13 用户纠正):**
- 智学网澳门项目**不是从 0 到 1 新建**——是原前端骨干离职后**接手 5 个遗留系统**做 i18n 改造 + 澳门业务适配。**不要写"澳门项目 0→1"**。讯飞工作经历 description 现为"成为澳门项目前端实际负责人"(已去掉"0→1")。
- 对比:地大 3 省 5 项目**是真·0 到 1 新建**,那个"从 0 到 1"可以写。
