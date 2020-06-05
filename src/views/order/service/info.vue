<template>
  <cs-container>
    <div class="cs-p">
      <el-card
        class="box-card"
        shadow="never">
        <el-row>
          <el-col class="service-left cs-pr" :span="9">
            <p class="card-title">售后信息</p>
            <div class="service-info">
              <div class="dt">创建日期</div>
              <div class="dd">{{serviceData.create_time}}</div>
            </div>

            <div class="service-info">
              <div class="dt">售后单号</div>
              <div class="dd">{{serviceData.service_no}}</div>
            </div>

            <div class="service-info">
              <div class="dt">订单号</div>
              <div class="dd">
                <span
                  @click="handleOrder(serviceData.order_no)"
                  class="link">{{serviceData.order_no}}</span>
              </div>
            </div>

            <div class="service-info" v-if="serviceData.get_admin">
              <div class="dt">处理人员</div>
              <div class="dd">
                <span :style="_getServiceColor(serviceData.get_admin)">
                  {{serviceData.get_admin | getUserName}}
                </span>
              </div>
            </div>

            <div class="service-info">
              <div class="dt">买家</div>
              <div class="dd">
                <span>{{serviceData.get_user.username}}</span>
                <el-image
                  v-if="serviceData.get_user.level_icon"
                  class="level-icon"
                  :src="serviceData.get_user.level_icon"
                  fit="fill">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"/>
                  </div>
                </el-image>
              </div>
            </div>

            <div class="service-info" v-if="serviceData.goods_status">
              <div class="dt">收货状态</div>
              <div class="dd">{{goodsMap[serviceData.goods_status]}}</div>
            </div>

            <div class="service-info">
              <div class="dt">售后原因</div>
              <div class="dd">{{serviceData.reason}}</div>
            </div>

            <div class="service-info" v-if="serviceData.description">
              <div class="dt">详细说明</div>
              <div class="dd">{{serviceData.description}}</div>
            </div>

            <div class="service-info" v-if="serviceData.image.length">
              <div class="dt">凭证照片</div>
              <div class="dd" style="line-height: 0;">
                <el-image
                  v-for="(item, index) in serviceData.image"
                  :key="index"
                  :src="item.source | getPreviewUrl('comment_thumb_x40')"
                  @click.stop="$preview(serviceData.image, index)"
                  class="image_thumb"
                  fit="cover"/>
              </div>
            </div>

            <el-divider></el-divider>

            <template v-if="serviceData.is_return">
              <div class="service-info">
                <div class="dt">是否寄回</div>
                <div class="dd">
                  <template v-if="serviceData.logistic_code">
                    <span>快递单号：</span>
                    <span
                      @click="handleDist(serviceData.service_no, serviceData.logistic_code)"
                      class="link">{{serviceData.logistic_code}}</span>
                  </template>

                  <template v-else>
                    买家尚未填写返件信息
                  </template>
                </div>
              </div>

              <template v-if="serviceData.address">
                <div class="service-info">
                  <div class="dt">寄件人</div>
                  <div class="dd">{{serviceData.consignee}}</div>
                </div>

                <div class="service-info">
                  <div class="dt">手机号</div>
                  <div class="dd">{{serviceData.mobile}}</div>
                </div>

                <div class="service-info">
                  <div class="dt">寄件地址</div>
                  <div class="dd">{{serviceData.address}}</div>
                </div>

                <div class="service-info">
                  <div class="dt">邮编</div>
                  <div class="dd">{{serviceData.zipcode}}</div>
                </div>
              </template>
            </template>

            <div class="service-info" v-if="serviceData.refund_no">
              <div class="dt">退款单号</div>
              <div class="dd">
                <span
                  @click="handleRefund(serviceData.refund_no)"
                  class="link">{{serviceData.refund_no}}</span>
              </div>
            </div>

            <div class="service-info" v-if="serviceData.result">
              <div class="dt">处理结果</div>
              <div class="dd">{{serviceData.result}}</div>
            </div>

            <div class="service-info">
              <div class="dt">卖家备注</div>
              <div class="dd">{{serviceData.remark}}</div>
            </div>
          </el-col>

          <el-col class="cs-pl" :span="15">
            <p class="card-title">售后状态</p>
            <el-steps
              :active="tradeStatus.active"
              :process-status="tradeStatus.process_status"
              :finish-status="tradeStatus.finish_status"
              :align-center="true">
              <el-step
                v-for="(value, index) of tradeStatus.step"
                :key="index"
                :title="value.title"
                :icon="value.icon"/>
            </el-steps>

            <el-divider></el-divider>

            <div style="display: inline-flex;">
              <el-button
                v-if="auth.message"
                @click="toMessage"
                size="small">留言</el-button>

              <el-button
                v-if="auth.remark"
                @click="setServiceRemark(0)"
                size="small">备注</el-button>

              <el-button
                v-if="[2, 3].includes(serviceData.type) && serviceData.status === 6 && auth.dist"
                @click="handleDist(serviceData.service_no, null, serviceData.logistic_code)"
                size="small">物流信息</el-button>

              <el-button
                v-if="serviceData.status === 0 && auth.agree"
                @click="handleServiceAgree(0)"
                size="small">同意售后</el-button>

              <el-button
                v-if="serviceData.status === 0 && auth.refused"
                @click="handleServiceRefused(0)"
                size="small">拒绝售后</el-button>

              <el-button
                v-if="serviceData.type !== 0 && serviceData.status === 1 && !serviceData.logistic_code && auth.sendback"
                @click="handleServiceSendback(0)"
                size="small">{{serviceData.is_return ? '撤销寄回' : '要求寄回'}}</el-button>

              <el-button
                v-if="((serviceData.type === 0 && serviceData.status === 1) || serviceData.status === 3) && auth.after"
                @click="handleServiceAfter(0)"
                size="small">设为售后中</el-button>

              <el-button
                v-if="[1, 3, 4].includes(serviceData.status) && auth.cancel"
                @click="handleServiceCancel(0)"
                size="small">撤销售后</el-button>

              <el-button
                v-if="serviceData.status === 4 && auth.complete"
                @click="setServiceComplete(0)"
                size="small">售后完成</el-button>
            </div>
          </el-col>
        </el-row>

        <el-collapse :value="['goods', 'log']">
          <el-collapse-item title="售后商品" name="goods">
            <el-table
              style="margin-top: -15px;"
              :data="serviceData.get_order_goods">
              <el-table-column label="商品" min-width="300">
                <template slot-scope="scope">
                  <el-image
                    class="goods-image"
                    @click="handleView(scope.row.goods_id)"
                    :src="scope.row.goods_image | getPreviewUrl"
                    fit="contain"
                    lazy>
                  </el-image>

                  <div class="goods-info">
                    <span
                      :title="scope.row.goods_name"
                      @click="handleView(scope.row.goods_id)"
                      class="name">{{scope.row.goods_name}}</span>

                    <p class="specs">{{scope.row.key_value}}</p>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="商品状态">
                <template slot-scope="scope">
                  <span :style="{'color': deliveryMap[scope.row.status].color}">
                    {{deliveryMap[scope.row.status].text}}
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="申请数量">
                <span>{{serviceData.qty}}</span>
              </el-table-column>

              <el-table-column label="类型">
                <span>{{typeMap[serviceData.type]}}</span>
              </el-table-column>

              <el-table-column label="状态">
                <span>{{statusMap[serviceData.status + 1]}}</span>
              </el-table-column>
            </el-table>

            <div v-if="serviceData.refund_fee" class="cs-fr cs-p">
              <div :class="{'service-info': true, 'cs-pb': isRefundOther()}">
                <div class="dt">申请金额</div>
                <div class="dd number">{{serviceData.refund_fee | getNumber}}</div>
              </div>

              <template v-if="serviceData.refund_detail">
                <div v-if="serviceData.refund_detail.money_amount" class="service-info">
                  <div class="dt">退回余额</div>
                  <div class="dd number">{{serviceData.refund_detail.money_amount | getNumber}}</div>
                </div>

                <div v-if="serviceData.refund_detail.integral_amount" class="service-info">
                  <div class="dt">退回积分</div>
                  <div class="dd number">{{serviceData.refund_detail.integral_amount | getNumber}}</div>
                </div>

                <div v-if="serviceData.refund_detail.card_amount" class="service-info">
                  <div class="dt">退回购物卡</div>
                  <div class="dd number">{{serviceData.refund_detail.card_amount | getNumber}}</div>
                </div>

                <div v-if="serviceData.refund_detail.payment_amount" class="service-info">
                  <div class="dt">退回在线支付</div>
                  <div class="dd number">{{serviceData.refund_detail.payment_amount | getNumber}}</div>
                </div>
              </template>

              <div v-if="serviceData.delivery_fee" class="service-info">
                <div class="dt">退回运费</div>
                <div class="dd number">{{serviceData.delivery_fee | getNumber}}</div>
              </div>
            </div>
          </el-collapse-item>

          <el-collapse-item title="售后日志" name="log" id="msg-form">
            <el-timeline>
              <el-timeline-item
                v-for="(log, index) in serviceData.get_service_log"
                :key="index"
                :type="log.client_type ? 'danger' : 'primary'"
                :timestamp="log.create_time">
                <div class="service-log">
                  <li><span>[{{clientMap[log.client_type]}}]</span> {{log.action}}</li>
                  <li class="comment">{{`${log.description}：${log.comment}`}}</li>
                </div>
              </el-timeline-item>
            </el-timeline>

            <el-form
              :model="msgForm"
              :rules="msgRules"
              label-width="68px"
              id="add-message"
              ref="msgForm">
              <el-form-item prop="message">
                <el-input
                  v-model="msgForm.message"
                  placeholder="您可以输入售后单留言，顾客在日志中可看到"
                  type="textarea"
                  :autosize="{minRows: 5}"
                  :show-word-limit="true"
                  maxlength="255"/>

                <el-button
                  class="cs-mt-10"
                  type="primary"
                  :loading="msgLoading"
                  @click="handleMessage"
                  size="small">提交</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>

    <el-dialog
      title="卖家备注"
      :visible.sync="formRemark.visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px">
      <el-input
        v-model="formRemark.request.remark"
        type="textarea"
        :rows="6"
        placeholder="编辑卖家备注，仅卖家自己可见"
        maxlength="255"
        show-word-limit>
      </el-input>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="formRemark.visible = false"
          size="small">取消</el-button>

        <el-button
          type="primary"
          :loading="formRemark.loading"
          @click="handleServiceRemark"
          size="small">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="售后完成"
      :visible.sync="formComplete.visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      @open="handleOpenDelivery"
      width="600px">
      <el-form
        :model="formComplete.request"
        :rules="rules.complete"
        ref="formComplete"
        label-width="80px">
        <el-form-item
          label="处理结果"
          prop="result">
          <el-input
            v-model="formComplete.request.result"
            placeholder="可输入售后处理结果"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          v-if="[2, 3].includes(formComplete.request.type)"
          label="快递单号"
          prop="logistic_code">
          <el-input
            v-model="formComplete.request.logistic_code"
            class="input-with-select"
            placeholder="请输入售后完成后寄回商品的快递单号"
            :clearable="true">
            <el-select
              v-model="formComplete.request.delivery_item_id"
              style="width: 150px;"
              placeholder="请选择"
              slot="prepend">
              <el-option
                v-for="(item, index) in delivery"
                :key="index"
                :label="item.name"
                :value="item.delivery_item_id"/>
            </el-select>
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="formComplete.visible = false"
          size="small">取消</el-button>

        <el-button
          type="primary"
          :loading="formComplete.loading"
          @click="handleServiceComplete"
          size="small">确定</el-button>
      </div>
    </el-dialog>

    <cs-order-refund v-model="refundVisible" :refund-no="refundNo"/>

    <cs-delivery-dist ref="deliveryDist"/>
  </cs-container>
