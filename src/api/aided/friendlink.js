import request from '@/plugin/axios/request'

const url = '/v1/friend_link'

/**
 * 添加一个友情链接
 * @param {Object} data
 * @returns
 */
export function addFriendlinkItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.friendlink.item',
      ...data
    }
  })
}

/**
 * 编辑一个友情链接
 * @param {Object} data
 * @returns
 */
export function setFriendlinkItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.friendlink.item',
      ...data
    }
  })
}

/**
 * 获取一个友情链接
 * @param {Number} friend_link_id
 * @returns
 */
export function getFriendlinkItem(friend_link_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.friendlink.item',
      friend_link_id
    }
  })
}

/**
 * 获取友情链接列表
 * @param {Object} data
 * @returns
 */
export function getFriendlinkList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.friendlink.list',
      ...data
    }
  })
}

/**
 * 批量删除友情链接
 * @param {Array} friend_link_id
 * @returns
 */
export function delFriendlinkList(friend_link_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.friendlink.list',
      friend_link_id
    }
  })
}

/**
 * 批量设置友情链接状态
 * @param {Array} friend_link_id
 * @param {Number} status
 * @returns
 */
export function setFriendlinkStatus(friend_link_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.friendlink.status',
      friend_link_id,
      status
    }
  })
}

/**
 * 设置友情链接排序
 * @param {Number} friend_link_id
 * @param {Number} sort
 * @returns
 */
export function setFriendlinkSort(friend_link_id, sort) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.friendlink.sort',
      friend_link_id,
      sort
    }
  })
}
