import request from '@/plugin/axios/request'

const url = '/v1/delivery_area'

/**
 * 添加一个配送区域
 * @param {Object} data
 * @returns
 */
export function addDeliveryAreaItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.delivery.area.item',
      ...data
    }
  })
}

/**
 * 编辑一个配送区域
 * @param {Object} data
 * @returns
 */
export function setDeliveryAreaItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.delivery.area.item',
      ...data
    }
  })
}

/**
 * 批量删除配送区域
 * @param {Array} delivery_area_id
 * @returns
 */
export function delDeliveryAreaList(delivery_area_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.delivery.area.list',
      delivery_area_id
    }
  })
}

/**
 * 获取一个配送区域
 * @param {Number} delivery_area_id
 * @returns
 */
export function getDeliveryAreaItem(delivery_area_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.delivery.area.item',
      delivery_area_id
    }
  })
}

/**
 * 获取配送区域列表
 * @param {Object} data
 * @returns
 */
export function getDeliveryAreaList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.delivery.area.list',
      ...data
    }
  })
}
