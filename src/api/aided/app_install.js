import request from '@/plugin/axios/request'

const url = '/v1/app_install'

/**
 * 添加一个应用安装包
 * @param {Object} data
 * @returns
 */
export function addAppInstallItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.app.install.item',
      ...data
    }
  })
}

/**
 * 编辑一个应用安装包
 * @param {Object} data
 * @returns
 */
export function setAppInstallItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.app.install.item',
      ...data
    }
  })
}

/**
 * 获取一个应用安装包
 * @param {Number} app_install_id
 * @returns
 */
export function getAppInstallItem(app_install_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.app.install.item',
      app_install_id
    }
  })
}

/**
 * 批量删除应用安装包
 * @param {Array} app_install_id
 * @returns
 */
export function delAppInstallList(app_install_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.app.install.list',
      app_install_id
    }
  })
}

/**
 * 获取应用安装包列表
 * @param {Object} data
 * @returns
 */
export function getAppInstallList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.app.install.list',
      ...data
    }
  })
}

/**
 * 根据条件查询是否有更新
 * @param {String} user_agent
 * @param {String} ver
 * @returns
 */
export function queryAppInstallUpdated(user_agent, ver) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'query.app.install.updated',
      user_agent,
      ver
    }
  })
}

/**
 * 根据请求获取一个应用安装包
 * @returns
 */
export function requestAppInstallItem() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'request.app.install.item'
    }
  })
}
