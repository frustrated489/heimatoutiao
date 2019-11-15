import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/home/index.vue' 完整路径
import Layout from '@/views/layout' // 简写路径
import Login from '@/views/login'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Home from '@/views/home'
Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   redirect: '/home'
  // },
  // 一级路由 主页
  {
    path: '/',
    component: Layout,
    children: [{
      path: '',
      component: Home
    }, {
      path: '/article',
      component: Article
    }, {
      path: '/publish',
      component: Publish
    }]
  }, {
    // 一级路由 登录页
    path: '/login',
    name: 'login',
    component: Login
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
