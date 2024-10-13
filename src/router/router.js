import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user.js'

function loggedInCheck(to) {
    const store = useUserStore();

    if (!store.loggedIn) {
        return {path: '/'}
    }
}

function nonLoggedInCheck(to) {
    const store = useUserStore();

    if (store.loggedIn) {
        return {path: '/admin'}
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
            beforeEnter: nonLoggedInCheck,
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('../views/AdminView.vue'),
            beforeEnter: loggedInCheck,
        }
    ]
})

router.beforeEach((to, from, next) => {
    next()
})

router.beforeResolve((to, from, next) => {
    next()
})

export default router;

