import request from '@/plugin/axios/request'

const url = '/v1/discount'

/**
 * 添加一个商品折扣
 * @param {Object} data
 * @returns
 */
export function addDiscountItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.discount.item',
      ...data
    }
  })
}

/**
 * 编辑一个商品折扣
 * @param {Object} data
 * @returns
 */
export function setDiscountItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.discount.item',
      ...data
    }
  })
}

/**
 * 获取一个商品折扣
 * @param {Number} discount_id
 * @returns
 */
export function getDiscountItem(discount_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.discount.item',
      discount_id
    }
  })
}

/**
 * 批量删除商品折扣
 * @param {Array} discount_id
 * @returns
 */
export function delDiscountList(discount_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.discount.list',
      discount_id
    }
  })
}

/**
 * 批量设置商品折扣状态
 * @param {Array} discount_id
 * @param {Number} status
 * @returns
 */
export function setDiscountStatus(discount_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.discount.status',
      discount_id,
      status
    }
  })
}

/**
 * 获取商品折扣列表
 * @param {Object} data
 * @returns
 */
export function getDiscountList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.discount.list',
      ...data
    }
  })
}

/**
 * 根据商品编号获取折扣信息
 * @param {Array} goods_id
 * @returns
 */
export function getDiscountGoodsInfo(goods_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.discount.goods.info',
      goods_id
    }
  })
}

/**
 * 根据编号获取折扣商品明细
 * @param {Array} discount_id
 * @returns
 */
export function getDiscountGoodsList(discount_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.discount.goods.list',
      discount_id
    }
  })
}
