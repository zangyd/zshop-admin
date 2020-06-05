import request from '@/plugin/axios/request'

const url = '/v1/user_address'

/**
 * 获取指定账号的收货地址列表
 * @param {Number} client_id
 * @returns
 */
export function getUserAddressList(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.user.address.list',
      client_id
    }
  })
}

/**
 * 获取指定账号的一个收货地址
 * @param {Number} client_id
 * @param {Number} user_address_id
 * @returns
 */
export function getUserAddressItem(client_id, user_address_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.user.address.item',
      client_id,
      user_address_id
    }
  })
}

/**
 * 获取指定账号的默认收货地址
 * @param {Number} client_id
 * @returns
 */
export function getUserAddressDefault(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.user.address.default',
      client_id
    }
  })
}

/**
 * 添加一个收货地址
 * @param {Object} data
 * @returns
 */
export function addUserAddressItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.user.address.item',
      ...data
    }
  })
}

/**
 * 编辑一个收货地址
 * @param {Object} data
 * @returns
 */
export function setUserAddressItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.user.address.item',
      ...data
    }
  })
}

/**
 * 批量删除收货地址
 * @param {Number|String} client_id
 * @param {Array} user_address_id
 * @returns
 */
export function delUserAddressList(client_id, user_address_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.user.address.list',
      client_id,
      user_address_id
    }
  })
}

/**
 * 设置一个收货地址为默认收货地址
 * @param {Number} user_address_id
 * @returns
 */
export function setUserAddressDefault(user_address_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.user.address.default',
      user_address_id
    }
  })
}

/**
 * 检测是否超出最大添加数量
 * @param {Number|String} client_id
 * @returns
 */
export function isUserAddressMaximum(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'is.user.address.maximum',
      client_id
    }
  })
}
