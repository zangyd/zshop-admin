import request from '@/plugin/axios/request'

const url = '/v1/admin'

/**
 * 账号登录，并且获取授权码
 * @param {Object} data
 * @returns
 */
export function loginAdminUser(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'login.admin.user',
      platform: 'admin',
      ...data
    }
  })
}

/**
 * 注销当前已登录的账号
 * @returns
 */
export function logoutAdminUser() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'logout.admin.user'
    }
  })
}

/**
 * 修改一个账号密码
 * @param {Object} data
 * @returns
 */
export function setAdminPassword(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.admin.password',
      ...data
    }
  })
}

/**
 *  验证账号是否合法
 * @param {String} username
 * @returns
 */
export function checkAdminUsername(username) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'check.admin.username',
      username
    }
  })
}

/**
 * 验证账号昵称是否合法
 * @param {String} nickname
 * @returns
 */
export function checkAdminNickname(nickname) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'check.admin.nickname',
      nickname
    }
  })
}

/**
 * 添加一个账号
 * @param {Object} data
 * @returns
 */
export function addAdminItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.admin.item',
      ...data
    }
  })
}

/**
 * 编辑一个账号
 * @param {Object} data
 * @returns
 */
export function setAdminItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.admin.item',
      ...data
    }
  })
}

/**
 * 批量设置账号状态
 * @param {Array} client_id
 * @param {Number} status
 * @returns
 */
export function setAdminStatus(client_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.admin.status',
      client_id,
      status
    }
  })
}

/**
 * 重置一个账号密码
 * @param {Number} client_id
 * @returns
 */
export function resetAdminItem(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'reset.admin.item',
      client_id
    }
  })
}

/**
 * 批量删除账号
 * @param {Array} client_id
 * @returns
 */
export function delAdminList(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.admin.list',
      client_id
    }
  })
}

/**
 * 获取一个账号
 * @param {Number} client_id
 * @returns
 */
export function getAdminItem(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.admin.item',
      client_id
    }
  })
}

/**
 * 获取账号列表
 * @param {Object} data
 * @returns
 */
export function getAdminList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.admin.list',
      ...data
    }
  })
}

/**
 * 获取指定账号的基础数据
 * @param {Array} client_id
 * @returns
 */
export function getAdminSelect(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.admin.select',
      client_id
    }
  })
}
