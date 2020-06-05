<template>
  <div class="goods-control" @click="handleShowDlg">
    <slot name="control"/>

    <el-dialog
      title="商品选取"
      :visible.sync="visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      @open="handleOpen"
      width="760px">

      <!-- 搜索框开始 -->
      <el-form :model="form" style="margin-top: -25px;" size="small" @submit.native.prevent>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item>
              <el-radio-group v-model="isSelection" @change="handleSubmit(true)">
                <el-radio-button :label="false">全部</el-radio-button>
                <el-radio-button :label="true">已选</el-radio-button>
              </el-radio-group>

              <el-button-group class="cs-ml-10">
                <el-button icon="el-icon-circle-close" @click="clearedSelection">清除</el-button>
                <el-button icon="el-icon-refresh" @click="handleSubmit(true)">刷新</el-button>
              </el-button-group>
            </el-form-item>
          </el-col>

          <el-col :span="14">
            <el-form-item prop="keywords">
              <el-input
                v-model="form.keywords"
                placeholder="输入商品名称进行搜索"
                @keyup.enter.native="handleSubmit(true)"
                :clearable="true"
                size="small">
                <el-button slot="append" icon="el-icon-search" @click="handleSubmit(true)"/>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 资源列表开始 -->
      <el-table
        ref="multipleTable"
        :data="tableData"
        row-key="goods_id"
        @selection-change="handleSelectionChange">
        <el-table-column
          :reserve-selection="true"
          align="center"
          type="selection"
          width="50">
        </el-table-column>

        <el-table-column
          label="名称"
          prop="name">
          <template slot-scope="scope">
            <el-image
              class="goods-image"
              @click="handleViewGoods(scope.row.goods_id)"
              :src="scope.row.attachment | getPreviewUrl"
              fit="contain"
              lazy>
            </el-image>

            <div class="goods-info">
              <div
                :title="scope.row.name"
                @click="handleViewGoods(scope.row.goods_id)"
                class="name">{{scope.row.name}}</div>

              <p class="price"><span style="color: #909399;">本店价：</span>{{scope.row.shop_price | getNumber}}</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="库存"
          prop="store_qty"
          width="100">
        </el-table-column>

        <el-table-column
          label="销量"
          prop="sales_sum"
          width="100">
        </el-table-column>

        <el-table-column
          label="状态"
          prop="status"
          align="center"
          width="80">
          <template slot-scope="scope">
            <span>{{scope.row.status ? '出售中' : '已下架'}}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 翻页开始 -->
      <page-footer
        style="margin: 0; padding: 20px 0 0 0;"
        :current="page.current"
        :size="page.size"
        :total="page.total"
        :is-size="false"
        @change="handlePaginationChange"/>

      <!-- 确认,取消 -->
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="visible = false"
          size="small">取消</el-button>

        <el-button
          type="primary"
          @click="handleConfirm"
          size="small">确定</el-button>
      </div>
    </el-dialog>

    <cs-goods-drawer ref="goodsDrawer"/>
  </div>
</template>

<script>
import util from '@/utils/util'
import { getGoodsAdminList, getGoodsSelect } from '@/api/goods/goods'

export default {
  name: 'cs-goods-select',
  components: {
    csGoodsDrawer: () => import('@/components/cs-goods-drawer'),
    PageFooter: () => import('@/components/cs-footer')
  },
  props: {
    // 确认按钮事件
    confirm: {
      type: Function
    },
    // 已选数据
    checkList: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      isCheck: false,
      isSelection: false,
      tableData: [],
      multipleSelection: [],
      form: {
        keywords: undefined,
        goods_id: undefined
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      }
    }
  },
  filters: {
    getPreviewUrl(val) {
      if (Array.isArray(val) && val.length > 0) {
        if (val[0].source) {
          return util.getImageCodeUrl(val[0].source, 'goods_image_x80')
        }
      }

      return ''
    },
    getNumber(val) {
      return util.getNumber(val)
    }
  },
  methods: {
    handlePaginationChange(val) {
      this.page = val
      this.$nextTick(() => {
        this.handleSubmit()
      })
    },
    handleShowDlg() {
      this.visible = true
    },
    handleOpen() {
      if (!this.isCheck && this.checkList.length) {
        let idList = []
        for (let value of this.checkList) {
          if (Object.prototype.hasOwnProperty.call(value, 'goods_id')) {
            idList.push(value.goods_id)
          }
        }

        getGoodsSelect(idList)
          .then(res => {
            this.$nextTick(() => {
              if (res.data) {
                res.data.forEach(value => {
                  this.$refs.multipleTable.toggleRowSelection(value, true)
                })
              }
            })
          })
          .then(() => {
            if (!this.tableData.length) {
              this.handleSubmit(true)
            }
          })
      } else {
        if (!this.tableData.length) {
          this.handleSubmit(true)
        }
      }

      // 组件存在时只需处理一次
      this.isCheck = true
    },
    handleSubmit(isRefresh = false) {
      if (isRefresh) {
        this.page.current = 1
      }

      let form = { ...this.form }
      if (this.isSelection) {
        form.goods_id = []
        this.multipleSelection.forEach(value => {
          form.goods_id.push(value.goods_id)
        })
      }

      getGoodsAdminList({
        ...form,
        page_no: this.page.current,
        page_size: this.page.size
      })
        .then(res => {
          this.tableData = res.data.items || []
          this.page.total = res.data.total_result
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    clearedSelection() {
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection()
      })
    },
    handleConfirm() {
      this.$emit('confirm', this.multipleSelection)
      this.visible = false
    },
    handleViewGoods(val) {
      this.$nextTick(() => {
        this.$refs.goodsDrawer.show(val)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .goods-control {
    width: auto;
    display: inline;
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
    width: 290px;
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

    .price {
      margin: 0;
      font-size: 12px;
      color: $color-danger;
    }
  }
</style>
