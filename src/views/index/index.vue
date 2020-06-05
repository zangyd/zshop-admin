<template>
  <cs-container :is-back="false">
    <cs-page-cover
      title="zshop Admin"
      sub-title="商城后台管理系统集成方案">
      <img src="~@/assets/image/logo@2x.png" alt="logo">
    </cs-page-cover>
  </cs-container>
</template>

<script>
import CsPageCover from './components/cs-page-cover'

export default {
  components: {
    CsPageCover
  }
}
</script>

<style lang="scss" scoped>
  .index-btn-group {
    color: $color-text-placehoder;

    span {
      font-size: 13px;
      color: $color-text-sub;

      &:hover {
        color: $color-text-main;
        cursor: pointer;
      }
    }
  }
</style>
