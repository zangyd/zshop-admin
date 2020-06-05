<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">
      <el-form-item v-if="auth.add">
        <el-button
          icon="el-icon-plus"
          :disabled="loading"
          @click="handleCreate">新增促销</el-button>
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
        prop="promotion_id"
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
        label="促销日期"
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
      @open="handleOpenDlg"
      width="620px">
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
            placeholder="请输入促销名称"
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
                placeholder="请选择促销开始日期"
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
                placeholder="请选择促销结束日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          label="状态"
          prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-form-item>

        <el-form-item
          label="促销方案"
          prop="promotion_item">
          <div
            class="action cs-pb-10"
            v-for="(item, index) in form.promotion_item"
            :key="index">
            <el-divider>促销方案</el-divider>

            <span class="promotion-label">满多少金额</span>
            <el-input-number
              v-model="item.quota"
              class="promotion-input"
              placeholder="请输入限额"
              controls-position="right"
              :min="0"
              :precision="2">
            </el-input-number>

            <div class="active">
              <el-button
                @click="item.settings.push({type: undefined, value: undefined})"
                type="text"
                size="small">新增配置</el-button>

              <el-button
                @click="form.promotion_item.splice(index, 1)"
                type="text"
                size="small">删除</el-button>
            </div>

            <div
              v-for="(value, key) in item.settings"
              :key="key">
              <span class="promotion-label">方案类型</span>
              <el-select
                v-model="value.type"
                @change="val => value.value = val !== '2' ? undefined : 0"
                class="promotion-input"
                placeholder="请选择">
                <el-option
                  v-for="(item, index) in typeMap"
                  :key="index"
                  :label="item"
                  :value="index"/>
              </el-select>

              <el-select
                v-if="value.type === '4'"
                :value="filterCoupon(value.value)"
                @change="val => {value.value = val}"
                class="promotion-input"
                placeholder="请选择">
                <el-option
                  v-for="item in couponData"
                  :key="item.coupon_id"
                  :label="item.name"
                  :value="item.coupon_id">
                </el-option>
              </el-select>

              <el-input-number
                v-if="['0', '1', '3'].indexOf(value.type) !== -1"
                v-model="value.value"
                class="promotion-input"
                controls-position="right"
                placeholder="请输入"
                :min="0"
                :max="value.type === '1' ? 100 : Number.MAX_SAFE_INTEGER"
                :precision="value.type !== '3' ? 2 : 0">
              </el-input-number>

              <div class="active">
                <el-tooltip placement="top" :content="typeHelp[value.type]">
                  <i class="el-icon-warning-outline cs-mr-10" v-show="typeHelp[value.type]"/>
                </el-tooltip>

                <el-button
                  @click="item.settings.splice(key, 1)"
                  type="text"
                  size="small">删除</el-button>
              </div>
            </div>
          </div>

          <el-button
            @click="form.promotion_item.push({quota: undefined, settings: []})"
            size="small">新增方案</el-button>
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
          @click="update"
          size="small">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addPromotionItem,
  delPromotionList,
  setPromotionItem,
  setPromotionStatus
} from '@/api/marketing/promotion'
import util from '@/utils/util'
import { getCouponSelect } from '@/api/marketing/coupon'

export default {
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
        update: '编辑促销',
        create: '新增促销'
      },
      typeHelp: {
        0: '满足限额后在订单结算金额的基础上减去指定金额',
        1: '满足限额后在订单结算金额的基础上再按折扣结算（80表示8折）',
        2: '满足限额后该笔订单免去运费',
        3: '满足限额后并且在订单完成后赠送指定积分',
        4: '满足限额后并且在订单完成后赠送指定的优惠劵'
      },
      form: {
        name: undefined,
        begin_time: undefined,
        end_time: undefined,
        status: undefined,
        promotion_item: undefined
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
        promotion_item: [
          {
            required: true,
            message: '促销方案不能为空',
            trigger: 'blur'
          }
        ]
      },
      dialogLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      couponData: []
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
      this.auth.add = this.$permission('/marketing/marketing/promotion/add')
      this.auth.set = this.$permission('/marketing/marketing/promotion/set')
      this.auth.del = this.$permission('/marketing/marketing/promotion/del')
      this.auth.enable = this.$permission('/marketing/marketing/promotion/enable')
      this.auth.disable = this.$permission('/marketing/marketing/promotion/disable')
    },
    // 获取列表中的编号
    _getIdList(val) {
      if (val === null) {
        val = this.multipleSelection
      }

      let idList = []
      if (Array.isArray(val)) {
        val.forEach(value => {
          idList.push(value.promotion_id)
        })
      } else {
        idList.push(this.currentTableData[val].promotion_id)
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
      let promotion_id = this._getIdList(val)
      if (promotion_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      function setStatus(promotion_id, status, vm) {
        setPromotionStatus(promotion_id, status)
          .then(() => {
            vm.currentTableData.forEach((value, index) => {
              if (promotion_id.indexOf(value.promotion_id) !== -1) {
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
        setStatus(promotion_id, newStatus, this)
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setStatus(promotion_id, status, this)
        })
        .catch(() => {
        })
    },
    // 批量删除
    handleDelete(val) {
      let promotion_id = this._getIdList(val)
      if (promotion_id.length === 0) {
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
          delPromotionList(promotion_id)
            .then(() => {
              util.deleteDataList(this.currentTableData, promotion_id, 'promotion_id')
              if (this.currentTableData.length <= 0) {
                this.$emit('refresh', true)
              }

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 打开对话框事件
    handleOpenDlg() {
      if (!this.couponData.length) {
        getCouponSelect({ type: 3, status: 1, is_invalid: 0, is_shelf_life: 1 })
          .then(res => {
            this.couponData = res.data || []
          })
      }
    },
    // 过滤优惠劵空选项
    filterCoupon(val) {
      if (!this.couponData.find(item => item.coupon_id === val)) {
        return null
      }

      return val
    },
    // 弹出新建对话框
    handleCreate() {
      this.form = {
        name: '',
        begin_time: undefined,
        end_time: undefined,
        status: 1,
        promotion_item: []
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
      this.form = { ...this.currentTableData[index] }

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
          addPromotionItem(this.form)
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
          setPromotionItem(this.form)
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

<style scoped>
  .active {
    display: none;
  }

  .action:hover .active {
    display: inline-block;
  }

  .promotion-label {
    width: 80px;
    padding-bottom: 10px;
    display: inline-block;
  }

  .promotion-input {
    width: 175px;
    margin-right: 10px;
  }
</style>
