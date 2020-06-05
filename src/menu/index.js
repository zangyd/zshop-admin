import util from '@/utils/util'

// 菜单 顶栏
// export const menuHeader = []

// 菜单 侧边栏
// export const menuAside = []

/**
 * 将数据源处理为菜单树
 * @param arr
 * @returns {{header: Array, aside: Array}}
 */
function getMenuData(arr) {
  let tree = { header: [], aside: [] }
  arr.forEach(value => {
    if (!value.is_navi || !value.status) {
      return
    }

    // 储存顶部(父节点)数据
    let arrElem = {
      path: value.url,
      title: value.name,
      icon: value.icon,
      remark: value.remark,
      type: value.type
    }

    if (value.parent_id === 0) {
      tree.header.push({ ...arrElem })
    }

    // 处理子节点数据
    arrElem.menu_id = value.menu_id
    arrElem.parent_id = value.parent_id

    tree.aside.push(arrElem)
  })

  tree.aside = util.formatDataToTree(tree.aside)
  return tree
}

export default {
  install(vm, source) {
    vm.commit('zshop/menu/headerAuth', source)

    const { header, aside } = getMenuData(source)
    vm.commit('zshop/menu/headerSet', header)
    vm.commit('zshop/menu/asideSet', aside)
    vm.commit('zshop/search/init', aside)
  }
}
