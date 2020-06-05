import util from '@/utils/util'

export default {
  namespaced: true,
  mutations: {
    /**
     * @description 显示版本信息
     */
    versionShow() {
      util.log.capsule('zshop Admin', `${process.env.VUE_APP_VERSION}`)
      console.log('Web https://www.zshop.cn/')
      console.log('Doc https://doc.zshop.cn/')
    }
  }
}
