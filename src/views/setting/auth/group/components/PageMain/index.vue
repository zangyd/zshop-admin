<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">

      <el-form-item v-if="auth.add">
        <el-button
          icon="el-icon-plus"
          :disabled="loading"
          @click="handleCreate">新增用户组</el-button>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button
            v-if="auth.enable"
            icon="el-icon-check"
            :disabled="loading"
            @click="handleState(1)">启用</el-button>

          <el-button
            v-if="auth.disable"
            icon="el-icon-close"
            :disabled="loading"
            @click="handleState(0)">禁用</el-button>
        </el-button-group>
      </el-form-item>

      <cs-help
        :router="$route.path"
        style="padding-bottom: 19px;">
      </cs-help>
    </el-form>

    <el-table
      :data="currentTableData"
      :highlight-current-row="true"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange">
      <el-table-column
        align="center"
        type="selection"
        width="55"
        :selectable="row => {return !row.system}"/>

      <el-table-column
        label="名称"
        prop="name"
        sortable="custom"
        :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column
        label="描述"
        prop="description"
        min-width="200"
        :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column
        label="所属类型">
        <template slot-scope="scope">
          {{scope.row.system ? '系统保留' : '用户添加'}}
        </template>
      </el-table-column>

      <el-table-column
        label="模块">
        <template slot-scope="scope">
          {{module[scope.row.module]}}
        </template>
      </el-table-column>

      <el-table-column
        label="排序值"
        prop="sort"
        align="center"
        sortable="custom">
        <template slot-scope="scope">
          <el-input-number
            v-if="auth.sort"
            size="mini"
            v-model="scope.row.sort"
            @change="handleSort(scope.$index)"
            style="width: 88px;"
            controls-position="right"
            :min="0"
            :max="255">
          </el-input-number>
          <span v-else>
            {{scope.row.sort}}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="状态"
        prop="status"
        align="center"
        width="100"
        sortable="custom">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="statusMap[scope.row.status].type"
            :style="auth.enable || auth.disable ? 'cursor: pointer;' : ''"
            :effect="auth.enable || auth.disable ? 'light' : 'plain'"
            @click.native="switchStatus(scope.$index)">
            {{statusMap[scope.row.status].text}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <el-button
            v-if="auth.set"
            size="small"
            @click="handleUpdate(scope.$index)"
            type="text">编辑</el-button>

          <el-button
            v-if="auth.del && !scope.row.system"
            size="small"
            @click="handleDelete(scope.$index)"
            type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="80px">
        <el-form-item
          label="名称"
          prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入名称"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          label="描述"
          prop="description">
          <el-input
            v-model="form.description"
            placeholder="可输入描述"
            type="textarea"
            :rows="5"/>
        </el-form-item>

        <el-form-item
          label="模块"
          prop="module">
          <el-select
            v-model="form.module"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in module"
              :key="index"
              :label="item"
              :value="index"/>
          </el-select>
        </el-form-item>

        <el-form-item
          label="排序值"
          prop="sort">
          <el-input-number
            v-model="form.sort"
            controls-position="right"
            :min="0"
            :max="255"
            style="width: 120px;"/>
        </el-form-item>

        <el-form-item
          label="状态"
          prop="status">
          <el-switch
            v-model="form.status"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="dialogFormVisible = false"
          size="small">取消</el-button>

        <el-button
          v-if="dialogStatus === 'create'"
          type="primary"
          :loading="dialogLoading"
          @click="create"
          size="small">确定</el-button>

        <el-button
          v-else type="primary"
          :loading="dialogLoading"
          @click="update(form.index)"
          size="small">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addAuthGroupItem,
  setAuthGroupItem,
  delAuthGroupItem,
  setAuthGroupSort,
  setAuthGroupStatus
} from '@/api/auth/group'

