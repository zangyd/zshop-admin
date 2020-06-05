<template>
  <div class="cs-p">
    <el-tabs
      v-model="tabPane"
      @tab-click="tab => {$emit('tabs', tab.name)}"
      class="tab-box">
      <el-tab-pane
        v-for="(item, index) in statusMap"
        :key="index"
        :label="item"
        :name="index">
        <el-table v-if="index === tabPane" :data="currentTableData">
          <el-table-column
            label="商品"
            min-width="380">
            <template slot-scope="scope">
              <div class="service-summary cs-mb-5">
                <span class="cs-mr">售后单号：{{scope.row.service_no}}</span>
                <span>创建日期：{{scope.row.create_time}}</span>
              </div>

              <div class="service-goods">
                <el-image
                  class="goods-image cs-cp"
                  @click="handleView(scope.row.get_order_goods.goods_id)"
                  :src="scope.row.get_order_goods.goods_image | getPreviewUrl"
                  fit="contain"
                  lazy>
                </el-image>

                <div class="goods-info service-text">
                  <p>
                    <span
                      @click="handleView(scope.row.get_order_goods.goods_id)"
                      class="link">{{scope.row.get_order_goods.goods_name}}</span>

                    <span
                      :style="{'color': deliveryMap[scope.row.get_order_goods.status].color}"
                      class="delivery cs-pl-5">{{deliveryMap[scope.row.get_order_goods.status].text}}</span>
                  </p>

                  <p class="son">
                    订单号：<span
                      @click="handleOrder(scope.row.order_no)"
                      class="link">{{scope.row.order_no}}</span></p>

                  <p
                    v-if="scope.row.get_order_goods.key_value"
                    class="son">{{scope.row.get_order_goods.key_value}}</p>

                  <p class="son">{{scope.row.reason}}</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="售后类型"
            min-width="100">
            <template slot-scope="scope">
              <div class="service-text">
                <p>{{typeMap[scope.row.type]}}</p>
                <p v-if="scope.row.goods_status" class="son">收货状态：{{goodsMap[scope.row.goods_status]}}</p>
                <p v-if="scope.row.refund_fee" class="son">申请金额：{{scope.row.refund_fee | getNumber}}</p>
                <p v-if="scope.row.qty" class="son">申请数量：{{scope.row.qty}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="买家">
            <template slot-scope="scope">
              <div class="service-text">
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

                <p v-if="scope.row.get_admin">
                  <span
                    :style="_getServiceColor(scope.row.get_admin)"
                    class="son">{{scope.row.get_admin | getUserName}}</span>
                </p>

                <p v-if="scope.row.is_return">
                  <el-tooltip placement="top">
                    <div slot="content">
                      快递单号：{{scope.row.logistic_code}}<br/><br/>
                      <template v-if="scope.row.address">
                        姓名：{{scope.row.consignee}}<br/>
                        手机：{{scope.row.mobile}}<br/>
                        地址：{{scope.row.address}}<br/>
                        邮编：{{scope.row.zipcode}}
                      </template>

                      <template v-else>
                        买家尚未填写返件信息
                      </template>
                    </div>

                    <el-link
                      class="service-button"
                      type="info"
                      @click="handleDist(scope.row.service_no, scope.row.logistic_code)"
                      :underline="false">返件地址</el-link>
                  </el-tooltip>
                </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="售后状态"
            align="center">
            <template slot-scope="scope">
              <div class="service-text">
                <el-badge
                  :hidden="!scope.row.admin_event"
                  class="service-event"
                  is-dot>
                  <p class="service-button">{{statusMap[scope.row.status + 1]}}</p>
                </el-badge>

                <p v-if="scope.row.result">
                  <el-tooltip :content="scope.row.result" placement="top">
                    <span class="son">处理结果</span>
                  </el-tooltip>
                </p>

                <p v-if="[2, 3].includes(scope.row.type) && scope.row.status === 6 && auth.dist">
                  <el-link
                    class="service-button"
                    type="info"
                    @click="handleDist(scope.row.service_no, null, scope.row.logistic_code)"
                    :underline="false">物流信息</el-link>
                </p>

                <p>
                  <el-link
                    class="service-button"
                    type="info"
                    @click="handleService(scope.row.service_no)"
                    :underline="false">详情</el-link>
                </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <div class="service-text">
                <p v-if="scope.row.status === 0 && auth.agree">
                  <el-link
                    class="service-button"
                    type="primary"
                    @click="handleServiceAgree(scope.$index)"
                    :underline="false">同意售后</el-link>
                </p>

                <p v-if="scope.row.status === 0 && auth.refused">
                  <el-link
                    class="service-button"
                    type="danger"
                    @click="handleServiceRefused(scope.$index)"
                    :underline="false">拒绝售后</el-link>
                </p>

                <p v-if="scope.row.type !== 0 && scope.row.status === 1 && !scope.row.logistic_code && auth.sendback">
                  <el-link
                    class="service-button"
                    type="primary"
                    @click="handleServiceSendback(scope.$index)"
                    :underline="false">{{scope.row.is_return ? '撤销寄回' : '要求寄回'}}</el-link>
                </p>

                <p v-if="((scope.row.type === 0 && scope.row.status === 1) || scope.row.status === 3) && auth.after">
                  <el-link
                    class="service-button"
                    type="primary"
                    @click="handleServiceAfter(scope.$index)"
                    :underline="false">设为售后中</el-link>
                </p>

                <p v-if="[1, 3, 4].includes(scope.row.status) && auth.cancel">
                  <el-link
                    class="service-button"
                    type="danger"
                    @click="handleServiceCancel(scope.$index)"
                    :underline="false">撤销售后</el-link>
                </p>

                <p v-if="scope.row.status === 4 && auth.complete">
                  <el-link
                    class="service-button"
                    type="success"
                    @click="setServiceComplete(scope.$index)"
                    :underline="false">售后完成</el-link>
                </p>

                <p v-if="auth.remark">
                  <el-tooltip
                    :disabled="scope.row.remark.length <= 0"
                    :content="scope.row.remark"
                    placement="left">
                    <el-link
                      class="service-button"
                      :type="scope.row.remark ? 'warning' : 'info'"
                      @click="setServiceRemark(scope.$index)"
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

    <cs-delivery-dist ref="deliveryDist"/>
  </div>
</template>

<script>
import serviceMixins from '../mixins/service'

export default {
  mixins: [
    serviceMixins
  ],
  props: {
    loading: {
      default: false
    },
    tableData: {
      default: () => []
    },
    typeMap: {
      default: () => {}
    }
  },
  data() {
    return {
      tabPane: 0
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
  methods: {
    // 查看售后详情
    handleService(service_no) {
      this.$router.push({
        name: 'order-service-info',
        params: { service_no }
      })
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

  .input-with-select /deep/ .el-input-group__prepend {
    background-color: #FFF;
  }

  .service-event /deep/ .el-badge__content {
    margin-top: 5px;
    margin-right: -5px;
  }

  .service-summary {
    color: $color-text-placehoder;
    font-size: 13px;
  }

  .service-text {
    p {
      margin: 0;
    }

    .son {
      color: $color-text-sub;
      font-size: 13px;
    }
  }

  .service-goods {
    float: left;

    .goods-image {
      float: left;
      width: 80px;
      height: 80px;
    }

    .goods-info {
      padding: 0 50px 0 100px;

      .link {
        &:hover {
          cursor: pointer;
          color: $color-primary;
          text-decoration: underline;
        }
      }

      .delivery {
        font-size: 13px;
      }
    }
  }

  .level-icon {
    margin-left: 5px;
    line-height: 0;
    vertical-align: text-bottom;
  }

  .service-button {
    padding: 0;
    font-size: 13px;
  }
</style>
