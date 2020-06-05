<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">
      <el-form-item v-if="auth.info">
        <el-button
          icon="el-icon-warning-outline"
          :disabled="loading"
          @click="handleInfo">优惠劵信息</el-button>
      </el-form-item>

      <el-form-item v-if="couponType !== 'delete' && auth.del">
        <el-button
          icon="el-icon-delete"
          :disabled="loading"
          @click="handleStatus(null, 'del')">删除</el-button>
      </el-form-item>

      <el-form-item v-if="couponType === 'delete' && auth.rec">
        <el-button
          icon="el-icon-refresh-left"
          :disabled="loading"
          @click="handleStatus(null, 'rec')">恢复</el-button>
      </el-form-item>

      <cs-help
        :router="$route.path"
        style="padding-bottom: 19px;">
      </cs-help>
    </el-form>

    <el-table
      :data="currentTableData"
      :highlight-current-row="true"
      @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"/>

      <el-table-column
        label="兑换码"
        prop="exchange_code">
      </el-table-column>

      <el-table-column
        label="订单号"
        prop="order_no"
        min-width="160">
      </el-table-column>

      <el-table-column
        label="关联账号"
        prop="get_user.username">
      </el-table-column>

      <el-table-column
        label="使用日期"
        align="center"
        prop="use_time"
        width="160">
      </el-table-column>

      <el-table-column
        label="是否有效"
        align="center">
        <template slot-scope="scope">
          <el-tag
            :type="invalidMap[scope.row.get_coupon.is_invalid].type"
            size="mini"
            effect="plain">
            {{invalidMap[scope.row.get_coupon.is_invalid].text}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="100">
        <template slot-scope="scope">
          <el-button
            v-if="couponType !== 'delete' && auth.del"
            @click="handleStatus(scope.$index, 'del')"
            size="small"
            type="text">删除</el-button>

          <el-button
            v-if="couponType === 'delete' && auth.rec"
            @click="handleStatus(scope.$index, 'rec')"
            size="small"
            type="text">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="优惠劵信息"
      :visible.sync="infoVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="650px">
      <el-form
        v-if="couponData"
        label-width="110px"
        label-position="left"
        style="margin-top: -25px;">
        <cs-print ref="print">
          <el-form-item label="名称：">
            <span>{{couponData.name}}</span>
          </el-form-item>

          <el-form-item label="描述：">
            <span>{{couponData.description || '-'}}</span>
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item label="类型：">
                <span>{{typeMap[couponData.type]}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="领取码：">
                <span>{{couponData.give_code}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="优惠金额：">
                <span>{{couponData.money | getNumber}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="使用门槛：">
                <span>满 {{couponData.quota | getNumber}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="限领次数：">
                <span>{{couponData.frequency || '不限次数'}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="发放数：">
                <span>{{couponData.give_num}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="领取数：">
                <span>{{couponData.receive_num}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="使用数：">
                <span>{{couponData.use_num}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="状态：">
                <el-tag
                  :type="statusMap[couponData.status].type"
                  effect="plain"
                  size="mini">
                  {{statusMap[couponData.status].text}}
                </el-tag>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="是否有效：">
                <el-tag
                  :type="invalidMap[couponData.is_invalid].type"
                  effect="plain"
                  size="mini">
                  {{invalidMap[couponData.is_invalid].text}}
                </el-tag>
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider/>

          <el-row>
            <el-col :span="12">
              <el-form-item label="发放开始日期：">
                <span>{{couponData.give_begin_time}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="发放结束日期：">
                <span>{{couponData.give_end_time}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="使用开始日期：">
                <span>{{couponData.use_begin_time}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="使用截止日期：">
                <span>{{couponData.use_end_time}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </cs-print>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <div class="cs-fl">
          <el-button
            icon="el-icon-printer"
            @click="$refs.print.toPrint()"
            size="small">打印</el-button>
        </div>

        <el-button
          type="primary"
          @click="infoVisible = false"
          size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from '@/utils/util'
import { delCouponGiveList, recCouponGiveList } from '@/api/marketing/coupon_give'

export default {
  components: {
    csPrint: () => import('@/components/cs-print')
  },
  props: {
    loading: {
      default: false
    },
    tableData: {
      default: () => []
    },
    couponData: {
      default: null
    },
    couponType: {
      default: ''
    }
  },
  data() {
    return {
      infoVisible: false,
      currentTableData: [],
      multipleSelection: [],
      auth: {
        info: false,
        del: false,
        rec: false
      },
      typeMap: {
        0: '指定会员',
        1: '批量生成',
        2: '主动领取',
        3: '营销赠送'
      },
      invalidMap: {
        0: {
          text: '正常',
          type: 'success'
        },
        1: {
          text: '无效',
          type: 'danger'
        }
      },
      statusMap: {
        0: {
          text: '禁用',
          type: 'danger'
        },
        1: {
          text: '启用',
          type: 'success'
        }
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
      this.auth.info = this.$permission('/marketing/coupon/give/info')
      this.auth.del = this.$permission('/marketing/coupon/give/del')
      this.auth.rec = this.$permission('/marketing/coupon/give/rec')
    },
    // 获取列表中的编号
    _getIdList(val) {
      if (val === null) {
        val = this.multipleSelection
      }

      let idList = []
      if (Array.isArray(val)) {
        val.forEach(value => {
          idList.push(value.coupon_give_id)
        })
      } else {
        idList.push(this.currentTableData[val].coupon_give_id)
      }

      return idList
    },
    // 选中数据项
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量删除或恢复
    handleStatus(val, type) {
      let coupon_give_id = this._getIdList(val)
      if (coupon_give_id.length === 0) {
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
          if (type === 'del') {
            delCouponGiveList(coupon_give_id)
              .then(() => {
                util.deleteDataList(this.currentTableData, coupon_give_id, 'coupon_give_id')
                this.$message.success('操作成功')
              })
          }
        })
        .then(() => {
          if (type === 'rec') {
            recCouponGiveList(coupon_give_id)
              .then(() => {
                util.deleteDataList(this.currentTableData, coupon_give_id, 'coupon_give_id')
                this.$message.success('操作成功')
              })
          }
        })
        .catch(() => {
        })
    },
    // 显示优惠劵信息
    handleInfo() {
      if (!this.couponData) {
        this.$message.info('查询全部优惠劵时无法显示信息')
        return
      }

      this.infoVisible = true
    }
  }
}
</script>
