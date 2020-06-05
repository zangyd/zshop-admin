<template>
  <el-form
    :inline="true"
    :model="form"
    ref="form"
    size="mini"
    @submit.native.prevent
    style="margin-bottom: -18px;">
    <el-form-item label="账号" prop="account">
      <el-input
        v-model="form.account"
        prefix-icon="el-icon-search"
        placeholder="可输入账号/昵称"
        @keyup.enter.native="handleFormSubmit(true)"
        :clearable="true"/>
    </el-form-item>

    <el-form-item label="筛选状态" prop="type">
      <el-select
        v-model="form.type"
        placeholder="请选择"
        style="width: 120px;"
        clearable>
        <el-option label="正常" value="normal"/>
        <el-option label="无效" value="invalid"/>
        <el-option label="已使用" value="used"/>
        <el-option label="回收站" value="delete"/>
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
        type: undefined,
        account: undefined
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
