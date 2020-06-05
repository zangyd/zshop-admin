import request from '@/plugin/axios/request'

const url = '/v1/setting'

/**
 * 通用的接口设置
 * @param {Object} data
 * @param {String} method
 * @returns
 */
function setRequest(data, method) {
  return request({
    url,
    method: 'post',
    data: {
      method: method,
      data
    }
  })
}

/**
 * 获取某个模块的设置
 * @param {String} module
 * @param {Array} code
 * @returns
 */
export function getSettingList(module, code = []) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.setting.list',
      module,
      code
    }
  })
}

/**
 * 设置配送轨迹
 * @param {Object} data
 * @returns
 */
export function setDeliveryDistList(data) {
  return setRequest(data, 'set.delivery.dist.list')
}

/**
 * 设置支付完成提示页
 * @param {Object} data
 * @returns
 */
export function setPaymentList(data) {
  return setRequest(data, 'set.payment.list')
}

/**
 * 设置配送优惠
 * @param {Object} data
 * @returns
 */
export function setDeliveryList(data) {
  return setRequest(data, 'set.delivery.list')
}

/**
 * 设置购物系统
 * @param {Object} data
 * @returns
 */
export function setShoppingList(data) {
  return setRequest(data, 'set.shopping.list')
}

/**
 * 设置售后服务
 * @param {Object} data
 * @returns
 */
export function setServiceList(data) {
  return setRequest(data, 'set.service.list')
}

/**
 * 设置系统配置
 * @param {Object} data
 * @returns
 */
export function setSystemList(data) {
  return setRequest(data, 'set.system.list')
}

/**
 * 设置上传配置
 * @param {Object} data
 * @returns
 */
export function setUploadList(data) {
  return setRequest(data, 'set.upload.list')
}
