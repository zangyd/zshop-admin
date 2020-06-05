import request from '@/plugin/axios/request'

const url = '/v1/goods'

/**
 * 检测商品货号是否唯一
 * @param {String} goods_code
 * @param {Number} exclude_id
 * @returns
 */
export function uniqueGoodsCode(goods_code, exclude_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'unique.goods.code',
      goods_code,
      exclude_id
    }
  })
}

/**
 * 添加一个商品
 * @param {Object} data
 * @returns
 */
export function addGoodsItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.goods.item',
      ...data
    }
  })
}

/**
 * 编辑一个商品
 * @param {Object} data
 * @returns
 */
export function setGoodsItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.goods.item',
      ...data
    }
  })
}

/**
 * 获取一个商品
 * @param {Number} goods_id
 * @returns
 */
export function getGoodsItem(goods_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.item',
      goods_id
    }
  })
}

/**
 * 批量删除或恢复商品(回收站)
 * @param {Array} goods_id
 * @param {Number} is_delete
 * @returns
 */
export function delGoodsList(goods_id, is_delete) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.goods.list',
      goods_id,
      is_delete
    }
  })
}

/**
 * 获取指定编号商品的基础数据
 * @param {Array} goods_id
 * @returns
 */
export function getGoodsSelect(goods_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.select',
      goods_id
    }
  })
}

/**
 * 批量设置或关闭商品可积分抵扣
 * @param {Array} goods_id
 * @param {Number} is_integral
 * @returns
 */
export function setIntegralGoodsList(goods_id, is_integral) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.integral.goods.list',
      goods_id,
      is_integral
    }
  })
}

/**
 * 批量设置商品是否推荐
 * @param {Array} goods_id
 * @param {Number} is_recommend
 * @returns
 */
export function setRecommendGoodsList(goods_id, is_recommend) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.recommend.goods.list',
      goods_id,
      is_recommend
    }
  })
}

/**
 * 批量设置商品是否为新品
 * @param {Array} goods_id
 * @param {Number} is_new
 * @returns
 */
export function setNewGoodsList(goods_id, is_new) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.new.goods.list',
      goods_id,
      is_new
    }
  })
}

/**
 * 批量设置商品是否为热卖
 * @param {Array} goods_id
 * @param {Number} is_hot
 * @returns
 */
export function setHotGoodsList(goods_id, is_hot) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.hot.goods.list',
      goods_id,
      is_hot
    }
  })
}

/**
 * 批量设置商品是否上下架
 * @param {Array} goods_id
 * @param {Number} status
 * @returns
 */
export function setShelvesGoodsList(goods_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.shelves.goods.list',
      goods_id,
      status
    }
  })
}

/**
 * 获取指定商品的属性列表
 * @param {Number} goods_id
 * @returns
 */
export function getGoodsAttrList(goods_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.attr.list',
      goods_id
    }
  })
}

/**
 * 获取指定商品的规格组合列表
 * @param {Number} goods_id
 * @returns
 */
export function getGoodsSpecList(goods_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.spec.list',
      goods_id
    }
  })
}

/**
 * 获取指定商品的规格图
 * @param {Number} goods_id
 * @returns
 */
export function getGoodsSpecImage(goods_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.spec.image',
      goods_id
    }
  })
}

/**
 * 获取管理后台商品列表
 * @param {Object} data
 * @returns
 */
export function getGoodsAdminList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.admin.list',
      ...data
    }
  })
}

/**
 * 设置商品排序
 * @param {Number} goods_id
 * @param {Number} sort
 * @returns
 */
export function setGoodsSort(goods_id, sort) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.goods.sort',
      goods_id,
      sort
    }
  })
}

/**
 * 获取商品关键词联想词
 * @param {String} keywords
 * @returns
 */
export function getGoodsKeywordsSuggest(keywords) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.keywords.suggest',
      keywords
    }
  })
}

/**
 * 复制一个商品
 * @param {Number} goods_id
 * @returns
 */
export function copyGoodsItem(goods_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'copy.goods.item',
      goods_id
    }
  })
}

/**
 * 获取指定商品的属性配置数据
 * @param {Number} goods_id
 * @returns
 */
export function getGoodsAttrConfig(goods_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.attr.config',
      goods_id
    }
  })
}

/**
 * 获取指定商品的规格配置数据
 * @param {Number} goods_id
 * @param {Number} key_to_array
 * @returns
 */
export function getGoodsSpecConfig(goods_id, key_to_array = 0) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.spec.config',
      goods_id,
      key_to_array
    }
  })
}

/**
 * 获取指定商品的规格菜单数据
 * @param {Number} goods_id
 * @returns
 */
export function getGoodsSpecMenu(goods_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.spec.menu',
      goods_id
    }
  })
}
