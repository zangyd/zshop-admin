import request from '@/plugin/axios/request'

const url = '/v1/card'

/**
 * 添加一条购物卡
 * @param {Object} data
 * @returns
 */
export function addCardItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.card.item',
      ...data
    }
  })
}

/**
 * 编辑一条购物卡
 * @param {Object} data
 * @returns
 */
export function setCardItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.card.item',
      ...data
    }
  })
}

/**
 * 获取一条购物卡
 * @param {Number} card_id
 * @returns
 */
export function getCardItem(card_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.card.item',
      card_id
    }
  })
}

/**
 * 批量设置购物卡状态
 * @param {Array} card_id
 * @param {Number} status
 * @returns
 */
export function setCardStatus(card_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.card.status',
      card_id,
      status
    }
  })
}

/**
 * 批量删除购物卡
 * @param {Array} card_id
 * @returns
 */
export function delCardList(card_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.card.list',
      card_id
    }
  })
}

/**
 * 获取购物卡列表
 * @param {Object} data
 * @returns
 */
export function getCardList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.card.list',
      ...data
    }
  })
}
