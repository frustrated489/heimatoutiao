import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/home/index.vue' 完整路径
import Layout from '../views/layout' // 简写路径
import Login from '../views/login'
// @是VueCLI 中提供的一种特殊的路径规则，他直接指向src目录路径
// 注意：在VueCLI 创建的项目中，无论你在哪里使用@符号，他永远指向src
import Article from '@/views/article'
import Publish from '@/views/publish'
import Home from '@/views/home'
import Comment from '@/views/comment'
import CommentDetail from '@/views/comment-detail'
import Media from '@/views/media'
import Account from '@/views/account'
// 加载nprogress
import NProgress from 'nprogress'

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
    }, {
      path: '/publish/:articleId',
      component: Publish
    }, {
      path: '/comment',
      component: Comment
    }, {
      path: '/comment/:articleId',
      component: CommentDetail,
      props: true
    }, {
      path: '/media',
      component: Media
    }, {
      path: '/account',
      component: Account
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
// 路由的拦截器 beforeEach 方法，该方法接受一个函数作为参数
// 参数1 ：to，表示去哪里的路由信息
// 参数2 ： from，表示来自哪里的路由信息
// 参数3 ： next，他是一个方法，用于路由放行
// 我们具体要做的就是：判断用户的登录状态，有就通过，没有就跳转到登录页
router.beforeEach((to, from, next) => {
  // 开启顶部导航进度条特效
  NProgress.start()
  // 如果是非登录页面，我们才校验登录状态

  // 如果访问的是登录页面，则直接放行
  if (to.path === '/login') {
    next()
    // 停止代码往后执行
    return
  }

  // 非登录页面，校验登录状态

  // 获取用户token
  const token = window.localStorage.getItem('user-token')
  // 判断是否有token， 有就通过
  if (token) {
    next()
  } else {
    // 2 3 没有，就跳转到登录页
    next('/login') // 跳转到指定路由

    // 如果在登录页并且是非登录状态访问非登录页面，这里手动的终止进度条，否则进度条不会停止
    NProgress.done()
  }
})

router.afterEach((to, from) => {
  // 结束顶部的导航进度条
  NProgress.done()
})
export default router
