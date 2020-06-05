/**
 * 项目依赖的各项CDN静态资源,如果不在此列表中表示从本地库中生成调用资源
 * 可在".env"配置项中的"VUE_APP_CDN"进行设置,默认为使用本地依赖
 */
let cdn = []
if (process.env.VUE_APP_CDN === 'true') {
  cdn = [
    {
      name: 'vue',
      library: 'Vue',
      js: 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
      css: ''
    },
    {
      name: 'vue-router',
      library: 'VueRouter',
      js: 'https://cdn.jsdelivr.net/npm/vue-router@3.3.2/dist/vue-router.min.js',
      css: ''
    },
    {
      name: 'vuex',
      library: 'Vuex',
      js: 'https://cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
      css: ''
    },
    {
      name: 'axios',
      library: 'axios',
      js: 'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
      css: ''
    },
    {
      name: 'better-scroll',
      library: 'BScroll',
      js: 'https://cdn.jsdelivr.net/npm/better-scroll@1.15.2/dist/bscroll.min.js',
      css: ''
    },
    {
      name: 'element-ui',
      library: 'ELEMENT',
      js: 'https://cdn.jsdelivr.net/npm/element-ui@2.13.2/lib/index.min.js',
      css: 'https://cdn.jsdelivr.net/npm/element-ui@2.13.2/lib/theme-chalk/index.css'
    },
    {
      name: 'dayjs',
      library: 'dayjs',
      js: 'https://cdn.jsdelivr.net/npm/dayjs@1.8.28/dayjs.min.js',
      css: ''
    },
    {
      name: 'fuse.js',
      library: 'Fuse',
      js: 'https://cdn.jsdelivr.net/npm/fuse.js@6.0.0/dist/fuse.min.js',
      css: ''
    },
    {
      name: 'hotkeys-js',
      library: 'hotkeys',
      js: 'https://cdn.jsdelivr.net/npm/hotkeys-js@3.8.1/dist/hotkeys.min.js',
      css: ''
    },
    {
      name: 'lodash',
      library: '_',
      js: 'https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js',
      css: ''
    },
    {
      name: 'lowdb',
      library: 'low',
      js: 'https://cdn.jsdelivr.net/npm/lowdb@1.0.0/dist/low.min.js',
      css: ''
    },
    {
      name: 'lowdb/adapters/LocalStorage',
      library: 'LocalStorage',
      js: 'https://cdn.jsdelivr.net/npm/lowdb@1.0.0/dist/LocalStorage.min.js',
      css: ''
    },
    {
      name: 'nprogress',
      library: 'NProgress',
      js: 'https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
      css: 'https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.css'
    },
    {
      name: 'sortablejs',
      library: 'Sortable',
      js: 'https://cdn.jsdelivr.net/npm/sortablejs@1.10.2/Sortable.min.js',
      css: ''
    },
    {
      name: 'screenfull',
      library: 'screenfull',
      js: 'https://cdn.jsdelivr.net/npm/screenfull@5.0.2/dist/screenfull.min.js',
      css: ''
    },
    {
      name: 'ua-parser-js',
      library: 'UAParser',
      js: 'https://cdn.jsdelivr.net/npm/ua-parser-js@0.7.21/dist/ua-parser.min.js',
      css: ''
    },
    {
      name: 'js-cookie',
      library: 'Cookies',
      js: 'https://cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.min.js',
      css: ''
    },
  ]
}

module.exports = [
  ...cdn
]
