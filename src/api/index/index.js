import request from '@/plugin/axios/request'

const url = '/v1/index'

/**
 * 清空所有缓存
 * @returns
 */
export function clearCacheAll() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'clear.cache.all'
    }
  })
}

/**
 * 调整最优状态(服务端为正式环境有效)
 * @returns
 */
export function setSystemOptimize() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.system.optimize'
    }
  })
}

/**
 * 获取内核版本号
 * @returns
 */
export function getKernelVersion() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.system.version'
    }
  })
}

/**
 * 批量调用
 * @param {Array} data
 * @returns
 */
export function batchRequests(data) {
  return request({
    url: '/batch',
    method: 'post',
    data: {
      batch: data
    }
  })
}
