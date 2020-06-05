import request from '@/plugin/axios/request'

const url = '/v1/qrcode'

/**
 * 获取二维码调用地址
 * @returns
 */
export function getQrcodeCallurl() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.qrcode.callurl'
    }
  })
}

/**
 * 添加一个二维码
 * @param {Object} data
 * @returns
 */
export function addQrcodeItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.qrcode.item',
      ...data
    }
  })
}

/**
 * 编辑一个二维码
 * @param {Object} data
 * @returns
 */
export function setQrcodeItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.qrcode.item',
      ...data
    }
  })
}

/**
 * 获取一个二维码
 * @param {Number} qrcode_id
 * @returns
 */
export function getQrcodeConfig(qrcode_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.qrcode.config',
      qrcode_id
    }
  })
}

/**
 * 获取二维码列表
 * @param {Object} data
 * @returns
 */
export function getQrcodeList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.qrcode.list',
      ...data
    }
  })
}

/**
 * 批量删除二维码
 * @param {Array} qrcode_id
 * @returns
 */
export function delQrcodeList(qrcode_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.qrcode.list',
      qrcode_id
    }
  })
}
