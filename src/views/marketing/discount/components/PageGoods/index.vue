<template>
  <div>
    <el-table
      :data="discountList">
      <el-table-column
        label="编号"
        prop="goods_id"
        min-width="15">
      </el-table-column>

      <el-table-column
        label="商品名称"
        prop="name">
        <template slot-scope="scope">
          <div class="discount-text" :title="scope.row.goods | filterGoodsName">
            <span
              @click="handleViewGoods(scope.row.goods_id)"
              class="link">{{scope.row.goods | filterGoodsName}}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="typeMap[type] || '折扣方式'"
        width="160">
        <template slot="header" slot-scope="scope">
          <el-tooltip placement="top" :content="typeHelp[type]">
            <i class="el-icon-warning-outline cs-mr-10" v-show="typeHelp[type]"/>
          </el-tooltip>
          <span>{{scope.column.label}}</span>
        </template>

        <template slot-scope="scope">
          <el-select
            v-if="type === '3'"
            :value="filterCoupon(scope.row.discount)"
            @change="val => {scope.row.discount = val}"
            placeholder="请选择"
            size="mini">
            <el-option
              v-for="item in couponData"
              :key="item.coupon_id"
              :label="item.name"
              :value="item.coupon_id">
            </el-option>
          </el-select>

          <el-input-number
            v-else
            v-model="scope.row.discount"
            controls-position="right"
            placeholder="请输入"
            size="mini"
            :max="type === '0' ? 100 : Number.MAX_SAFE_INTEGER"
            :min="0"
            :precision="2">
          </el-input-number>
        </template>
      </el-table-column>

      <el-table-column
        :label="type"
        align="center"
        width="80">
        <template slot="header" slot-scope="scope">
          <el-popover
            v-model="batchVisible"
            placement="top-end"
            trigger="manual">
            <el-select
              v-if="type === '3'"
              v-model="batchValue"
              class="cs-mb-10"
              :placeholder="`请选择${typeMap[scope.column.label]}`"
              size="mini">
              <el-option
                v-for="item in couponData"
                :key="item.coupon_id"
                :label="item.name"
                :value="item.coupon_id">
              </el-option>
            </el-select>

            <el-input-number
              v-else
              v-model="batchValue"
              :placeholder="`请输入${typeMap[scope.column.label]}`"
              controls-position="right"
              size="mini"
              style="width: 150px; margin-bottom: 10px;"
              :max="type === '0' ? 100 : Number.MAX_SAFE_INTEGER"
              :min="0"
              :precision="2">
            </el-input-number>

            <div class="cs-tr">
              <el-button @click="batchVisible = false" size="mini" type="text">取消</el-button>
              <el-button @click="batchDiscount" type="primary" size="mini">确定</el-button>
            </div>

            <el-button
              :disabled="!type"
              type="text"
              slot="reference"
              @click="handleBatch">批处理</el-button>
          </el-popover>
        </template>

        <template slot-scope="scope">
          <el-button
            @click="remove(scope.$index)"
            type="text"
            size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <cs-goods-drawer ref="goodsDrawer"/>
  </div>
</template>

<script>
import { getCouponSelect } from '@/api/marketing/coupon'
import { getGoodsSelect } from '@/api/goods/goods'

export default {
  components: {
    csGoodsDrawer: () => import('@/components/cs-goods-drawer')
  },
  props: {
    // 外部v-model值
    value: {
      type: Array,
      required: true,
      default: () => {}
    },
    // 折扣方式
    type: {
      type: String,
      required: false,
      default: null
    },
    // 处理方式
    status: {
      type: String,
      required: true,
      default: ''
    },
    // 折扣索引
    typeMap: {
      default: () => {}
    }
  },
  computed: {
    discountList: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  data() {
    return {
      typeHelp: {
        0: '打折额度，比如65表示按6.5折结算',
        1: '减多少额度，比如65表示在原价的基础上减去65',
        2: '固定价格，比如65则按65的价格结算',
        3: '赠送优惠劵，订单完成后赠送指定的优惠劵给顾客'
      },
      batchValue: undefined,
      batchVisible: false,
      couponData: []
    }
  },
  watch: {
    type: {
      handler() {
        this.discountList.forEach(value => {
          value.discount = undefined
        })
      }
    }
  },
  filters: {
    filterGoodsName(val) {
      if (!val) {
        return ''
      }

      return val.name
    }
  },
  mounted() {
    let request = [getCouponSelect({ type: 3, status: 1, is_invalid: 0, is_shelf_life: 1 })]
    if (this.value.length && this.status === 'update') {
      let idList = []
      this.value.forEach(item => {
        idList.push(item.goods_id)
      })

      if (idList.length) {
        request.push(getGoodsSelect(idList))
      }
    }

    Promise.all(request)
      .then(res => {
        this.couponData = res[0].data || []
        if (res[1] && res[1].data) {
          for (let value of this.discountList) {
            let goodsData = res[1].data.find(item => item.goods_id === value.goods_id)
            this.$set(value, 'goods', goodsData)
          }
        }
      })
  },
  methods: {
    remove(index) {
      this.discountList.splice(index, 1)
    },
    filterCoupon(val) {
      if (!this.couponData.find(item => item.coupon_id === val)) {
        return null
      }

      return val
    },
    handleBatch() {
      this.batchValue = undefined
      this.batchVisible = true
    },
    batchDiscount() {
      this.batchVisible = false
      this.discountList.forEach(value => {
        value.discount = this.batchValue
      })
    },
    handleViewGoods(val) {
      this.$nextTick(() => {
        this.$refs.goodsDrawer.show(val)
      })
    }
  }
}
</script>

<style scoped>
  .discount-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }

  .link:hover {
    cursor: pointer;
    color: #409EFF;
    text-decoration: underline;
  }
</style>
