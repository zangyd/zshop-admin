<template>
  <video-player
    class="video-player vjs-custom-skin"
    ref="videoPlayer"
    :playsinline="true"
    :options="playerOptions">
  </video-player>
</template>

<script>
import util from '@/utils/util'
import { size } from 'lodash'
import 'video.js/dist/lang/zh-CN'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

export default {
  name: 'cs-video',
  props: {
    // 视频资源 url=路径 mime=类型 cover=海报
    videoData: {
      type: [Object, Array],
      required: false,
      default: () => {}
    },
    // 是否自动播放
    autoplay: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否静音
    muted: {
      type: Boolean,
      required: false,
      default: false
    },
    // 窗口比例
    aspectRatio: {
      type: String,
      required: false,
      default: '16:9'
    }
  },
  watch: {
    videoData: {
      handler(val) {
        this.setSources(val)
      },
      immediate: true
    }
  },
  data() {
    return {
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        autoplay: this.autoplay,
        muted: this.muted,
        loop: false,
        preload: 'auto',
        language: 'zh-CN',
        aspectRatio: this.aspectRatio,
        fluid: true,
        sources: [],
        poster: this.videoData.cover,
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true
        }
      }
    }
  },
  methods: {
    // 更换视频源
    setSources(sources) {
      if (size(sources) === 0) {
        return
      }

      this.playerOptions.poster = util.getImageStyleUrl(sources.cover)
      this.playerOptions.sources = [{ src: util.checkUrl(sources.url), type: sources.mime }]
    },
    // 移除视频源
    delSources() {
      this.playerOptions.poster = ''
      this.playerOptions.sources = [{}]
    }
  }
}
</script>
