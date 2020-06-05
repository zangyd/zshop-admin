import request from '@/plugin/axios/request'

const url = '/v1/goods_category'

/**
 * 添加一个商品分类
 * @param {Object} data
 * @returns
 */
export function addGoodsCategoryItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.goods.category.item',
      ...data
    }
  })
}

/**
 * 编辑一个商品分类
 * @param {Object} data
 * @returns
 */
export function setGoodsCategoryItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.goods.category.item',
      ...data
    }
  })
}

/**
 * 批量删除商品分类(支持检测是否存在子节点与关联商品)
 * @param {Array} goods_category_id
 * @param {Number} not_empty
 * @returns
 */
export function delGoodsCategoryList(goods_category_id, not_empty = 0) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.goods.category.list',
      goods_category_id,
      not_empty
    }
  })
}

/**
 * 获取一个商品分类
 * @param {Number} goods_category_id
 * @returns
 */
export function getGoodsCategoryItem(goods_category_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.category.item',
      goods_category_id
    }
  })
}

/**
 * 获取商品分类列表
 * @param {Object} data
 * @returns
 */
export function getGoodsCategoryList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.category.list',
      ...data
    }
  })
}

/**
 * 获取所有子级分类
 * @param {Object} data
 * @returns
 */
export function getGoodsCategorySon(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.category.son',
      ...data
    }
  })
}

/**
 * 获取分类导航数据
 * @param {Object} data
 * @returns
 */
export function getGoodsCategoryNavi(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.category.navi',
      ...data
    }
  })
}

/**
 * 批量设置是否显示
 * @param {Array} goods_category_id
 * @param {Number} status
 * @returns
 */
export function setGoodsCategoryStatus(goods_category_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.goods.category.status',
      goods_category_id,
      status
    }
  })
}

/**
 * 设置商品分类排序
 * @param {Number} goods_category_id
 * @param {Number} sort
 * @returns
 */
export function setGoodsCategorySort(goods_category_id, sort) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.goods.category.sort',
      goods_category_id,
      sort
    }
  })
}

/**
 * 批量设置是否导航
 * @param {Array} goods_category_id
 * @param {Number} is_navi
 * @returns
 */
export function setGoodsCategoryNavi(goods_category_id, is_navi) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.goods.category.navi',
      goods_category_id,
      is_navi
    }
  })
}

/**
 * 根据编号自动排序
 * @param {Array} goods_category_id
 * @returns
 */
export function setGoodsCategoryIndex(goods_category_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.goods.category.index',
      goods_category_id
    }
  })
}
