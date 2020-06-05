<template>
  <cs-container>
    <page-edit
      state="create"
      :catList="catList"
      :catData="catData">
    </page-edit>
  </cs-container>
</template>

<script>
import util from '@/utils/util'
import { getArticleCatList } from '@/api/article/cat'

export default {
  name: 'system-article-create',
  components: {
    PageEdit: () => import('./components/PageEdit')
  },
  data() {
    return {
      // 分类源数据
      catList: [],
      // 整理后的分类数据
      catData: []
    }
  },
  mounted() {
    getArticleCatList(null)
      .then(res => {
        this.catList = res.data || []
        this.catData = util.formatDataToTree(this.catList, 'article_cat_id')
      })
  }
}
</script>
