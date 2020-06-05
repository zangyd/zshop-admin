<template>
  <el-dialog
    title="退款信息"
    :visible.sync="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    @open="handleOpen"
    width="650px">
    <el-form
      v-loading="loading"
      label-width="165px"
      label-position="left"
      style="margin-top: -25px;">
      <cs-print ref="print">
        <el-form-item label="退款金额：">
          <span>{{result.refund_amount | getNumber}}</span>
        </el-form-item>

        <el-form-item label="退款状态：">
          <span>{{result.refund_status}}</span>
        </el-form-item>

        <el-form-item label="退款入账账户：">
          <span>{{result.refund_recv_accout}}</span>
        </el-form-item>

        <el-form-item label="退款单号(流水号)：">
          <span>{{result.refund_no}}</span>
        </el-form-item>

        <el-form-item label="支付单号(交易流水号)：">
          <span>{{result.payment_no}}</span>
        </el-form-item>

        <el-form-item label="退款交易号：">
          <span>{{result.out_trade_no}}</span>
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
        @click="visible = false"
        size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import util from '@/utils/util'
import { queryRefundItem } from '@/api/order/refund'

export default {
  name: 'cs-order-refund',
  components: {
    csPrint: () => import('@/components/cs-print')
  },
  props: {
    // 外部v-model值
    value: {
      type: Boolean,
      default: false
    },
    refundNo: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      result: {},
      loading: false
    }
  },
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  filters: {
    getNumber(val) {
      return util.getNumber(val)
    }
  },
  methods: {
    handleOpen() {
      this.result = {}
      this.loading = true

      queryRefundItem(this.refundNo)
        .then(res => {
          this.result = res.data || {}
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
