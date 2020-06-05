import request from '@/plugin/axios/request'

const url = '/v1/notice_tpl'

/**
 * 获取一个通知系统模板
 * @param {Number} notice_tpl_id
 * @returns
 */
export function getNoticeTplItem(notice_tpl_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.notice.tpl.item',
      notice_tpl_id
    }
  })
}

/**
 * 获取通知系统模板列表
 * @param {String} code
 * @returns
 */
export function getNoticeTplList(code) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.notice.tpl.list',
      code
    }
  })
}

/**
 * 编辑一个通知系统模板
 * @param {Object} data
 * @returns
 */
export function setNoticeTplItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.notice.tpl.item',
      ...data
    }
  })
}

/**
 * 批量设置通知系统模板是否启用
 * @param {Array} notice_tpl_id
 * @param {Number} status
 * @returns
 */
export function setNoticeTplStatus(notice_tpl_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.notice.tpl.status',
      notice_tpl_id,
      status
    }
  })
}
