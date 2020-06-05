<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      :type-map="typeMap"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :type-map="typeMap"
      :table-data="table"
      @tabs="handleTabs"
      @refresh="handleRefresh"/>

    <page-footer
      slot="footer"
      :loading="loading"
      :current="page.current"
      :size="page.size"
      :total="page.total"
      @change="handlePaginationChange"/>
  </cs-container>
</template>

<script>
import { getOrderServiceList } from '@/api/order/service'

export default {
  name: 'order-service-list',
  components: {
    PageHeader: () => import('./components/PageHeader'),
    PageMain: () => import('./components/PageMain'),
    PageFooter: () => import('@/components/cs-footer')
  },
  data() {
    return {
      loading: false,
      table: [],
      status: null,
      typeMap: {
        0: '仅退款',
        1: '退货退款',
        2: '换货',
        3: '维修'
      },
      page: {
        current: 1,
        size: 0,
        total: 0
      }
    }
  },
  mounted() {
    this.$store.dispatch('zshop/db/databasePage', { user: true })
      .then(res => {
        this.page.size = res.get('size').value() || 25
      })
      .then(() => {
        this.handleSubmit()
      })
  },
  beforeRouteEnter(to, from, next) {
    // 从订单详情页返回后刷新列表
    if (from.name === 'order-service-info') {
      next(instance => {
        if (instance.$refs.header) {
          instance.$refs.header.handleFormSubmit()
        }
      })
    } else {
      next()
    }
  },
  methods: {
    // 刷新列表页面
    handleRefresh(isTurning = false) {
      if (isTurning) {
        !(this.page.current - 1) || this.page.current--
      }

      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit()
      })
    },
    // 分页变化改动
    handlePaginationChange(val) {
      this.page = val
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit()
      })
    },
    // 标签页切换
    handleTabs(val) {
      this.status = val <= 0 ? null : val - 1
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit(true)
      })
    },
    // 提交查询请求
    handleSubmit(form, isRestore = false) {
      if (isRestore) {
        this.page.current = 1
      }

      this.loading = true
      getOrderServiceList({
        ...form,
        status: this.status,
        page_no: this.page.current,
        page_size: this.page.size
      })
        .then(res => {
          this.table = res.data.items || []
          this.page.total = res.data.total_result
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
