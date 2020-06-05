import request from '@/plugin/axios/request'

const url = '/v1/delivery_dist'

/**
 * 添加一条配送轨迹
 * @param {Object} data
 * @returns
 */
export function addDeliveryDistItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.delivery.dist.item',
      ...data
    }
  })
}

/**
 * 根据流水号获取配送轨迹
 * @param {Object} data
 * @returns
 */
export function getDeliveryDistCode(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.delivery.dist.code',
      ...data
    }
  })
}

/**
 * 获取配送轨迹列表
 * @param {Object} data
 * @returns
 */
export function getDeliveryDistList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.delivery.dist.list',
      ...data
    }
  })
}

/**
 * 根据快递单号即时查询配送轨迹
 * @param {Object} data
 * @returns
 */
export function getDeliveryDistTrace(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.delivery.dist.trace',
      ...data
    }
  })
}

/**
 * 获取配送回调URL接口
 * @returns
 */
export function getDeliveryDistCallback() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.delivery.dist.callback'
    }
  })
}
