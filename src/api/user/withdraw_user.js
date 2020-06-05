import request from '@/plugin/axios/request'

const url = '/v1/withdraw_user'

/**
 * 添加一个提现账号
 * @param {Object} data
 * @returns
 */
export function addWithdrawUserItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.withdraw.user.item',
      ...data
    }
  })
}

/**
 * 编辑一个提现账号
 * @param {Object} data
 * @returns
 */
export function setWithdrawUserItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.withdraw.user.item',
      ...data
    }
  })
}

/**
 * 批量删除提现账号
 * @param {Array} withdraw_user_id
 * @param {Number,String} client_id
 * @returns
 */
export function delWithdrawUserList(withdraw_user_id, client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.withdraw.user.list',
      withdraw_user_id,
      client_id
    }
  })
}

/**
 * 获取指定账号的一个提现账号
 * @param {Number} withdraw_user_id
 * @param {Number,String} client_id
 * @returns
 */
export function getWithdrawUserItem(withdraw_user_id, client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.withdraw.user.item',
      withdraw_user_id,
      client_id
    }
  })
}

/**
 * 获取指定账号的提现账号列表
 * @param {Number,String} client_id
 * @returns
 */
export function getWithdrawUserList(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.withdraw.user.list',
      client_id
    }
  })
}

/**
 * 检测是否超出最大添加数量
 * @param {Number,String} client_id
 * @returns
 */
export function isWithdrawUserMaximum(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'is.withdraw.user.maximum',
      client_id
    }
  })
}
