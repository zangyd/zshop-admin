<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">
      <el-form-item v-if="auth.info">
        <el-button
          icon="el-icon-warning-outline"
          :disabled="loading"
          @click="handleInfo">购物卡信息</el-button>
      </el-form-item>

      <el-form-item v-if="auth.enable || auth.disable">
        <el-button-group>
          <el-button
            v-if="auth.enable"
            icon="el-icon-check"
            :disabled="loading"
            @click="handleInvalid(null, 1, true)">启用</el-button>

          <el-button
            v-if="auth.disable"
            icon="el-icon-close"
            :disabled="loading"
            @click="handleInvalid(null, 0, true)">禁用</el-button>
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
      @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"/>

      <el-table-column
        label="卡号"
        prop="number"
        min-width="110">
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.remark"
            :content="`备注：${scope.row.remark}`"
            placement="top-start">
            <i class="el-icon-tickets cs-pr-5"/>
          </el-tooltip>
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="卡密"
        prop="password"
        min-width="130">
      </el-table-column>

      <el-table-column
        label="可用余额"
        prop="money">
        <template slot-scope="scope">
          {{scope.row.money | getNumber}}
        </template>
      </el-table-column>

      <el-table-column
        label="是否激活"
        align="center"
        prop="is_active">
        <template slot-scope="scope">
          <el-tag size="mini" effect="plain" :type="activeMap[scope.row.is_active].type">
            {{activeMap[scope.row.is_active].text}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="激活账号"
        prop="get_user.username">
      </el-table-column>

      <el-table-column
        label="激活日期"
        align="center"
        prop="active_time"
        width="160">
      </el-table-column>

      <el-table-column
        label="状态"
        align="center"
        prop="is_invalid">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="invalidMap[scope.row.is_invalid].type"
            :style="auth.enable || auth.disable ? 'cursor: pointer;' : ''"
            :effect="auth.enable || auth.disable ? 'light' : 'plain'"
            @click.native="handleInvalid(scope.$index)">
            {{invalidMap[scope.row.is_invalid].text}}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="购物卡信息"
      :visible.sync="infoVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px">
      <el-form
        v-if="cardData"
        label-width="90px"
        label-position="left"
        style="margin-top: -25px;">
        <cs-print ref="print">
          <el-form-item label="名称：">
            <span>{{cardData.name}}</span>
          </el-form-item>

          <el-form-item label="描述：">
            <span>{{cardData.description || '-'}}</span>
          </el-form-item>

          <el-form-item label="面额：">
            <span>{{cardData.money | getNumber}}</span>
          </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item label="发放数：">
                <span>{{cardData.give_num}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="激活数：">
                <span>{{cardData.active_num}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="创建时间：">
                <span>{{cardData.create_time}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="截止日期：">
                <span>{{cardData.end_time || '不限日期'}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="状态：">
            <el-tag
              :type="invalidMap[cardData.status].type"
              effect="plain"
              size="small">
              {{invalidMap[cardData.status].text}}
            </el-tag>
          </el-form-item>
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
import { setCardUseInvalid } from '@/api/marketing/card_use'

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
    cardData: {
      default: null
    }
  },
  data() {
    return {
      infoVisible: false,
      currentTableData: [],
      multipleSelection: [],
      auth: {
        info: false,
        enable: false,
        disable: false
      },
      activeMap: {
        0: {
          text: '待激活',
          type: 'info'
        },
        1: {
          text: '已激活',
          type: ''
        }
      },
      invalidMap: {
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
      this.auth.info = this.$permission('/marketing/card/use/info')
      this.auth.enable = this.$permission('/marketing/card/use/enable')
      this.auth.disable = this.$permission('/marketing/card/use/disable')
    },
    // 获取列表中的编号
    _getIdList(val) {
      if (val === null) {
        val = this.multipleSelection
      }

      let idList = []
      if (Array.isArray(val)) {
        val.forEach(value => {
          idList.push(value.card_use_id)
        })
      } else {
        idList.push(this.currentTableData[val].card_use_id)
      }

      return idList
    },
    // 选中数据项
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 显示购物卡信息
    handleInfo() {
      if (!this.cardData) {
        this.$message.info('查询全部购物卡时无法显示信息')
        return
      }

      this.infoVisible = true
    },
    // 处理购物卡状态
    handleInvalid(val, invalid = 0, batch = false) {
      let card_use_id = this._getIdList(val)
      if (card_use_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      function setInvalid(card_use_id, is_invalid, remark, vm) {
        setCardUseInvalid({ card_use_id, is_invalid, remark })
          .then(() => {
            vm.currentTableData.forEach((value, index) => {
              if (card_use_id.indexOf(value.card_use_id) !== -1) {
                vm.$set(vm.currentTableData, index, {
                  ...value,
                  is_invalid,
                  remark
                })
              }
            })

            vm.$message.success('操作成功')
          })
      }

      if (!batch) {
        let oldData = this.currentTableData[val]
        invalid = oldData.is_invalid ? 0 : 1

        if (oldData.is_invalid > 1) {
          return
        }

        // 禁用权限检测
        if (invalid === 0 && !this.auth.disable) {
          return
        }

        // 启用权限检测
        if (invalid === 1 && !this.auth.enable) {
          return
        }
      }

      const message = '请填写状态设置原因(备注)'
      this.$prompt(message, '状态设置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: message
      })
        .then(({ value }) => {
          if (!batch) {
            this.$set(this.currentTableData[val], 'is_invalid', 2)
          }

          setInvalid(card_use_id, invalid, value, this)
        })
        .catch(() => {
        })
    }
  }
}
</script>
