import request from '@/plugin/axios/request'

const url = '/v1/ads'

/**
 * 添加一个广告
 * @param {Object} data
 * @returns
 */
export function addAdsItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.ads.item',
      ...data
    }
  })
}

/**
 * 编辑一个广告
 * @param {Object} data
 * @returns
 */
export function setAdsItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.ads.item',
      ...data
    }
  })
}

/**
 * 设置广告排序
 * @param {Number} ads_id
 * @param {Number} sort
 * @returns
 */
export function setAdsSort(ads_id, sort) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.ads.sort',
      ads_id,
      sort
    }
  })
}

/**
 * 批量删除广告
 * @param {Array} ads_id
 * @returns
 */
export function delAdsList(ads_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.ads.list',
      ads_id
    }
  })
}

/**
 * 批量设置是否显示
 * @param {Array} ads_id
 * @param {Number} status
 * @returns
 */
export function setAdsStatus(ads_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.ads.status',
      ads_id,
      status
    }
  })
}

/**
 * 获取一个广告
 * @param {Number} ads_id
 * @returns
 */
export function getAdsItem(ads_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.ads.item',
      ads_id
    }
  })
}

/**
 * 获取广告列表
 * @param {Object} data
 * @returns
 */
export function getAdsList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.ads.list',
      ...data
    }
  })
}
