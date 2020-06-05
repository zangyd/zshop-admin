<template>
  <cs-container :is-back="false">
    <el-form
      class="form-box cs-m"
      label-width="150px"
      label-position="left">
      <el-form-item class="action" :label="delivery.name">
        <span>{{delivery.value}}</span>
        <el-button
          class="form-button active"
          type="text"
          size="small"
          @click="copyData(delivery.value)">复制</el-button>
      </el-form-item>

      <el-form-item class="action" :label="captcha.name">
        <span>{{captcha.value}}</span>
        <el-button
          class="form-button active"
          type="text"
          size="small"
          @click="copyData(captcha.value)">复制</el-button>
      </el-form-item>

      <el-form-item class="action" :label="qrcode.name">
        <span>{{qrcode.value}}</span>
        <el-button
          class="form-button active"
          type="text"
          size="small"
          @click="copyData(qrcode.value)">复制</el-button>
      </el-form-item>

      <el-form-item class="action" :label="barcode.name">
        <span>{{barcode.value}}</span>
        <el-button
          class="form-button active"
          type="text"
          size="small"
          @click="copyData(barcode.value)">复制</el-button>
      </el-form-item>

      <el-form-item size="small">
        <el-button @click="getInfoData('操作成功')">刷新</el-button>
      </el-form-item>
    </el-form>
  </cs-container>
</template>

<script>
import { batchRequests } from '@/api/index'
import * as clipboard from 'clipboard-polyfill'

export default {
  name: 'setting-setting-info',
  data() {
    return {
      delivery: {
        name: '快递鸟推送回调URL',
        value: ''
      },
      qrcode: {
        name: '二维码调用URL',
        value: ''
      },
      barcode: {
        name: '条形码调用URL',
        value: ''
      },
      captcha: {
        name: '应用验证码调用URL',
        value: ''
      }
    }
  },
  mounted() {
    this.getInfoData()
  },
  methods: {
    getInfoData(message = null) {
      let data = [
        {
          version: 'v1',
          controller: 'delivery_dist',
          method: 'get.delivery.dist.callback'
        },
        {
          version: 'v1',
          controller: 'qrcode',
          method: 'get.qrcode.callurl'
        },
        {
          version: 'v1',
          controller: 'barcode',
          method: 'get.barcode.callurl'
        },
        {
          version: 'v1',
          controller: 'app',
          method: 'get.app.captcha.callurl'
        }
      ]

      batchRequests(data)
        .then(res => {
          res.data.forEach(value => {
            if (value.status === 200) {
              switch (value.method) {
                case 'get.delivery.dist.callback':
                  this.delivery.value = value.data.callback_url
                  break

                case 'get.app.captcha.callurl':
                  this.captcha.value = value.data.call_url
                  break

                case 'get.qrcode.callurl':
                  this.qrcode.value = value.data.call_url
                  break

                case 'get.barcode.callurl':
                  this.barcode.value = value.data.call_url
                  break
              }
            }
          })

          if (message) {
            this.$message.success(message)
          }
        })
    },
    copyData(val) {
      clipboard.writeText(val)
        .then(() => {
          this.$message.success('已复制到剪贴板')
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
  }
}
</script>

<style scoped>
  .form-box {
    padding: 20px;
    background-color: #FFF;
  }

  .form-button {
    padding-left: 5px;
  }

  .active {
    display: none;
  }

  .action:hover .active {
    display: inline;
  }
</style>
