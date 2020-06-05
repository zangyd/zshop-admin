import request from '@/plugin/axios/request'

const url = '/v1/transaction'

/**
 * 获取一笔交易结算
 * @param {Number} transaction_id
 * @returns
 */
export function getTransactionItem(transaction_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.transaction.item',
      transaction_id
    }
  })
}

/**
 * 获取交易结算列表
 * @param {Object} data
 * @returns
 */
export function getTransactionList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.transaction.list',
      ...data
    }
  })
}
