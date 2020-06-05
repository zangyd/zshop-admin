<template>
  <cs-container>
    <page-header
      slot="header"
      :loading="loading"
      :module="module"
      :group="group"
      @submit="handleSubmit"
      ref="header"/>

    <page-main
      :loading="loading"
      :tree-data="tree"
      :module="module"
      :group="group"
      :whitelist="whitelist"
      @refresh="handleRefresh"
      ref="rule"/>
  </cs-container>
</template>

<script>
import { getMenuModule } from '@/api/auth/menu'
import { getAuthGroupList } from '@/api/auth/group'
import { getAuthRuleList } from '@/api/auth/rule'

export default {
  name: 'setting-auth-rule',
  components: {
    PageHeader: () => import('./components/PageHeader'),
    PageMain: () => import('./components/PageMain')
  },
  data() {
    return {
      loading: false,
      tree: [],
      module: {},
      group: {},
      whitelist: []
    }
  },
  mounted() {
    Promise.all([
      getMenuModule(),
      getAuthGroupList({ status: 1 })
    ])
      .then(res => {
        this.module = res[0] || {}

        if (res[1].data) {
          res[1].data.forEach(value => {
            this.group[value.group_id] = value
          })
        }
      })
      .then(() => {
        this.handleSubmit()
      })
  },
  methods: {
    // 重新载入页面
    handleRefresh() {
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit()
      })
    },
    // 提交查询请求
    handleSubmit(form) {
      this.loading = true
      getAuthRuleList(form)
        .then(res => {
          this.tree = []
          let mapModule = []

          for (const index in this.module) {
            if (!Object.prototype.hasOwnProperty.call(this.module, index)) {
              continue
            }

            if (form && form.module) {
              if (form.module !== index) {
                continue
              }
            }

            mapModule[index] = this.tree.push({
              rule_id: index,
              name: this.module[index],
              children: [],
              system: true,
              module: index,
              status: 1
            })
          }

          if (res.data) {
            res.data.forEach(value => {
              this.tree[mapModule[value.module] - 1].children.push(value)

              // 从列表中获取游客(白名单)权限
              if (value.group_id === 4 && value.module === 'api') {
                this.whitelist = this.whitelist.concat(value.menu_auth)
              }
            })
          }

          if (this.$refs.rule) {
            this.$refs.rule.filterText = ''
            this.$refs.rule.resetForm()
            this.$refs.rule.resetElements()
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
