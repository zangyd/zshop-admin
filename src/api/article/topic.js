import request from '@/plugin/axios/request'

const url = '/v1/topic'

/**
 * 添加一个专题
 * @param {Object} data
 * @returns
 */
export function addTopicItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.topic.item',
      ...data
    }
  })
}

/**
 * 编辑一个专题
 * @param {Object} data
 * @returns
 */
export function setTopicItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.topic.item',
      ...data
    }
  })
}

/**
 * 批量删除专题
 * @param {Array} topic_id
 * @returns
 */
export function delTopicList(topic_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.topic.list',
      topic_id
    }
  })
}

/**
 * 获取一个专题
 * @param {Number} topic_id
 * @returns
 */
export function getTopicItem(topic_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.topic.item',
      topic_id
    }
  })
}

/**
 * 获取专题列表
 * @param {Object} data
 * @returns
 */
export function getTopicList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.topic.list',
      ...data
    }
  })
}

/**
 * 批量设置专题是否显示
 * @param {Array} topic_id
 * @param {Number} status
 * @returns
 */
export function setTopicStatus(topic_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.topic.status',
      topic_id,
      status
    }
  })
}
