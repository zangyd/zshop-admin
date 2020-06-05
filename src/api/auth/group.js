import request from '@/plugin/axios/request'

const url = '/v1/auth_group'

/**
 * 添加一个用户组
 * @param {Object} data
 * @returns
 */
export function addAuthGroupItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.auth.group.item',
      ...data
    }
  })
}

/**
 * 编辑一个用户组
 * @param {Object} data
 * @returns
 */
export function setAuthGroupItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.auth.group.item',
      ...data
    }
  })
}

/**
 * 获取一个用户组
 * @param {Number} group_id
 * @returns
 */
export function getAuthGroupItem(group_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.auth.group.item',
      group_id
    }
  })
}

/**
 * 删除一个用户组
 * @param {Number} group_id
 * @returns
 */
export function delAuthGroupItem(group_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.auth.group.item',
      group_id
    }
  })
}

/**
 * 获取用户组列表
 * @param {Object} data
 * @returns
 */
export function getAuthGroupList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.auth.group.list',
      ...data
    }
  })
}

/**
 * 批量设置用户组状态
 * @param {Array} group_id
 * @param {Number} status
 * @returns
 */
export function setAuthGroupStatus(group_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.auth.group.status',
      group_id,
      status
    }
  })
}

/**
 * 设置用户组排序值
 * @param {Number} group_id
 * @param {Number} sort
 * @returns
 */
export function setAuthGroupSort(group_id, sort) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.auth.group.sort',
      group_id,
      sort
    }
  })
}
