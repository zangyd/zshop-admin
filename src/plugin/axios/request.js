import axios from 'axios'
import util from '@/utils/util'
import store from '@/store/index'
import { Message, MessageBox } from 'element-ui'
import { get } from 'lodash'

// 创建一个错误
function errorCreate(msg) {
  const error = new Error(msg)
  errorLog(error)
  throw error
}

// 记录和显示错误
function errorLog(error) {
  if (util.cookies.get('block') === 'true') {
    return
  }

  // 添加到日志
  store.dispatch('zshop/log/push', {
    type: 'danger',
    info: '数据请求异常',
    message: error.message,
    meta: { error }
  })

  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(error)
  }

  // 显示提示
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
}

// 创建一个axios实例
const service = axios.create({
  // api的base_url
  baseURL: serverConfig.BASE_API,
  // request timeout
  timeout: 30000,
  // 默认使用简单请求,避免复杂请求(多一次OPTIONS请求)
  // 如有特殊需求或协议不同,可修改为例如"application/json; charset=utf-8"
  headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  // 启用跨域访问携带Cookie
  // withCredentials: true
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    setDefaultParams(config)
    refreshToken(config)
    return config
  },
  error => {
    errorLog(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    // 这个状态码是和后端约定的
    const { status, message } = dataAxios

    // 状态码不存在则非后端请求接口
    if (status === undefined) {
      return dataAxios
    }

    // 处理后端状态码
    switch (status) {
      case 200:
        return dataAxios

      case 401:
        reAuthorize()
        break

      default:
        errorCreate(message)
    }

    return Promise.reject(response)
  },
  error => {
    if (!error.response) {
      // 来自服务端或游览器
      switch (get(error, 'request.status')) {
        case 400: error.message = '请求错误'; break
        case 401: error.message = '未授权，请登录'; break
        case 403: error.message = '拒绝访问'; break
        case 404: error.message = '请求地址不存在'; break
        case 408: error.message = '请求超时'; break
        case 500: error.message = '服务器内部错误'; break
        case 501: error.message = '服务未实现'; break
        case 502: error.message = '网关错误'; break
        case 503: error.message = '服务不可用'; break
        case 504: error.message = '网关超时'; break
        case 505: error.message = 'HTTP版本不受支持'; break
        default: break
      }
    } else {
      // 来自API接口
      const { status, message } = get(error, 'response.data')
      error.message = message || get(error, 'response.statusText')

      if (status === 401) {
        reAuthorize()
      }
    }

    errorLog(error)
    return Promise.reject(error)
  }
)

// 刷新令牌
function refreshToken(config) {
  const token = util.cookies.get('token')
  if (!token || token === 'undefined') {
    return
  }

  // 以下接口不需要刷新令牌
  const whiteList = [
    'refresh.admin.token',
    'logout.admin.user',
    'login.admin.user'
  ]

  if (whiteList.indexOf(get(config, 'data.method')) >= 0) {
    return
  }

  let userInfo = store.state.zshop.user.info
  const nowTime = Math.round(new Date() / 1000) + 100

  if ((nowTime - 3600) > userInfo.token.token_expires && nowTime < userInfo.token.refresh_expires) {
    service({
      method: 'post',
      url: '/v1/admin',
      data: {
        method: 'refresh.admin.token',
        refresh: userInfo.token.refresh
      }
    })
      .then(res => {
        userInfo.token = res.data.token
        store.dispatch('zshop/user/set', userInfo, { root: true }).then(() => {})
        util.cookies.set('token', res.data.token.token)
      })
      .catch(err => {
        errorLog(err)
      })
  }
}

// 重新授权确认
function reAuthorize() {
  if (util.cookies.get('block') === 'true') {
    return
  }

  util.cookies.set('block', 'true')
  MessageBox.confirm('您的授权已过期或在其他地方登录，是否重新登录？', '授权过期', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      util.cookies.remove('token')
      util.cookies.remove('uuid')
      util.cookies.remove('block')
      location.reload()
    })
    .catch(() => {
      util.cookies.set('block', 'false')
    })
}

// 添加默认参数及签名
function setDefaultParams(config) {
  const token = util.cookies.get('token')
  if (!token || token === 'undefined') {
    return
  }

  // 业务参数数组不存在则需要创建
  if (!config.data) {
    config.data = {}
  }

  config.data.token = token
  config.data.appkey = serverConfig.APP_KEY
  config.data.timestamp = Math.round(new Date() / 1000) + 100
  config.data.format = 'json'
  config.data.sign = util.getSign(config.data)
}

export default service
