import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: 'login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("../views/account/Login")
  },
  {
    path: '/test',
    name: 'test',
    component: () => import("../views/Test")
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
