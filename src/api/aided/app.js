import request from '@/plugin/axios/request'

const url = '/v1/app'

/**
 * 添加一个应用
 * @param {Object} data
 * @returns
 */
export function addAppItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.app.item',
      ...data
    }
  })
}

/**
 * 编辑一个应用
 * @param {Object} data
 * @returns
 */
export function setAppItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.app.item',
      ...data
    }
  })
}

/**
 * 获取一个应用
 * @param {Number} app_id
 * @returns
 */
export function getAppItem(app_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.app.item',
      app_id
    }
  })
}

/**
 * 获取应用列表
 * @param {Object} data
 * @returns
 */
export function getAppList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.app.list',
      ...data
    }
  })
}

/**
 * 批量删除应用
 * @param {Array} app_id
 * @returns
 */
export function delAppList(app_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.app.list',
      app_id
    }
  })
}

/**
 * 查询应用名称是否已存在
 * @param {String} app_name
 * @param {Number} exclude_id
 * @returns
 */
export function uniqueAppName(app_name, exclude_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'unique.app.name',
      app_name,
      exclude_id
    }
  })
}

/**
 * 更换应用Secret
 * @param {Number} app_id
 * @returns
 */
export function replaceAppSecret(app_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'replace.app.secret',
      app_id
    }
  })
}

/**
 * 批量设置应用验证码
 * @param {Array} app_id
 * @param {Number} captcha
 * @returns
 */
export function setAppCaptcha(app_id, captcha) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.app.captcha',
      app_id,
      captcha
    }
  })
}

/**
 * 批量设置应用状态
 * @param {Array} app_id
 * @param {Number} status
 * @returns
 */
export function setAppStatus(app_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.app.status',
      app_id,
      status
    }
  })
}

/**
 * 查询应用验证码状态
 * @param {String} app_key
 * @returns
 */
export function getAppCaptcha(app_key) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.app.captcha',
      appkey: app_key
    }
  })
}
