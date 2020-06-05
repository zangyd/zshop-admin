import {
  setOrderServiceAfter,
  setOrderServiceAgree,
  setOrderServiceCancel,
  setOrderServiceComplete,
  setOrderServiceRefused,
  setOrderServiceRemark,
  setOrderServiceSendback
} from '@/api/order/service'
import util from '@/utils/util'
import { getDeliveryCompanySelect } from '@/api/logistics/company'

export default {
  components: {
    csDeliveryDist: () => import('@/components/cs-delivery-dist')
  },
  data() {
    return {
      currentTableData: [],
      auth: {
        message: false,
        agree: false,
        refused: false,
        sendback: false,
        after: false,
        cancel: false,
        complete: false,
        remark: false,
        dist: false
      },
      delivery: [],
      statusMap: {
        0: '全部',
        1: '待处理',
        2: '已同意',
        3: '已拒绝',
        4: '已寄件',
        5: '售后中',
        6: '已撤销',
        7: '已完成'
      },
      deliveryMap: {
        0: {
          text: '待发货',
          color: '#303133'
        },
        1: {
          text: '已发货',
          color: '#67C23A'
        },
        2: {
          text: '已收货',
          color: '#67C23A'
        },
        3: {
          text: '已取消',
          color: '#F56C6C'
        }
      },
      goodsMap: {
        0: '未选择',
        1: '未收到货',
        2: '已收到货'
      },
      rules: {
        complete: {
          result: [
            {
              max: 100,
              message: '长度不能大于 100 个字符',
              trigger: 'blur'
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
      formRemark: {
        index: undefined,
        loading: false,
        visible: false,
        request: {}
      },
      formComplete: {
        index: undefined,
        loading: false,
        visible: false,
        request: {}
      }
    }
  },
  filters: {
    getPreviewUrl(val, code = 'goods_image_x80') {
      return val ? util.getImageCodeUrl(val, code) : ''
    },
    getNumber(val) {
      return util.getNumber(val)
    },
    getUserName(val) {
      if (val.username) {
        return val.username === util.cookies.get('uuid') ? '我的工单' : `${val.username} 的工单`
      }
    }
  },
  mounted() {
    this._validationAuth()
  },
  methods: {
    // 验证权限
    _validationAuth() {
      this.auth.message = this.$permission('/order/service/list/message')
      this.auth.agree = this.$permission('/order/service/list/agree')
      this.auth.refused = this.$permission('/order/service/list/refused')
      this.auth.sendback = this.$permission('/order/service/list/sendback')
      this.auth.after = this.$permission('/order/service/list/after')
      this.auth.cancel = this.$permission('/order/service/list/cancel')
      this.auth.complete = this.$permission('/order/service/list/complete')
      this.auth.remark = this.$permission('/order/service/list/remark')
      this.auth.dist = this.$permission('/order/service/list/dist')
    },
    // 我的工单配色
    _getServiceColor(val) {
      if (val && val.username === util.cookies.get('uuid')) {
        return 'color: #E6A23C;'
      }
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
    // 获取快递公司列表
    handleOpenDelivery() {
      if (!this.delivery.length) {
        getDeliveryCompanySelect(0)
          .then(res => {
            this.delivery = res.data || []
          })
      }
    },
    // 商品预览
    handleView(goods_id) {
      this.$router.push({
        name: 'goods-admin-view',
        params: { goods_id }
      })
    },
    // 查看订单详情
    handleOrder(order_no) {
      this.$router.push({
        name: 'order-admin-info',
        params: { order_no }
      })
    },
    // 查询配送轨迹
    handleDist(code, logistic = null, exclude = []) {
      if (this.$refs.deliveryDist) {
        if (typeof exclude === 'string') {
          exclude = exclude ? [exclude] : []
        }

        this.$refs.deliveryDist.show(code, logistic, exclude)
      }
    },
    // 设置卖家备注
    setServiceRemark(index) {
      const data = this.currentTableData[index]
      this.formRemark = {
        index,
        loading: false,
        visible: true,
        request: {
          service_no: data.service_no,
          remark: data.remark
        }
      }
    },
    // 请求卖家备注
    handleServiceRemark() {
      this.formRemark.loading = true
      const index = this.formRemark.index

      setOrderServiceRemark(this.formRemark.request)
        .then(() => {
          this.currentTableData[index].remark = this.formRemark.request.remark
          this.formRemark.visible = false
          this.$message.success('操作成功')
        })
        .catch(() => {
          this.formRemark.loading = false
        })
    },
    // 同意售后
    handleServiceAgree(index) {
      this._whetherToConfirm()
        .then(() => {
          const data = this.currentTableData[index]
          setOrderServiceAgree(data.service_no)
            .then(res => {
              if (this.$options.name !== 'order-service-info') {
                if (this.tabPane === '0') {
                  this.$set(this.currentTableData, index, {
                    ...data,
                    ...res.data,
                    admin_event: 0,
                    get_admin: { username: util.cookies.get('uuid') } // 后端不返回get_admin,进行模拟
                  })
                } else {
                  this.currentTableData.splice(index, 1)
                  if (this.currentTableData.length <= 0) {
                    this.$emit('refresh', true)
                  }
                }
              } else {
                this.getServiceData()
              }
            })
            .then(() => {
              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 拒绝售后
    handleServiceRefused(index) {
      this.$prompt('请输入拒绝原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请输入拒绝原因'
      })
        .then(({ value }) => {
          const data = this.currentTableData[index]
          setOrderServiceRefused(data.service_no, value)
            .then(res => {
              if (this.$options.name !== 'order-service-info') {
                if (this.tabPane === '0') {
                  this.$set(this.currentTableData, index, {
                    ...data,
                    ...res.data,
                    admin_event: 0,
                    get_admin: { username: util.cookies.get('uuid') } // 后端不返回get_admin,进行模拟
                  })
                } else {
                  this.currentTableData.splice(index, 1)
                  if (this.currentTableData.length <= 0) {
                    this.$emit('refresh', true)
                  }
                }
              } else {
                this.getServiceData()
              }
            })
            .then(() => {
              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 设置是否需要寄回商家
    handleServiceSendback(index) {
      this._whetherToConfirm()
        .then(() => {
          const data = this.currentTableData[index]
          const isReturn = Number(!data.is_return)

          setOrderServiceSendback(data.service_no, isReturn)
            .then(() => {
              if (this.$options.name !== 'order-service-info') {
                this.$set(this.currentTableData, index, {
                  ...data,
                  is_return: isReturn,
                  admin_event: 0
                })
              } else {
                this.getServiceData()
              }
            })
            .then(() => {
              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 设为售后中
    handleServiceAfter(index) {
      this._whetherToConfirm()
        .then(() => {
          const data = this.currentTableData[index]
          setOrderServiceAfter(data.service_no)
            .then(res => {
              if (this.$options.name !== 'order-service-info') {
                if (this.tabPane === '0') {
                  this.$set(this.currentTableData, index, {
                    ...data,
                    ...res.data,
                    admin_event: 0
                  })
                } else {
                  this.currentTableData.splice(index, 1)
                  if (this.currentTableData.length <= 0) {
                    this.$emit('refresh', true)
                  }
                }
              } else {
                this.getServiceData()
              }
            })
            .then(() => {
              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 撤销售后
    handleServiceCancel(index) {
      this._whetherToConfirm()
        .then(() => {
          const data = this.currentTableData[index]
          setOrderServiceCancel(data.service_no)
            .then(res => {
              if (this.$options.name !== 'order-service-info') {
                if (this.tabPane === '0') {
                  this.$set(this.currentTableData, index, {
                    ...data,
                    ...res.data,
                    admin_event: 0
                  })
                } else {
                  this.currentTableData.splice(index, 1)
                  if (this.currentTableData.length <= 0) {
                    this.$emit('refresh', true)
                  }
                }
              } else {
                this.getServiceData()
              }
            })
            .then(() => {
              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 售后完成
    setServiceComplete(index) {
      const data = this.currentTableData[index]
      this.formComplete = {
        index,
        loading: false,
        visible: false,
        request: {
          type: data.type,
          service_no: data.service_no,
          delivery_item_id: undefined,
          logistic_code: undefined,
          result: undefined
        }
      }

      this.$nextTick(() => {
        if (this.$refs.formComplete) {
          this.$refs.formComplete.clearValidate()
        }

        this.formComplete.visible = true
      })
    },
    // 请求售后完成
    handleServiceComplete() {
      this.$refs.formComplete.validate(valid => {
        if (valid) {
          const request = this.formComplete.request
          if ([2, 3].includes(request.type) && !request.delivery_item_id) {
            this.$message.error('请选择快递公司')
            return
          }

          this.formComplete.loading = true
          const index = this.formComplete.index

          setOrderServiceComplete(request)
            .then(res => {
              if (this.$options.name !== 'order-service-info') {
                if (this.tabPane === '0') {
                  this.$set(this.currentTableData, index, {
                    ...this.currentTableData[index],
                    ...res.data,
                    admin_event: 0
                  })
                } else {
                  this.currentTableData.splice(index, 1)
                  if (this.currentTableData.length <= 0) {
                    this.$emit('refresh', true)
                  }
                }
              } else {
                this.getServiceData()
              }

              this.formComplete.visible = false
              this.$message.success('操作成功')
            })
        }
      })
    }
  }
}
