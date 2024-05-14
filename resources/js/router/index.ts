import { useAuthStore } from '@/store';
import { RouteLocationNormalized, createRouter, createWebHistory } from 'vue-router';

const AuthGuard = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    const authStore = useAuthStore();
    if (authStore.loggedIn) {
        // get auth user (me) if null
        if (authStore.me === null) {
            await authStore.getUserMe();
        }
        // forward the user to the requested route
        next();
    } else {
        next({ name: 'login' });
    }
};

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue'),
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        beforeEnter: AuthGuard,
        meta: {
            layout: 'AppLayoutAdmin',
        },
    },
    {
        path: '/users',
        name: 'users',
        component: () => import('@/views/users/IndexView.vue'),
        beforeEnter: AuthGuard,
        meta: {
            layout: 'AppLayoutAdmin',
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
