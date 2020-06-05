<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">
      <el-form-item v-if="auth.add">
        <el-button
          icon="el-icon-plus"
          :disabled="loading"
          @click="handleCreate">新增购物卡</el-button>
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
        label="名称"
        prop="name"
        sortable="custom"
        min-width="180"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.description"
            :content="`描述：${scope.row.description}`"
            placement="top-start">
            <i class="el-icon-tickets cs-pr-5"/>
          </el-tooltip>
          <span :class="{link: auth.use}" @click="handleUse(scope.row.card_id)">{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="面额"
        sortable="custom"
        prop="money">
        <template slot-scope="scope">
          {{scope.row.money | getNumber}}
        </template>
      </el-table-column>

      <el-table-column
        label="发放数"
        sortable="custom"
        prop="give_num">
      </el-table-column>

      <el-table-column
        label="激活数"
        sortable="custom"
        prop="active_num">
      </el-table-column>

      <el-table-column
        label="日期"
        align="center">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">
              创建日期：{{scope.row.create_time}}<br/>
              截止日期：{{scope.row.end_time || '不限日期'}}
            </div>
            <el-tag size="mini" effect="plain" type="info">详细</el-tag>
          </el-tooltip>
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
        min-width="120">
        <template slot-scope="scope">
          <el-button
            v-if="auth.export"
            @click="handleExportCard(scope.row.card_id, scope.row.name)"
            size="small"
            type="text">导出</el-button>

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
            placeholder="请输入购物卡名称"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          label="描述"
          prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="可输入购物卡描述"
            :autosize="{minRows: 3}"
            maxlength="255"
            show-word-limit/>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="面额"
              prop="money">
              <el-input-number
                v-model="form.money"
                placeholder="请输入面额"
                controls-position="right"
                :disabled="dialogStatus !== 'create'"
                :precision="2"
                :min="0">
              </el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="发放数"
              prop="give_num">
              <el-input-number
                v-model="form.give_num"
                placeholder="请输入发放数"
                controls-position="right"
                :disabled="dialogStatus !== 'create'"
                :min="0">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          label="截止日期"
          prop="end_time">
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="可选择购物卡截止有效期"
            :disabled="dialogStatus !== 'create'">
          </el-date-picker>
          <div class="help-block">
            <span>为空表示不限制截止日期</span>
          </div>
        </el-form-item>

        <el-form-item
          label="指定分类"
          prop="category">
          <cs-goods-category
            v-model="form.category"
            type="all">
            <el-button slot="control">商品分类选取</el-button>
          </cs-goods-category>

          <div class="help-block">
            <span>指定商品分类后，该购物卡只能购买分类范围内的商品</span>
          </div>
        </el-form-item>

        <el-form-item
          label="排除分类"
          prop="exclude_category">
          <cs-goods-category
            v-model="form.exclude_category"
            type="all">
            <el-button slot="control">商品分类选取</el-button>
          </cs-goods-category>

          <div class="help-block">
            <span>排除商品分类后，该购物卡不能购买分类范围内的商品</span>
          </div>
        </el-form-item>

        <el-form-item
          label="状态"
          prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0">
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
          @click="update"
          size="small">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addCardItem,
  delCardList,
  setCardItem,
  setCardStatus
} from '@/api/marketing/card'
import util from '@/utils/util'
import VueTableExport from '@zangyd/vue-table-export'
import { getCardUseExport } from '@/api/marketing/card_use'

export default {
  components: {
    csGoodsCategory: () => import('@/components/cs-goods-category')
  },
  props: {
    loading: {
      default: false
    },
    tableData: {
      default: () => []
    }
  },
  data() {
    return {
      currentTableData: [],
      multipleSelection: [],
      dialogLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑购物卡',
        create: '新增购物卡'
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
      auth: {
        use: false,
        add: false,
        set: false,
        del: false,
        export: false,
        enable: false,
        disable: false
      },
      form: {
        name: undefined,
        description: undefined,
        money: undefined,
        category: undefined,
        exclude_category: undefined,
        give_num: undefined,
        end_time: undefined,
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
            max: 50,
            message: '长度不能大于 50 个字符',
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
        money: [
          {
            required: true,
            message: '面额不能为空',
            trigger: 'blur'
          }
        ],
        give_num: [
          {
            required: true,
            message: '发放数不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  filters: {
    getNumber(val) {
      return util.getNumber(val)
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
      this.auth.use = this.$permission('/marketing/card/use/list')
      this.auth.add = this.$permission('/marketing/card/list/add')
      this.auth.set = this.$permission('/marketing/card/list/set')
      this.auth.del = this.$permission('/marketing/card/list/del')
      this.auth.export = this.$permission('/marketing/card/list/export')
      this.auth.enable = this.$permission('/marketing/card/list/enable')
      this.auth.disable = this.$permission('/marketing/card/list/disable')
    },
    // 获取列表中的编号
    _getIdList(val) {
      if (val === null) {
        val = this.multipleSelection
      }

      let idList = []
      if (Array.isArray(val)) {
        val.forEach(value => {
          idList.push(value.card_id)
        })
      } else {
        idList.push(this.currentTableData[val].card_id)
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
      let card_id = this._getIdList(val)
      if (card_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      function setStatus(card_id, status, vm) {
        setCardStatus(card_id, status)
          .then(() => {
            vm.currentTableData.forEach((value, index) => {
              if (card_id.indexOf(value.card_id) !== -1) {
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
        setStatus(card_id, newStatus, this)
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setStatus(card_id, status, this)
        })
        .catch(() => {
        })
    },
    // 批量删除
    handleDelete(val) {
      let card_id = this._getIdList(val)
      if (card_id.length === 0) {
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
          delCardList(card_id)
            .then(() => {
              util.deleteDataList(this.currentTableData, card_id, 'card_id')
              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 弹出新建对话框
    handleCreate() {
      this.form = {
        name: '',
        description: '',
        money: undefined,
        category: [],
        exclude_category: [],
        give_num: undefined,
        end_time: undefined,
        status: 1
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
          addCardItem(this.form)
            .then(res => {
              this.currentTableData.unshift({
                ...res.data,
                active_num: 0
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
    // 请求修改
    update() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          setCardItem(this.form)
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
    },
    // 查询购物卡使用明细
    handleUse(key) {
      if (this.auth.use) {
        this.$router.push({
          name: 'marketing-card-use',
          params: { card_id: key }
        })
      }
    },
    // 导出购物卡
    handleExportCard(id, name) {
      const columns = [
        {
          label: '编号',
          prop: 'card_use_id'
        },
        {
          label: '卡号',
          prop: 'number'
        },
        {
          label: '卡密',
          prop: 'password'
        },
        {
          label: '可用余额',
          prop: 'money'
        },
        {
          label: '是否激活',
          prop: 'is_active'
        },
        {
          label: '激活时间',
          prop: 'active_time'
        },
        {
          label: '是否有效',
          prop: 'is_invalid'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]

      const replace = {
        is_active: {
          0: '待激活',
          1: '已激活'
        },
        is_invalid: {
          0: '禁用',
          1: '启用'
        }
      }

      getCardUseExport(id)
        .then(res => {
          VueTableExport.excel({
            columns: columns,
            data: util.dataReplace(res.data, replace),
            title: name
          })
        })
    }
  }
}
</script>

<style scoped>
  .help-block {
    color: #909399;
    font-size: 12px;
    line-height: 2;
    margin-bottom: -8px;
  }

  .link:hover {
    cursor: pointer;
    color: #409EFF;
    text-decoration: underline;
  }
</style>
