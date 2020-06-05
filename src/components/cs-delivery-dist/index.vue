<template>
  <el-dialog
    title="物流信息"
    :visible.sync="visible"
    :append-to-body="true"
    width="600px">
    <el-form
      label-width="80px"
      label-position="left"
      style="margin-top: -25px;">
      <el-form-item label="快递公司">
        <el-select
          v-model="companyIndex"
          placeholder="请选择"
          style="width: 300px;">
          <el-option
            v-for="(item, index) in result"
            :key="index"
            :label="item.get_delivery_item.name"
            :value="index">
            <span style="float: left;" title="快递公司">{{item.get_delivery_item.name}}</span>
            <span style="float: right; color: #8492A6; font-size: 13px;" title="创建日期">{{item.create_time}}</span>
          </el-option>
        </el-select>

        <template v-if="result !== null && result.length > 0">
          <el-tag
            :type="result[companyIndex].state | getStateType"
            class="cs-ml-10"
            effect="plain"
            size="mini">
            {{stateMap[result[companyIndex].state]}}
          </el-tag>
        </template>
      </el-form-item>
    </el-form>

    <div v-if="result !== null">
      <el-divider>物流轨迹</el-divider>

      <el-timeline v-if="result.length > 0 && result[companyIndex]['trace'].length">
        <el-timeline-item type="success">
          物流单号：{{result[companyIndex]['logistic_code']}}
          快递公司：{{result[companyIndex]['get_delivery_item']['name']}}
        </el-timeline-item>

        <el-timeline-item
          v-for="(trace, index) in result[companyIndex].trace"
          :key="index"
          :timestamp="trace.accept_time"
          type="primary">
          {{trace.accept_station}}
        </el-timeline-item>
      </el-timeline>

      <div v-else class="not-trace">
        <p v-if="result.length">
          物流单号：{{result[companyIndex]['logistic_code']}}
          快递公司：{{result[companyIndex]['get_delivery_item']['name']}}
        </p>
        <p>暂无轨迹</p>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getDeliveryDistCode } from '@/api/logistics/dist'

export default {
  name: 'cs-delivery-dist',
  data() {
    return {
      visible: false,
      companyIndex: undefined,
      result: [],
      stateMap: {
        0: '无轨迹',
        1: '已揽收',
        2: '在途中',
        3: '签收',
        4: '问题件',
        201: '到达派件城市'
      }
    }
  },
  filters: {
    getStateType(val) {
      switch (val) {
        case 3:
          return 'success'
        case 4:
          return 'danger'
        default:
          return 'info'
      }
    }
  },
  methods: {
    show(orderCode, logisticCode = null, excludeCode = []) {
      const request = {
        order_code: orderCode,
        logistic_code: logisticCode,
        exclude_code: excludeCode
      }

      this.visible = true
      this.companyIndex = null
      this.result = null

      getDeliveryDistCode(request)
        .then(res => {
          this.result = res.data || []
          this.companyIndex = this.result.length > 0 ? 0 : null
        })
    }
  }
}
</script>

<style scoped>
  .not-trace {
    color: #99A9BF;
    text-align: center;
  }
</style>
