import request from '@/plugin/axios/request'

const url = '/v1/goods_type'

/**
 * 添加一个商品模型
 * @param {String} type_name
 * @returns
 */
export function addGoodsTypeItem(type_name) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.goods.type.item',
      type_name
    }
  })
}

/**
 * 编辑一个商品模型
 * @param {Object} data
 * @returns
 */
export function setGoodsTypeItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.goods.type.item',
      ...data
    }
  })
}

/**
 * 批量删除商品模型
 * @param {Array} goods_type_id
 * @returns
 */
export function delGoodsTypeList(goods_type_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.goods.type.list',
      goods_type_id
    }
  })
}

/**
 * 查询商品模型名称是否已存在
 * @param {String} type_name
 * @param {Number} exclude_id
 * @returns
 */
export function uniqueGoodsTypeName(type_name, exclude_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'unique.goods.type.name',
      type_name,
      exclude_id
    }
  })
}

/**
 * 获取一个商品模型
 * @param {Number} goods_type_id
 * @returns
 */
export function getGoodsTypeItem(goods_type_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.type.item',
      goods_type_id
    }
  })
}

/**
 * 获取商品模型列表
 * @param {Object} data
 * @returns
 */
export function getGoodsTypeList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.type.list',
      ...data
    }
  })
}

/**
 * 获取商品模型选择列表
 * @param {Object} data
 * @returns
 */
export function getGoodsTypeSelect(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.type.select',
      ...data
    }
  })
}
