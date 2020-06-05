import request from '@/plugin/axios/request'

const url = '/v1/user'

/**
 * 验证账号是否合法
 * @param {String} username
 * @returns
 */
export function checkUserUsername(username) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'check.user.username',
      username
    }
  })
}

/**
 * 验证账号是否合法
 * @param {String} mobile
 * @returns
 */
export function checkUserMobile(mobile) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'check.user.mobile',
      mobile
    }
  })
}

/**
 * 验证账号昵称是否合法
 * @param {String} nickname
 * @returns
 */
export function checkUserNickname(nickname) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'check.user.nickname',
      nickname
    }
  })
}

/**
 * 注册一个新账号
 * @param {Object} data
 * @returns
 */
export function addUserItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.user.item',
      ...data
    }
  })
}

/**
 * 编辑一个账号
 * @param {Object} data
 * @returns
 */
export function setUserItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.user.item',
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
export function setUserStatus(client_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.user.status',
      client_id,
      status
    }
  })
}

/**
 * 修改一个账号密码
 * @param {Number} client_id
 * @param {String} password
 * @param {String} password_confirm
 * @returns
 */
export function setUserPassword(client_id, password, password_confirm) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.user.password',
      client_id,
      password,
      password_confirm
    }
  })
}

/**
 * 批量删除账号
 * @param {Array} client_id
 * @returns
 */
export function delUserList(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.user.list',
      client_id
    }
  })
}

/**
 * 获取一个账号
 * @param {Number} client_id
 * @returns
 */
export function getUserItem(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.user.item',
      client_id
    }
  })
}

/**
 * 获取一个账号的简易信息
 * @param {Number} client_id
 * @returns
 */
export function getUserInfo(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.user.info',
      client_id
    }
  })
}

/**
 * 获取账号列表
 * @param {Object} data
 * @returns
 */
export function getUserList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.user.list',
      ...data
    }
  })
}

/**
 * 获取指定账号的基础数据
 * @param {Array} client_id
 * @returns
 */
export function getUserSelect(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.user.select',
      client_id
    }
  })
}
