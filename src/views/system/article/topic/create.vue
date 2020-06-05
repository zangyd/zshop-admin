<template>
  <cs-container>
    <page-edit state="create"></page-edit>
  </cs-container>
</template>

<script>
export default {
  name: 'system-topic-create',
  components: {
    PageEdit: () => import('./components/PageEdit')
  }
}
</script>
