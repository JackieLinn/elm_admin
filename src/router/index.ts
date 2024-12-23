import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', redirect: '/login'},
    {name: 'login', path: '/login', component: () => import('@/views/LoginPage.vue')},
    {name: 'register', path: '/register', component: () => import('@/views/RegisterPage.vue')},
    {name: 'reset', path: '/reset', component: () => import('@/views/ResetPage.vue')},
  ],
})

export default router
