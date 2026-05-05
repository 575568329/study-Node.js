# GraphCanvas 白色主题适配

> Day 6（2026-05-05）

---

## 核心概念

将 ForceGraph2D 图谱画布从暗色主题切换到白色主题，适配文档阅读场景和整体系统风格。

## 配色方案

| 元素 | 暗色主题 | 白色主题 |
|------|---------|---------|
| 背景色 | 深色（#1a1a2e） | 白色（#ffffff） |
| 文字色 | 浅色（#e0e0e0） | 深色（#333333） |
| 边线色 | 半透明白色 | 灰色系（#999999） |
| 节点色 | 鲜艳色 | 适中饱和度色 |

## 设计依据

- **Datawrapper**（数据可视化平台）: 图谱推荐白底，利于阅读
- **Cambridge Intelligence**（图可视化工具厂商）: 深色文字+浅色背景更易识别
- **对比度**: 白底深色文字的对比度优于暗底浅色文字

## 实现要点

```tsx
// ForceGraph2D 配置
<ForceGraph2D
  backgroundColor="#ffffff"           // 白底
  nodeLabel={node => node.name}       // 节点名称
  nodeColor={node => node.color}      // 节点颜色
  linkColor={() => '#999999'}         // 灰色边线
  nodeCanvasObject={(node, ctx, globalScale) => {
    // 深色文字标签
    ctx.fillStyle = '#333333';
    ctx.font = `${12 / globalScale}px SansSerif`;
    ctx.fillText(node.name, node.x + 5, node.y + 2);
  }}
/>
```

## 面试要点

- 图谱为什么选白色主题？（文档阅读场景、对比度、风格统一）
- 参考了哪些权威来源？（Datawrapper、Cambridge Intelligence）
