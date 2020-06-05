import request from '@/plugin/axios/request'

const url = '/v1/coupon'

/**
 * 添加一张优惠劵
 * @param {Object} data
 * @returns
 */
export function addCouponItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.coupon.item',
      ...data
    }
  })
}

/**
 * 编辑一张优惠劵
 * @param {Object} data
 * @returns
 */
export function setCouponItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.coupon.item',
      ...data
    }
  })
}

/**
 * 获取一张优惠劵
 * @param {Number} coupon_id
 * @returns
 */
export function getCouponItem(coupon_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.coupon.item',
      coupon_id
    }
  })
}

/**
 * 获取优惠劵列表
 * @param {Object} data
 * @returns
 */
export function getCouponList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.coupon.list',
      ...data
    }
  })
}

/**
 * 获取优惠劵选择列表
 * @param {Object} data
 * @returns
 */
export function getCouponSelect(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.coupon.select',
      ...data
    }
  })
}

/**
 * 批量删除优惠劵
 * @param {Array} coupon_id
 * @returns
 */
export function delCouponList(coupon_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.coupon.list',
      coupon_id
    }
  })
}

/**
 * 批量设置优惠劵状态
 * @param {Array} coupon_id
 * @param {Number} status
 * @returns
 */
export function setCouponStatus(coupon_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.coupon.status',
      coupon_id,
      status
    }
  })
}

/**
 * 批量设置优惠劵是否失效
 * @param {Array} coupon_id
 * @param {Number} is_invalid
 * @returns
 */
export function setCouponInvalid(coupon_id, is_invalid) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.coupon.invalid',
      coupon_id,
      is_invalid
    }
  })
}

/**
 * 获取当前可领取的优惠劵列表
 * @returns
 */
export function getCouponActive() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.coupon.active'
    }
  })
}
