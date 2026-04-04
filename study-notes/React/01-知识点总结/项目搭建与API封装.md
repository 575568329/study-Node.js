# React+TS 项目搭建与 API 封装

> 学习日期: 2026-04-04 | 置信度: 高

---

## 项目搭建

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install && npm run dev
```

## 目录结构（对比 Vue3）

```
Vue3 项目：                      React 项目：
src/                             src/
├── api/                         ├── api/
│   ├── request.ts               │   ├── request.ts
│   └── user.ts                  │   └── user.ts
├── composables/                 ├── hooks/        (改名)
├── stores/                      ├── stores/       (Zustand)
├── types/                       ├── types/
├── views/                       ├── pages/        (改名)
├── components/                  ├── components/
└── router/                      └── router/
```

三个区别：composables → hooks，views → pages，.vue → .tsx

## API 层封装

和 Vue3 项目一模一样：

```tsx
// api/request.ts
import axios from 'axios'
const request = axios.create({ baseURL: '/api' })
request.interceptors.response.use(res => res.data, err => Promise.reject(err))
export default request

// hooks/useUserList.ts（替代 Vue3 的 composable）
function useUserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    request.get('/users').then(data => { setUsers(data); setLoading(false) })
  }, [])
  return { users, loading }
}
```

数据流：types → api → hook → 组件（和 Vue3 项目一样）

## React vs Vue3 设计哲学

```
Vue3：约定大于配置，帮你做更多决策（自动挡）
React：自由大于约定，你自己做所有决策（手动挡）

具体体现：
- 响应式：Vue3 自动追踪 vs React 手动声明依赖
- 样式：Vue3 <style scoped> 内置 vs React 需第三方方案
- 组件注册：Vue3 可全局注册 vs React 每个文件自己 import
- 状态：Vue3 ref 可直接改 vs React 必须用 setter
```

---

**标签**: #React #项目搭建 #API封装 #已掌握
