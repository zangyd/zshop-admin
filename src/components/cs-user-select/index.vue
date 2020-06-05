<template>
  <div class="user-control" @click="handleShowDlg">
    <slot name="control"/>

    <el-dialog
      title="账号选取"
      :visible.sync="visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      @open="handleOpen"
      width="760px">

      <!-- 搜索框开始 -->
      <el-form :model="form" style="margin-top: -25px;" size="small" @submit.native.prevent>
        <el-row :gutter="20">
          <el-col :span="12">
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

          <el-col :span="12">
            <el-form-item prop="account">
              <el-input
                v-model="form.account"
                placeholder="可输入账号/昵称进行搜索"
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
        :row-key="typeUser === 'client' ? 'user_id' : 'admin_id'"
        @selection-change="handleSelectionChange">
        <el-table-column
          :reserve-selection="true"
          align="center"
          type="selection"
          width="50">
        </el-table-column>

        <el-table-column
          label="账号"
          prop="username"
          min-width="160">
          <template slot-scope="scope">
            <el-avatar
              class="cs-fl"
              size="medium"
              :src="scope.row.head_pic | getPreviewUrl">
              <img :src="`${$publicPath}image/setting/user.png`" alt=""/>
            </el-avatar>

            <div class="user-info cs-ml-10">
              <div class="username">{{scope.row.username}}</div>
              <p v-if="typeUser === 'client'" class="level">
                <el-tooltip
                  v-if="scope.row.get_user_level.icon"
                  :content="scope.row.get_user_level.name"
                  placement="top">
                  <el-image
                    class="level-icon"
                    :src="scope.row.get_user_level.icon"
                    fit="fill">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"/>
                    </div>
                  </el-image>
                </el-tooltip>
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="昵称"
          prop="nickname">
        </el-table-column>

        <el-table-column
          v-if="typeUser === 'client'"
          label="手机号"
          prop="mobile">
        </el-table-column>

        <el-table-column
          v-else
          label="所属组"
          prop="get_auth_group.name">
        </el-table-column>

        <el-table-column
          label="状态"
          prop="status"
          align="center"
          width="80">
          <template slot-scope="scope">
            <el-tag
              :type="statusMap[scope.row.status].type"
              effect="plain"
              size="mini">
              {{statusMap[scope.row.status].text}}
            </el-tag>
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
  </div>
</template>

<script>
import util from '@/utils/util'
import { getUserList, getUserSelect } from '@/api/user/client'
import { getAdminList, getAdminSelect } from '@/api/user/admin'

export default {
  name: 'cs-user-select',
  components: {
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
    },
    // 获取类型
    typeUser: {
      type: String,
      required: false,
      default: 'client'
    }
  },
  data() {
    return {
      visible: false,
      isCheck: false,
      isSelection: false,
      tableData: [],
      multipleSelection: [],
      statusMap: {
        0: {
          text: '禁用',
          type: 'danger'
        },
        1: {
          text: '启用',
          type: 'success'
        }
      },
      form: {
        account: undefined,
        client_id: undefined
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
      return val ? util.getImageCodeUrl(val, 'head_pic') : ''
    }
  },
  methods: {
    handleShowDlg() {
      this.visible = true
    },
    handlePaginationChange(val) {
      this.page = val
      this.$nextTick(() => {
        this.handleSubmit()
      })
    },
    handleOpen() {
      if (!this.isCheck && this.checkList.length) {
        let idList = []
        for (let value of this.checkList) {
          const typeId = this.typeUser === 'client' ? 'user_id' : 'admin_id'
          if (Object.prototype.hasOwnProperty.call(value, typeId)) {
            idList.push(value[typeId])
          }
        }

        if (this.checkList.length && !idList.length) {
          idList = this.checkList
        }

        const funSelect = this.typeUser === 'client' ? getUserSelect : getAdminSelect
        funSelect(idList)
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
        form.client_id = []
        this.multipleSelection.forEach(value => {
          form.client_id.push(value[this.typeUser === 'client' ? 'user_id' : 'admin_id'])
        })
      }

      const funList = this.typeUser === 'client' ? getUserList : getAdminList
      funList({
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-control {
    width: auto;
    display: inline;
  }

  .user-info {
    float: left;

    .username {
      width: 160px;
      line-height: 14px;
      overflow: hidden;
    }

    .level {
      margin: 0;
    }
  }

  .level-icon {
    line-height: 0;
    vertical-align: text-bottom;
  }
</style>
