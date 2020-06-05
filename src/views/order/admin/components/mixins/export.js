import { getOrderList } from '@/api/order/order'
import VueTableExport from '@zangyd/vue-table-export'
import util from '@/utils/util'

export default {
  data() {
    return {
      exportLoading: false
    }
  },
  methods: {
    // 订单导出
    handleExport() {
      let exportData = []
      this.exportLoading = true

      if (this.multipleSelection.length > 0) {
        exportData = [...this.multipleSelection]
        this.dataProcessing(exportData)
      } else {
        getOrderList({ is_export: 1 })
          .then(res => {
            exportData = res.data.items || []
            this.dataProcessing(exportData)
          })
          .catch(() => {
            this.exportLoading = false
          })
      }
    },
    // 处理原始数据
    dataProcessing(data) {
      if (!Array.isArray(data) || data.length <= 0) {
        this.exportLoading = false
        this.$message.warning('没有可导出的数据')
        return
      }

      const commentMap = {
        0: '未评价',
        1: '已评价',
        2: '追加评价'
      }

      const serviceMap = {
        0: '可申请售后',
        1: '售后中',
        2: '完成售后',
        3: '不可申请售后'
      }

      const statusMap = {
        0: '未发货',
        1: '已发货',
        2: '已收货',
        3: '已取消'
      }

      // 对无法处理的数据字段进行操作
      for (let value of data) {
        value.username = value.get_user.username
        value.nickname = value.get_user.nickname
        value.delivery_id = value.get_delivery && value.get_delivery.alias
        value.payment_code = this._getPaymentType(value.payment_code)
        value.goods = ''

        for (let item of value.get_order_goods) {
          value.goods += `名称：${item.goods_name};`
          value.goods += `货号：${item.goods_code};`
          value.goods += `SKU：${item.goods_sku};`
          value.goods += `条码：${item.bar_code};`
          value.goods += `规格：${item.key_value};`
          value.goods += `市场价：${item.market_price};`
          value.goods += `本店价：${item.shop_price};`
          value.goods += `购买数量：${item.qty};`
          value.goods += `评价状态：${commentMap[item.is_comment]};`
          value.goods += `售后状态：${serviceMap[item.is_service]};`
          value.goods += `货品状态：${statusMap[item.status]};;`
        }
      }

      // 文件名
      const fileName = '订单导出' + (new Date()).getTime()

      // 导出头
      const columns = [
        {
          label: '订单号',
          prop: 'order_no'
        },
        {
          label: '买家账号',
          prop: 'username'
        },
        {
          label: '买家昵称',
          prop: 'nickname'
        },
        {
          label: '商品',
          prop: 'goods'
        },
        {
          label: '订单金额',
          prop: 'pay_amount'
        },
        {
          label: '商品金额',
          prop: 'goods_amount'
        },
        {
          label: '应付金额(含运费)',
          prop: 'total_amount'
        },
        {
          label: '余额抵扣',
          prop: 'use_money'
        },
        {
          label: '会员等级抵扣',
          prop: 'use_level'
        },
        {
          label: '积分抵扣',
          prop: 'use_integral'
        },
        {
          label: '优惠劵抵扣',
          prop: 'use_coupon'
        },
        {
          label: '商品折扣抵扣',
          prop: 'use_discount'
        },
        {
          label: '订单促销抵扣',
          prop: 'use_promotion'
        },
        {
          label: '购物卡抵扣',
          prop: 'use_card'
        },
        {
          label: '运费',
          prop: 'delivery_fee'
        },
        {
          label: '支付单号(交易流水号)',
          prop: 'payment_no'
        },
        {
          label: '支付编码',
          prop: 'payment_code'
        },
        {
          label: '购物卡号',
          prop: 'card_number'
        },
        {
          label: '配送方式',
          prop: 'delivery_id'
        },
        {
          label: '收货人姓名',
          prop: 'consignee'
        },
        {
          label: '完整地址',
          prop: 'complete_address'
        },
        {
          label: '邮编',
          prop: 'zipcode'
        },
        {
          label: '手机号码',
          prop: 'mobile'
        },
        {
          label: '电话',
          prop: 'tel'
        },
        {
          label: '买家备注',
          prop: 'buyer_remark'
        },
        {
          label: '发票抬头',
          prop: 'invoice_title'
        },
        {
          label: '纳税人识别号',
          prop: 'tax_number'
        },
        {
          label: '开票费用',
          prop: 'invoice_amount'
        },
        {
          label: '交易状态',
          prop: 'trade_status'
        },
        {
          label: '配送状态',
          prop: 'delivery_status'
        },
        {
          label: '支付状态',
          prop: 'payment_status'
        },
        {
          label: '卖家备注',
          prop: 'sellers_remark'
        },
        {
          label: '调整价格',
          prop: 'adjustment'
        },
        {
          label: '积分换算比例(%)',
          prop: 'integral_pct'
        },
        {
          label: '赠送积分',
          prop: 'give_integral'
        },
        {
          label: '支付时间',
          prop: 'payment_time'
        },
        {
          label: '发货时间',
          prop: 'delivery_time'
        },
        {
          label: '完成时间',
          prop: 'finished_time'
        },
        {
          label: '创建时间',
          prop: 'create_time'
        },
        {
          label: '更新时间',
          prop: 'update_time'
        }
      ]

      // 替换值
      const replace = {
        trade_status: {
          0: '待处理',
          1: '配货中',
          2: '已发货',
          3: '已完成',
          4: '已取消'
        },
        delivery_status: {
          0: '未发货',
          1: '已发货',
          2: '部分发'
        },
        payment_status: {
          0: '未支付',
          1: '已支付'
        }
      }

      VueTableExport.excel({
        columns: columns,
        data: util.dataReplace(data, replace),
        title: fileName
      })
        .finally(() => {
          this.exportLoading = false
        })
    }
  }
}
