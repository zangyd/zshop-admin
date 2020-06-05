<template>
  <cs-container :is-back="isBack">
    <div class="cs-p">
      <el-card
        class="box-card"
        shadow="never">
        <div slot="header" class="clearfix">
          <div class="gallery">
            <page-media
              ref="goodsMedia"
              :image="goodsData.attachment"
              :video="goodsData.video">
            </page-media>
          </div>

          <div class="itemInfo">
            <div class="goods-name cs-pb-5">
              <b>{{goodsData.name}}</b>
            </div>

            <div class="product-name">
              <span>{{goodsData.product_name}}</span>
            </div>

            <div class="summary-first">
              <div class="summary-price-wrap cs-pt-10">
                <div class="summary-price">
                  <div class="dt">市场价</div>
                  <div class="dd">
                    <span style="text-decoration: line-through;">
                      <span>￥</span>
                      <span>{{goodsData.market_price | getNumber}}</span>
                    </span>
                  </div>
                </div>
                <div class="summary-price">
                  <div class="dt" style="line-height: 28px;">本店价</div>
                  <div class="dd">
                    <span class="price">
                      <span>￥</span>
                      <span style="font-size: 22px;"><b>{{currentPrice}}</b></span>
                    </span>
                  </div>
                </div>
                <div class="summary-price price-bg">
                  <div class="dt">总库存</div>
                  <div class="dd"><span>{{currentStore}}</span></div>
                </div>
                <div class="summary-info">
                  <div class="content">
                    <p>评价数</p>
                    <span>{{goodsData.comment_sum}}</span>
                  </div>

                  <div class="content">
                    <p>累计销量</p>
                    <span>{{goodsData.sales_sum}}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-for="(value, key) in specConfig" :key="key" class="cs-pt-5">
              <div style="display: inline-block;">
                <div class="dt">{{value.name}}</div>
                <div class="dd">
                  <div
                    v-for="(item, index) in value.spec_item"
                    :key="index"
                    class="goods-spec"
                    :class="{'active': value.active === item.spec_item_id, 'disabled': item.disabled}"
                    @click="selectSpec(key, index)">
                    <template v-if="item.color">
                      <span class="item-info" :style="{'background-color': item.color}"/>
                    </template>

                    <template v-if="item.image.length">
                      <el-image
                        class="item-info"
                        :src="item.image[0]['source'] | getPreviewUrl(36, 36)"
                        fit="contain"/>
                    </template>

                    <span class="item-name">{{item.item_name}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <el-tabs v-model="activeName">
          <el-tab-pane label="详情描述" name="content">
            <div v-if="attrImportant.length" class="parameter cs-mb-15">
              <ul class="parameter-list">
                <li v-for="(value, key) in attrImportant" :key="key" :title="value.attr_value">
                  <span>{{`${value.attr_name}：${value.attr_value}`}}</span>
                </li>
              </ul>
              <p class="more-par cs-pr" style="margin: 0;">
                <el-button type="text" size="mini" @click="activeName='attr'">详细参数 >></el-button>
              </p>
            </div>
            <div class="mce-content-body" v-html="goodsData.content"></div>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="attr">
            <el-table
              :data="attrConfig"
              row-key="goods_attribute_id"
              :tree-props="{children: 'get_attribute'}"
              :show-header="false"
              default-expand-all>
              <el-table-column
                prop="attr_name"
                width="160"
                show-overflow-tooltip>
                <template slot-scope="props">
                  <span :class="{'attr-label': !props.row.is_parent}">{{props.row.attr_name}}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                width="35">
                <template slot-scope="props">
                  <el-tooltip
                    v-if="props.row.description"
                    :content="props.row.description"
                    placement="top">
                    <i class="el-icon-warning-outline"/>
                  </el-tooltip>
                </template>
              </el-table-column>

              <el-table-column prop="attr_value"/>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </cs-container>
</template>

<script>
import util from '@/utils/util'
import { size, difference, uniq } from 'lodash'
import { getGoodsAttributeData } from '@/api/goods/attribute'
import { getGoodsAttrList, getGoodsItem, getGoodsSpecMenu } from '@/api/goods/goods'

export default {
  props: {
    goods_id: {
      type: [String, Number],
      required: true
    },
    isBack: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      activeName: 'content',
      currentPrice: 0,
      rangePrice: '',
      currentStore: 0,
      goodsData: {},
      attrConfig: [],
      attrImportant: [],
      specCombo: {},
      specConfig: []
    }
  },
  filters: {
    getNumber(val) {
      return util.getNumber(val)
    },
    getPreviewUrl(val, width, height) {
      return util.getImageStyleUrl(val, `&size[]=${width}&size[]=${height}`)
    }
  },
  watch: {
    goods_id: {
      handler() {
        this.getGoodsData()
      },
      immediate: true
    }
  },
  components: {
    PageMedia: () => import('./components/PageMedia')
  },
  methods: {
    resetGoodsData() {
      this.activeName = 'content'
      this.currentPrice = 0
      this.rangePrice = ''
      this.currentStore = 0
      this.goodsData = {}
      this.attrConfig = []
      this.attrImportant = []
      this.specCombo = {}
      this.specConfig = []
    },
    getGoodsOtherInfo() {
      /**
       * get.goods.attr.config 是后台商品属性设置后读取参数所使用
       * 而实际的前台是面对顾客的,所以应当使用以下方法进行显示
       */
      Promise.all([
        getGoodsSpecMenu(this.goods_id),
        getGoodsAttrList(this.goods_id),
        getGoodsAttributeData(this.goodsData.goods_type_id, 1)
      ])
        .then(res => {
          this.specCombo = res[0].data ? res[0].data.spec_combo : {}
          this.specConfig = res[0].data ? res[0].data.spec_config : []

          // 规格项只有一列时通过库存设置禁用状态
          if (size(this.specConfig) === 1) {
            this.specConfig[0].spec_item.forEach(item => {
              const spec = this.specCombo[item.spec_item_id]
              if (!spec || spec.store_qty <= 0) {
                item.disabled = true
              }
            })
          }

          // 计算价格区间
          if (size(this.specCombo) > 0) {
            let lowPrice = Number.MAX_SAFE_INTEGER
            let highPrice = 0

            for (let combo in this.specCombo) {
              if (!Object.prototype.hasOwnProperty.call(this.specCombo, combo)) {
                continue
              }

              lowPrice = Math.min(lowPrice, this.specCombo[combo].price)
              highPrice = Math.max(highPrice, this.specCombo[combo].price)
            }

            lowPrice = util.getNumber(lowPrice)
            highPrice = util.getNumber(highPrice)
            this.rangePrice = `${lowPrice} - ${highPrice}`
            this.currentPrice = this.rangePrice
          }

          let key = {}
          for (let value of res[1].data || []) {
            if (!value.attr_value) {
              continue
            }

            if (key[value.parent_id] === undefined) {
              const parentData = res[2].data[value.parent_id]
              if (!parentData) {
                continue
              }

              let pos = this.attrConfig.push({
                goods_attribute_id: parentData.goods_attribute_id,
                attr_name: parentData.attr_name,
                is_parent: true,
                get_attribute: []
              })

              key[value.parent_id] = pos - 1
            }

            const attrData = res[2].data[value.goods_attribute_id]
            if (attrData.is_important === 1) {
              this.attrImportant.push({
                goods_attribute_id: attrData.goods_attribute_id,
                attr_name: attrData.attr_name,
                attr_value: value.attr_value
              })
            }

            this.attrConfig[key[value.parent_id]].get_attribute.push({
              goods_attribute_id: attrData.goods_attribute_id,
              description: attrData.description,
              attr_name: attrData.attr_name,
              attr_value: value.attr_value
            })
          }
        })
    },
    getGoodsData() {
      this.resetGoodsData()
      getGoodsItem(this.goods_id)
        .then(res => {
          this.goodsData = res.data || {}
          this.currentPrice = util.getNumber(this.goodsData.shop_price)
          this.currentStore = this.goodsData.store_qty
          this.getGoodsOtherInfo()
        })
    },
    selectSpec(parent, key) {
      const parentData = this.specConfig[parent]
      const itemData = this.specConfig[parent].spec_item[key]
      if (itemData.disabled) {
        return
      }

      // 选中状态设置,并获取已选规格键名
      let activeList = new Array(this.specConfig.length).fill(0)
      let newId = parentData.active !== itemData.spec_item_id ? itemData.spec_item_id : 0
      this.$set(parentData, 'active', newId)
      this.specConfig.forEach((spec, index) => {
        if (spec.active) {
          activeList[index] = spec.active.toString()
        }
      })

      // 规格存在图集时进行处理
      if (itemData.image.length > 0) {
        this.$nextTick(() => {
          this.$refs.goodsMedia.updateImage(newId ? itemData.image : [])
        })
      }

      // 筛选规格项状态
      if (this.specConfig.length > 1) {
        // 将被禁用的选择项
        let disabled = []

        for (let active in activeList) {
          if (!Object.prototype.hasOwnProperty.call(activeList, active) || !activeList[active]) {
            continue
          }

          let outStock = []
          let ampleStock = []

          for (let combo in this.specCombo) {
            let comboArray = combo.split('_')
            if (comboArray[active] === activeList[active]) {
              if (this.specCombo[combo].store_qty > 0) {
                ampleStock = ampleStock.concat(comboArray)
              } else {
                outStock = outStock.concat(comboArray)
              }
            }
          }

          if (outStock.length) {
            disabled = disabled.concat(difference(outStock, ampleStock))
          }
        }

        disabled = uniq(disabled)
        this.specConfig.forEach(value => {
          for (let item of value.spec_item) {
            if (value.active === item.spec_item_id) {
              item.disabled = false
              continue
            }

            if (disabled.indexOf(item.spec_item_id.toString()) === -1) {
              item.disabled = false
              continue
            }

            item.disabled = true
          }
        })
      }

      // 更新售价与库存
      const strActive = activeList.join('_')
      if (Object.prototype.hasOwnProperty.call(this.specCombo, strActive)) {
        this.currentStore = this.specCombo[strActive].store_qty
        this.currentPrice = util.getNumber(this.specCombo[strActive].price)
      } else {
        this.currentStore = this.goodsData.store_qty
        this.currentPrice = this.rangePrice
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/assets/style/fixed/tinymce.scss';

  .box-card {
    border-radius: 0;
    border: 1px solid $color-border-1;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .gallery {
    float: left;
    width: 460px;
  }

  .attr-label {
    color: $color-text-sub;
  }

  .parameter {
    padding: 0 10px 10px;
    border-bottom: 1px solid $color-border-3;
    font-size: 13px;
    color: $color-text-normal;

    .more-par {
      margin-top: -5px;
      text-align: right;
    }

    .parameter-list {
      padding: 15px 0 15px;
    }

    ul {
      margin: 0;
      padding: 20px 0 15px;
      overflow: hidden;
      _zoom: 1;
    }

    ul li {
      width: 20%;
      padding-left: 42px;
      float: left;
      margin-bottom: 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .itemInfo {
    margin-left: 480px;
    font-size: 14px;
    color: $color-text-sub;

    .dt {
      float: left;
      padding-left: 10px;
      line-height: 20px;
    }

    .dd {
      margin-left: 80px;

      .price {
        color: $color-danger;
        overflow: hidden;
      }
    }

    .goods-name {
      color: $color-text-normal;
      font-size: 16px;
    }

    .product-name {
      color: $color-danger;
    }

    .summary-first {
      position: relative;
      padding: 5px 0;

      .summary-price-wrap {
        background: #F3F3F3;

        .price-bg {
          background: url('~@/assets/image/price-bg.png') 0 -12px repeat-x #EFEFEF;
        }

        .summary-price {
          position: relative;
          padding-bottom: 10px;
        }

        .summary-info {
          position: absolute;
          right: 10px;
          top: 10px;

          .content {
            text-align: center;
            width: 100px;
            float: left;

            p {
              margin: 5px 0;
            }

            span {
              color: #005EA7;
            }
          }
        }
      }
    }
  }

  .goods-spec {
    @extend %flex-center-row;
    float: left;
    font-size: 12px;
    line-height: 38px;
    margin: 0 5px 5px 0;
    border: 1px solid $color-border-1;

    &.active {
      color: $color-danger;
      border-color: $color-danger;
    }

    &:hover {
      @extend %unable-select;
      border-color: $color-danger;
    }

    &.disabled {
      cursor: not-allowed;
      color: $color-text-placehoder;
      border: 1px dashed $color-border-3;

      .item-info {
        opacity: 0.5;
      }
    }

    .item-name {
      padding: 0 10px;
    }

    .item-info {
      margin: 1px;
      width: 36px;
      height: 36px;
      line-height: 16px;
    }
  }
</style>
