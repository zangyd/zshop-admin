<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">
      <el-form-item v-if="auth.add">
        <el-button
          icon="el-icon-plus"
          :disabled="loading"
          @click="handleCreate">新增折扣</el-button>
      </el-form-item>

      <el-form-item v-if="auth.enable || auth.disable">
        <el-button-group>
          <el-button
            v-if="auth.enable"
            icon="el-icon-check"
            :disabled="loading"
            @click="handleStatus(null, 1, true)">启用</el-button>

          <el-button
            v-if="auth.disable"
            icon="el-icon-close"
            :disabled="loading"
            @click="handleStatus(null, 0, true)">禁用</el-button>
        </el-button-group>
      </el-form-item>

      <el-form-item v-if="auth.del">
        <el-button
          icon="el-icon-delete"
          :disabled="loading"
          @click="handleDelete(null)">删除</el-button>
      </el-form-item>

      <cs-help
        :router="$route.path"
        style="padding-bottom: 19px;">
      </cs-help>
    </el-form>

    <el-table
      :data="currentTableData"
      :highlight-current-row="true"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange">
      <el-table-column align="center" type="selection" width="55"/>

      <el-table-column
        label="编号"
        prop="discount_id"
        sortable="custom"
        min-width="40">
      </el-table-column>

      <el-table-column
        label="名称"
        prop="name"
        sortable="custom"
        min-width="180">
      </el-table-column>

      <el-table-column
        label="折扣方式"
        prop="type"
        width="160">
        <template slot-scope="scope">
          {{typeMap[scope.row.type]}}
        </template>
      </el-table-column>

      <el-table-column
        label="折扣日期"
        prop="begin_time"
        sortable="custom"
        align="center"
        width="160">
        <template slot-scope="scope">
          <span>{{scope.row.begin_time}}</span>
          <br>
          <span>{{scope.row.end_time}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="状态"
        prop="status"
        sortable="custom"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="statusMap[scope.row.status].type"
            :style="auth.enable || auth.disable ? 'cursor: pointer;' : ''"
            :effect="auth.enable || auth.disable ? 'light' : 'plain'"
            @click.native="handleStatus(scope.$index)">
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
            @click="handleUpdate(scope.$index)"
            size="small"
            type="text">编辑</el-button>

          <el-button
            v-if="auth.del"
            @click="handleDelete(scope.$index)"
            size="small"
            type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="760px">
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
            placeholder="请输入折扣名称"
            :clearable="true"/>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="开始日期"
              prop="begin_time">
              <el-date-picker
                v-model="form.begin_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择折扣开始日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="结束日期"
              prop="end_time">
              <el-date-picker
                v-model="form.end_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择折扣结束日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="折扣方式"
              prop="type">
              <el-select
                v-model="form.type"
                placeholder="请选择"
                style="width: 100%;">
                <el-option
                  v-for="(item, index) in typeMap"
                  :key="index"
                  :label="item"
                  :value="index"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="状态"
              prop="status">
              <el-switch
                v-model="form.status"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          label="商品选取"
          prop="discount_goods">
          <cs-goods-select
            :check-list="form.discount_goods"
            @confirm="handleGoodsConfirm">
            <el-button slot="control">商品选取</el-button>
          </cs-goods-select>
        </el-form-item>

        <page-goods
          v-if="dialogFormVisible"
          v-model="form.discount_goods"
          :type="form.type"
          :type-map="typeMap"
          :status="dialogStatus">
        </page-goods>
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
          @click="update"
          size="small">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addDiscountItem,
  delDiscountList,
  setDiscountItem,
  setDiscountStatus
} from '@/api/marketing/discount'
import util from '@/utils/util'

