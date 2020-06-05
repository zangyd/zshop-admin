import request from '@/plugin/axios/request'

const url = '/v1/spec'

/**
 * 添加一个商品规格
 * @param {Object} data
 * @returns
 */
export function addGoodsSpecItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.goods.spec.item',
      ...data
    }
  })
}

/**
 * 编辑一个商品规格
 * @param {Object} data
 * @returns
 */
export function setGoodsSpecItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.goods.spec.item',
      ...data
    }
  })
}

/**
 * 获取一条商品规格
 * @param {Object} data
 * @returns
 */
export function getGoodsSpecItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.spec.item',
      ...data
    }
  })
}

/**
 * 获取商品规格列表(可翻页)
 * @param {Object} data
 * @returns
 */
export function getGoodsSpecPage(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.spec.page',
      ...data
    }
  })
}

/**
 * 获取商品规格列表
 * @param {Number} goods_type_id
 * @returns
 */
export function getGoodsSpecList(goods_type_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.spec.list',
      goods_type_id
    }
  })
}

/**
 * 获取所有商品规格及规格项
 * @returns
 */
export function getGoodsSpecAll() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.spec.all'
    }
  })
}

/**
 * 批量删除商品规格
 * @param {Array} spec_id
 * @returns
 */
export function delGoodsSpecList(spec_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.goods.spec.list',
      spec_id
    }
  })
}

/**
 * 批量设置商品规格检索
 * @param {Array} spec_id
 * @param {Number} spec_index
 * @returns
 */
export function setGoodsSpecKey(spec_id, spec_index) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.goods.spec.key',
      spec_id,
      spec_index
    }
  })
}

/**
 * 设置商品规格排序
 * @param {Number} spec_id
 * @param {Number} sort
 * @returns
 */
export function setGoodsSpecSort(spec_id, sort) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.goods.spec.sort',
      spec_id,
      sort
    }
  })
}
