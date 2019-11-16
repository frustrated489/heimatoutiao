import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import axios from 'axios'
import JSONbig from 'json-bigint'
// 加载 nprogress 中的指定的样式文件
// 注意：加载第三方包中的具体文件不需要写具体路径，直接写包名即可
// 总结就是：'包名/具体文件路径'
import 'nprogress/nprogress.css'

// 设置axios的常态地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'

// axios 默认会把后端返回的数据使用 JSON.parse转为对象给我们使用
// 同时它也提供了让我们自定义转换的功能
axios.defaults.transformResponse = [function (data, headers) {
  // axios 默认使用 JSON.parse(data)
  // 我们这里手动配置使用 JSONbig.parse(data)
  // 任何接口都会返回数据
  // 所有请求返回的数据都要 JSONbig.parse(data) 转一下
  // 删除操作，后端返回的是空数据
  // 空数据一经转换就报错了
  // 说白了，当没有响应体的时候，JSONbig.parse(data) 执行就报错了

  // 把导致出错的代码放到 try 里面，把出错之后的处理放到 catch 里面
  // try-catch 是 JavaScript 的原生语法，就像 if-else 一样，专门用于捕获异常
  try {
    return JSONbig.parse(data)
  } catch (err) {
    console.log(err)
    // 一旦try 里面的代码执行引发异常，那么进入catch执行
    return {}
  }
}]
Vue.prototype.$axios = axios // 将axios共享给所有实例使用
Vue.use(ElementUI) // 注册整个的所有的elementUI 组件 Vue.ues 调用了elementUI里面的一个方法 install=> 调用时传入了Vue 对象
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
