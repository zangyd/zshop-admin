<template>
  <div class="category-control" @click="visible = true">
    <slot name="control"/>

    <el-dialog
      width="600px"
      :visible.sync="visible"
      :append-to-body="true"
      :close-on-click-modal="false">

      <el-tree
        v-if="visible"
        node-key="goods_category_id"
        :props="treeProps"
        :load="loadNode"
        :show-checkbox="true"
        :lazy="true"
        style="margin-top: -15px;"
        ref="tree"/>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="visible = false"
          size="small">取消</el-button>

        <el-button
          @click="handleConfirm"
          type="primary"
          size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCategoryList } from '@/api/goods/category'

export default {
  name: 'category-lazy',
  data() {
    return {
      visible: false,
      treeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  methods: {
    // 动态加载节点
    loadNode(node, resolve) {
      this.getCategoryData(node.key, resolve)
    },
    // 获取节点
    getCategoryData(categoryId, resolve) {
      getGoodsCategoryList({ goods_category_id: categoryId, level: 0 })
        .then(res => {
          resolve(res.data || [])
        })
    },
    // 确认提交
    handleConfirm() {
      // 向父级组件返回数据
      if (this.$refs.tree) {
        this.$emit('confirm', this.$refs.tree.getCheckedKeys())
      }
    }
  }
}
</script>

<style scoped>
  .category-control {
    width: auto;
    display: inline;
  }
</style>
