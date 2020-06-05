import request from '@/plugin/axios/request'

const url = '/v1/payment'

/**
 * 获取支付配置列表
 * @param {Object} data
 * @returns
 */
export function getPaymentList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.payment.list',
      ...data
    }
  })
}

/**
 * 编辑一个支付配置
 * @param {Object} data
 * @returns
 */
export function setPaymentItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.payment.item',
      ...data
    }
  })
}

/**
 * 获取一个支付配置
 * @param {Number} payment_id
 * @returns
 */
export function getPaymentItem(payment_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.payment.item',
      payment_id
    }
  })
}

/**
 * 设置支付配置排序
 * @param {Number} payment_id
 * @param {Number} sort
 * @returns
 */
export function setPaymentSort(payment_id, sort) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.payment.sort',
      payment_id,
      sort
    }
  })
}

/**
 * 批量设置支付配置状态
 * @param {Array} payment_id
 * @param {Number} status
 * @returns
 */
export function setPaymentStatus(payment_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.payment.status',
      payment_id,
      status
    }
  })
}

/**
 * 财务对账号进行资金调整
 * @param {Object} data
 * @returns
 */
export function setPaymentFinance(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.payment.finance',
      ...data
    }
  })
}
