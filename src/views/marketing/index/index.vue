<template>
  <cs-container :is-back="false">
    <page-navi class="cs-m" v-model="root"/>
  </cs-container>
</template>

<script>
export default {
  name: 'marketing-index',
  components: {
    PageNavi: () => import('@/layout/header-aside/components/header-navi')
  },
  data() {
    return {
      root: '/marketing'
    }
  }
}
</script>
