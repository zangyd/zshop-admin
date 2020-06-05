import { mapActions, mapState } from 'vuex'
import menuMixin from '../mixin/menu'
import BScroll from 'better-scroll'
import { elMenuItem, elSubmenu } from '../libs/util.menu'

export default {
  name: 'cs-layout-header-aside-menu-side',
  mixins: [
    menuMixin
  ],
  render(h) {
    return h('div', {
      attrs: { class: 'cs-layout-header-aside-menu-side' }
    }, [
      h('el-menu', {
        props: { collapse: this.asideCollapse, collapseTransition: this.asideTransition, uniqueOpened: true, defaultActive: this.$route.fullPath },
        ref: 'menu',
        on: { select: this.handleMenuSelect }
      }, this.menuAside.map(menu => (menu.children === undefined ? elMenuItem : elSubmenu).call(this, h, menu))),
      ...this.menuAside.length === 0 && !this.asideCollapse ? [
        h('div', {
          attrs: { class: 'cs-layout-header-aside-menu-empty', flex: 'dir:top main:center cross:center' }
        }, [
          h('i', {
            attrs: { class: 'el-icon-s-grid' }
          }),
          h('span', {
          }, '暂无侧栏菜单')
        ])
      ] : []
    ])
  },
  data() {
    return {
      matched: null,
      menuAside: [],
      asideHeight: 300,
      BS: null
    }
  },
  computed: {
    ...mapState('zshop/menu', [
      'aside',
      'asideCollapse',
      'asideTransition',
      'asideIndex',
      'history'
    ])
  },
  watch: {
    // 折叠和展开菜单的时候销毁 better scroll
    asideCollapse() {
      this.scrollDestroy()
      setTimeout(() => {
        this.scrollInit()
      }, 500)
    },
    // 监听路由 改变侧边菜单栏
    $route: {
      handler({ matched, fullPath }) {
        // 路由父级发生变化时菜单数据将发生改变
        const pathRoute = matched[0].path ? matched[0].path : matched[1].path
        if (matched.length > 0 && pathRoute !== this.matched) {
          const _side = this.aside.find(menu => menu.path === pathRoute)
          this.menuAside = _side && _side.children ? _side.children : []
          this.matched = pathRoute
        }

        // 记录历史菜单
        const path = fullPath.slice(0, fullPath.lastIndexOf('/'))
        const openeds = this.menuAside.find(menu => menu.path === path)

        if (openeds !== undefined && openeds.children) {
          let history = openeds.children.find(menu => menu.path === fullPath)
          this.historyDataSet(history).then(() => {})
        }

        // 进入"首页"时,将历史菜单压入最底部
        if (this.asideIndex === fullPath && this.history.length) {
          this.menuAside.unshift({
            path: '/index',
            title: '首页',
            icon: 'shouye_o'
          })

          this.menuAside.push({
            path: '/index/history',
            title: '访问历史',
            icon: 'lishijilu_o',
            children: this.history
          })

          this.$nextTick(() => {
            if (!this.asideCollapse && this.$refs.menu) {
              this.$refs.menu.open('/index/history')
            }
          })
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.scrollInit()
  },
  beforeDestroy() {
    this.scrollDestroy()
  },
  methods: {
    ...mapActions('zshop/menu', [
      'historyDataSet'
    ]),
    scrollInit() {
      this.BS = new BScroll(this.$el, {
        mouseWheel: true,
        click: true
        // 如果你愿意可以打开显示滚动条
        // scrollbar: {
        //   fade: true,
        //   interactive: false
        // }
      })
    },
    scrollDestroy() {
      try {
        this.BS.destroy()
      } catch (e) {
        delete this.BS
        this.BS = null
      }
    }
  }
}
