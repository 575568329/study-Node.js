import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'   // ← 原始 App（待办事项 demo），切回改这行
import App from './router-demo/App.tsx'  // ← React Router 示例项目

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