export default {
  props: {
    loading: {
      default: false
    },
    tableData: {
      default: () => []
    },
    module: {
      default: () => {}
    }
  },
  data() {
    return {
      currentTableData: [],
      multipleSelection: [],
      auth: {
        add: false,
        del: false,
        set: false,
        enable: false,
        disable: false,
        sort: false
      },
      dialogLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户组',
        create: '新增用户组'
      },
      statusMap: {
        0: {
          text: '禁用',
          type: 'danger'
        },
        1: {
          text: '启用',
          type: 'success'
        },
        2: {
          text: '...',
          type: 'info'
        }
      },
      form: {
        index: undefined,
        name: undefined,
        description: undefined,
        module: undefined,
        sort: undefined,
        status: undefined
      },
      rules: {
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          },
          {
            max: 32,
            message: '长度不能大于 32 个字符',
            trigger: 'blur'
          }
        ],
        description: [
          {
            max: 255,
            message: '长度不能大于 255 个字符',
            trigger: 'blur'
          }
        ],
        module: [
          {
            required: true,
            message: '至少选择一项',
            trigger: 'change'
          }
        ],
        sort: [
          {
            type: 'number',
            message: '必须为数字值',
            trigger: 'blur'
          }
        ],
        status: [
          {
            type: 'enum',
            enum: ['0', '1'],
            message: '值的范围必须为 0 或 1',
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    tableData: {
      handler(val) {
        this.currentTableData = val
      },
      immediate: true
    }
  },
  mounted() {
    this._validationAuth()
  },
  methods: {
    // 验证权限
    _validationAuth() {
      this.auth.add = this.$permission('/setting/auth/group/add')
      this.auth.del = this.$permission('/setting/auth/group/del')
      this.auth.set = this.$permission('/setting/auth/group/set')
      this.auth.enable = this.$permission('/setting/auth/group/enable')
      this.auth.disable = this.$permission('/setting/auth/group/disable')
      this.auth.sort = this.$permission('/setting/auth/group/sort')
    },
    // 选中数据项
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取排序字段
    sortChange({ column, prop, order }) {
      let sort = {
        order_type: undefined,
        order_field: undefined
      }

      if (column && order) {
        sort.order_type = order === 'ascending' ? 'asc' : 'desc'
        sort.order_field = prop
      }

      this.$emit('sort', sort)
    },
    // 返回表格行颜色
    tableRowClassName({ row }) {
      if (row.system) {
        return 'warning-row'
      }

      return ''
    },
    // 弹出新建对话框
    handleCreate() {
      this.form = {
        index: undefined,
        name: '',
        description: '',
        module: '',
        sort: 50,
        status: '1'
      }

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }

        this.dialogStatus = 'create'
        this.dialogLoading = false
        this.dialogFormVisible = true
      })
    },
    // 请求创建用户组
    create() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          addAuthGroupItem(this.form)
            .then(res => {
              this.currentTableData.unshift(res.data)
              this.dialogFormVisible = false
              this.$message.success('操作成功')
            })
            .catch(() => {
              this.dialogLoading = false
            })
        }
      })
    },
    // 批量设置状态
    handleState(state) {
      let group_list = []
      this.multipleSelection.forEach(value => {
        group_list.push(value.group_id)
      })

      if (group_list.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setAuthGroupStatus(group_list, state)
            .then(() => {
              this.currentTableData.forEach((value, index) => {
                if (group_list.indexOf(value.group_id) !== -1) {
                  this.$set(this.currentTableData, index, {
                    ...value,
                    status: state
                  })
                }
              })

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 弹出编辑对话框
    handleUpdate(index) {
      const data = this.currentTableData[index]
      this.form = {
        index: index,
        group_id: data.group_id,
        name: data.name,
        description: data.description,
        module: data.module,
        sort: data.sort,
        status: data.status.toString()
      }

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }

        this.dialogStatus = 'update'
        this.dialogLoading = false
        this.dialogFormVisible = true
      })
    },
    // 请求修改用户组
    update(index) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          setAuthGroupItem(this.form)
            .then(res => {
              this.$set(this.currentTableData, index, {
                ...this.currentTableData[index],
                ...res.data
              })

              this.dialogFormVisible = false
              this.$message.success('操作成功')
            })
            .catch(() => {
              this.dialogLoading = false
            })
        }
      })
    },
    // 请求删除用户组
    handleDelete(index) {
      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          delAuthGroupItem(this.currentTableData[index].group_id)
            .then(() => {
              this.currentTableData.splice(index, 1)
              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 请求修改排序值
    handleSort(index) {
      setAuthGroupSort(
        this.currentTableData[index].group_id,
        this.currentTableData[index].sort
      )
    },
    // 请求修改状态值
    switchStatus(index) {
      let oldData = this.currentTableData[index]
      const newStatus = oldData.status ? 0 : 1

      // 禁用权限检测
      if (newStatus === 0 && !this.auth.disable) {
        return
      }

      // 启用权限检测
      if (newStatus === 1 && !this.auth.enable) {
        return
      }

      this.$set(this.currentTableData, index, { ...oldData, status: 2 })
      setAuthGroupStatus([oldData.group_id], newStatus)
        .then(() => {
          this.$message.success('操作成功')
          this.$set(this.currentTableData, index, {
            ...oldData,
            status: newStatus
          })
        })
        .catch(() => {
          this.$set(this.currentTableData, index, oldData)
        })
    }
  }
}
</script>

<style scoped>
  .el-table >>> .warning-row {
    background: oldlace;
  }

  .el-table >>> .spacer-row {
    background: #FAFAFA;
  }
</style>
