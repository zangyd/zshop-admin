import request from '@/plugin/axios/request'

const url = '/v1/user_level'

/**
 * 获取一个账号等级
 * @param {Number} user_level_id
 * @returns
 */
export function getUserLevelItem(user_level_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.user.level.item',
      user_level_id
    }
  })
}

/**
 * 获取账号等级列表
 * @returns
 */
export function getUserLevelList() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.user.level.list'
    }
  })
}

/**
 * 添加一个账号等级
 * @param {Object} data
 * @returns
 */
export function addUserLevelItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.user.level.item',
      ...data
    }
  })
}

/**
 * 编辑一个账号等级
 * @param {Object} data
 * @returns
 */
export function setUserLevelItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.user.level.item',
      ...data
    }
  })
}

/**
 * 批量删除账号等级
 * @param {Array} user_level_id
 * @returns
 */
export function delUserLevelList(user_level_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.user.level.list',
      user_level_id
    }
  })
}
