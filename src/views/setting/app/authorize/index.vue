<template>
  <cs-container :is-back="false">
    <el-form
      class="form-box cs-m"
      label-width="150px"
      label-position="left">
      <el-form-item label="授权状态" size="small">
        <template v-if="status">
          <el-button type="success">已授权</el-button>
        </template>

        <template v-else>
          <el-button type="danger" @click="handleOpen">未授权</el-button>
        </template>
      </el-form-item>

      <el-form-item label="授权版本">
        <span>{{version}}</span>
      </el-form-item>

      <el-form-item label="授权域名">
        <span>{{domain}}</span>
      </el-form-item>

      <el-form-item label="服务到期">
        <span>{{service}}</span>
      </el-form-item>

      <el-form-item label="授权年限">
        <span>{{authorize}}</span>
      </el-form-item>

      <el-form-item label="后台管理版本号">
        <el-tag>{{adminVersion}}</el-tag>
      </el-form-item>

      <el-form-item label="后台最新版本号">
        <el-tag :type="checkVersion(adminLatest, adminVersion)">{{adminLatest}}</el-tag>
      </el-form-item>

      <el-form-item label="框架内核版本号">
        <el-tag>{{kernelVersion}}</el-tag>
      </el-form-item>

      <el-form-item label="框架最新版本号">
        <el-tag :type="checkVersion(kernelLatest, kernelVersion)">{{kernelLatest}}</el-tag>
      </el-form-item>

      <el-form-item size="small">
        <el-button :loading="loading" @click="getAuthorizeData">刷新</el-button>
      </el-form-item>
    </el-form>
  </cs-container>
</template>

<script>
import util from '@/utils/util'
import { getKernelVersion } from '@/api/index'

export default {
  name: 'setting-app-authorize',
  data() {
    return {
      loading: false,
      status: 0,
      version: '',
      domain: '',
      service: '',
      authorize: '',
      adminVersion: process.env.VUE_APP_VERSION,
      kernelVersion: '0.0.0',
      adminLatest: '0.0.0',
      kernelLatest: '0.0.0'
    }
  },
  mounted() {
    this.getAuthorizeData()
  },
  methods: {
    handleOpen() {
      this.$open('https://zshop.cn/pricing')
    },
    checkVersion(a, b) {
      return util.compareVersion(a, b) ? 'danger' : 'info'
    },
    getAuthorizeData() {
      getKernelVersion()
        .then(res => {
          if (res.data) {
            this.kernelVersion = res.data.version
          }
        })

      this.loading = true
      this.$axios({
        url: 'https://api.zshop.cn/api/v1/authorize.html',
        method: 'post',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        data: {
          method: 'check.authorize.item',
          domain: document.location.host,
          version: 'professional'
        }
      })
        .then(res => {
          if (res.data) {
            this.status = res.data.status
            this.version = res.data.version
            this.domain = res.data.domain
            this.service = res.data.service
            this.authorize = res.data.authorize
            this.adminLatest = res.data.admin_latest
            this.kernelLatest = res.data.kernel_latest
          }
        })
        .finally(() => {
          this.loading = false
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
</style>
