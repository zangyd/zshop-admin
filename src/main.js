import Vue from 'vue'
import App from './App'

import store from '@/store'
import zshop from '@/plugin/zshop'

// 菜单和路由设置
import router from './router'
import { frameInRoutes } from '@/router/routes'

// 核心插件
Vue.use(zshop)

// API配置
Vue.prototype.$baseConfig = serverConfig

// v-permission
Vue.directive('permission', {
  bind: (el, binding) => {
    if (!Vue.prototype.$permission(binding.value)) {
      el.parentNode ? el.parentNode.removeChild(el) : el.style.display = 'none'
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('zshop/page/init', frameInRoutes)
  },
  mounted() {
    // 展示系统信息
    this.$store.commit('zshop/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('zshop/account/load').then(() => {})
    // 获取并记录用户 UA
    this.$store.commit('zshop/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('zshop/fullscreen/listen').then(() => {})
  }
}).$mount('#app')
