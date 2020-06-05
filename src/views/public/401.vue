<template>
  <cs-container :is-back="false">
    <div class="page">
      <img src="~@/assets/image/logo@2x.png" alt="404">
      <p class="page_title">401 Unauthorized</p>
      <el-button class="cs-mt" @click="handleClose">离开</el-button>
    </div>
  </cs-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'page401',
  methods: {
    ...mapActions('zshop/page', [
      'close'
    ]),
    handleClose() {
      this.close({
        tagName: this.$route.fullPath
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page {
    height: 100%;
    @extend %flex-center-col;

    .page_title {
      font-size: 20px;
      color: $color-text-main;
    }
  }
</style>
