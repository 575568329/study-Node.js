# ForceGraph2D API — 2D vs 3D 区别

> Day 6（2026-05-05）

---

## 核心概念

react-force-graph 的 2D 和 3D 版本 API 不同，**不能混用**。本项目使用 2D 版本（react-force-graph-2d）。

## API 对比

| 操作 | 2D 版本 | 3D 版本 |
|------|---------|---------|
| 平移视角 | `centerAt(x, y, ms)` | `cameraPosition({ x, y, z })` |
| 缩放 | `zoom(level, ms)` | `cameraPosition({ ... })` 配合距离参数 |
| 重置视图 | `centerAt(0, 0, 800)` + `zoom(1, 800)` | `cameraPosition({ x: 0, y: 0, z: distance })` |

## 正确用法（2D 版本）

```tsx
const graphRef = useRef<ForceGraphMethods>();

// 重置到概览视图
const resetOverview = () => {
  graphRef.current?.centerAt(0, 0, 800);  // 平移到中心，800ms 动画
  graphRef.current?.zoom(1, 800);          // 缩放到 1x，800ms 动画
};

// 定位到某个节点
const focusNode = (node: NodeObject) => {
  graphRef.current?.centerAt(node.x!, node.y!, 800);
  graphRef.current?.zoom(3, 800);          // 放大到 3x
};
```

## 踩坑

- **错误**: `graphRef.current.cameraPosition()` → TypeError
- **原因**: `cameraPosition` 是 3D 版本的 API，2D 版本不存在
- **修复**: 使用 `centerAt()` + `zoom()` 替代

## 面试要点

- 2D 和 3D 的视角控制 API 有什么区别？
- 为什么不能混用？（两个版本的方法签名和参数完全不同）
