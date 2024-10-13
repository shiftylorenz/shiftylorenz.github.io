import { createApp } from 'vue'
import { createPinia } from 'pinia';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Tooltip from 'primevue/tooltip';

import router from "./router/router.js";
import App from './App.vue'

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
}).
directive('tooltip', Tooltip).
use(router).
use(createPinia()).
mount("#app");