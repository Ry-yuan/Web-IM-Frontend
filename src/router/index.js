import Vue from 'vue'
import Router from 'vue-router'
import Chat from '@/components/chat'
import Register from '../page/register/register'
import Login from '../page/login/login'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Chat',
      component: Chat
    },
    {
      path:'/register',
      name:'Register',
      component:Register
    },
    {
      path:'/login',
      name:'Login',
      component:Login
    }
  ]
})
