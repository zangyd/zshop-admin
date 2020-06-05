import { uniqueId } from 'lodash'

// 创建 el-menu-item
export function elMenuItem(h, menu) {
  return h('el-menu-item',
    {
      key: menu.path,
      props: {
        index: menu.path || uniqueId('cs-menu-empty-')
      }
    }, [
      ...menu.icon ? [
        h('i', {
          attrs: {
            class: `iconfont icon${menu.icon}`
          }
        })
      ] : [],
      ...!menu.icon && !menu.iconSvg ? [
        h('i', {
          attrs: { class: 'el el-icon-document' }
        })
      ] : [],
      ...menu.iconSvg ? [
        h('cs-icon-svg', {
          props: { name: menu.iconSvg }
        })
      ] : [],
      h('span', { slot: 'title' }, menu.title || '未命名菜单')
    ])
}

// 创建 el-submenu
export function elSubmenu(h, menu) {
  return h('el-submenu',
    {
      key: menu.path,
      props: {
        index: menu.path || uniqueId('cs-menu-empty-')
      }
    }, [
      ...menu.icon ? [
        h('i', {
          slot: 'title', attrs: { class: `iconfont icon${menu.icon}` }
        })
      ] : [],
      ...!menu.icon && !menu.iconSvg ? [
        h('i', {
          slot: 'title', attrs: { class: 'el el-icon-folder' }
        })
      ] : [],
      ...menu.iconSvg ? [
        h('cs-icon-svg', {
          slot: 'title', props: { name: menu.iconSvg }
        })
      ] : [],
      h('span', { slot: 'title' }, menu.title || '未命名菜单'),
      ...menu.children.map(child => (child.children === undefined ? elMenuItem : elSubmenu).call(this, h, child))
    ])
}
