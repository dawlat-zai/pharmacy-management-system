import { useAuthStore } from '@/store';
import { usePermissionStore } from '@/store/permission';
import { RouteLocationNormalized, createRouter, createWebHistory } from 'vue-router';

const AuthGuard = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    const authStore = useAuthStore();
    if (authStore.loggedIn) {
        // get auth user (me) if null
        if (authStore.me === null) {
            await authStore.getUserMe();
        }

        const permissionStore = usePermissionStore();

        // Fetch permissions if not already fetched
        if (!permissionStore.permissions.length) {
            await permissionStore.fetchPermissions();
        }

        if (to.meta.requiresPermission && !permissionStore.hasPermission(to.meta.requiresPermission as string)) {
            next('/unauthorized'); // Redirect to unauthorized page
        } else {
            next(); // forward the user to the requested route
        }
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
            requiresPermission: 'read users',
        },
    },
    {
        path: '/users/create',
        name: 'users_create',
        component: () => import('@/views/users/CreateView.vue'),
        beforeEnter: AuthGuard,
        meta: {
            layout: 'AppLayoutAdmin',
            requiresPermission: 'create users',
        },
    },
    {
        path: '/users/:id/edit',
        name: 'users_edit',
        component: () => import('@/views/users/EditView.vue'),
        beforeEnter: AuthGuard,
        meta: {
            layout: 'AppLayoutAdmin',
            requiresPermission: 'update users',
        },
    },
    {
        path: '/roles',
        name: 'roles',
        component: () => import('@/views/roles/IndexView.vue'),
        beforeEnter: AuthGuard,
        meta: {
            layout: 'AppLayoutAdmin',
            requiresPermission: 'read roles',
        },
    },
    {
        path: '/roles/create',
        name: 'roles_create',
        component: () => import('@/views/roles/CreateView.vue'),
        beforeEnter: AuthGuard,
        meta: {
            layout: 'AppLayoutAdmin',
            requiresPermission: 'create roles',
        },
    },
    {
        path: '/roles/:id/edit',
        name: 'roles_edit',
        component: () => import('@/views/roles/EditView.vue'),
        beforeEnter: AuthGuard,
        meta: {
            layout: 'AppLayoutAdmin',
            requiresPermission: 'update roles',
        },
    },
    {
        path: '/categories',
        name: 'categories',
        component: () => import('@/views/categories/IndexView.vue'),
        beforeEnter: AuthGuard,
        meta: {
            layout: 'AppLayoutAdmin',
            requiresPermission: 'read categories',
        },
    },
    {
        path: '/categories/create',
        name: 'categories_create',
        component: () => import('@/views/categories/CreateView.vue'),
        beforeEnter: AuthGuard,
        meta: {
            layout: 'AppLayoutAdmin',
            requiresPermission: 'create categories',
        },
    },
    {
        path: '/categories/:id/edit',
        name: 'categories_edit',
        component: () => import('@/views/categories/EditView.vue'),
        beforeEnter: AuthGuard,
        meta: {
            layout: 'AppLayoutAdmin',
            requiresPermission: 'update categories',
        },
    },
    {
        path: '/products',
        name: 'products',
        component: () => import('@/views/products/IndexView.vue'),
        beforeEnter: AuthGuard,
        meta: {
            layout: 'AppLayoutAdmin',
            requiresPermission: 'read products',
        },
    },
    {
        path: '/products/create',
        name: 'products_create',
        component: () => import('@/views/products/CreateView.vue'),
        beforeEnter: AuthGuard,
        meta: {
            layout: 'AppLayoutAdmin',
            requiresPermission: 'create products',
        },
    },
    {
        path: '/products/:id/edit',
        name: 'products_edit',
        component: () => import('@/views/products/EditView.vue'),
        beforeEnter: AuthGuard,
        meta: {
            layout: 'AppLayoutAdmin',
            requiresPermission: 'update products',
        },
    },
    {
        path: '/unauthorized',
        name: 'unauthorized',
        component: () => import('@/views/UnauthorizedView.vue'),
        meta: {
            layout: 'AppLayoutAdmin',
        },
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
