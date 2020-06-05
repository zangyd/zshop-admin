import request from '@/plugin/axios/request'

const url = '/v1/withdraw'

/**
 * 获取一个提现请求
 * @param {String} withdraw_no
 * @returns
 */
export function getWithdrawItem(withdraw_no) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.withdraw.item',
      withdraw_no
    }
  })
}

/**
 * 获取提现请求列表
 * @param {Object} data
 * @returns
 */
export function getWithdrawList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.withdraw.list',
      ...data
    }
  })
}

/**
 * 处理一个提现请求
 * @param {String} withdraw_no
 * @returns
 */
export function processWithdrawItem(withdraw_no) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'process.withdraw.item',
      withdraw_no
    }
  })
}

/**
 * 完成一个提现请求
 * @param {String} withdraw_no
 * @param {String} remark
 * @returns
 */
export function completeWithdrawItem(withdraw_no, remark) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'complete.withdraw.item',
      withdraw_no,
      remark
    }
  })
}

/**
 * 拒绝一个提现请求
 * @param {String} withdraw_no
 * @param {String} remark
 * @returns
 */
export function refuseWithdrawItem(withdraw_no, remark) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'refuse.withdraw.item',
      withdraw_no,
      remark
    }
  })
}

/**
 * 获取提现手续费
 * @returns
 */
export function getWithdrawFee() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.withdraw.fee'
    }
  })
}
