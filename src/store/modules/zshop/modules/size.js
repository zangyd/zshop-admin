import Vue from 'vue'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    // 尺寸(medium small mini)
    value: ''
  },
  actions: {
    /**
     * @description 将当前的设置应用到 element
     * @param {Object} context
     * @param commit
     * @param {Boolean} refresh 是否在设置之后刷新页面
     */
    apply({ state, commit }, refresh) {
      Vue.prototype.$ELEMENT.size = state.value
      if (refresh) {
        commit('zshop/page/keepAliveClean', null, { root: true })
        router.replace('/refresh')
      }
    },
    /**
     * @description 确认已经加载组件尺寸设置
     * @param {Object} context
     */
    isLoaded({ state }) {
      if (state.value) {
        return Promise.resolve()
      }

      return new Promise(resolve => {
        const timer = setInterval(() => {
          if (state.value) {
            resolve(clearInterval(timer))
          }
        }, 10)
      })
    },
    /**
     * @description 设置尺寸
     * @param context
     * @param dispatch
     * @param size  尺寸
     * @returns {Promise<void>}
     */
    async set({ state, dispatch }, size) {
      // store 赋值
      state.value = size
      // 应用
      dispatch('apply', true)
      // 持久化
      await dispatch('zshop/db/set', {
        dbName: 'sys',
        path: 'size.value',
        value: state.value,
        user: true
      }, { root: true })
    },
    /**
     * @description 从持久化数据读取尺寸设置
     * @param context
     * @param dispatch
     * @returns {Promise<void>}
     */
    async load({ state, dispatch }) {
      // store 赋值
      state.value = await dispatch('zshop/db/get', {
        dbName: 'sys',
        path: 'size.value',
        defaultValue: 'default',
        user: true
      }, { root: true })

      // 应用
      dispatch('apply')
    }
  }
}
