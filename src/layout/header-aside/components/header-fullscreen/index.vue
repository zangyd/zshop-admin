<template>
  <el-tooltip effect="dark" :content="active ? '退出全屏' : '全屏'" placement="bottom">
    <el-button class="btn-text can-hover" type="text" @click="toggle" icon="el-icon-full-screen"/>
  </el-tooltip>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('zshop/fullscreen', [
      'active'
    ])
  },
  methods: {
    ...mapActions('zshop/fullscreen', [
      'toggle'
    ])
  }
}
</script>
