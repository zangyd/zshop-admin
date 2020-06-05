<template>
  <div>
    <el-tooltip
      v-show="isBackToTop && $parent.csScroll.y > 200"
      content="返回顶部"
      placement="top"
      :open-delay="1000">
      <div class="cs-floating top" @click="$parent.$refs.component.backToTop()">
        <i class="el-icon-caret-top"/>
      </div>
    </el-tooltip>

    <el-tooltip
      v-show="isBack"
      content="返回上一页"
      placement="top"
      :open-delay="1000">
      <div class="cs-floating back" @click="$router.back()">
        <i class="el-icon-caret-left"/>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'cs-back-to-top',
  props: {
    isBackToTop: {
      type: Boolean,
      default: true
    },
    isBack: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .top {
    bottom: 110px;
  }

  .back {
    bottom: 75px;
  }

  .cs-floating {
    position: absolute;
    z-index: 1;
    right: 59px;
    width: 32px;
    border-radius: 4px;
    background-color: rgba($color-text-sub, .7);
    color: #FFF;
    line-height: 25px;
    text-align: center;
    transition: all .3s;
    @extend %unable-select;

    &:hover {
      background-color: rgba($color-text-normal, .9);
    }
  }
</style>
