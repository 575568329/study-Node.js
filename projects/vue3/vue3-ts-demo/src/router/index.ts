import { createRouter, createWebHistory } from 'vue-router'
// 路由类型定义
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')  // 懒加载
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    // 动态路由 — 参数类型安全
    path: '/user/:id',
    name: 'user',
    component: () => import('../views/UserView.vue'),
    props: true  // 把 route params 作为 props 传入组件
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/UserListView.vue')
  }
] as const  // 关键：as const 让路由信息变成字面量类型

const router = createRouter({
  history: createWebHistory(),
  routes
})

// router.beforeEach((to, from) => { 
//   // to 和 from 都是类型化的 RouteLocationNormalized
//   console.log(`导航: ${from.path} → ${to.path}`)
//   return false
// })

export default router