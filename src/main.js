import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import axios from 'axios'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0' // 设置axios的常态地址
Vue.prototype.$axios = axios // 将axios共享给所有实例使用
Vue.use(ElementUI) // 注册整个的所有的elementUI 组件 Vue.ues 调用了elementUI里面的一个方法 install=> 调用时传入了Vue 对象
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
