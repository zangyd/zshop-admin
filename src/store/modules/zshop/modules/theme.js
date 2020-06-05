import setting from '@/setting'

export default {
  namespaced: true,
  state: {
    // 主题
    list: setting.theme.list,
    // 现在激活的主题 这应该是一个名字 不是对象
    activeName: setting.theme.default
  },
  getters: {
    /**
     * @description 返回当前的主题信息 不是一个名字 而是当前激活主题的所有数据
     * @param {Object} state state
     */
    activeSetting(state) {
      return state.list.find(theme => theme.name === state.activeName)
    }
  },
  actions: {
    /**
     * @description 激活一个主题
     * @param context
     * @param commit
     * @param dispatch
     * @param themeName
     * @returns {Promise<void>}
     */
    async set({ state, commit, dispatch }, themeName) {
      // 检查这个主题在主题列表里是否存在
      state.activeName = state.list.find(e => e.name === themeName) ? themeName : setting.theme.default
      // 将 vuex 中的主题应用到 dom
      commit('dom')
      // 持久化
      await dispatch('zshop/db/set', {
        dbName: 'sys',
        path: 'theme.activeName',
        value: state.activeName,
        user: true
      }, { root: true })
    },
    /**
     * @description 从持久化数据加载主题设置
     * @param context
     * @param commit
     * @param dispatch
     * @returns {Promise<void>}
     */
    async load({ state, commit, dispatch }) {
      // store 赋值
      let activeName = await dispatch('zshop/db/get', {
        dbName: 'sys',
        path: 'theme.activeName',
        defaultValue: setting.theme.default,
        user: true
      }, { root: true })
      // 检查这个主题在主题列表里是否存在
      if (state.list.find(e => e.name === activeName)) {
        state.activeName = activeName
      } else {
        state.activeName = setting.theme.default
        // 持久化
        await dispatch('zshop/db/set', {
          dbName: 'sys',
          path: 'theme.activeName',
          value: state.activeName,
          user: true
        }, { root: true })
      }
      // 将 vuex 中的主题应用到 dom
      commit('dom')
    }
  },
  mutations: {
    /**
     * @description 将 vuex 中的主题应用到 dom
     * @param {Object} state state
     */
    dom(state) {
      document.body.className = `theme-${state.activeName}`
    }
  }
}
