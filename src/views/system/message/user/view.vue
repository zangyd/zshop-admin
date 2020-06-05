<template>
  <cs-container>
    <div class="cs-p">
      <el-card
        class="box-card"
        shadow="never">
        <div slot="header" class="clearfix">
          <h2>{{message.title}}</h2>
          <span>最后编辑：{{message.update_time}}</span>
          <span>游览量：{{message.page_views}}</span>
        </div>
        <div class="mce-content-body" v-html="message.content"></div>
      </el-card>
    </div>
  </cs-container>
</template>

<script>
import { getMessageUserItem } from '@/api/message/message'

export default {
  props: {
    message_id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      message: {}
    }
  },
  watch: {
    message_id: {
      handler() {
        this.getMessageData()
      },
      immediate: true
    }
  },
  methods: {
    resetMessageData() {
      this.message = {}
    },
    getMessageData() {
      this.resetMessageData()
      getMessageUserItem(this.message_id)
        .then(res => {
          this.message = res.data || {}
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/assets/style/fixed/tinymce.scss';

  .box-card {
    border-radius: 0;
    border: 1px solid $color-border-1;
  }

  .clearfix {
    text-align: center;
  }

  .clearfix span, a {
    color: $color-text-sub;
    font-size: 13px;
    margin-right: 15px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }
</style>
