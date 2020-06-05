import request from '@/plugin/axios/request'

const url = '/v1/payment_log'

/**
 * 获取一笔充值记录
 * @param {Object} data
 * @returns
 */
export function getPaymentLogItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.payment.log.item',
      ...data
    }
  })
}

/**
 * 获取充值记录列表
 * @param {Object} data
 * @returns
 */
export function getPaymentLogList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.payment.log.list',
      ...data
    }
  })
}
