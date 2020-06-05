<template>
  <div class="cs-p">
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-tooltip placement="top-start" :open-delay="650">
          <div slot="content">
            <span>为您提供三个月内的数据导出</span><br/>
            <span>当勾选订单时，只导出被选中的数据</span>
          </div>

          <el-button
            icon="el-icon-download"
            :disabled="loading"
            :loading="exportLoading"
            @click="handleExport">导出数据</el-button>
        </el-tooltip>
      </el-form-item>

      <el-form-item v-if="auth.print">
        <el-dropdown
          placement="bottom"
          :show-timeout="50">
          <el-button
            :disabled="loading">
            <i class="el-icon-printer"/>
            <span>打印</span>
            <i class="el-icon-arrow-down cs-pl-5"/>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              @click.native="handlePrint('order')">打印订单</el-dropdown-item>

            <el-dropdown-item
              v-if="['2', '3'].includes(tabPane)"
              @click.native="handlePrint('out')">打印出库单</el-dropdown-item>

            <el-dropdown-item
              v-if="['3', '4'].includes(tabPane)"
              @click.native="handlePrint('delivery')">打印发货单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>

      <el-form-item v-if="auth.start_picking && tabPane === '2'">
        <el-button
          icon="el-icon-document-checked"
          :disabled="loading"
          @click="handlePicking(1)">设为配货</el-button>
      </el-form-item>

      <el-form-item v-if="auth.cancel_picking && tabPane === '3'">
        <el-button
          icon="el-icon-document-delete"
          :disabled="loading"
          @click="handlePicking(0)">取消配货</el-button>
      </el-form-item>

      <el-form-item v-if="auth.complete && tabPane === '4'">
        <el-button
          icon="el-icon-shopping-bag-2"
          :disabled="loading"
          @click="handleComplete()">确认收货</el-button>
      </el-form-item>

      <cs-help
        :router="$route.path"
        style="padding-bottom: 19px;">
      </cs-help>
    </el-form>

    <el-tabs
      v-model="tabPane"
      @tab-click="tab => {$emit('tabs', tab.name)}"
      class="tab-box">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="getTabPaneName(index, item)"
        :name="index">
        <el-table
          v-if="index === tabPane"
          :data="currentTableData"
          @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"/>

          <el-table-column
            label="订单"
            min-width="380">
            <template slot-scope="scope">
              <div class="order-summary cs-mb-5">
                <cs-icon class="cs-mr-10" :name="sourceMap[scope.row.source]"/>
                <span class="cs-mr">订单号：{{scope.row.order_no}}</span>
                <span>创建日期：{{scope.row.create_time}}</span>
              </div>

              <div
                v-for="(goods, index) in scope.row.get_order_goods"
                :key="index"
                :class="{'order-goods-list': true, 'cs-mt-10': index > 0}">
                <el-image
                  class="goods-image cs-cp"
                  @click="handleView(goods.goods_id)"
                  :src="goods.goods_image | getPreviewUrl"
                  fit="contain"
                  lazy>
                </el-image>

                <div class="goods-info order-text">
                  <p>
                    <span
                      @click="handleView(goods.goods_id)"
                      class="link">{{goods.goods_name}}</span>

                    <span
                      :class="`${goods.is_service === 1 ? 'service' : 'complete'}`"
                      class="cs-pl-5">{{serviceMap[goods.is_service]}}</span>
                  </p>
                  <p v-if="goods.key_value" class="son">{{goods.key_value}}</p>
                  <p class="son">本店价：{{goods.shop_price | getNumber}} x {{goods.qty}}</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="订单金额"
            min-width="100">
            <template slot-scope="scope">
              <div class="order-text">
                <p class="shop-price">{{scope.row.pay_amount | getNumber}}</p>
                <p class="son">应付款：{{scope.row.total_amount | getNumber}}</p>
                <p class="son">含运费：{{scope.row.delivery_fee | getNumber}}</p>
                <p class="son">
                  <span :class="{'shop-price': scope.row.payment_code === '1'}">
                    {{_getPaymentType(scope.row.payment_code)}}
                  </span>
                </p>

                <el-link
                  v-if="auth.price && scope.row.trade_status === 0 && scope.row.payment_status === 0"
                  class="order-button"
                  type="primary"
                  @click="setOrderAmount(scope.$index)"
                  :underline="false">修改金额</el-link>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="买家">
            <template slot-scope="scope">
              <div class="order-text">
                <p style="width: 130px;">
                  <span class="son">{{scope.row.get_user.username}}</span>

                  <el-image
                    v-if="scope.row.get_user.level_icon"
                    class="level-icon"
                    :src="scope.row.get_user.level_icon"
                    fit="fill">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"/>
                    </div>
                  </el-image>
                </p>

                <p>
                  <span class="son">{{scope.row.get_delivery | getDelivery}}</span>
                </p>

                <p>
                  <el-tooltip placement="top">
                    <div slot="content">
                      姓名：{{scope.row.consignee}}<br/>
                      手机：{{scope.row.mobile}}<br/>
                      <template v-if="scope.row.tel">电话：{{scope.row.tel}}<br/></template>
                      地址：{{scope.row.complete_address}}
                      <template v-if="scope.row.zipcode"><br/>邮编：{{scope.row.zipcode}}</template>
                    </div>
                    <i class="el-icon-house"/>
                  </el-tooltip>

                  <el-tooltip
                    v-if="scope.row.buyer_remark"
                    :content="scope.row.buyer_remark"
                    placement="top">
                    <i class="el-icon-chat-dot-round cs-ml-10"/>
                  </el-tooltip>

                  <el-tooltip
                    v-if="scope.row.invoice_type > 0"
                    placement="top">
                    <div slot="content">
                      发票抬头：{{scope.row.invoice_title}}
                      <template v-if="scope.row.invoice_type === 2"><br/>纳税人号：{{scope.row.tax_number}}</template>
                    </div>
                    <i class="el-icon-tickets cs-ml-10"/>
                  </el-tooltip>
                </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="交易状态"
            align="center">
            <template slot-scope="scope">
              <div class="order-text">
                <p
                  v-for="(item, index) in getOrderStatus(scope.row)"
                  :key="index"
                  class="order-button">{{item}}</p>

                <p>
                  <el-link
                    class="order-button"
                    type="info"
                    @click="handleInfo(scope.row.order_no)"
                    :underline="false">详情</el-link>
                </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <div class="order-text">
                <p v-if="auth.set && scope.row.delivery_status === 0 && scope.row.trade_status <= 1">
                  <el-link
                    class="order-button"
                    type="success"
                    @click="setOrderItem(scope.$index)"
                    :underline="false">修改订单</el-link>
                </p>

                <p v-if="auth.start_picking && scope.row.payment_status === 1 && scope.row.trade_status === 0">
                  <el-link
                    class="order-button"
                    type="primary"
                    @click="handlePicking(1, scope.$index)"
                    :underline="false">设为配货</el-link>
                </p>

                <p v-if="auth.cancel_picking && scope.row.payment_status === 1 && scope.row.trade_status === 1">
                  <el-link
                    class="order-button"
                    type="primary"
                    @click="handlePicking(0, scope.$index)"
                    :underline="false">取消配货</el-link>
                </p>

                <p
                  v-if="auth.delivery && scope.row.payment_status === 1 && scope.row.delivery_status !== 1 && [1, 2].includes(scope.row.trade_status)">
                  <el-link
                    class="order-button"
                    type="primary"
                    @click="handleDelivery(scope.$index)"
                    :underline="false">确定发货</el-link>
                </p>

                <p v-if="auth.complete && scope.row.delivery_status === 1 && scope.row.trade_status === 2">
                  <el-link
                    class="order-button"
                    type="primary"
                    @click="handleComplete(scope.$index)"
                    :underline="false">确认收货</el-link>
                </p>

                <p v-if="auth.dist && scope.row.delivery_status !== 0">
                  <el-link
                    class="order-button"
                    type="primary"
                    @click="handleDeliveryDist(scope.row.order_no)"
                    :underline="false">物流信息</el-link>
                </p>

                <p v-if="auth.cancel && scope.row.trade_status <= 1">
                  <el-link
                    class="order-button"
                    type="danger"
                    @click="handleOrderCancel(scope.$index)"
                    :underline="false">取消订单</el-link>
                </p>

                <p v-if="auth.del && scope.row.trade_status === 4 && scope.row.is_delete <= 0">
                  <el-link
                    class="order-button"
                    @click="handleOrderRecycle(scope.$index, 1)"
                    :underline="false">删除订单</el-link>
                </p>

                <p v-if="auth.restore && scope.row.is_delete > 0">
                  <el-link
                    class="order-button"
                    @click="handleOrderRecycle(scope.$index, 0)"
                    :underline="false">恢复订单</el-link>
                </p>

                <p v-if="auth.remark">
                  <el-tooltip
                    :disabled="scope.row.sellers_remark.length <= 0"
                    :content="scope.row.sellers_remark"
                    placement="left">
                    <el-link
                      class="order-button"
                      :type="scope.row.sellers_remark ? 'warning' : 'info'"
                      @click="setSellersRemark(scope.$index)"
                      :underline="false">备注</el-link>
                  </el-tooltip>
                </p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

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

          <span class="order-summary cs-pl-10">正数增加，负数减少</span>

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
            <div class="order-goods-list">
              <el-image
                class="goods-image-small cs-cp"
                @click="handleViewGoods(scope.row.goods_id)"
                :src="scope.row.goods_image | getPreviewUrl"
                fit="contain">
              </el-image>

              <div class="goods-info order-text" style="padding: 0 30px 0 70px;">
                <p class="goods-name link" @click="handleViewGoods(scope.row.goods_id)">{{scope.row.goods_name}}</p>
                <p v-if="scope.row.key_value" class="son">{{scope.row.key_value}}</p>
              </div>
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
  </div>
