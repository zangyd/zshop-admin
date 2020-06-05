import request from '@/plugin/axios/request'

const url = '/v1/notice'

/**
 * 获取一个通知系统
 * @param {String} code
 * @returns
 */
export function getNoticeItem(code) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.notice.item',
      code
    }
  })
}

/**
 * 获取通知系统列表
 * @returns
 */
export function getNoticeList() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.notice.list'
    }
  })
}

/**
 * 批量设置通知系统是否启用
 * @param {Array} code
 * @param {Number} status
 * @returns
 */
export function setNoticeStatus(code, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.notice.status',
      code,
      status
    }
  })
}

/**
 * 设置一个通知系统
 * @param {Object} data
 * @returns
 */
export function setNoticeItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.notice.item',
      ...data
    }
  })
}
