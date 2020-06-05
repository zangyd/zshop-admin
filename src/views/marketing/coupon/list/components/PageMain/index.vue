<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">
      <el-form-item v-if="auth.add">
        <el-button
          icon="el-icon-plus"
          :disabled="loading"
          @click="handleCreate">新增优惠劵</el-button>
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

      <el-form-item v-if="auth.normal || auth.invalid">
        <el-button-group>
          <el-button
            v-if="auth.normal"
            icon="el-icon-circle-check"
            :disabled="loading"
            @click="handleInvalid(null, 0, true)">正常</el-button>

          <el-button
            v-if="auth.invalid"
            icon="el-icon-circle-close"
            :disabled="loading"
            @click="handleInvalid(null, 1, true)">作废</el-button>
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

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="名称">
              <span>{{props.row.name}}</span>
            </el-form-item>

            <el-form-item label="描述">
              <span>{{props.row.description}}</span>
            </el-form-item>

            <el-form-item label="类型">
              <span>{{typeMap[props.row.type]}}</span>
            </el-form-item>

            <el-form-item label="领取码">
              <span>{{props.row.give_code}}</span>
            </el-form-item>

            <el-form-item label="优惠金额">
              <span>{{props.row.money | getNumber}}</span>
            </el-form-item>

            <el-form-item label="使用门槛">
              <span>满 {{props.row.quota | getNumber}}</span>
            </el-form-item>

            <el-form-item label="限领次数">
              <span>{{props.row.frequency || '不限次数'}}</span>
            </el-form-item>

            <el-form-item label="发放数">
              <span>{{props.row.give_num}}</span>
            </el-form-item>

            <el-form-item label="领取数">
              <span>{{props.row.receive_num}}</span>
            </el-form-item>

            <el-form-item label="使用数">
              <span>{{props.row.use_num}}</span>
            </el-form-item>

            <el-form-item label="状态">
              <el-tag
                :type="statusMap[props.row.status].type"
                effect="plain"
                size="mini">
                {{statusMap[props.row.status].text}}
              </el-tag>
            </el-form-item>

            <el-form-item label="是否有效">
              <el-tag
                :type="invalidMap[props.row.is_invalid].type"
                effect="plain"
                size="mini">
                {{invalidMap[props.row.is_invalid].text}}
              </el-tag>
            </el-form-item>

            <el-divider/>

            <el-form-item label="发放开始日期">
              <span>{{props.row.give_begin_time}}</span>
            </el-form-item>

            <el-form-item label="发放结束日期">
              <span>{{props.row.give_end_time}}</span>
            </el-form-item>

            <el-form-item label="使用开始日期">
              <span>{{props.row.use_begin_time}}</span>
            </el-form-item>

            <el-form-item label="使用截止日期">
              <span>{{props.row.use_end_time}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

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
          <span
            @click="handleGive(scope.row.coupon_id)"
            :class="{link: auth.use}">{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="类型"
        sortable="custom"
        prop="type">
        <template slot-scope="scope">
          {{typeMap[scope.row.type]}}
        </template>
      </el-table-column>

      <el-table-column
        label="发放数"
        sortable="custom"
        prop="give_num">
      </el-table-column>

      <el-table-column
        label="优惠金额"
        prop="money">
        <template slot-scope="scope">
          {{scope.row.money | getNumber}}
        </template>
      </el-table-column>

      <el-table-column
        label="使用门槛"
        prop="quota">
        <template slot-scope="scope">
          满 {{scope.row.quota | getNumber}}
        </template>
      </el-table-column>

      <el-table-column
        label="状态"
        sortable="custom"
        prop="status"
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
        label="是否有效"
        sortable="custom"
        prop="is_invalid"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="invalidMap[scope.row.is_invalid].type"
            :style="auth.normal || auth.invalid ? 'cursor: pointer;' : ''"
            :effect="auth.normal || auth.invalid ? 'light' : 'plain'"
            @click.native="handleInvalid(scope.$index)">
            {{invalidMap[scope.row.is_invalid].text}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="120">
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

          <el-dropdown
            v-if="scope.row.type !== 3 && auth.give"
            :show-timeout="50"
            size="small">
            <el-button
              class="cs-ml-10"
              size="small"
              type="text">发放操作</el-button>

            <el-dropdown-menu slot="dropdown">
              <template v-if="scope.row.type === 2">
                <el-dropdown-item
                  @click.native="handleCopyGiveCode(scope.row.give_code)">
                  复制领取码
                </el-dropdown-item>

                <el-dropdown-item
                  @click.native="handleCopyGuide(scope.$index)">
                  复制领取地址
                </el-dropdown-item>
              </template>

              <template v-if="scope.row.type === 1">
                <el-dropdown-item
                  @click.native="handleLive(scope.$index)">
                  生成优惠劵
                </el-dropdown-item>

                <el-dropdown-item
                  @click.native="handleExport(scope.$index)">
                  导出优惠劵
                </el-dropdown-item>
              </template>

              <template v-if="scope.row.type === 0">
                <el-dropdown-item
                  @click.native="handleGiveUser('user', scope.$index)">
                  会员账号发放
                </el-dropdown-item>

                <el-dropdown-item
                  @click.native="handleGiveUser('level', scope.$index)">
                  账号等级发放
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="670px">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <el-form-item
          label="名称"
          prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入优惠劵名称"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          label="描述"
          prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="可输入优惠劵描述"
            :autosize="{minRows: 3}"
            maxlength="255"
            show-word-limit/>
        </el-form-item>

        <el-form-item
          v-if="form.type === '2'"
          label="引导地址"
          prop="guide">
          <el-input
            v-model="form.guide"
            placeholder="可输入优惠劵引导地址"
            :clearable="true">
          </el-input>
          <div class="help-block">
            <span>引导顾客到特定的页面上进行领取</span>
          </div>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="类型"
              prop="type">
              <el-select
                v-model="form.type"
                placeholder="请选择"
                :disabled="dialogStatus !== 'create'"
                clearable>
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
              label="发放数"
              prop="give_num">
              <el-input-number
                v-model="form.give_num"
                placeholder="请输入发放数"
                controls-position="right"
                :min="0">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="优惠金额"
              prop="money">
              <el-input-number
                v-model="form.money"
                placeholder="请输入优惠金额"
                controls-position="right"
                :precision="2"
                :min="0">
              </el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="使用门槛"
              prop="quota">
              <el-input-number
                v-model="form.quota"
                placeholder="请输入使用门槛"
                controls-position="right"
                :precision="2"
                :min="0">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          label="指定分类"
          prop="category">
          <cs-goods-category
            v-model="form.category"
            type="all">
            <el-button slot="control">商品分类选取</el-button>
          </cs-goods-category>

          <div class="help-block">
            <span>指定商品分类后，该优惠劵只能对分类范围内的商品有效</span>
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
            <span>排除商品分类后，该优惠劵对分类范围内的商品没有效果</span>
          </div>
        </el-form-item>

        <el-row v-if="form.type === '2'" :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="会员等级"
              prop="level">
              <el-select
                v-model="form.level"
                placeholder="不选表示全部有效"
                collapse-tags
                multiple>
                <el-option
                  v-for="item in userLevel"
                  :key="item.user_level_id"
                  :label="item.name"
                  :value="item.user_level_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="限领次数"
              prop="frequency">
              <el-input-number
                v-model="form.frequency"
                placeholder="可输入限领次数"
                controls-position="right"
                :max="255"
                :min="0">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="发放开始日期"
              prop="give_begin_time">
              <el-date-picker
                v-model="form.give_begin_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择发放开始日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="发放结束日期"
              prop="give_end_time">
              <el-date-picker
                v-model="form.give_end_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择发放开始日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="使用开始日期"
              prop="use_begin_time">
              <el-date-picker
                v-model="form.use_begin_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择使用开始日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="使用截止日期"
              prop="use_end_time">
              <el-date-picker
                v-model="form.use_end_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择使用截止日期"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
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

          <el-col :span="12">
            <el-form-item
              label="是否有效"
              prop="is_invalid">
              <el-switch
                v-model="form.is_invalid"
                :active-value="0"
                :inactive-value="1">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
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

    <el-dialog
      title="发放优惠劵"
      :visible.sync="dialogGiveFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="600px">
      <el-form>
        <el-form-item
          v-if="dialogGiveType === 'level'"
          label="会员等级">
          <el-select
            v-model="giveForm.user_level_id"
            placeholder="请选择"
            collapse-tags
            multiple>
            <el-option
              v-for="item in userLevel"
              :key="item.user_level_id"
              :label="item.name"
              :value="item.user_level_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="dialogGiveType === 'user'"
          label="会员账号">
          <cs-user-select @confirm="handleUserConfirm">
            <el-button slot="control">账号选取</el-button>
          </cs-user-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <div style="float: left; font-size: 13px;">
          <span>剩余 {{giveNumber}} 张优惠劵可发放</span>
        </div>

        <el-button
          @click="dialogGiveFormVisible = false"
          size="small">取消</el-button>

        <el-button
          type="primary"
          :loading="dialogGiveLoading"
          @click="giveCoupon"
          size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addCouponItem,
  delCouponList,
  setCouponInvalid,
  setCouponItem,
  setCouponStatus
} from '@/api/marketing/coupon'
import {
  giveCouponLive,
  giveCouponUser,
  getCouponGiveExport
} from '@/api/marketing/coupon_give'
import * as clipboard from 'clipboard-polyfill'
import util from '@/utils/util'
import { getUserLevelList } from '@/api/user/level'
import VueTableExport from '@zangyd/vue-table-export'

export default {
  components: {
    csUserSelect: () => import('@/components/cs-user-select'),
    csGoodsCategory: () => import('@/components/cs-goods-category')
  },
  props: {
    loading: {
      default: false
    },
    typeMap: {
      default: () => {}
    },
    tableData: {
      default: () => []
    }
  },
  data() {
    return {
      currentTableData: [],
      multipleSelection: [],
      userLevel: [],
      dialogLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑优惠劵',
        create: '新增优惠劵'
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
      invalidMap: {
        0: {
          text: '正常',
          type: 'success'
        },
        1: {
          text: '作废',
          type: 'danger'
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
        give: false,
        enable: false,
        disable: false,
        normal: false,
        invalid: false
      },
      form: {
        name: undefined,
        description: undefined,
        guide: undefined,
        type: undefined,
        money: undefined,
        quota: undefined,
        category: undefined,
        exclude_category: undefined,
        level: undefined,
        frequency: undefined,
        give_num: undefined,
        give_begin_time: undefined,
        give_end_time: undefined,
        use_begin_time: undefined,
        use_end_time: undefined,
        status: undefined,
        is_invalid: undefined
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
        guide: [
          {
            max: 255,
            message: '长度不能大于 255 个字符',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '至少选择一项',
            trigger: 'change'
          }
        ],
        money: [
          {
            required: true,
            message: '优惠金额不能为空',
            trigger: 'blur'
          }
        ],
        quota: [
          {
            required: true,
            message: '使用门槛不能为空',
            trigger: 'blur'
          }
        ],
        give_num: [
          {
            required: true,
            message: '发放数不能为空',
            trigger: 'blur'
          }
        ],
        give_begin_time: [
          {
            required: true,
            message: '发放开始日期不能为空',
            trigger: 'change'
          }
        ],
        give_end_time: [
          {
            required: true,
            message: '发放结束日期不能为空',
            trigger: 'change'
          }
        ],
        use_begin_time: [
          {
            required: true,
            message: '使用开始日期不能为空',
            trigger: 'change'
          }
        ],
        use_end_time: [
          {
            required: true,
            message: '使用截止日期不能为空',
            trigger: 'change'
          }
        ]
      },
      dialogGiveLoading: false,
      dialogGiveFormVisible: false,
      dialogGiveType: '',
      giveNumber: 0,
      giveForm: {
        coupon_id: undefined,
        username: undefined,
        user_level_id: undefined
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
    getUserLevelList()
      .then(res => {
        this.userLevel = res.data || []
      })
  },
  methods: {
    // 验证权限
    _validationAuth() {
      this.auth.use = this.$permission('/marketing/coupon/give/list')
      this.auth.add = this.$permission('/marketing/coupon/list/add')
      this.auth.set = this.$permission('/marketing/coupon/list/set')
      this.auth.del = this.$permission('/marketing/coupon/list/del')
      this.auth.give = this.$permission('/marketing/coupon/list/give')
      this.auth.enable = this.$permission('/marketing/coupon/list/enable')
      this.auth.disable = this.$permission('/marketing/coupon/list/disable')
      this.auth.normal = this.$permission('/marketing/coupon/list/normal')
      this.auth.invalid = this.$permission('/marketing/coupon/list/invalid')
    },
    // 获取列表中的编号
    _getIdList(val) {
      if (val === null) {
        val = this.multipleSelection
      }

      let idList = []
      if (Array.isArray(val)) {
        val.forEach(value => {
          idList.push(value.coupon_id)
        })
      } else {
        idList.push(this.currentTableData[val].coupon_id)
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
    // 打开优惠劵使用明细
    handleGive(key) {
      if (this.auth.use) {
        this.$router.push({
          name: 'marketing-coupon-give',
          params: { coupon_id: key }
        })
      }
    },
    // 批量删除
    handleDelete(val) {
      let coupon_id = this._getIdList(val)
      if (coupon_id.length === 0) {
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
          delCouponList(coupon_id)
            .then(() => {
              util.deleteDataList(this.currentTableData, coupon_id, 'coupon_id')
              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 批量设置状态
    handleStatus(val, status = 0, confirm = false) {
      let coupon_id = this._getIdList(val)
      if (coupon_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      function setStatus(coupon_id, status, vm) {
        setCouponStatus(coupon_id, status)
          .then(() => {
            vm.currentTableData.forEach((value, index) => {
              if (coupon_id.indexOf(value.coupon_id) !== -1) {
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
        setStatus(coupon_id, newStatus, this)
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setStatus(coupon_id, status, this)
        })
        .catch(() => {
        })
    },
    // 批量设置是否有效
    handleInvalid(val, invalid = 0, confirm = false) {
      let coupon_id = this._getIdList(val)
      if (coupon_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      function setInvalid(coupon_id, is_invalid, vm) {
        setCouponInvalid(coupon_id, is_invalid)
          .then(() => {
            vm.currentTableData.forEach((value, index) => {
              if (coupon_id.indexOf(value.coupon_id) !== -1) {
                vm.$set(vm.currentTableData, index, {
                  ...value,
                  is_invalid
                })
              }
            })

            vm.$message.success('操作成功')
          })
      }

      if (!confirm) {
        let oldData = this.currentTableData[val]
        const newInvalid = oldData.is_invalid ? 0 : 1

        if (oldData.is_invalid > 1) {
          return
        }

        // 禁用权限检测
        if (newInvalid === 0 && !this.auth.normal) {
          return
        }

        // 启用权限检测
        if (newInvalid === 1 && !this.auth.invalid) {
          return
        }

        this.$set(this.currentTableData, val, { ...oldData, is_invalid: 2 })
        setInvalid(coupon_id, newInvalid, this)
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setInvalid(coupon_id, invalid, this)
        })
        .catch(() => {
        })
    },
    // 弹出新建对话框
    handleCreate() {
      this.form = {
        name: '',
        description: '',
        guide: '',
        type: undefined,
        money: undefined,
        quota: undefined,
        category: [],
        exclude_category: [],
        level: [],
        frequency: 0,
        give_num: undefined,
        give_begin_time: undefined,
        give_end_time: undefined,
        use_begin_time: undefined,
        use_end_time: undefined,
        status: 1,
        is_invalid: 0
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
    // 请求创建
    create() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          addCouponItem(this.form)
            .then(res => {
              this.currentTableData.unshift({
                ...res.data,
                receive_num: 0,
                use_num: 0
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
    // 请求修改
    update() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          setCouponItem(this.form)
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
    // 复制领取码
    handleCopyGiveCode(val) {
      clipboard.writeText(val)
        .then(() => {
          this.$message.success('已复制到剪贴板')
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 复制领取地址
    handleCopyGuide(index) {
      const data = this.currentTableData[index]
      let url = data.guide ? '/' : '/v1/coupon_give.html'
      let giveLink = util.getBaseApi(url, data.guide || this.$baseConfig.BASE_API)

      giveLink += data.guide ? 'give_code=' : 'method=give.coupon.code&give_code='
      giveLink += data.give_code

      clipboard.writeText(giveLink)
        .then(() => {
          this.$message.success('已复制到剪贴板')
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 请求生成优惠劵
    handleLive(index) {
      let data = this.currentTableData[index]
      const message = `请填写生成数量（最多还可生成 ${data.give_num - data.receive_num} 张）`

      this.$prompt(message, '生成优惠劵', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请填写生成数量'
      })
        .then(({ value }) => {
          giveCouponLive(data.coupon_id, value)
            .then(() => {
              this.$set(data, 'receive_num', data.receive_num + Number(value))
              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 导出优惠劵
    handleExport(index) {
      const data = this.currentTableData[index]
      if (data.receive_num <= 0) {
        this.$message.error('没有可导出的数据，请先生成优惠劵')
        return
      }

      const columns = [
        {
          label: '编号',
          prop: 'coupon_give_id'
        },
        {
          label: '兑换码',
          prop: 'exchange_code'
        },
        {
          label: '使用时间',
          prop: 'use_time'
        },
        {
          label: '创建时间',
          prop: 'create_time'
        },
        {
          label: '是否删除',
          prop: 'is_delete'
        }
      ]

      const replace = {
        is_delete: {
          0: '否',
          1: '是'
        }
      }

      getCouponGiveExport(data.coupon_id)
        .then(res => {
          VueTableExport.excel({
            columns: columns,
            data: util.dataReplace(res.data, replace),
            title: data.name
          })
        })
    },
    // 指定会员发放优惠劵
    handleGiveUser(type, index) {
      this.currentIndex = index
      this.dialogGiveType = type

      let data = this.currentTableData[index]
      this.giveNumber = data.give_num - data.receive_num

      this.giveForm = {
        coupon_id: data.coupon_id,
        username: undefined,
        user_level_id: undefined
      }

      this.$nextTick(() => {
        this.dialogGiveLoading = false
        this.dialogGiveFormVisible = true
      })
    },
    // 会员选取确认事件
    handleUserConfirm(val) {
      let userList = []
      val.forEach(value => {
        userList.push(value.username)
      })

      this.giveForm.username = userList
    },
    // 请求发放优惠劵
    giveCoupon() {
      this.dialogGiveLoading = true
      let data = this.currentTableData[this.currentIndex]

      giveCouponUser(this.giveForm)
        .then(res => {
          this.$set(data, 'receive_num', data.receive_num + res.data)
          this.dialogGiveFormVisible = false
          this.$message.success('操作成功')
        })
        .catch(() => {
          this.dialogGiveLoading = false
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

  .table-expand {
    font-size: 0;
    padding: 0 65px;
  }

  .table-expand >>> label {
    float: left;
    width: 120px;
    color: #99A9BF;
  }

  .table-expand >>> .el-form-item__content {
    display: block;
    padding-left: 120px;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
