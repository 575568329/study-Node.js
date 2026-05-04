# Toast 通知组件设计

> 学习日期: 2026-05-04
> 项目: rag-docs-assistant
> 关联: [[上传进度条实现]] | [[项目实战踩坑记录]]

---

## 核心概念

### 什么是 Toast？

Toast 是一种轻量级的通知组件，在页面角落短暂显示一条消息，几秒后自动消失。常用于操作反馈（成功/失败提示）。

### 组件接口设计

```typescript
interface ToastProps {
  message: string;            // 提示消息
  status: 'success' | 'error'; // 状态类型
  onClose: () => void;        // 关闭回调
}
```

### 组件实现

```typescript
// Toast.tsx
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  status: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, status, onClose }: ToastProps) {
  // 3 秒后自动消失
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    // 清理定时器，防止内存泄漏
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = status === 'success' ? '#4CAF50' : '#F44336';

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '12px 24px',
      backgroundColor: bgColor,
      color: 'white',
      borderRadius: '8px',
      zIndex: 1000,
    }}>
      {message}
    </div>
  );
}
```

### 使用方式

```typescript
const [toast, setToast] = useState<{
  message: string;
  status: 'success' | 'error';
} | null>(null);

// 触发 Toast
const handleUpload = () => {
  setToast({ message: '上传成功！', status: 'success' });
};

const handleError = () => {
  setToast({ message: '上传失败，请重试', status: 'error' });
};

// 条件渲染：toast 为 null 时不渲染组件
return (
  <div>
    {/* ... 页面内容 ... */}
    {toast && (
      <Toast
        message={toast.message}
        status={toast.status}
        onClose={() => setToast(null)}
      />
    )}
  </div>
);
```

---

## 关键要点

1. **条件渲染**: 使用 `{toast && <Toast ... />}` 确保 `toast` 为 `null` 时不渲染组件
2. **自动消失**: `useEffect` + `setTimeout` 实现 N 秒后自动关闭
3. **清理定时器**: useEffect 返回 `() => clearTimeout(timer)` 防止内存泄漏
4. **onClose 回调**: 组件不管理自己的显隐，由父组件通过 state 控制（受控模式）
5. **状态区分**: `success` / `error` 用不同颜色，视觉上区分操作结果

---

## 常见错误

| 错误 | 原因 | 修复 |
|------|------|------|
| Toast message 为空仍渲染 | 只检查 message 字段而非整个 toast 对象 | `toast` 为 `null` 时不渲染 |
| 快速连续触发 Toast 闪烁 | 多次 setToast 导致旧定时器未清理 | useEffect cleanup 会自动清理 |
| onClose 未调用导致 Toast 不消失 | 缺少关闭逻辑 | Toast 内 useEffect 调用 onClose |
