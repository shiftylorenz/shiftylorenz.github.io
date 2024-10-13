import { defineStore } from 'pinia'
import router from "@/router/router.js";

export const useUserStore = defineStore('user', {
    state: () => ({
        loggedIn: false,
        token: false,
        userId: false,
        role: false,
    }),
    actions: {
        setToken(t) {
            this.token = t;
            this.loggedIn = true
        },
        setUserId(t) {
            this.userId = t
        },
        setRole(t) {
            this.role = t
        },
        setLoggedIn(v) {
            this.loggedIn = v;
        },
        logOut() {
            this.loggedIn = false;
            this.token = false;

            router.push({name: 'login'});
        }
    },
})