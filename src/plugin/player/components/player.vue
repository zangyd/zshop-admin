<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
    @close="close"
    class="player-dialog cs-fcc">
    <span class="el-image-viewer__btn el-image-viewer__close" @click="close">
      <i class="el-icon-circle-close"></i>
    </span>

    <div v-if="dialogVisible" class="player">
      <cs-video :video-data="{url: dialogVideoUrl, mime: dialogVideoMime, cover: dialogVidePoster}"/>
    </div>
  </el-dialog>
</template>

<script>
import util from '@/utils/util'

export default {
  name: 'player',
  components: {
    csVideo: () => import('@/components/cs-video')
  },
  data() {
    return {
      dialogVisible: false,
      dialogVideoMime: '',
      dialogVideoUrl: '',
      dialogVidePoster: ''
    }
  },
  methods: {
    show(url, mime, poster) {
      this.$nextTick(() => {
        this.dialogVideoMime = mime
        this.dialogVideoUrl = util.checkUrl(url)
        this.dialogVidePoster = util.getImageStyleUrl(poster)
        this.dialogVisible = true
      })
    },
    close() {
      this.dialogVisible = false
      this.dialogVideoMime = ''
      this.dialogVideoUrl = ''
      this.dialogVidePoster = ''
    }
  }
}
</script>

<style scoped>
  .player-dialog >>> .el-image-viewer__close {
    position: fixed;
    color: #FFF;
  }

  .player-dialog >>> .el-dialog {
    margin: 0 !important;
    border-radius: 0;
    box-shadow: none;
    background: inherit;
  }

  .player-dialog >>> .el-dialog__header {
    display: none;
  }

  .player-dialog >>> .el-dialog__body {
    padding: 0;
    text-align: center;
  }
</style>