</template>

<script>
import orderMixins from '../mixins/order'
import exportOrder from '../mixins/export'
import { getSettingList } from '@/api/config/setting'

export default {
  mixins: [
    orderMixins,
    exportOrder
  ],
  props: {
    loading: {
      default: false
    },
    tableData: {
      default: () => []
    },
    toPayment: {
      default: () => {}
    },
    orderTotal: {
      default: () => {}
    }
  },
  data() {
    return {
      tabPane: '0',
      tabList: {
        0: '全部',
        1: '未付款',
        2: '已付款',
        3: '待发货',
        4: '已发货',
        5: '已完成',
        6: '已取消',
        8: '回收站'
      },
      // 键名与"tabList"对应
      totalMap: {
        1: 'not_paid',
        2: 'paid',
        3: 'not_shipped',
        4: 'shipped'
      }
    }
  },
  watch: {
    tableData: {
      handler(val) {
        this.currentTableData = val
        this.multipleSelection = []
      },
      immediate: true
    }
  },
  mounted() {
    this.getOrderSource()
  },
  methods: {
    // 数字化标签名称
    getTabPaneName(key, value) {
      if (!Object.prototype.hasOwnProperty.call(this.totalMap, key)) {
        return value
      }

      if (!Object.prototype.hasOwnProperty.call(this.orderTotal, this.totalMap[key])) {
        return value
      }

      if (this.orderTotal[this.totalMap[key]] <= 0) {
        return value
      }

      return value + `(${this.orderTotal[this.totalMap[key]]})`
    },
    // 获取订单来源配置
    getOrderSource() {
      getSettingList('system_shopping', ['source'])
        .then(res => {
          if (res.data) {
            res.data.source.value.forEach((value, index) => {
              this.sourceMap[index] = value.icon
            })
          }
        })
    },
    // 选中数据项
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 订单详情
    handleInfo(order_no) {
      this.$router.push({
        name: 'order-admin-info',
        params: { order_no }
      })
    },
    // 订单打印
    handlePrint(type) {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      this.$router.push({
        name: 'order-admin-print',
        params: {
          type,
          orderData: this.multipleSelection
        }
      })
    },
    // 获取订单状态
    getOrderStatus(data) {
      let result = []

      switch (data.trade_status) {
        // 待处理
        case 0:
          switch (data.payment_status) {
            case 0:
              result.push('等待买家付款')
              break
            case 1:
              result.push('买家已付款')
              break
          }
          break
        // 配货中
        case 1:
          result.push('配货中')
          break
        // 已发货
        case 2:
          switch (data.delivery_status) {
            case 1:
              result.push('全部发货')
              break
            case 2:
              result.push('部分发货')
              break
          }
          break
        // 已完成
        case 3:
          result.push('交易成功')
          break
        case 4:
          result.push('交易关闭')
          break
      }

      return result
    }
  }
}
</script>

<style lang="scss" scoped>
  .tab-box {
    padding: 5px 10px;
    background-color: #FFF;
  }

  .el-table /deep/ td {
    background-color: #FFFFFF !important;
  }

  .order-summary {
    color: $color-text-placehoder;
    font-size: 13px;
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

  .order-goods-list {
    float: left;

    .goods-image {
      float: left;
      width: 80px;
      height: 80px;
    }

    .goods-image-small {
      float: left;
      width: 60px;
      height: 60px;
    }

    .goods-info {
      padding: 0 50px 0 100px;
      min-width: 405px;

      .goods-name {
        height: 36px;
        line-height: 18px;
        overflow: hidden;
      }

      .link {
        &:hover {
          cursor: pointer;
          color: $color-primary;
          text-decoration: underline;
        }
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
  }

  .shop-price {
    color: $color-danger;
  }

  .level-icon {
    margin-left: 5px;
    line-height: 0;
    vertical-align: text-bottom;
  }

  .order-button {
    padding: 0;
    font-size: 13px;
  }
</style>
