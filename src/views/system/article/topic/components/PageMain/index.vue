<template>
  <div class="cs-p">
    <el-form
      :inline="true"
      size="small">

      <el-form-item v-if="auth.add">
        <el-button
          icon="el-icon-plus"
          :disabled="loading"
          @click="handleCreate">新增专题</el-button>
      </el-form-item>

      <el-form-item v-if="auth.enable || auth.disable">
        <el-button-group>
          <el-button
            v-if="auth.enable"
            icon="el-icon-check"
            :disabled="loading"
            @click="handleStatus(null, 1, true)">启用</el-button>

          <el-button
            v-if="auth.disable"
            icon="el-icon-close"
            :disabled="loading"
            @click="handleStatus(null, 0, true)">禁用</el-button>
        </el-button-group>
      </el-form-item>

      <el-form-item v-if="auth.del">
        <el-button
          icon="el-icon-delete"
          :disabled="loading"
          @click="handleDelete(null)">删除</el-button>
      </el-form-item>

      <cs-help
        :router="$route.path"
        style="padding-bottom: 19px;">
      </cs-help>
    </el-form>

    <el-table
      :data="currentTableData"
      :highlight-current-row="true"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange">
      <el-table-column align="center" type="selection" width="55"/>

      <el-table-column
        label="标题"
        prop="title"
        sortable="custom"
        min-width="250"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span class="link" @click="handleView(scope.row.topic_id)">{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="别名"
        prop="alias"
        sortable="custom"
        min-width="130"
        :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column
        label="创建日期"
        prop="create_time"
        sortable="custom"
        align="center"
        width="160">
      </el-table-column>

      <el-table-column
        label="状态"
        prop="status"
        sortable="custom"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="statusMap[scope.row.status].type"
            :style="auth.enable || auth.disable ? 'cursor: pointer;' : ''"
            :effect="auth.enable || auth.disable ? 'light' : 'plain'"
            @click.native="handleStatus(scope.$index)">
            {{statusMap[scope.row.status].text}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        min-width="120">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleView(scope.row.topic_id)"
            type="text">预览</el-button>

          <el-button
            v-if="auth.set"
            size="small"
            @click="handleEdit(scope.row.topic_id)"
            type="text">编辑</el-button>

          <el-button
            v-if="auth.del"
            size="small"
            @click="handleDelete(scope.$index)"
            type="text">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import util from '@/utils/util'
import { mapActions } from 'vuex'
import { delTopicList, setTopicStatus } from '@/api/article/topic'

export default {
  props: {
    tableData: {
      default: () => []
    },
    loading: {
      default: false
    }
  },
  data() {
    return {
      currentTableData: [],
      multipleSelection: [],
      auth: {
        add: false,
        del: false,
        set: false,
        enable: false,
        disable: false
      },
      statusMap: {
        0: {
          text: '禁用',
          type: 'danger'
        },
        1: {
          text: '启用',
          type: 'success'
        },
        2: {
          text: '...',
          type: 'info'
        }
      }
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
  activated() {
    this.updateChange({
      name: 'system-topic-admin',
      source: this.currentTableData,
      key: 'topic_id'
    })
  },
  mounted() {
    this._validationAuth()
  },
  methods: {
    ...mapActions('zshop/update', [
      'updateChange'
    ]),
    // 验证权限
    _validationAuth() {
      this.auth.add = this.$permission('/system/topic/admin/add')
      this.auth.del = this.$permission('/system/topic/admin/del')
      this.auth.set = this.$permission('/system/topic/update')
      this.auth.enable = this.$permission('/system/topic/admin/enable')
      this.auth.disable = this.$permission('/system/topic/admin/disable')
    },
    // 获取列表中的专题编号
    _getTopicIdList(val) {
      if (val === null) {
        val = this.multipleSelection
      }

      let idList = []
      if (Array.isArray(val)) {
        val.forEach(value => {
          idList.push(value.topic_id)
        })
      } else {
        idList.push(this.currentTableData[val].topic_id)
      }

      return idList
    },
    // 选中数据项
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取排序字段
    sortChange({ column, prop, order }) {
      let sort = {
        order_type: undefined,
        order_field: undefined
      }

      if (column && order) {
        sort.order_type = order === 'ascending' ? 'asc' : 'desc'
        sort.order_field = prop
      }

      this.$emit('sort', sort)
    },
    // 批量设置状态
    handleStatus(val, status = 0, confirm = false) {
      let topic_id = this._getTopicIdList(val)
      if (topic_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      function setStatus(topic_id, status, vm) {
        setTopicStatus(topic_id, status)
          .then(() => {
            vm.currentTableData.forEach((value, index) => {
              if (topic_id.indexOf(value.topic_id) !== -1) {
                vm.$set(vm.currentTableData, index, {
                  ...value,
                  status
                })
              }
            })

            vm.$message.success('操作成功')
          })
      }

      if (!confirm) {
        let oldData = this.currentTableData[val]
        const newStatus = oldData.status ? 0 : 1

        if (oldData.status > 1) {
          return
        }

        // 禁用权限检测
        if (newStatus === 0 && !this.auth.disable) {
          return
        }

        // 启用权限检测
        if (newStatus === 1 && !this.auth.enable) {
          return
        }

        this.$set(this.currentTableData, val, { ...oldData, status: 2 })
        setStatus(topic_id, newStatus, this)
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          setStatus(topic_id, status, this)
        })
        .catch(() => {
        })
    },
    // 批量删除专题
    handleDelete(val) {
      let topic_id = this._getTopicIdList(val)
      if (topic_id.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }

      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          delTopicList(topic_id)
            .then(() => {
              util.deleteDataList(this.currentTableData, topic_id, 'topic_id')
              if (this.currentTableData.length <= 0) {
                this.$emit('refresh', true)
              }

              this.$message.success('操作成功')
            })
        })
        .catch(() => {
        })
    },
    // 发送预览专题请求
    handleView(key) {
      this.$router.push({
        name: 'system-topic-view',
        params: { topic_id: key }
      })
    },
    // 创建专题
    handleCreate() {
      this.$router.push({
        name: 'system-topic-create'
      })
    },
    // 编辑专题
    handleEdit(key) {
      this.$router.push({
        name: 'system-topic-update',
        params: { topic_id: key }
      })
    }
  }
}
</script>

<style scoped>
  .link:hover {
    cursor: pointer;
    color: #409EFF;
    text-decoration: underline;
  }
</style>
