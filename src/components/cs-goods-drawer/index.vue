<template>
  <el-drawer
    class="view-goods"
    size="100%"
    :visible.sync="drawer"
    :append-to-body="true"
    :destroy-on-close="true"
    :show-close="true"
    :modal="false">
    <cs-goods-view :goods_id="currentGoodsId" :is-back="false"/>
  </el-drawer>
</template>

<script>
export default {
  name: 'cs-goods-drawer',
  components: {
    csGoodsView: () => import('@/views/goods/admin/view')
  },
  data() {
    return {
      drawer: false,
      currentGoodsId: 0
    }
  },
  methods: {
    show(val) {
      this.currentGoodsId = val
      this.drawer = true
    }
  }
}
</script>

<style scoped>
  .view-goods >>> .el-drawer__body {
    height: auto;
    overflow: auto;
  }
</style>
