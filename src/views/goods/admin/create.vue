<template>
  <cs-container>
    <page-edit
      ref="create"
      state="create"
      :confirm-loading.sync="confirmLoading"
      @close="handleClose">
    </page-edit>

    <template slot="footer">
      <div style="margin: -10px 0;">
        <el-button
          type="primary"
          size="small"
          :loading="confirmLoading"
          @click="handleConfirm">确定</el-button>

        <el-button
          size="small"
          @click="handleClose">取消</el-button>
      </div>
    </template>
  </cs-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'goods-admin-create',
  components: {
    PageEdit: () => import('./components/PageEdit')
  },
  data() {
    return {
      confirmLoading: false
    }
  },
  methods: {
    ...mapActions('zshop/page', [
      'close'
    ]),
    // 请求提交
    handleConfirm() {
      this.$refs.create.handleConfirm()
    },
    // 关闭当前窗口
    handleClose() {
      this.close({
        tagName: this.$route.fullPath
      })
    }
  }
}
</script>
