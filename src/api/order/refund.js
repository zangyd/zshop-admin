import request from '@/plugin/axios/request'

const url = '/v1/order_refund'

/**
 * 查询一笔退款信息
 * @param {String} refund_no
 * @returns
 */
export function queryRefundItem(refund_no) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'query.refund.item',
      refund_no
    }
  })
}

/**
 * 获取退款记录列表
 * @param {Object} data
 * @returns
 */
export function getRefundList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.refund.list',
      ...data
    }
  })
}
