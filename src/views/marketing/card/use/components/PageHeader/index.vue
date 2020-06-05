<template>
  <el-form
    :inline="true"
    :model="form"
    ref="form"
    size="mini"
    @submit.native.prevent
    style="margin-bottom: -18px;">
    <el-form-item label="卡号" prop="number">
      <el-input
        v-model="form.number"
        prefix-icon="el-icon-search"
        placeholder="可输入购物卡卡号"
        @keyup.enter.native="handleFormSubmit(true)"
        style="width: 200px;"
        :clearable="true"/>
    </el-form-item>

    <el-form-item label="筛选有效" prop="type">
      <el-select
        v-model="form.type"
        placeholder="请选择"
        style="width: 120px;"
        clearable>
        <el-option label="正常卡" value="normal"/>
        <el-option label="无效卡" value="invalid"/>
      </el-select>
    </el-form-item>

    <el-form-item label="筛选激活" prop="is_active">
      <el-select
        v-model="form.is_active"
        placeholder="请选择"
        style="width: 120px;"
        clearable>
        <el-option label="已激活" value="1"/>
        <el-option label="待激活" value="0"/>
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
        width="219"
        placement="bottom"
        trigger="click">
        <div class="more-filter">
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="form.name"
              prefix-icon="el-icon-search"
              placeholder="可输入购物卡名称"
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
    }
  },
  data() {
    return {
      form: {
        name: undefined,
        account: undefined,
        type: undefined,
        is_active: undefined
      }
    }
  },
  methods: {
    handleFormSubmit(isRestore = false) {
      this.$emit('submit', this.form, isRestore)
    },
    handleFormReset() {
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
    width: 40px;
  }

  .more-filter >>> .el-form-item__content {
    margin-left: 40px;
  }
</style>
