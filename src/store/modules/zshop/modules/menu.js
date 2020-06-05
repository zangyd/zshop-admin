import setting from '@/setting'
import menu from '@/menu'
import util from '@/utils/util'
import { getMenuAuthList } from '@/api/auth/menu'

export default {
  namespaced: true,
  state: {
    // 顶栏菜单
    header: [],
    // 侧栏菜单
    aside: [],
    // 侧边历史菜单
    history: [],
    // 侧边栏收缩
    asideCollapse: setting.menu.asideCollapse,
    // 侧边栏折叠动画
    asideTransition: setting.menu.asideTransition,
    // 侧边栏首页路径
    asideIndex: setting.page.opened[0].fullPath,
    // 侧边栏限制历史菜单
    historyCount: setting.menu.historyCount,
    // 权限字典
    authKey: {},
    // 菜单源数据
    sourceData: []
  },
  actions: {
    /**
     * @description 持久化数据加载侧边栏设置
     * @param context
     * @param dispatch
     * @returns {Promise<void>}
     */
    async asideLoad({ state, dispatch }) {
      // store 赋值
      const menuData = await dispatch('zshop/db/get', {
        dbName: 'sys',
        path: 'menu',
        defaultValue: setting.menu,
        user: true
      }, { root: true })

      if (menuData.asideCollapse !== undefined) {
        state.asideCollapse = menuData.asideCollapse
      }

      if (menuData.asideTransition !== undefined) {
        state.asideTransition = menuData.asideTransition
      }
    },
    /**
     * @description 设置侧边栏展开或者收缩
     * @param context
     * @param dispatch
     * @param collapse is collapse
     * @returns {Promise<void>}
     */
    async asideCollapseSet({ state, dispatch }, collapse) {
      // store 赋值
      state.asideCollapse = collapse
      // 持久化
      await dispatch('zshop/db/set', {
        dbName: 'sys',
        path: 'menu.asideCollapse',
        value: state.asideCollapse,
        user: true
      }, { root: true })
    },
    /**
     * @description 切换侧边栏展开和收缩
     * @param context
     * @param dispatch
     * @returns {Promise<void>}
     */
    async asideCollapseToggle({ state, dispatch }) {
      // store 赋值
      state.asideCollapse = !state.asideCollapse
      // 持久化
      await dispatch('zshop/db/set', {
        dbName: 'sys',
        path: 'menu.asideCollapse',
        value: state.asideCollapse,
        user: true
      }, { root: true })
    },
    /**
     * @description 设置侧边栏折叠动画
     * @param context
     * @param dispatch
     * @param transition is transition
     * @returns {Promise<void>}
     */
    async asideTransitionSet({ state, dispatch }, transition) {
      // store 赋值
      state.asideTransition = transition
      // 持久化
      await dispatch('zshop/db/set', {
        dbName: 'sys',
        path: 'menu.asideTransition',
        value: state.asideTransition,
        user: true
      }, { root: true })
    },
    /**
     * @description 切换侧边栏折叠动画
     * @param context
     * @param dispatch
     * @returns {Promise<void>}
     */
    async asideTransitionToggle({ state, dispatch }) {
      // store 赋值
      state.asideTransition = !state.asideTransition
      // 持久化
      await dispatch('zshop/db/set', {
        dbName: 'sys',
        path: 'menu.asideTransition',
        value: state.asideTransition,
        user: true
      }, { root: true })
    },
    /**
     * @description 从持久化数据读取菜单源数据
     * @param state state
     * @param dispatch
     * @returns {Promise<void>}
     */
    async sourceDataLoad({ state, dispatch }) {
      // 加载菜单数据源
      state.sourceData = await dispatch('zshop/db/get', {
        dbName: 'database',
        path: '$menu.sourceData',
        defaultValue: [],
        user: true
      }, { root: true })

      // 处理菜单源不存在,并且用户已登录
      if (!state.sourceData.length && util.cookies.get('token')) {
        const res = await getMenuAuthList(null)

        // 持久化
        state.sourceData = res.data || []
        await dispatch('zshop/db/set', {
          dbName: 'database',
          path: '$menu.sourceData',
          value: state.sourceData,
          user: true
        }, { root: true })
      }

      // 处理顶栏菜单、侧边菜单、功能搜索
      menu.install(this, state.sourceData)
    },
    /**
     * @description 从持久化数据读取历史菜单数据
     * @param state state
     * @param dispatch
     * @returns {Promise<void>}
     */
    async historyLoad({ state, dispatch }) {
      // 获取历史菜单持久化
      state.history = await dispatch('zshop/db/get', {
        dbName: 'database',
        path: '$menu.history',
        defaultValue: [],
        user: true
      }, { root: true })
    },
    /**
     * 将 history 属性赋值并持久化 在这之前请先确保已经更新了 state.history
     * @param context
     * @param dispatch
     * @returns {Promise<void>}
     */
    async historyDataWrite({ state, dispatch }) {
      // 历史菜单持久化
      dispatch('zshop/db/set', {
        dbName: 'database',
        path: '$menu.history',
        value: state.history,
        user: true
      }, { root: true })
    },
    /**
     * 设置历史菜单数据
     * @param state
     * @param dispatch
     * @param history
     * @returns {Promise<void>}
     */
    async historyDataSet({ state, dispatch }, history) {
      if (history) {
        let index = state.history.findIndex(menu => menu.path === history.path)
        if (index !== -1) {
          state.history.splice(index, 1)
        }

        state.history.unshift(history)
        if (state.history.length > state.historyCount) {
          state.history = state.history.slice(0, state.historyCount)
        }
      }

      // 持久化
      await dispatch('historyDataWrite')
    },
    /**
     * 清空访问历史
     * @param state
     * @param dispatch
     * @returns {Promise<void>}
     */
    async historyClear({ state, dispatch }) {
      state.history = []
      await dispatch('historyDataWrite')
    }
  },
  mutations: {
    /**
     * @description 设置权限字典
     * @param {Object} state state
     * @param {Array} source source setting
     */
    headerAuth(state, source) {
      if (source.length > 0) {
        let auth = {}
        source.forEach(value => {
          if (value.url) {
            auth[value.url] = value.name
          }
        })

        state.authKey = auth
      }
    },
    /**
     * @description 设置顶栏菜单
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    headerSet(state, menu) {
      // store 赋值
      state.header = menu
    },
    /**
     * @description 设置侧边栏菜单
     * @param {Object} state state
     * @param {Array} menu menu setting
     */
    asideSet(state, menu) {
      // store 赋值
      state.aside = menu
    }
  }
}
