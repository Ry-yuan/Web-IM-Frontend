import Vue from 'vue'
import Router from 'vue-router'
import Chat from '@/components/chat'
import Register from '../page/register/register'
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
    }
  ]
})