export default {
  components: {
    PageGoods: () => import('../PageGoods'),
    csGoodsSelect: () => import('@/components/cs-goods-select')
  },
  props: {
    loading: {
      default: false
    },
    tableData: {
      default: () => []
    },
    typeMap: {
      default: () => {}
    }
  },
  data() {
    return {
      currentTableData: [],
      multipleSelection: [],
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
      textMap: {
        update: '编辑折扣',
        create: '新增折扣'
      },
      form: {
        name: undefined,
        type: undefined,
        begin_time: undefined,
        end_time: undefined,
        status: undefined,
        discount_goods: undefined
      },
      auth: {
        add: false,
        set: false,
        del: false,
        enable: false,
        disable: false
      },
      rules: {
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          },
          {
            max: 100,
            message: '长度不能大于 100 个字符',
            trigger: 'blur'
          }
        ],
        begin_time: [
          {
            required: true,
            message: '开始日期不能为空',
            trigger: 'change'
          }
        ],
        end_time: [
          {
            required: true,
            message: '结束日期不能为空',
            trigger: 'change'
          }
        ],
        type: [
          {
            required: true,
            message: '至少选择一项',
            trigger: 'change'
          }
        ],
        discount_goods: [
          {
            required: true,
            message: '商品选取不能为空',
            trigger: 'blur'
          }
        ]
      },
      dialogLoading: false,
      dialogFormVisible: false,
      dialogStatus: ''
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
      this.auth.add = this.$permission('/marketing/marketing/discount/add')
      this.auth.set = this.$permission('/marketing/marketing/discount/set')
      this.auth.del = this.$permission('/marketing/marketing/discount/del')
      this.auth.enable = this.$permission('/marketing/marketing/discount/enable')
      this.auth.disable = this.$permission('/marketing/marketing/discount/disable')
    },
    // 获取列表中的编号
    _getIdList(val) {
      if (val === null) {
        val = this.multipleSelection
      }

      let idList = []
      if (Array.isArray(val)) {
        val.forEach(value => {
          idList.push(value.discount_id)
        })
      } else {
        idList.push(this.currentTableData[val].discount_id)
      }

      return idList
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
    // 批量设置状态
    handleStatus(val, status = 0, confirm = false) {
      let discount_id = this._getIdList(val)
      if (discount_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      function setStatus(discount_id, status, vm) {
        setDiscountStatus(discount_id, status)
          .then(() => {
            vm.currentTableData.forEach((value, index) => {
              if (discount_id.indexOf(value.discount_id) !== -1) {
                vm.$set(vm.currentTableData, index, {
                  ...value,
                  status
                })
              }
            })

            vm.$message.success('操作成功')
          })
      }

      if (!confirm) {
        let oldData = this.currentTableData[val]
        const newStatus = oldData.status ? 0 : 1

        if (oldData.status > 1) {
          return
        }

        // 禁用权限检测
        if (newStatus === 0 && !this.auth.disable) {
          return
        }

        // 启用权限检测
        if (newStatus === 1 && !this.auth.enable) {
          return
        }

        this.$set(this.currentTableData, val, { ...oldData, status: 2 })
        setStatus(discount_id, newStatus, this)
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setStatus(discount_id, status, this)
        })
        .catch(() => {
        })
    },
    // 批量删除
    handleDelete(val) {
      let discount_id = this._getIdList(val)
      if (discount_id.length === 0) {
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
          delDiscountList(discount_id)
            .then(() => {
              util.deleteDataList(this.currentTableData, discount_id, 'discount_id')
              if (this.currentTableData.length <= 0) {
                this.$emit('refresh', true)
              }

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 商品选取确认事件
    handleGoodsConfirm(val) {
      let discount = []
      val.forEach(value => {
        discount.push({
          goods_id: value.goods_id,
          discount: undefined,
          description: '',
          goods: value
        })
      })

      // 转换成折扣结构
      this.form.discount_goods = discount
    },
    // 弹出新建对话框
    handleCreate() {
      this.form = {
        name: '',
        type: undefined,
        begin_time: undefined,
        end_time: undefined,
        status: 1,
        discount_goods: []
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
    // 弹出编辑对话框
    handleUpdate(index) {
      this.currentIndex = index
      this.form = {
        ...this.currentTableData[index],
        type: this.currentTableData[index].type.toString()
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
    // 请求创建
    create() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          addDiscountItem(this.form)
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
    // 请求修改
    update() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          setDiscountItem(this.form)
            .then(res => {
              this.$set(
                this.currentTableData,
                this.currentIndex,
                {
                  ...this.currentTableData[this.currentIndex],
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
    }
  }
}
</script>
