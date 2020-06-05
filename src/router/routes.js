import index from './modules/index'
import system from './modules/system'
import setting from './modules/setting'
import member from './modules/member'
import marketing from './modules/marketing'
import order from './modules/order'
import goods from './modules/goods'
import finance from './modules/finance'

/**
 * 在主框架内显示
 */
const frameIn = [
  index,
  system,
  setting,
  member,
  marketing,
  order,
  goods,
  finance
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: () => import('@/views/public/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
