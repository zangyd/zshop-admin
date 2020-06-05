import layoutHeaderAside from '@/layout/header-aside'

const meta = { auth: true }

export default {
  path: '/setting',
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}index`,
      meta: { ...meta, cache: true, title: '设置首页' },
      component: () => import('@/views/setting/index')
    },
    {
      path: 'admin/member',
      name: `${pre}admin-member`,
      meta: { ...meta, cache: true, title: '管理人员' },
      component: () => import('@/views/setting/admin/member')
    },
    {
      path: 'admin/action',
      name: `${pre}admin-action`,
      meta: { ...meta, cache: true, title: '操作日志' },
      component: () => import('@/views/setting/admin/action')
    },
    {
      path: 'auth/group',
      name: `${pre}auth-group`,
      meta: { ...meta, cache: true, title: '用户组' },
      component: () => import('@/views/setting/auth/group')
    },
    {
      path: 'auth/menu',
      name: `${pre}auth-menu`,
      meta: { ...meta, cache: true, title: '菜单管理' },
      component: () => import('@/views/setting/auth/menu')
    },
    {
      path: 'auth/rule',
      name: `${pre}auth-rule`,
      meta: { ...meta, cache: true, title: '权限规则' },
      component: () => import('@/views/setting/auth/rule')
    },
    {
      path: 'setting/system',
      name: `${pre}setting-system`,
      meta: { ...meta, cache: true, title: '系统管理' },
      component: () => import('@/views/setting/setting/system')
    },
    {
      path: 'setting/info',
      name: `${pre}setting-info`,
      meta: { ...meta, cache: true, title: '系统信息' },
      component: () => import('@/views/setting/setting/info')
    },
    {
      path: 'setting/navi',
      name: `${pre}setting-navi`,
      meta: { ...meta, cache: true, title: '前台导航' },
      component: () => import('@/views/setting/setting/navi')
    },
    {
      path: 'setting/template',
      name: `${pre}setting-template`,
      meta: { ...meta, cache: true, title: '消息模板' },
      component: () => import('@/views/setting/setting/template')
    },
    {
      path: 'payment/config',
      name: `${pre}payment-config`,
      meta: { ...meta, cache: true, title: '支付配置' },
      component: () => import('@/views/setting/payment/config')
    },
    {
      path: 'payment/log',
      name: `${pre}payment-log`,
      meta: { ...meta, cache: true, title: '支付日志' },
      component: () => import('@/views/setting/payment/log')
    },
    {
      path: 'logistics/region',
      name: `${pre}logistics-region`,
      meta: { ...meta, cache: true, title: '区域管理' },
      component: () => import('@/views/setting/logistics/region')
    },
    {
      path: 'logistics/company',
      name: `${pre}logistics-company`,
      meta: { ...meta, cache: true, title: '快递公司' },
      component: () => import('@/views/setting/logistics/company')
    },
    {
      path: 'logistics/delivery',
      name: `${pre}logistics-delivery`,
      meta: { ...meta, cache: true, title: '配送方式' },
      component: () => import('@/views/setting/logistics/delivery')
    },
    {
      path: 'logistics/delivery/area/:delivery_id/:delivery_item_id',
      name: `${pre}logistics-delivery-area`,
      props: true,
      meta: { ...meta, title: '配送区域' },
      component: () => import('@/views/setting/logistics/delivery-area')
    },
    {
      path: 'app/app',
      name: `${pre}app-app`,
      meta: { ...meta, cache: true, title: 'App应用' },
      component: () => import('@/views/setting/app/app')
    },
    {
      path: 'app/app_install',
      name: `${pre}app-app_install`,
      meta: { ...meta, cache: true, title: 'App安装包' },
      component: () => import('@/views/setting/app/app_install')
    },
    {
      path: 'app/authorize',
      name: `${pre}app-authorize`,
      meta: { ...meta, cache: true, title: '商业授权' },
      component: () => import('@/views/setting/app/authorize')
    }
  ])('setting-')
}
