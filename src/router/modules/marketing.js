import layoutHeaderAside from '@/layout/header-aside'

const meta = { auth: true }

export default {
  path: '/marketing',
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}index`,
      meta: { ...meta, cache: true, title: '营销首页' },
      component: () => import('@/views/marketing/index')
    },
    {
      path: 'marketing/discount',
      name: `${pre}marketing-discount`,
      meta: { ...meta, cache: true, title: '商品折扣' },
      component: () => import('@/views/marketing/discount')
    },
    {
      path: 'marketing/promotion',
      name: `${pre}marketing-promotion`,
      meta: { ...meta, cache: true, title: '订单促销' },
      component: () => import('@/views/marketing/promotion')
    },
    {
      path: 'card/list',
      name: `${pre}card-list`,
      meta: { ...meta, cache: true, title: '购物卡' },
      component: () => import('@/views/marketing/card/list')
    },
    {
      path: 'card/use',
      name: `${pre}card-use`,
      props: true,
      meta: { ...meta, title: '购物卡使用' },
      component: () => import('@/views/marketing/card/use')
    },
    {
      path: 'coupon/list',
      name: `${pre}coupon-list`,
      meta: { ...meta, cache: true, title: '优惠劵' },
      component: () => import('@/views/marketing/coupon/list')
    },
    {
      path: 'coupon/give',
      name: `${pre}coupon-give`,
      props: true,
      meta: { ...meta, title: '优惠劵使用' },
      component: () => import('@/views/marketing/coupon/give')
    }
  ])('marketing-')
}
