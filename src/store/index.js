import Vue from 'vue'
import Vuex from 'vuex'

import zshop from './modules/zshop'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    zshop
  }
})
