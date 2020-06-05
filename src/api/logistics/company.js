import request from '@/plugin/axios/request'

const url = '/v1/delivery_item'

/**
 * 添加一个快递公司
 * @param {Object} data
 * @returns
 */
export function addDeliveryCompanyItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.delivery.company.item',
      ...data
    }
  })
}

/**
 * 编辑一个快递公司
 * @param {Object} data
 * @returns
 */
export function setDeliveryCompanyItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.delivery.company.item',
      ...data
    }
  })
}

/**
 * 批量删除快递公司
 * @param {Array} delivery_item_id
 * @returns
 */
export function delDeliveryCompanyList(delivery_item_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.delivery.company.list',
      delivery_item_id
    }
  })
}

/**
 * 获取一个快递公司
 * @param {Number} delivery_item_id
 * @returns
 */
export function getDeliveryCompanyItem(delivery_item_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.delivery.company.item',
      delivery_item_id
    }
  })
}

/**
 * 查询快递公司编码是否已存在
 * @param {String} code
 * @param {Number} type
 * @param {Number} exclude_id
 * @returns
 */
export function uniqueDeliveryCompanyCode(code, type, exclude_id = null) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'unique.delivery.company.code',
      code,
      type,
      exclude_id
    }
  })
}

/**
 * 获取快递公司列表
 * @param {Object} data
 * @returns
 */
export function getDeliveryCompanyList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.delivery.company.list',
      ...data
    }
  })
}

/**
 * 获取快递公司选择列表
 * @param {Number} type
 * @returns
 */
export function getDeliveryCompanySelect(type = null) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.delivery.company.select',
      type
    }
  })
}

/**
 * 根据快递单号识别快递公司
 * @param {String} code
 * @returns
 */
export function getDeliveryCompanyRecognise(code) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.delivery.company.recognise',
      code
    }
  })
}

/**
 * 复制一个快递公司为「热门类型」
 * @param {Number} delivery_item_id
 * @returns
 */
export function copyDeliveryCompanyHot(delivery_item_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'copy.delivery.company.hot',
      delivery_item_id
    }
  })
}
