import request from '@/plugin/axios/request'

const url = '/v1/ask'

/**
 * 删除一条记录
 * @param {Number} ask_id
 * @returns
 */
export function delAskItem(ask_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.ask.item',
      ask_id
    }
  })
}

/**
 * 回复一个提问
 * @param {Number} ask_id
 * @param {string} answer
 * @returns
 */
export function replyAskItem(ask_id, answer) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'reply.ask.item',
      ask_id,
      answer
    }
  })
}

/**
 * 获取一个问答明细
 * @param {Number} ask_id
 * @returns
 */
export function getAskItem(ask_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.ask.item',
      ask_id
    }
  })
}

/**
 * 获取问答主题列表
 * @param {Object} data
 * @returns
 */
export function getAskList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.ask.list',
      ...data
    }
  })
}
