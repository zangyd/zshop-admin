import request from '@/plugin/axios/request'

const url = '/v1/ads_position'

/**
 * 添加一个广告位置
 * @param {Object} data
 * @returns
 */
export function addAdsPositionItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.ads.position.item',
      ...data
    }
  })
}

/**
 * 编辑一个广告位置
 * @param {Object} data
 * @returns
 */
export function setAdsPositionItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.ads.position.item',
      ...data
    }
  })
}

/**
 * 批量删除广告位置(支持检测是否存在关联广告)
 * @param {Array} position_id
 * @param {Number} not_empty
 * @returns
 */
export function delAdsPositionList(position_id, not_empty = 0) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.ads.position.list',
      ads_position_id: position_id,
      not_empty
    }
  })
}

/**
 * 批量设置广告位置状态
 * @param {Array} position_id
 * @param {Number} status
 * @returns
 */
export function setAdsPositionStatus(position_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.ads.position.status',
      ads_position_id: position_id,
      status
    }
  })
}

/**
 * 获取一个广告位置
 * @param {Number} position_id
 * @returns
 */
export function getAdsPositionItem(position_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.ads.position.item',
      ads_position_id: position_id
    }
  })
}

/**
 * 获取广告位置列表
 * @param {Object} data
 * @returns
 */
export function getAdsPositionList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.ads.position.list',
      ...data
    }
  })
}

/**
 * 获取广告位置选择列表
 * @param {Object} data
 * @returns
 */
export function getAdsPositionSelect(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.ads.position.select',
      ...data
    }
  })
}
