import request from '@/plugin/axios/request'

const url = '/v1/user_money'

/**
 * 获取指定账号资金信息
 * @param {Number} client_id
 * @returns
 */
export function getUserMoneyInfo(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.user.money.info',
      client_id
    }
  })
}
