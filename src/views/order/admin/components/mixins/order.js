import {
  cancelOrderItem,
  changePriceOrderItem,
  completeOrderList,
  deliveryOrderItem,
  pickingOrderList,
  recycleOrderItem,
  remarkOrderItem,
  setOrderItem
} from '@/api/order/order'
import util from '@/utils/util'
import { getDeliverySelect } from '@/api/logistics/delivery'
import { getDeliveryCompanySelect } from '@/api/logistics/company'

export default {
  components: {
    csRegionSelect: () => import('@/components/cs-region-select'),
    csDeliveryDist: () => import('@/components/cs-delivery-dist'),
    csGoodsDrawer: () => import('@/components/cs-goods-drawer')
  },
  data() {
    return {
      currentTableData: [],
      multipleSelection: [],
      auth: {
        print: false,
        start_picking: false,
        cancel_picking: false,
        delivery: false,
        complete: false,
        price: false,
        set: false,
        dist: false,
        cancel: false,
        del: false,
        restore: false,
        remark: false
      },
      rules: {
        order: {
          consignee: [
            {
              required: true,
              message: '收货人姓名不能为空',
              trigger: 'blur'
            },
            {
              max: 50,
              message: '长度不能大于 50 个字符',
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true,
              message: '收货人手机号码不能为空',
              trigger: 'blur'
            },
            {
              min: 7,
              max: 15,
              message: '长度在 7 到 15 个字符',
              trigger: 'blur'
            }
          ],
          tel: [
            {
              max: 20,
              message: '长度不能大于 20 个字符',
              trigger: 'blur'
            }
          ],
          zipcode: [
            {
              max: 20,
              message: '长度不能大于 20 个字符',
              trigger: 'blur'
            }
          ],
          region_list: [
            {
              required: true,
              message: '收货区域不能为空',
              trigger: 'change'
            }
          ],
          address: [
            {
              required: true,
              message: '收货详细地址不能为空',
              trigger: 'blur'
            },
            {
              max: 255,
              message: '长度不能大于 255 个字符',
              trigger: 'blur'
            }
          ],
          invoice_title: [
            {
              max: 255,
              message: '长度不能大于 255 个字符',
              trigger: 'blur'
            }
          ],
          tax_number: [
            {
              max: 20,
              message: '长度不能大于 20 个字符',
              trigger: 'blur'
            }
          ]
        },
        delivery: {
          delivery_id: [
            {
              required: true,
              message: '至少选择一项',
              trigger: 'change'
            }
          ],
          delivery_item_id: [
            {
              required: true,
              message: '至少选择一项',
              trigger: 'change'
            }
          ],
          logistic_code: [
            {
              required: true,
              message: '快递单号不能为空',
              trigger: 'blur'
            },
            {
              max: 50,
              message: '长度不能大于 50 个字符',
              trigger: 'blur'
            }
          ]
        }
      },
      delivery: {},
      deliveryMap: {
        0: '#303133',
        1: '#67C23A',
        2: '#67C23A',
        3: '#F56C6C'
      },
      sourceMap: {},
      serviceMap: {
        1: '售后中',
        2: '已售后'
      },
      statusMap: {
        0: '待发货',
        1: '已发货',
        2: '已收货',
        3: '已取消'
      },
      formRemark: {
        index: undefined,
        loading: false,
        visible: false,
        request: {}
      },
      formAmount: {
        index: undefined,
        loading: false,
        visible: false,
        actual: 0,
        request: {}
      },
      formOrder: {
        index: undefined,
        loading: false,
        visible: false,
        request: {}
      },
      formDelivery: {
        index: undefined,
        loading: false,
        visible: false,
        delivery: 1,
        selection: [],
        goods: {},
        request: {}
      }
    }
  },
  filters: {
    getPreviewUrl(val) {
      return val ? util.getImageCodeUrl(val, 'goods_image_x80') : ''
    },
    getNumber(val) {
      return util.getNumber(val)
    },
    getDelivery(val) {
      return val ? val.alias : ''
    }
  },
  mounted() {
    this.handleOpenDelivery()
    this._validationAuth()
  },
  methods: {
    // 验证权限
    _validationAuth() {
      this.auth.print = this.$permission('/order/admin/print')
      this.auth.start_picking = this.$permission('/order/admin/list/start_picking')
      this.auth.cancel_picking = this.$permission('/order/admin/list/cancel_picking')
      this.auth.delivery = this.$permission('/order/admin/list/delivery')
      this.auth.complete = this.$permission('/order/admin/list/complete')
      this.auth.price = this.$permission('/order/admin/list/price')
      this.auth.set = this.$permission('/order/admin/list/set')
      this.auth.dist = this.$permission('/order/admin/list/dist')
      this.auth.cancel = this.$permission('/order/admin/list/cancel')
      this.auth.del = this.$permission('/order/admin/list/del')
      this.auth.restore = this.$permission('/order/admin/list/restore')
      this.auth.remark = this.$permission('/order/admin/list/remark')
    },
    // 获取列表中的订单编号
    _getOrderNoList(val) {
      if (val === null) {
        val = this.multipleSelection
      }

      let idList = []
      if (Array.isArray(val)) {
        val.forEach(value => {
          idList.push(value.order_no)
        })
      } else {
        idList.push(this.currentTableData[val].order_no)
      }

      return idList
    },
    // 获取付款方式
    _getPaymentType(code) {
      if (Object.prototype.hasOwnProperty.call(this.toPayment, code)) {
        return this.toPayment[code].name
      }

      return ''
    },
    // 询问提示
    _whetherToConfirm(message = null, type = 'warning') {
      let options = {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type
      }

      let msg = message || '确定要执行该操作吗?'
      return this.$confirm(msg, '提示', options)
    },
    // 商品预览弹出窗
    handleViewGoods(value) {
      this.$nextTick(() => {
        this.$refs.goodsDrawer.show(value)
      })
    },
    // 商品预览
    handleView(goods_id) {
      this.$router.push({
        name: 'goods-admin-view',
        params: { goods_id }
      })
    },
    // 设置卖家备注
    setSellersRemark(index) {
      const data = this.currentTableData[index]
      this.formRemark = {
        index,
        loading: false,
        visible: true,
        request: {
          order_no: data.order_no,
          sellers_remark: data.sellers_remark
        }
      }
    },
    // 请求卖家备注
    handleSellersRemark() {
      this.formRemark.loading = true
      const index = this.formRemark.index

      remarkOrderItem(this.formRemark.request)
        .then(res => {
          this.currentTableData[index].sellers_remark = res.data.sellers_remark
          this.formRemark.visible = false
          this.$message.success('操作成功')
        })
        .catch(() => {
          this.formRemark.loading = false
        })
    },
    // 查询配送轨迹
    handleDeliveryDist(value) {
      if (this.$refs.deliveryDist) {
        this.$refs.deliveryDist.show(value)
      }
    },
    // 修改金额
    setOrderAmount(index) {
      const data = this.currentTableData[index]
      this.formAmount = {
        index,
        loading: false,
        visible: true,
        actual: data.total_amount,
        request: {
          order_no: data.order_no,
          total_amount: 0
        }
      }
    },
    // 请求修改金额
    handleOrderAmount() {
      this.formAmount.loading = true
      const index = this.formAmount.index

      changePriceOrderItem(this.formAmount.request)
        .then(() => {
          if (this.$options.name !== 'order-admin-info') {
            this.currentTableData[index].total_amount += this.formAmount.request.total_amount
          } else {
            this.getOrderData()
          }

          this.formAmount.visible = false
          this.$message.success('操作成功')
        })
        .catch(() => {
          this.formAmount.loading = false
        })
    },
    // 修改订单
    setOrderItem(index) {
      this.formOrder = {
        index,
        loading: false,
        visible: false,
        request: { ...this.currentTableData[index] }
      }

      this.$nextTick(() => {
        if (this.$refs.formOrder) {
          this.$refs.formOrder.clearValidate()
        }

        this.formOrder.visible = true
      })
    },
    // 请求修改订单
    handleSetOrder() {
      this.$refs.formOrder.validate(valid => {
        if (valid) {
          this.formOrder.loading = true
          setOrderItem(this.formOrder.request)
            .then(res => {
              if (this.$options.name !== 'order-admin-info') {
                this.$set(this.currentTableData, this.formOrder.index, {
                  ...this.currentTableData[this.formOrder.index],
                  ...res.data
                })
              } else {
                this.getOrderData()
              }

              this.formOrder.visible = false
              this.$message.success('操作成功')
            })
            .catch(() => {
              this.formOrder.loading = false
            })
        }
      })
    },
    // 请求配货状态
    handlePicking(is_picking, value = null) {
      let orderList = this._getOrderNoList(value)
      if (orderList.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      this._whetherToConfirm()
        .then(() => {
          pickingOrderList(orderList, is_picking)
            .then(res => {
              if (this.$options.name !== 'order-admin-info') {
                let refreshTotal = true

                if (this.tabPane === '0') {
                  this.currentTableData.forEach(item => {
                    if (orderList.indexOf(item.order_no) !== -1) {
                      this.$set(item, 'trade_status', res.data.trade_status)
                    }
                  })
                } else {
                  util.deleteDataList(this.currentTableData, orderList, 'order_no')
                  if (this.currentTableData.length <= 0) {
                    refreshTotal = false
                    this.$emit('refresh', true)
                  }
                }

                refreshTotal && this.$emit('total')
              } else {
                this.getOrderData()
              }

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 获取配送信息
    handleOpenDelivery() {
      if (!this.delivery.select) {
        getDeliverySelect()
          .then(res => {
            this.delivery.select = res.data || []
          })
      }

      if (!this.delivery.company) {
        getDeliveryCompanySelect(0)
          .then(res => {
            this.delivery.company = res.data || []
          })
      }
    },
    // 确认发货
    handleDelivery(index) {
      const data = this.currentTableData[index]
      this.formDelivery = {
        index,
        loading: false,
        visible: false,
        delivery: 1,
        selection: [],
        goods: data.get_order_goods,
        request: {
          order_no: data.order_no,
          order_goods_id: [],
          delivery_id: data.delivery_id,
          delivery_item_id: undefined,
          logistic_code: undefined
        }
      }

      // 处理el-select项不存在的bug
      if (this.delivery.select) {
        if (!this.delivery.select.find(item => item.delivery_id === data.delivery_id)) {
          this.formDelivery.request.delivery_id = undefined
        }
      }

      this.$nextTick(() => {
        if (this.$refs.formDelivery) {
          this.$refs.formDelivery.clearValidate()
        }

        if (this.$refs.dliveryMultiple) {
          this.$refs.dliveryMultiple.clearSelection()
        }

        this.formDelivery.visible = true
      })
    },
    // 请求确认发货
    deliveryOrderItem() {
      this.$refs.formDelivery.validate(valid => {
        if (valid) {
          if (this.formDelivery.selection.length <= 0) {
            this.formDelivery.loading = false
            this.$message.error('请至少选择一个商品')
            return
          }

          let orderGoods = []
          let request = this.formDelivery.request

          this.formDelivery.selection.forEach(item => {
            orderGoods.push(item.order_goods_id)
          })

          switch (this.formDelivery.delivery) {
            case 0:
              delete request.delivery_id
              delete request.delivery_item_id
              delete request.logistic_code
              break
            case 1:
              delete request.delivery_item_id
              break
            case 2:
              delete request.delivery_id
              break
          }

          this.formDelivery.loading = true
          this.formDelivery.request.order_goods_id = orderGoods

          deliveryOrderItem(request)
            .then(res => {
              if (this.$options.name !== 'order-admin-info') {
                let refreshTotal = true
                const index = this.formDelivery.index

                if (this.tabPane === '0' || res.data.delivery_status !== 1) {
                  this.formDelivery.goods.forEach(item => {
                    if (orderGoods.includes(item.order_goods_id)) {
                      item.is_service = 0
                      item.status = 1
                    }
                  })

                  this.$set(this.currentTableData, index, {
                    ...this.currentTableData[index],
                    ...res.data
                  })
                } else {
                  this.currentTableData.splice(index, 1)
                  if (this.currentTableData.length <= 0) {
                    refreshTotal = false
                    this.$emit('refresh', true)
                  }
                }

                refreshTotal && this.$emit('total')
              } else {
                this.getOrderData()
              }

              this.formDelivery.visible = false
              this.$message.success('操作成功')
            })
            .catch(() => {
              this.formDelivery.loading = false
            })
        }
      })
    },
    // 请求确认收货
    handleComplete(value = null) {
      let orderList = this._getOrderNoList(value)
      if (orderList.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      this._whetherToConfirm()
        .then(() => {
          completeOrderList(orderList)
            .then(res => {
              if (this.$options.name !== 'order-admin-info') {
                let refreshTotal = true

                if (this.tabPane === '0') {
                  this.currentTableData.forEach(item => {
                    if (orderList.indexOf(item.order_no) !== -1) {
                      item.trade_status = res.data.trade_status
                      item.finished_time = res.data.finished_time
                      item.get_order_goods.forEach(goods => {
                        if (goods.is_service === 1) {
                          goods.is_service = 0
                        }
                      })
                    }
                  })
                } else {
                  util.deleteDataList(this.currentTableData, orderList, 'order_no')
                  if (this.currentTableData.length <= 0) {
                    refreshTotal = false
                    this.$emit('refresh', true)
                  }
                }

                refreshTotal && this.$emit('total')
              } else {
                this.getOrderData()
              }

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 请求取消订单
    handleOrderCancel(index) {
      this._whetherToConfirm()
        .then(() => {
          const data = this.currentTableData[index]
          cancelOrderItem(data.order_no)
            .then(res => {
              if (this.$options.name !== 'order-admin-info') {
                let refreshTotal = true

                if (this.tabPane === '0') {
                  this.$set(this.currentTableData, index, {
                    ...data,
                    ...res.data
                  })
                } else {
                  this.currentTableData.splice(index, 1)
                  if (this.currentTableData.length <= 0) {
                    refreshTotal = false
                    this.$emit('refresh', true)
                  }
                }

                refreshTotal && this.$emit('total')
              } else {
                this.getOrderData()
              }

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 请求删除或恢复订单
    handleOrderRecycle(index, type) {
      this._whetherToConfirm()
        .then(() => {
          recycleOrderItem(this.currentTableData[index].order_no, type)
            .then(() => {
              if (this.$options.name !== 'order-admin-info') {
                this.currentTableData.splice(index, 1)

                if (this.currentTableData.length <= 0) {
                  this.$emit('refresh', true)
                }
              } else {
                this.getOrderData()
              }

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    }
  }
}
