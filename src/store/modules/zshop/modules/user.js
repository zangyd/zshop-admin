export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {},
    // 未读消息数
    unreadMessage: 0
  },
  actions: {
    /**
     * @description 设置用户数据
     * @param context
     * @param dispatch
     * @param info
     * @returns {Promise<void>}
     */
    async set({ state, dispatch }, info) {
      // store 赋值
      state.info = info
      // 持久化
      await dispatch('zshop/db/set', {
        dbName: 'sys',
        path: 'user.info',
        value: info,
        user: true
      }, { root: true })
    },
    /**
     * @description 从数据库取用户数据
     * @param context
     * @param dispatch
     * @returns {Promise<void>}
     */
    async load({ state, dispatch }) {
      // store 赋值
      state.info = await dispatch('zshop/db/get', {
        dbName: 'sys',
        path: 'user.info',
        defaultValue: {},
        user: true
      }, { root: true })
    }
  },
  mutations: {
    /**
     * @description 设置未读消息数
     * @param {Object} state state
     * @param {Number} count data
     */
    setMessage(state, count) {
      state.unreadMessage = count
    }
  }
}