</template>

<script>
import serviceMixins from './components/mixins/service'
import { addOrderServiceMessage, getOrderServiceItem } from '@/api/order/service'

export default {
  name: 'order-service-info',
  mixins: [
    serviceMixins
  ],
  components: {
    csOrderRefund: () => import('@/components/cs-order-refund')
  },
  props: {
    service_no: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      serviceData: {
        image: [],
        refund_detail: {},
        get_user: {},
        get_admin: null,
        get_order_goods: [],
        get_service_log: []
      },
      msgForm: {},
      msgLoading: false,
      msgRules: {
        message: [
          {
            required: true,
            message: '留言内容不能为空',
            trigger: 'blur'
          },
          {
            max: 255,
            message: '长度不能大于 255 个字符',
            trigger: 'blur'
          }
        ]
      },
      typeMap: {
        0: '仅退款',
        1: '退货退款',
        2: '换货',
        3: '维修'
      },
      clientMap: {
        '-1': '游客',
        0: '顾客',
        1: '商家'
      },
      refundNo: '',
      refundVisible: false,
      tradeStatus: {}
    }
  },
  watch: {
    service_no: {
      handler() {
        this.getServiceData()
      },
      immediate: true
    }
  },
  methods: {
    // 处理售后单状态数据
    _setTradeStatus() {
      // 初始化数据
      this.tradeStatus = {
        active: 1,
        step: [
          {
            icon: 'el-icon-edit-outline',
            title: '申请售后'
          },
          {
            icon: 'el-icon-user',
            title: '等待处理'
          },
          {
            icon: 'el-icon-loading',
            title: '售后中'
          },
          {
            icon: 'el-icon-time',
            title: '售后完成'
          }
        ]
      }

      // 处理状态显示
      switch (this.serviceData.status) {
        case 2:
          this.tradeStatus.process_status = 'wait'
          this.tradeStatus.finish_status = 'wait'
          break
        case 5:
        case 6:
          this.tradeStatus.process_status = 'finish'
          this.tradeStatus.finish_status = 'finish'
          break
        default:
          this.tradeStatus.process_status = 'process'
          this.tradeStatus.finish_status = 'finish'
      }

      // 计算进步
      switch (this.serviceData.status) {
        case 6:
        case 5:
          this.tradeStatus.active = 3
          break
        case 4:
        case 3:
        case 1:
          this.tradeStatus.active = 2
          break
        default:
          this.tradeStatus.active = 1
      }
    },
    // 是否返回其他退款信息
    isRefundOther() {
      if (this.serviceData.delivery_fee > 0) {
        return true
      }

      for (let key in this.serviceData.refund_detail) {
        if (!Object.prototype.hasOwnProperty.call(this.serviceData.refund_detail, key)) {
          continue
        }

        if (this.serviceData.refund_detail[key] > 0) {
          return true
        }
      }

      return false
    },
    // 获取售后数据
    getServiceData() {
      getOrderServiceItem(this.service_no)
        .then(res => {
          let service = res.data || {}
          service.get_order_goods = service.get_order_goods ? [service.get_order_goods] : []

          this.serviceData = service
          this.currentTableData = [this.serviceData]
          this._setTradeStatus()
        })
    },
    // 添加售后留言
    handleMessage() {
      this.$refs.msgForm.validate(valid => {
        if (valid) {
          this.msgLoading = true
          addOrderServiceMessage(this.service_no, this.msgForm.message)
            .then(() => {
              this.getServiceData()
            })
            .then(() => {
              this.$nextTick(() => {
                this.msgForm = {}
                this.$el.querySelector('#msg-form').scrollIntoView()
              })
            })
            .finally(() => {
              this.msgLoading = false
            })
        }
      })
    },
    // 查看退款单信息
    handleRefund(val) {
      this.refundNo = val
      this.refundVisible = true
    },
    // 返回到留言处
    toMessage() {
      this.$nextTick(() => {
        this.$el.querySelector('#add-message').scrollIntoView()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    border-radius: 0;
    border: 1px solid $color-border-1;

    .card-title {
      margin-top: 0;
    }

    .service-info {
      display: table;
      font-size: 14px;
      line-height: 28px;

      .dt {
        float: left;
        width: 100px;
        color: #99A9BF;
      }

      .dd {
        padding-left: 100px;
      }

      .number {
        width: 150px;
        text-align: right;
      }

      .link {
        &:hover {
          cursor: pointer;
          color: $color-primary;
          text-decoration: underline;
        }
      }
    }
  }

  .service-left {
    margin-bottom: 20px;
    border-right: 1px solid $color-border-1;

    .level-icon {
      margin-left: 5px;
      line-height: 0;
      vertical-align: text-bottom;
    }
  }

  .service-log {
    span {
      color: $color-info;
    }

    .comment {
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
    }
  }

  .goods-image {
    float: left;
    width: 60px;
    height: 60px;

    &:hover {
      cursor: pointer;
    }
  }

  .goods-info {
    float: left;
    width: 80%;
    margin-left: 10px;

    .name {
      height: 36px;
      line-height: 18px;
      overflow: hidden;

      &:hover {
        cursor: pointer;
        color: $color-primary;
        text-decoration: underline;
      }
    }

    .specs {
      margin: 0;
      font-size: 12px;
      color: $color-info;
    }
  }

  .image_thumb {
    width: 40px;
    height: 40px;
    margin: 5px 5px 0 0;
  }

  .image_thumb /deep/ img {
    cursor: pointer;
  }

  .image_thumb /deep/ .el-image__error {
    text-align: center;
    line-height: 1.4;
  }

  .el-collapse /deep/ .el-collapse-item__header {
    font-size: 16px;
  }

  .input-with-select /deep/ .el-input-group__prepend {
    background-color: #FFF;
  }
</style>
