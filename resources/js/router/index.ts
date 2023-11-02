import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: import('@/views/auth/LoginView.vue'),
  },
  {
    path: '/dashboard',
    component: import('@/views/DashboardView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
