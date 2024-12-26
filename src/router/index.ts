import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', redirect: '/login'},
    {name: 'login', path: '/login', component: () => import('@/views/LoginPage.vue')},
    {name: 'register', path: '/register', component: () => import('@/views/RegisterPage.vue')},
    {name: 'reset', path: '/reset', component: () => import('@/views/ResetPage.vue')},
    {name: 'home', path: '/home', component: () => import('@/views/HomePage.vue')},
    {name: 'businessList', path: '/businessList', component: () => import('@/views/BusinessListPage.vue')},
    {name: 'businessInfo', path: '/businessInfo', component: () => import('@/views/BusinessInfoPage.vue')},
    {name: 'order', path: '/order', component: () => import('@/views/OrderPage.vue')},
  ],
})

export default router
