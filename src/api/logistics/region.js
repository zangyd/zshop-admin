import request from '@/plugin/axios/request'

const url = '/v1/region'

/**
 * 添加一个区域
 * @param {Object} data
 * @returns
 */
export function addRegionItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.region.item',
      ...data
    }
  })
}

/**
 * 编辑一个区域
 * @param {Object} data
 * @returns
 */
export function setRegionItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.region.item',
      ...data
    }
  })
}

/**
 * 批量删除区域
 * @param {Array} region_id
 * @returns
 */
export function delRegionList(region_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.region.list',
      region_id
    }
  })
}

/**
 * 获取指定区域
 * @param {Number} region_id
 * @param {Number} region_all
 * @returns
 */
export function getRegionItem(region_id, region_all = 0) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.region.item',
      region_id,
      region_all
    }
  })
}

/**
 * 获取指定Id下的子节点
 * @param {Object} data
 * @returns
 */
export function getRegionList(data = null) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.region.list',
      ...data
    }
  })
}

/**
 * 获取指定Id下的所有子节点
 * @param {Object} data
 * @returns
 */
export function getRegionSonList(data = null) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.region.son.list',
      ...data
    }
  })
}

/**
 * 设置区域排序
 * @param {Number} region_id
 * @param {Number} sort
 * @returns
 */
export function setRegionSort(region_id, sort) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.region.sort',
      region_id,
      sort
    }
  })
}

/**
 * 根据编号自动排序
 * @param {Array} region_id
 * @returns
 */
export function setRegionIndex(region_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.region.index',
      region_id
    }
  })
}

/**
 * 根据区域编号获取区域名称
 * @param {Array} region_id
 * @returns
 */
export function getRegionName(region_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.region.name',
      region_id
    }
  })
}
