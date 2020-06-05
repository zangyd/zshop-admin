import layoutHeaderAside from '@/layout/header-aside'

const meta = { auth: true }

export default {
  path: '/order',
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}index`,
      meta: { ...meta, cache: true, title: '订单首页' },
      component: () => import('@/views/order/index')
    },
    {
      path: 'admin/list',
      name: `${pre}admin-list`,
      meta: { ...meta, cache: true, title: '订单列表' },
      component: () => import('@/views/order/admin')
    },
    {
      path: 'admin/info/:order_no',
      name: `${pre}admin-info`,
      props: true,
      meta: { ...meta, title: '订单详情' },
      component: () => import('@/views/order/admin/info')
    },
    {
      path: 'admin/print',
      name: `${pre}admin-print`,
      props: true,
      meta: { ...meta, cache: true, title: '订单打印' },
      component: () => import('@/views/order/admin/print')
    },
    {
      path: 'admin/refund',
      name: `${pre}admin-refund`,
      meta: { ...meta, cache: true, title: '退款日志' },
      component: () => import('@/views/order/refund')
    },
    {
      path: 'service/list',
      name: `${pre}service-list`,
      meta: { ...meta, cache: true, title: '售后列表' },
      component: () => import('@/views/order/service')
    },
    {
      path: 'service/info/:service_no',
      name: `${pre}service-info`,
      props: true,
      meta: { ...meta, title: '售后详情' },
      component: () => import('@/views/order/service/info')
    }
  ])('order-')
}
