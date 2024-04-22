import { createRouter, createWebHistory } from 'vue-router'
import login from '@/views/login.vue';
import regist from '@/views/regist.vue';
import forgetPwd from '@/views/forgetPwd.vue';
import mainContent from '@/views/mainContent.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name:"login",
      path:'/login',
      component:login
    },
    {
      name:"regist",
      path:'/regist',
      component:regist
    },
    {
      name:"forgetPwd",
      path:'/forgetPwd',
      component:forgetPwd
    },
    {
      name:'index',
      path:'/index',
      component:mainContent
    },
    {
      path:'/',
      redirect:'/login'
    }
  ]
})

export default router
