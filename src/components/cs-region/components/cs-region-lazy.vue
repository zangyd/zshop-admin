<template>
  <div class="region-control" @click="visible = true">
    <slot name="control"/>

    <el-dialog
      width="600px"
      :visible.sync="visible"
      :append-to-body="true"
      :close-on-click-modal="false">

      <el-tree
        v-if="visible"
        node-key="region_id"
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
import { getRegionList } from '@/api/logistics/region'

export default {
  name: 'cs-region-lazy',
  props: {
    // 默认上级编号
    regionId: {
      type: Number,
      required: false,
      default: 1
    }
  },
  data() {
    return {
      visible: false,
      treeProps: {
        label: 'region_name',
        children: 'children'
      }
    }
  },
  methods: {
    // 动态加载节点
    loadNode(node, resolve) {
      this.getRegionData(node.level ? node.key : this.regionId, resolve)
    },
    // 获取节点
    getRegionData(regionId, resolve) {
      getRegionList({ region_id: regionId })
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
  .region-control {
    width: auto;
    display: inline;
  }
</style>
