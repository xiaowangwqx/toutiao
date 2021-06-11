// 加载动态设置REM基准值
import 'amfe-flexible'
// 引入vant组件
import Vant from 'vant'
// 引入vant全局样式
import 'vant/lib/index.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'

// 注册使用vant组件库
Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')