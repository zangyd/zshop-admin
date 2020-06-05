<template>
  <el-cascader
    v-model="result"
    :placeholder="placeholder"
    :key="isResouceShow"
    :options="regionData"
    :props="cascaderProps"
    style="width: 100%;"
    filterable
    clearable>
  </el-cascader>
</template>

<script>
import util from '@/utils/util'
import { getRegionSonList } from '@/api/logistics/region'

export default {
  name: 'cs-region-select',
  props: {
    // 外部v-model值
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '试试搜索：浙江'
    }
  },
  data() {
    return {
      isResouceShow: 0,
      regionData: [],
      cascaderProps: {
        value: 'region_id',
        label: 'region_name',
        children: 'children'
      }
    }
  },
  computed: {
    result: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  mounted() {
    if (!this.regionData.length) {
      // 默认只获取中国区域
      getRegionSonList({ region_id: 1 })
        .then(res => {
          const setParent = { key: 'parent_id', value: [1] }
          this.regionData = util.formatDataToTree(res.data, 'region_id', 'parent_id', setParent)
        })
    }
  },
  watch: {
    value: {
      handler() {
        ++this.isResouceShow
      }
    }
  }
}
</script>
