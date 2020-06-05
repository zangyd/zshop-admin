import request from '@/plugin/axios/request'

const url = '/v1/upload'

/**
 * 获取上传模块列表
 * @returns
 */
export function getUploadModule() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.upload.module'
    }
  })
}

/**
 * 获取上传地址
 * @param {String} module
 * @returns
 */
export function getUploadUrl(module = undefined) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.upload.url',
      module
    }
  })
}

/**
 * 获取上传Token
 * @param {String} module
 * @param {String} type
 * @returns
 */
export function getUploadToken(module = undefined, type = 'web') {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.upload.token',
      module,
      type
    }
  })
}

/**
 * 替换上传资源
 * @param {Number} storage_id
 * @returns
 */
export function replaceUploadItem(storage_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'replace.upload.item',
      storage_id
    }
  })
}
