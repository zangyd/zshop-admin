import request from '@/plugin/axios/request'

const url = '/v1/coupon_give'

/**
 * 向指定用户发放优惠劵
 * @param {Object} data
 * @returns
 */
export function giveCouponUser(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'give.coupon.user',
      ...data
    }
  })
}

/**
 * 生成线下优惠劵
 * @param {Number} coupon_id
 * @param {Number} give_number
 * @returns
 */
export function giveCouponLive(coupon_id, give_number) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'give.coupon.live',
      coupon_id,
      give_number
    }
  })
}

/**
 * 获取已领取优惠劵列表
 * @param {Object} data
 * @returns
 */
export function getCouponGiveList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.coupon.give.list',
      ...data
    }
  })
}

/**
 * 批量删除已领取优惠劵
 * @param {Array} coupon_give_id
 * @returns
 */
export function delCouponGiveList(coupon_give_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.coupon.give.list',
      coupon_give_id
    }
  })
}

/**
 * 批量恢复已删优惠劵
 * @param {Array} coupon_give_id
 * @returns
 */
export function recCouponGiveList(coupon_give_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'rec.coupon.give.list',
      coupon_give_id
    }
  })
}

/**
 * 导出线下生成的优惠劵
 * @param {Number} coupon_id
 * @returns
 */
export function getCouponGiveExport(coupon_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.coupon.give.export',
      coupon_id
    }
  })
}
