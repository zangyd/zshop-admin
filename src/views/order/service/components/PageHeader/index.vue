<template>
  <el-form
    :inline="true"
    :model="form"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">
    <el-form-item label="流水号" prop="order_code">
      <el-input
        v-model="form.order_code"
        prefix-icon="el-icon-search"
        placeholder="可输入售后单号/订单号"
        @keyup.enter.native="handleFormSubmit(true)"
        :clearable="true"/>
    </el-form-item>

    <el-form-item label="账号" prop="account">
      <el-input
        v-model="form.account"
        prefix-icon="el-icon-search"
        placeholder="可输入账号/昵称"
        @keyup.enter.native="handleFormSubmit(true)"
        :clearable="true"/>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        icon="el-icon-search"
        :disabled="loading"
        @click="handleFormSubmit(true)">查询</el-button>
    </el-form-item>

    <el-form-item>
      <el-button
        icon="el-icon-refresh"
        @click="handleFormReset">重置</el-button>
    </el-form-item>

    <el-form-item>
      <el-popover
        width="383"
        placement="bottom"
        trigger="click">
        <div class="more-filter">
          <el-form-item label="我的工单" prop="my_service">
            <el-checkbox
              v-model="form.my_service"
              true-label="1"
              false-label="0">仅显示我的工单</el-checkbox>
          </el-form-item>

          <el-form-item label="事件过滤" prop="new_event">
            <el-checkbox
              v-model="form.new_event"
              true-label="1"
              false-label="0">仅显示新事件</el-checkbox>
          </el-form-item>

          <el-form-item label="售后类型" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择"
              clearable>
              <el-option
                v-for="(item, index) in typeMap"
                :key="index"
                :label="item"
                :value="index"/>
            </el-select>
          </el-form-item>

          <el-form-item label="创建日期" prop="time_period">
            <el-date-picker
              v-model="form.time_period"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 315px;">
            </el-date-picker>
          </el-form-item>
        </div>

        <el-button
          slot="reference"
          type="text">
          <span>更多筛选</span>
          <i class="el-icon-arrow-down cs-pl-5"/>
        </el-button>
      </el-popover>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    loading: {
      default: false
    },
    typeMap: {
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        order_code: undefined,
        account: undefined,
        type: undefined,
        new_event: '0',
        my_service: '0',
        begin_time: undefined,
        end_time: undefined,
        time_period: null
      }
    }
  },
  methods: {
    handleFormSubmit(isRestore = false) {
      let form = {}
      for (const index in this.form) {
        if (!Object.prototype.hasOwnProperty.call(this.form, index)) {
          continue
        }

        // 时间段处理
        if (index === 'time_period') {
          if (this.form[index] && this.form[index].length === 2) {
            form.begin_time = this.form[index][0].toUTCString()
            form.end_time = this.form[index][1].toUTCString()
          }

          continue
        }

        form[index] = this.form[index]
      }

      this.$emit('submit', form, isRestore)
    },
    handleFormReset() {
      this.form.time_period = null
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>
  .more-filter {
    margin-bottom: -18px;
  }

  .more-filter >>> label {
    width: auto;
  }
</style>
