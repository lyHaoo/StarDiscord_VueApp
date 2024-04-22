import { createApp ,ref} from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from 'pinia'
import '@/assets/iconfonts/iconfont.css'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import axios from 'axios';
axios.defaults.baseURL = "http://119.45.223.167:8086/"

const wsSocket = ref(null);
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
