<template>
  <cs-container>
    <div class="cs-p">
      <el-card
        class="box-card"
        shadow="never">
        <el-row>
          <el-col class="order-left cs-pr" :span="9">
            <p class="card-title">订单信息</p>
            <div class="order-info">
              <div class="dt">订单号</div>
              <div class="dd">{{orderData.order_no}}</div>
            </div>

            <div class="order-info">
              <div class="dt">支付流水号</div>
              <div class="dd">{{orderData.payment_no}}</div>
            </div>

            <div class="order-info">
              <div class="dt">订单来源</div>
              <div class="dd">{{sourceMap[orderData.source]}}</div>
            </div>

            <div class="order-info">
              <div class="dt">支付方式</div>
              <div class="dd">
                <span :style="orderData.payment_code === '1' && 'color: #F56C6C;'">
                  {{_getPaymentType(orderData.payment_code)}}
                </span>
              </div>
            </div>

            <div class="order-info" v-if="orderData.card_number">
              <div class="dt">购物卡号</div>
              <div class="dd">{{orderData.card_number}}</div>
            </div>

            <div class="order-info">
              <div class="dt">买家</div>
              <div class="dd">
                <span>{{orderData.get_user.username}}</span>
                <el-image
                  v-if="orderData.get_user.level_icon"
                  class="level-icon"
                  :src="orderData.get_user.level_icon"
                  fit="fill">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"/>
                  </div>
                </el-image>
              </div>
            </div>

            <div class="order-info">
              <div class="dt">买家备注</div>
              <div class="dd">{{orderData.buyer_remark}}</div>
            </div>

            <el-divider></el-divider>

            <div class="order-info">
              <div class="dt">收货人姓名</div>
              <div class="dd">{{orderData.consignee}}</div>
            </div>

            <div class="order-info">
              <div class="dt">收货地址</div>
              <div class="dd">{{orderData.complete_address}}</div>
            </div>

            <div class="order-info">
              <div class="dt">配送方式</div>
              <div class="dd">{{orderData.get_delivery | getDelivery}}</div>
            </div>

            <div class="order-info" v-if="orderData.zipcode">
              <div class="dt">邮编</div>
              <div class="dd">{{orderData.zipcode}}</div>
            </div>

            <div class="order-info">
              <div class="dt">收货人手机</div>
              <div class="dd">{{orderData.mobile}}</div>
            </div>

            <div class="order-info" v-if="orderData.tel">
              <div class="dt">收货人电话</div>
              <div class="dd">{{orderData.tel}}</div>
            </div>

            <template v-if="orderData.invoice_type > 0">
              <div class="order-info">
                <div class="dt">发票抬头</div>
                <div class="dd">{{orderData.invoice_title}}</div>
              </div>

              <div class="order-info" v-if="orderData.invoice_type === 2">
                <div class="dt">纳税人识别号</div>
                <div class="dd">{{orderData.tax_number}}</div>
              </div>
            </template>

            <el-divider></el-divider>

            <div class="order-info">
              <div class="dt">卖家备注</div>
              <div class="dd">{{orderData.sellers_remark}}</div>
            </div>
          </el-col>

          <el-col class="cs-pl" :span="15">
            <p class="card-title">订单状态 <span v-if="orderData.is_delete">(回收站)</span></p>
            <el-steps
              :active="tradeStatus.active"
              :process-status="tradeStatus.process_status"
              :finish-status="tradeStatus.finish_status"
              :align-center="false">
              <el-step
                v-for="(value, index) of tradeStatus.step"
                :key="index"
                :description="value.description"
                :title="value.title"
                :icon="value.icon"/>
            </el-steps>

            <el-divider></el-divider>

            <div style="display: inline-flex;">
              <el-dropdown
                v-if="auth.print"
                placement="bottom"
                :show-timeout="50">
                <el-button class="cs-mr-10" size="small">
                  <i class="el-icon-printer"/>
                  <span>打印</span>
                  <i class="el-icon-arrow-down cs-pl-5"/>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="handlePrint('order')">打印订单</el-dropdown-item>

                  <el-dropdown-item
                    @click.native="handlePrint('out')">打印出库单</el-dropdown-item>

                  <el-dropdown-item
                    @click.native="handlePrint('delivery')">打印发货单</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <el-button
                v-if="auth.remark"
                @click="setSellersRemark(0)"
                size="small">备注</el-button>

              <el-button
                v-if="auth.dist && orderData.delivery_status !== 0"
                @click="handleDeliveryDist(orderData.order_no)"
                size="small">物流信息</el-button>

              <el-button
                v-if="auth.price && orderData.trade_status === 0 && orderData.payment_status === 0"
                @click="setOrderAmount(0)"
                size="small">修改金额</el-button>

              <el-button
                v-if="auth.set && orderData.delivery_status === 0 && orderData.trade_status <= 1"
                @click="setOrderItem(0)"
                size="small">修改订单</el-button>

              <el-button
                v-if="auth.start_picking && orderData.payment_status === 1 && orderData.trade_status === 0"
                @click="handlePicking(1, 0)"
                size="small">设为配货</el-button>

              <el-button
                v-if="auth.cancel_picking && orderData.payment_status === 1 && orderData.trade_status === 1"
                @click="handlePicking(0, 0)"
                size="small">取消配货</el-button>

              <el-button
                v-if="auth.delivery && orderData.payment_status === 1 && orderData.delivery_status !== 1 && [1, 2].includes(orderData.trade_status)"
                @click="handleDelivery(0)"
                size="small">确定发货</el-button>

              <el-button
                v-if="auth.complete && orderData.delivery_status === 1 && orderData.trade_status === 2"
                @click="handleComplete(0)"
                size="small">确认收货</el-button>

              <el-button
                v-if="auth.cancel && orderData.trade_status <= 1"
                @click="handleOrderCancel(0)"
                size="small">取消订单</el-button>

              <el-button
                v-if="auth.del && orderData.trade_status === 4 && orderData.is_delete <= 0"
                @click="handleOrderRecycle(0, 1)"
                size="small">删除订单</el-button>

              <el-button
                v-if="auth.restore && orderData.is_delete > 0"
                @click="handleOrderRecycle(0, 0)"
                size="small">恢复订单</el-button>
            </div>
          </el-col>
        </el-row>

        <el-collapse :value="['goods', 'log']">
          <el-collapse-item title="商品列表" name="goods">
            <el-table
              style="margin-top: -15px;"
              :data="orderData.get_order_goods">
              <el-table-column
                label="商品名称"
                min-width="300">
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
                    <span
                      :class="`${scope.row.is_service === 1 ? 'service' : 'complete'}`"
                      class="cs-pl-5">{{serviceMap[scope.row.is_service]}}</span>

                    <p class="specs">{{scope.row.key_value}}</p>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                label="单价">
                <template slot-scope="scope">
                  {{scope.row.shop_price | getNumber}}
                </template>
              </el-table-column>

              <el-table-column
                prop="qty"
                label="数量">
              </el-table-column>

              <el-table-column
                label="小计">
                <template slot-scope="scope">
                  {{scope.row.shop_price * scope.row.qty | getNumber}}
                </template>
              </el-table-column>

              <el-table-column
                label="状态"
                align="center"
                width="80">
                <template slot-scope="scope">
                  <span :style="{'color': deliveryMap[scope.row.status]}">{{statusMap[scope.row.status]}}</span>
                </template>
              </el-table-column>
            </el-table>

            <div class="cs-fr cs-p">
              <div class="order-info">
                <div class="dt">总计</div>
                <div class="dd number">{{orderData.goods_amount | getNumber}}</div>
              </div>

              <div v-if="orderData.delivery_fee" class="order-info">
                <div class="dt">运费</div>
                <div class="dd number">{{orderData.delivery_fee | getNumber}}</div>
              </div>

              <div v-if="orderData.invoice_amount" class="order-info">
                <div class="dt">开票</div>
                <div class="dd number">{{orderData.invoice_amount | getNumber}}</div>
              </div>

              <div v-if="orderData.adjustment" class="order-info">
                <div class="dt">调整金额</div>
                <div class="dd number">{{orderData.adjustment | getNumber}}</div>
              </div>

              <div v-if="orderData.use_money" class="order-info">
                <div class="dt">余额抵扣</div>
                <div class="dd number">-{{orderData.use_money | getNumber}}</div>
              </div>

              <div v-if="orderData.use_card" class="order-info">
                <div class="dt">购物卡抵扣</div>
                <div class="dd number">-{{orderData.use_card | getNumber}}</div>
              </div>

              <div v-if="orderData.use_level" class="order-info">
                <div class="dt">会员抵扣</div>
                <div class="dd number">-{{orderData.use_level | getNumber}}</div>
              </div>

              <div v-if="orderData.use_integral" class="order-info">
                <div class="dt">积分抵扣</div>
                <div class="dd number">-{{orderData.use_integral | getNumber}}</div>
              </div>

              <div v-if="orderData.use_coupon" class="order-info">
                <div class="dt">优惠劵抵扣</div>
                <div class="dd number">-{{orderData.use_coupon | getNumber}}</div>
              </div>

              <div v-if="orderData.use_discount" class="order-info">
                <div class="dt">商品折扣抵扣</div>
                <div class="dd number">-{{orderData.use_discount | getNumber}}</div>
              </div>

              <div v-if="orderData.use_promotion" class="order-info">
                <div class="dt">订单促销抵扣</div>
                <div class="dd number">-{{orderData.use_promotion | getNumber}}</div>
              </div>

              <div class="order-info cs-pb">
                <div class="dt">应付金额</div>
                <div class="dd number">{{orderData.total_amount | getNumber}}</div>
              </div>

              <div class="order-info">
                <div class="dt">累计优惠</div>
                <div class="dd number">{{orderData.goods_amount - orderData.pay_amount | getNumber}}</div>
              </div>

              <div class="order-info">
                <div class="dt">{{orderData | getPaymentStatus}}</div>
                <div class="dd number">{{orderData | getPaymentAmount | getNumber}}</div>
              </div>
            </div>
          </el-collapse-item>

          <el-collapse-item title="订单日志" name="log">
            <el-timeline>
              <el-timeline-item
                v-for="(log, index) in orderData.get_order_log"
                :key="index"
                :type="log.client_type ? 'danger' : 'primary'"
                :timestamp="log.create_time">
                <div class="order-log">
                  <li><span>[{{clientMap[log.client_type]}}]</span> {{log.action}}</li>
                  <li>{{`${log.description}：${log.comment}`}}</li>
                </div>
              </el-timeline-item>
            </el-timeline>
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
        v-model="formRemark.request.sellers_remark"
        type="textarea"
        :rows="6"
        placeholder="编辑卖家备注，仅卖家自己可见"
        maxlength="200"
        show-word-limit>
      </el-input>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="formRemark.visible = false"
          size="small">取消</el-button>

        <el-button
          type="primary"
          :loading="formRemark.loading"
          @click="handleSellersRemark"
          size="small">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改金额"
      :visible.sync="formAmount.visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px">
      <el-form
        label-width="80px"
        label-position="left">
        <el-form-item label="增加/减少">
          <el-input-number
            v-model="formAmount.request.total_amount"
            placeholder="可输入调整金额"
            :precision="2">
          </el-input-number>

          <span class="order-remark cs-pl-10">正数增加，负数减少</span>

          <div>
            <span>应付款：</span>
            <span class="cs-pr-10">{{formAmount.actual}}</span>
            <span>调整后：</span>
            <strong>{{formAmount.actual + formAmount.request.total_amount | getNumber}}</strong>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="formAmount.visible = false"
          size="small">取消</el-button>

        <el-button
          type="primary"
          :loading="formAmount.loading"
          @click="handleOrderAmount"
          size="small">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改订单"
      :visible.sync="formOrder.visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px">
      <el-form
        :model="formOrder.request"
        :rules="rules.order"
        ref="formOrder"
        label-width="120px">
        <el-form-item
          label="收货人姓名"
          prop="consignee">
          <el-input
            v-model="formOrder.request.consignee"
            placeholder="请输入收货人姓名"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          label="收货人手机号"
          prop="mobile">
          <el-input
            v-model="formOrder.request.mobile"
            placeholder="请输入收货人手机号码"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          label="收货人电话"
          prop="tel">
          <el-input
            v-model="formOrder.request.tel"
            placeholder="可输入收货人电话"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          label="收货区域"
          prop="region_list">
          <cs-region-select v-model="formOrder.request.region_list"/>
        </el-form-item>

        <el-form-item
          label="详细地址"
          prop="address">
          <el-input
            v-model="formOrder.request.address"
            placeholder="请输入收货详细地址"
            :clearable="true"/>
        </el-form-item>

        <el-form-item
          label="收货人邮编"
          prop="zipcode">
          <el-input
            v-model="formOrder.request.zipcode"
            placeholder="请输入收货人邮编"
            :clearable="true"/>
        </el-form-item>

        <template v-if="formOrder.request.invoice_type > 0">
          <el-divider/>

          <el-form-item
            label="发票抬头"
            prop="invoice_title">
            <el-input
              v-model="formOrder.request.invoice_title"
              placeholder="可输入发票抬头"
              :clearable="true"/>
          </el-form-item>

          <el-form-item
            v-if="formOrder.request.invoice_type === 2"
            label="纳税人识别号"
            prop="tax_number">
            <el-input
              v-model="formOrder.request.tax_number"
              placeholder="可输入纳税人识别号"
              :clearable="true"/>
          </el-form-item>
        </template>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="formOrder.visible = false"
          size="small">取消</el-button>

        <el-button
          type="primary"
          :loading="formOrder.loading"
          @click="handleSetOrder"
          size="small">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="确定发货"
      :visible.sync="formDelivery.visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="760px">
      <el-table
        :data="formDelivery.goods"
        style="margin-top: -25px;"
        ref="dliveryMultiple"
        @selection-change="val => {formDelivery.selection = val}">
        <el-table-column
          align="center"
          type="selection"
          width="50"
          :selectable="row => {return !row.status}">
        </el-table-column>

        <el-table-column
          label="商品"
          prop="goods_name">
          <template slot-scope="scope">
            <el-image
              class="goods-image"
              @click="handleViewGoods(scope.row.goods_id)"
              :src="scope.row.goods_image | getPreviewUrl"
              fit="contain">
            </el-image>

            <div class="goods-info order-text">
              <p class="name link" @click="handleViewGoods(scope.row.goods_id)">{{scope.row.goods_name}}</p>
              <p v-if="scope.row.key_value" class="son">{{scope.row.key_value}}</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="数量"
          prop="qty"
          width="100">
        </el-table-column>

        <el-table-column
          label="状态"
          prop="status"
          align="center"
          width="80">
          <template slot-scope="scope">
            <span :style="{'color': deliveryMap[scope.row.status]}">{{statusMap[scope.row.status]}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="cs-mt">
        <el-radio-group
          v-model="formDelivery.delivery"
          class="cs-pb">
          <el-radio :label="0">无需配送</el-radio>
          <el-radio :label="1">配送方式</el-radio>
          <el-radio :label="2">快递公司</el-radio>
        </el-radio-group>

        <el-form
          :inline="true"
          :model="formDelivery.request"
          :rules="rules.delivery"
          ref="formDelivery"
          size="small">
          <el-form-item
            v-if="formDelivery.delivery === 1"
            label="配送方式"
            prop="delivery_id">
            <el-select
              v-model="formDelivery.request.delivery_id"
              placeholder="请选择"
              style="width: 280px;"
              clearable>
              <el-option
                v-for="item in delivery.select"
                :key="item.delivery_id"
                :label="item.alias"
                :value="item.delivery_id">
                <span style="float: left;">{{item.alias}}</span>
                <span style="float: right; color: #8492A6; font-size: 13px;">{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="formDelivery.delivery === 2"
            label="快递公司"
            prop="delivery_item_id">
            <el-select
              v-model="formDelivery.request.delivery_item_id"
              placeholder="请选择"
              style="width: 280px;"
              clearable>
              <el-option
                v-for="item in delivery.company"
                :key="item.delivery_item_id"
                :label="item.name"
                :value="item.delivery_item_id"/>
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="formDelivery.delivery !== 0"
            label="快递单号"
            prop="logistic_code">
            <el-input
              v-model="formDelivery.request.logistic_code"
              placeholder="请输入快递单号"
              :clearable="true"/>
          </el-form-item>
        </el-form>
      </div>

      <cs-goods-drawer ref="goodsDrawer"/>

      <div slot="footer" class="dialog-footer">
        <el-button
          @click="formDelivery.visible = false"
          size="small">取消</el-button>

        <el-button
          type="primary"
          :loading="formDelivery.loading"
          @click="deliveryOrderItem"
          size="small">确定</el-button>
      </div>
    </el-dialog>

    <cs-delivery-dist ref="deliveryDist"/>
  </cs-container>
</template>

<script>
import orderMixins from './components/mixins/order'
import { getOrderItem } from '@/api/order/order'
import { getPaymentList } from '@/api/payment/payment'
import { getSettingList } from '@/api/config/setting'

export default {
  name: 'order-admin-info',
  mixins: [
    orderMixins
  ],
  props: {
    order_no: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isInitial: false,
      orderData: {
        get_user: {},
        get_order_goods: [],
        get_delivery: {},
        get_order_log: []
      },
      tradeStatus: {},
      toPayment: {},
      clientMap: {
        '-1': '游客',
        0: '顾客',
        1: '商家'
      }
    }
  },
  watch: {
    order_no: {
      handler() {
        this.getOrderData()
      },
      immediate: true
    }
  },
  filters: {
    getPaymentStatus(val) {
      return !val.trade_status && !val.payment_status ? '预付款' : '实付款'
    },
    getPaymentAmount(val) {
      if (!val.trade_status && !val.payment_status) {
        return val.use_money + val.use_integral + val.use_card
      }

      if (val.trade_status !== 4) {
        return val.total_amount + val.use_money + val.use_integral + val.use_card
      }
    }
  },
  methods: {
    // 处理订单状态数据
    _setTradeStatus() {
      // 初始化数据
      this.tradeStatus = {
        active: 1,
        step: [
          {
            icon: 'el-icon-edit-outline',
            title: '创建订单',
            description: this.orderData.create_time
          },
          {
            icon: 'el-icon-bank-card',
            title: '付款',
            description: this.orderData.payment_time
          },
          {
            icon: 'el-icon-receiving',
            title: '配货',
            description: this.orderData.picking_time
          },
          {
            icon: 'el-icon-truck',
            title: '发货',
            description: this.orderData.delivery_time
          },
          {
            icon: 'el-icon-time',
            title: '完成',
            description: this.orderData.finished_time
          }
        ]
      }

      // 处理状态显示
      switch (this.orderData.trade_status) {
        case 4:
          this.tradeStatus.process_status = 'wait'
          this.tradeStatus.finish_status = 'wait'
          break
        case 3:
          this.tradeStatus.process_status = 'finish'
          this.tradeStatus.finish_status = 'finish'
          break
        default:
          this.tradeStatus.process_status = 'process'
          this.tradeStatus.finish_status = 'finish'
      }

      // 实际状态转换
      switch (this.orderData.trade_status) {
        case 4:
          this.tradeStatus.active = 4
          this.tradeStatus.step[4].title = '交易关闭'
          break
        case 3:
          this.tradeStatus.active = 4
          this.tradeStatus.step[4].title = '交易成功'
          break
        case 2:
          this.tradeStatus.active = 3
          switch (this.orderData.delivery_status) {
            case 1:
              this.tradeStatus.step[3].title = '全部发货'
              break
            case 2:
              this.tradeStatus.step[3].title = '部分发货'
              break
          }
          break
        case 1:
          this.tradeStatus.active = 2
          this.tradeStatus.step[2].title = '配货中'
          break
        case 0:
          this.tradeStatus.active = 1
          switch (this.orderData.payment_status) {
            case 0:
              this.tradeStatus.step[1].title = '等待买家付款'
              break
            case 1:
              this.tradeStatus.step[1].title = '买家已付款'
              break
          }
          break
      }
    },
    // 获取订单信息
    getOrderData() {
      let request = [getOrderItem(this.order_no, 1)]
      if (!this.isInitial) {
        request.push(getPaymentList({ is_select: 1, exclude_code: [4, 5, 6] }))
        request.push(getSettingList('system_shopping', ['source']))
        this.isInitial = true
      }

      Promise.all(request)
        .then(res => {
          this.orderData = res[0].data || {}
          this.currentTableData = [this.orderData]
          this._setTradeStatus()

          if (res[1] && res[1].data) {
            res[1].data.forEach(value => {
              this.toPayment[value.code] = value
            })
          }

          if (res[2] && res[2].data) {
            res[2].data.source.value.forEach((value, index) => {
              this.sourceMap[index] = value.name
            })
          }
        })
    },
    // 订单打印
    handlePrint(type) {
      this.$router.push({
        name: 'order-admin-print',
        params: {
          type,
          orderData: this.currentTableData
        }
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

    .order-info {
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
    }
  }

  .order-left {
    margin-bottom: 20px;
    border-right: 1px solid $color-border-1;

    .level-icon {
      margin-left: 5px;
      line-height: 0;
      vertical-align: text-bottom;
    }
  }

  .order-remark {
    font-size: 13px;
    line-height: 32px;
    color: $color-text-placehoder;
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

    .service {
      font-size: 13px;
      color: $color-warning;
    }

    .complete {
      font-size: 13px;
      color: $color-success;
    }
  }

  .order-log span {
    color: $color-info;
  }

  .order-text {
    p {
      margin: 0;
    }

    .son {
      color: $color-text-sub;
      font-size: 13px;
    }
  }

  .el-collapse /deep/ .el-collapse-item__header {
    font-size: 16px;
  }
</style>
