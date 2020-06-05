import request from '@/plugin/axios/request'

const url = '/v1/message'

/**
 * 添加一条消息
 * @param {Object} data
 * @returns
 */
export function addMessageItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.message.item',
      ...data
    }
  })
}

/**
 * 编辑一条消息
 * @param {Object} data
 * @returns
 */
export function setMessageItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.message.item',
      ...data
    }
  })
}

/**
 * 批量删除消息
 * @param {Array} message_id
 * @returns
 */
export function delMessageList(message_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.message.list',
      message_id
    }
  })
}

/**
 * 批量正式发布消息
 * @param {Array} message_id
 * @returns
 */
export function setMessageStatus(message_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.message.status',
      message_id
    }
  })
}

/**
 * 获取一条消息(后台)
 * @param {Number} message_id
 * @returns
 */
export function getMessageItem(message_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.message.item',
      message_id
    }
  })
}

/**
 * 获取消息列表(后台)
 * @param {Object} data
 * @returns
 */
export function getMessageList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.message.list',
      ...data
    }
  })
}

/**
 * 用户获取一条消息
 * @param {Number} message_id
 * @returns
 */
export function getMessageUserItem(message_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.message.user.item',
      message_id
    }
  })
}

/**
 * 用户获取消息列表
 * @param {Object} data
 * @returns
 */
export function getMessageUserList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.message.user.list',
      ...data
    }
  })
}

/**
 * 用户获取未读消息数
 * @param {Number} type
 * @returns
 */
export function getMessageUserUnread(type) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.message.user.unread',
      type
    }
  })
}

/**
 * 用户批量设置消息已读
 * @param {Array} message_id
 * @param {Number} type
 * @returns
 */
export function setMessageUserRead(message_id, type = null) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.message.user.read',
      message_id,
      type
    }
  })
}

/**
 * 用户设置消息全部已读
 * @param {Number} type
 * @returns
 */
export function setMessageUserAllread(type = null) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.message.user.allread',
      type
    }
  })
}

/**
 * 用户批量删除消息
 * @param {Array} message_id
 * @param {Number} type
 * @returns
 */
export function delMessageUserList(message_id, type = null) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.message.user.list',
      message_id,
      type
    }
  })
}

/**
 * 用户删除全部消息
 * @param {Number} type
 * @returns
 */
export function delMessageUserAll(type = null) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.message.user.all',
      type
    }
  })
}
