<template>
  <cs-container>
    <page-main
      :loading="loading"
      :table-data="table"
      :tpl-code.sync="tplCode"/>
  </cs-container>
</template>

<script>
import { getNoticeTplList } from '@/api/notice/template'

export default {
  name: 'setting-setting-template',
  components: {
    PageMain: () => import('./components/PageMain')
  },
  data() {
    return {
      table: [],
      loading: false,
      tplCode: 'sms'
    }
  },
  watch: {
    tplCode: {
      handler(val) {
        this.loading = true
        getNoticeTplList(val)
          .then(res => {
            this.table = res.data || []
          })
          .finally(() => {
            this.loading = false
          })
      },
      immediate: true
    }
  }
}
</script>
