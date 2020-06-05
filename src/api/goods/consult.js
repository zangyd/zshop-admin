import request from '@/plugin/axios/request'

const url = '/v1/goods_consult'

/**
 * 批量删除商品咨询
 * @param {Array} goods_consult_id
 * @returns
 */
export function delGoodsConsultList(goods_consult_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.goods.consult.list',
      goods_consult_id
    }
  })
}

/**
 * 批量设置是否前台显示
 * @param {Array} goods_consult_id
 * @param {Number} is_show
 * @returns
 */
export function setGoodsConsultShow(goods_consult_id, is_show) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.goods.consult.show',
      goods_consult_id,
      is_show
    }
  })
}

/**
 * 回复一个商品咨询
 * @param {Number} goods_consult_id
 * @param {String} content
 * @returns
 */
export function replyGoodsConsultItem(goods_consult_id, content) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'reply.goods.consult.item',
      goods_consult_id,
      content
    }
  })
}

/**
 * 获取一个商品咨询问答明细
 * @param {Number} goods_consult_id
 * @returns
 */
export function getGoodsConsultItem(goods_consult_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.consult.item',
      goods_consult_id
    }
  })
}

/**
 * 获取商品咨询列表
 * @param {Object} data
 * @returns
 */
export function getGoodsConsultList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.consult.list',
      ...data
    }
  })
}
