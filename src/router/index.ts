import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', redirect: '/login'},
    {name: 'login', path: '/login', component: () => import('@/views/Login.vue')},
  ],
})

export default router
