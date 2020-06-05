import request from '@/plugin/axios/request'

const url = '/v1/brand'

/**
 * 添加一个品牌
 * @param {Object} data
 * @returns
 */
export function addBrandItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.brand.item',
      ...data
    }
  })
}

/**
 * 编辑一个品牌
 * @param {Object} data
 * @returns
 */
export function setBrandItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.brand.item',
      ...data
    }
  })
}

/**
 * 批量删除品牌
 * @param {Array} brand_id
 * @returns
 */
export function delBrandList(brand_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.brand.list',
      brand_id
    }
  })
}

/**
 * 批量设置品牌是否显示
 * @param {Array} brand_id
 * @param {Number} status
 * @returns
 */
export function setBrandStatus(brand_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.brand.status',
      brand_id,
      status
    }
  })
}

/**
 * 验证品牌名称是否唯一
 * @param {Object} data
 * @returns
 */
export function uniqueBrandName(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'unique.brand.name',
      ...data
    }
  })
}

/**
 * 获取一个品牌
 * @param {Number} brand_id
 * @returns
 */
export function getBrandItem(brand_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.brand.item',
      brand_id
    }
  })
}

/**
 * 获取品牌列表
 * @param {Object} data
 * @returns
 */
export function getBrandList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.brand.list',
      ...data
    }
  })
}

/**
 * 获取品牌选择列表
 * @param {Object} data
 * @returns
 */
export function getBrandSelect(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.brand.select',
      ...data
    }
  })
}

/**
 * 设置品牌排序
 * @param {Number} brand_id
 * @param {Number} sort
 * @returns
 */
export function setBrandSort(brand_id, sort) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.brand.sort',
      brand_id,
      sort
    }
  })
}
