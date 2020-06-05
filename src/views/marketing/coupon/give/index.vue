<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :table-data="table"
      :coupon-data="couponData"
      :coupon-type="couponType"
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
import { getCouponItem } from '@/api/marketing/coupon'
import { getCouponGiveList } from '@/api/marketing/coupon_give'

export default {
  name: 'marketing-coupon-give',
  components: {
    PageHeader: () => import('./components/PageHeader'),
    PageMain: () => import('./components/PageMain'),
    PageFooter: () => import('@/components/cs-footer')
  },
  props: {
    coupon_id: {
      type: [String, Number],
      required: false,
      default: 0
    }
  },
  data() {
    return {
      table: [],
      loading: false,
      couponData: null,
      couponType: '',
      page: {
        current: 1,
        size: 0,
        total: 0
      }
    }
  },
  mounted() {
    let request = [
      this.$store.dispatch('zshop/db/databasePage', { user: true })
    ]

    if (this.coupon_id !== 0) {
      request.push(getCouponItem(this.coupon_id))
    }

    Promise.all(request)
      .then(res => {
        this.page.size = res[0].get('size').value() || 25
        this.couponData = res[1] ? res[1].data : null
      })
      .then(() => {
        this.handleSubmit({ coupon_id: this.coupon_id }, true)
      })
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
    // 提交查询请求
    handleSubmit(form, isRestore = false) {
      if (isRestore) {
        this.page.current = 1
      }

      this.loading = true
      this.couponType = form.type

      getCouponGiveList({
        ...form,
        coupon_id: this.coupon_id,
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
