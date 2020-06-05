<template>
  <div v-if="!isIE" v-show="viewer" class="cs-preview">
    <el-image-viewer v-if="viewer" :initial-index="imageIndex" :url-list="imageList" :z-index="5000" :on-close="close"/>
  </div>

  <el-dialog
    v-else
    class="cs-preview cs-image cs-fcc"
    :visible.sync="viewer"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
    @close="close">
    <span class="el-image-viewer__btn el-image-viewer__close" @click="close">
      <i class="el-icon-circle-close"></i>
    </span>

    <el-image v-if="viewer" class="cs-cp" :src="imageUrl" fit="fill" @click.native="$open(imageUrl)"/>
  </el-dialog>
</template>

<script>
import util from '@/utils/util'

export default {
  name: 'preview',
  components: {
    ElImageViewer: () => {
      return !util.isIE() ? import('element-ui/packages/image/src/image-viewer') : null
    }
  },
  mounted() {
    if (!this.isIE) {
      document.body.appendChild(this.$el)
    }
  },
  destroyed() {
    if (!this.isIE && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  data() {
    return {
      isIE: util.isIE(),
      viewer: false,
      imageIndex: 0,
      imageList: [],
      imageUrl: ''
    }
  },
  methods: {
    getImageList(image) {
      let result = []
      if (Array.isArray(image)) {
        for (let item of image) {
          result.push(util.checkUrl(item.source || item))
        }
      } else {
        result.push(util.checkUrl(image.source || image))
      }

      return result
    },
    visible(image, index) {
      this.$nextTick(() => {
        const temp = this.getImageList(image)
        if (this.isIE) {
          this.imageUrl = Object.prototype.hasOwnProperty.call(temp, index)
            ? temp[index]
            : temp[0]
        } else {
          this.imageList = temp
          this.imageIndex = index
        }

        this.viewer = true
      })
    },
    close() {
      this.$nextTick(() => {
        this.viewer = false
        this.imageList = []
        this.imageUrl = ''
      })
    }
  }
}
</script>

<style scoped>
  .cs-preview >>> .el-image-viewer__close {
    color: #FFF;
  }

  .cs-image >>> .el-image-viewer__close {
    position: fixed;
  }

  .cs-image >>> .el-dialog {
    margin: 0 !important;
    border-radius: 0;
    box-shadow: none;
    background: inherit;
  }

  .cs-image >>> .el-dialog__header {
    display: none;
  }

  .cs-image >>> .el-dialog__body {
    padding: 0;
    text-align: center;
  }
</style>
