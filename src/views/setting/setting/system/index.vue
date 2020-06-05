<template>
  <cs-container>
    <div class="cs-p">
      <el-tabs
        class="tab-box"
        v-model="activeName"
        @tab-click="handleClick">
        <el-tab-pane
          v-if="auth.info"
          label="系统配置"
          name="system_info">
          <system-info ref="system_info"/>
        </el-tab-pane>

        <el-tab-pane
          v-if="auth.shopping"
          label="购物系统"
          name="system_shopping">
          <system-shopping ref="system_shopping"/>
        </el-tab-pane>

        <el-tab-pane
          v-if="auth.service"
          label="售后服务"
          name="service">
          <service ref="service"/>
        </el-tab-pane>

        <el-tab-pane
          v-if="auth.payment"
          label="支付页面"
          name="payment">
          <payment ref="payment"/>
        </el-tab-pane>

        <el-tab-pane
          v-if="auth.delivery"
          label="配送优惠"
          name="delivery">
          <delivery ref="delivery"/>
        </el-tab-pane>

        <el-tab-pane
          v-if="auth.dist"
          label="配送轨迹"
          name="delivery_dist">
          <delivery-dist ref="delivery_dist"/>
        </el-tab-pane>

        <el-tab-pane
          v-if="auth.upload"
          label="上传配置"
          name="upload">
          <upload ref="upload"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </cs-container>
</template>

<script>
import { getSettingList } from '@/api/config/setting'
import systemInfo from './components/system-info'
import systemShopping from './components/system-shopping'
import service from './components/service'
import payment from './components/payment'
import delivery from './components/delivery'
import deliveryDist from './components/delivery-dist'
import upload from './components/upload'

export default {
  name: 'setting-setting-system',
  components: {
    'system-info': systemInfo,
    'system-shopping': systemShopping,
    service: service,
    payment: payment,
    delivery: delivery,
    'delivery-dist': deliveryDist,
    upload: upload
  },
  data() {
    return {
      activeName: undefined,
      auth: {
        info: false,
        shopping: false,
        service: false,
        payment: false,
        delivery: false,
        dist: false,
        upload: false
      }
    }
  },
  mounted() {
    this.validationAuth()
    this.systemInit()
  },
  methods: {
    // 验证权限(必须反方向验证)
    validationAuth() {
      if (this.$permission('/setting/setting/system/upload')) {
        this.auth.upload = true
        this.activeName = 'upload'
      }

      if (this.$permission('/setting/setting/system/dist')) {
        this.auth.dist = true
        this.activeName = 'delivery_dist'
      }

      if (this.$permission('/setting/setting/system/delivery')) {
        this.auth.delivery = true
        this.activeName = 'delivery'
      }

      if (this.$permission('/setting/setting/system/payment')) {
        this.auth.payment = true
        this.activeName = 'payment'
      }

      if (this.$permission('/setting/setting/system/service')) {
        this.auth.service = true
        this.activeName = 'service'
      }

      if (this.$permission('/setting/setting/system/shopping')) {
        this.auth.shopping = true
        this.activeName = 'system_shopping'
      }

      if (this.$permission('/setting/setting/system/info')) {
        this.auth.info = true
        this.activeName = 'system_info'
      }
    },
    handleClick(tab) {
      this.activeName = tab.name
      this.systemInit()
    },
    systemInit() {
      getSettingList(this.activeName)
        .then(res => {
          this.$refs[this.activeName].setFormData(res.data)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tab-box {
    padding: 5px 10px;
    background-color: #FFF;
  }

  .tab-box /deep/ .help-block {
    color: $color-info;
    font-size: 12px;
    line-height: 2;
    margin-bottom: -12px;
  }
</style>
