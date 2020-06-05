import request from '@/plugin/axios/request'

const url = '/v1/navigation'

/**
 * 添加一个导航
 * @param {Object} data
 * @returns
 */
export function addNavigationItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.navigation.item',
      ...data
    }
  })
}

/**
 * 编辑一个导航
 * @param {Object} data
 * @returns
 */
export function setNavigationItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.navigation.item',
      ...data
    }
  })
}

/**
 * 批量删除导航
 * @param {Array} navigation_id
 * @returns
 */
export function delNavigationList(navigation_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.navigation.list',
      navigation_id
    }
  })
}

/**
 * 获取一个导航
 * @param {Number} navigation_id
 * @returns
 */
export function getNavigationItem(navigation_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.navigation.item',
      navigation_id
    }
  })
}

/**
 * 获取导航列表
 * @param {Object} data
 * @returns
 */
export function getNavigationList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.navigation.list',
      ...data
    }
  })
}

/**
 * 批量设置是否新开窗口
 * @param {Array} navigation_id
 * @param {String} target
 * @returns
 */
export function setNavigationTarget(navigation_id, target) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.navigation.target',
      navigation_id,
      target
    }
  })
}

/**
 * 批量设置是否启用
 * @param {Array} navigation_id
 * @param {Number} status
 * @returns
 */
export function setNavigationStatus(navigation_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.navigation.status',
      navigation_id,
      status
    }
  })
}

/**
 * 设置导航排序
 * @param {Number} navigation_id
 * @param {Number} sort
 * @returns
 */
export function setNavigationSort(navigation_id, sort) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.navigation.sort',
      navigation_id,
      sort
    }
  })
}
