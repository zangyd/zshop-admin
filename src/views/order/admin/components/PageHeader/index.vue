<template>
  <el-form
    :inline="true"
    :model="form"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">
    <el-form-item label="关键词" prop="keywords">
      <el-input
        v-model="form.keywords"
        prefix-icon="el-icon-search"
        placeholder="可输入商品名称/订单号"
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

    <el-form-item label="支付方式" prop="payment_code">
      <el-select
        v-model="form.payment_code"
        placeholder="请选择"
        style="width: 120px;"
        clearable>
        <el-option
          v-for="(item, index) in toPayment"
          :key="index"
          :label="item.name"
          :value="item.code"/>
      </el-select>
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
        width="397"
        placement="bottom"
        trigger="click">
        <div class="more-filter">
          <el-form-item label="收货人姓名" prop="consignee">
            <el-input
              v-model="form.consignee"
              prefix-icon="el-icon-search"
              placeholder="可输入收货人姓名"
              @keyup.enter.native="handleFormSubmit(true)"
              :clearable="true"/>
          </el-form-item>

          <el-form-item label="收货人手机" prop="mobile">
            <el-input
              v-model="form.mobile"
              prefix-icon="el-icon-search"
              placeholder="可输入收货人手机"
              @keyup.enter.native="handleFormSubmit(true)"
              :clearable="true"/>
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
    toPayment: {
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        is_export: undefined,
        account: undefined,
        keywords: undefined,
        consignee: undefined,
        mobile: undefined,
        payment_code: undefined,
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
    width: 82px;
  }

  .more-filter >>> .el-form-item__content {
    margin-left: 82px;
  }
</style>
