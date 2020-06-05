import layoutHeaderAside from '@/layout/header-aside'

const meta = { auth: true }

export default {
  path: '/finance',
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}index`,
      meta: { ...meta, cache: true, title: '财务首页' },
      component: () => import('@/views/finance/index')
    }
  ])('finance-')
}
