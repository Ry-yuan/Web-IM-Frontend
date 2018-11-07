import Vue from 'vue'
import Router from 'vue-router'
import Chat from '@/page/chat/chat'
import Register from '@/page/register/register'
import Login from '@/page/login/login'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    //如果匹配没有的路由，返回登陆页
    {
      path: '*',
      redirect: '/login'
    }
  ]
})
