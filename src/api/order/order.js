import request from '@/plugin/axios/request'

const url = '/v1/order'

/**
 * 获取一个订单
 * @param {String} order_no
 * @param {Number} is_get_log
 * @returns
 */
export function getOrderItem(order_no, is_get_log = 0) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.order.item',
      order_no,
      is_get_log
    }
  })
}

/**
 * 获取一个订单操作日志
 * @param {String} order_no
 * @returns
 */
export function getOrderLog(order_no) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.order.log',
      order_no
    }
  })
}

/**
 * 获取订单列表
 * @param {Object} data
 * @returns
 */
export function getOrderList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.order.list',
      ...data
    }
  })
}

/**
 * 编辑一个订单
 * @param {Object} data
 * @returns
 */
export function setOrderItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.order.item',
      ...data
    }
  })
}

/**
 * 取消一个订单
 * @param {String} order_no
 * @returns
 */
export function cancelOrderItem(order_no) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'cancel.order.item',
      order_no
    }
  })
}

/**
 * 将订单放入回收站、还原或删除
 * @param {String} order_no
 * @param {Number} is_recycle
 * @returns
 */
export function recycleOrderItem(order_no, is_recycle) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'recycle.order.item',
      order_no,
      is_recycle
    }
  })
}

/**
 * 获取一个订单商品明细
 * @param {Number} order_goods_id
 * @returns
 */
export function getOrderGoodsItem(order_goods_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.order.goods.item',
      order_goods_id
    }
  })
}

/**
 * 获取订单各个状态合计数
 * @param {Object} data
 * @returns
 */
export function getOrderStatusTotal(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.order.status.total',
      ...data
    }
  })
}

/**
 * 调整订单应付金额
 * @param {Object} data
 * @returns
 */
export function changePriceOrderItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'change.price.order.item',
      ...data
    }
  })
}

/**
 * 添加或编辑卖家备注
 * @param {Object} data
 * @returns
 */
export function remarkOrderItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'remark.order.item',
      ...data
    }
  })
}

/**
 * 订单批量设为配货状态
 * @param {Array} order_no
 * @param {Number} is_picking
 * @returns
 */
export function pickingOrderList(order_no, is_picking) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'picking.order.list',
      order_no,
      is_picking
    }
  })
}

/**
 * 订单设为发货状态
 * @param {Object} data
 * @returns
 */
export function deliveryOrderItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'delivery.order.item',
      ...data
    }
  })
}

/**
 * 订单批量确认收货
 * @param {Array} order_no
 * @returns
 */
export function completeOrderList(order_no) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'complete.order.list',
      order_no
    }
  })
}

/**
 * 未付款订单超时自动取消
 * @returns
 */
export function timeoutOrderCancel() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'timeout.order.cancel'
    }
  })
}

/**
 * 未确认收货订单超时自动完成
 * @returns
 */
export function timeoutOrderComplete() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'timeout.order.complete'
    }
  })
}
