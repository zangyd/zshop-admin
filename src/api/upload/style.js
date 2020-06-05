import request from '@/plugin/axios/request'

const url = '/v1/storage_style'

/**
 * 添加一个资源样式
 * @param {Object} data
 * @returns
 */
export function addStorageStyleItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.storage.style.item',
      ...data
    }
  })
}

/**
 * 编辑一个资源样式
 * @param {Object} data
 * @returns
 */
export function setStorageStyleItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.storage.style.item',
      ...data
    }
  })
}

/**
 * 获取一个资源样式
 * @param {Number} storage_style_id
 * @returns
 */
export function getStorageStyleItem(storage_style_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.storage.style.item',
      storage_style_id
    }
  })
}

/**
 * 获取资源样式列表
 * @param {Object} data
 * @returns
 */
export function getStorageStyleList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.storage.style.list',
      ...data
    }
  })
}

/**
 * 批量删除资源样式
 * @param {Array} storage_style_id
 * @returns
 */
export function delStorageStyleList(storage_style_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.storage.style.list',
      storage_style_id
    }
  })
}

/**
 * 批量设置资源样式状态
 * @param {Array} storage_style_id
 * @param {Number} status
 * @returns
 */
export function setStorageStyleStatus(storage_style_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.storage.style.status',
      storage_style_id,
      status
    }
  })
}
