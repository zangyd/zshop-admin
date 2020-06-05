import request from '@/plugin/axios/request'

const url = '/v1/goods_reply'

/**
 * 批量删除商品评价的回复
 * @param {Array} goods_reply_id
 * @returns
 */
export function delGoodsReplyList(goods_reply_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.goods.reply.list',
      goods_reply_id
    }
  })
}

/**
 * 获取商品评价回复列表
 * @param {Object} data
 * @returns
 */
export function getGoodsReplyList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.goods.reply.list',
      ...data
    }
  })
}
