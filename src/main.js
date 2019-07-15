// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import jquery from 'jquery';
import ElementUI from 'element-ui'
import '../static/css/initialize.css' /* 初始化样式 */
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'     /* 阿里矢量图标 */
import Api from './service/api.js'
import '../static/css/callCommon.css'

// 话单
// import '../static/css/base.css'
// import '../static/css/btn.css'
// import '../static/css/index.css'
// import '../static/css/main.css'
// import '../static/css/cdr/statistics.css'
// import '../static/css/componentcss/searchtable.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.$Ajax = Api;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
