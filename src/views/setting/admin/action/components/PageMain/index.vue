<template>
  <div class="cs-p">
    <el-table
      :data="tableData"
      :highlight-current-row="true"
      @sort-change="sortChange">

      <el-table-column
        label="账号"
        prop="username"
        sortable="custom"
        :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column
        label="账号类型"
        prop="client_type"
        sortable="custom">
        <template slot-scope="scope">
          {{group[scope.row.client_type]}}
        </template>
      </el-table-column>

      <el-table-column
        label="动作"
        prop="action"
        :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column
        label="请求路径"
        prop="path"
        sortable="custom"
        :show-overflow-tooltip="true">
      </el-table-column>

      <el-table-column
        label="IP"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.ip"
            :content="scope.row.ip"
            placement="top">
            <i class="el-icon-location"/>
          </el-tooltip>
          {{scope.row.ip_region}}
        </template>
      </el-table-column>

      <el-table-column
        label="请求/处理"
        align="center">
        <template slot-scope="scope">
          <el-tag
            @click.native="getObjectToJson(scope.$index)"
            class="cs-cp"
            size="mini"
            type="info">详细</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="状态"
        align="center"
        width="75"
        prop="status"
        sortable="custom">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.status ? 'warning' : 'success'"
            effect="plain">
            {{statusMap[scope.row.status]}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="创建日期"
        prop="create_time"
        align="center"
        sortable="custom"
        width="160">
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="600px">
      <el-tabs
        v-model="dialogStatus"
        @tab-click="handleClick"
        style="margin-top: -25px;">
        <el-tab-pane label="请求参数" name="params">
          <cs-highlight v-if="dialogStatus === 'params'" :code="dialogJson"/>
        </el-tab-pane>

        <el-tab-pane label="处理结果" name="result">
          <cs-highlight v-if="dialogStatus === 'result'" :code="dialogJson"/>
        </el-tab-pane>

        <el-tab-pane label="请求头部" name="header">
          <cs-highlight v-if="dialogStatus === 'header'" :code="dialogJson"/>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <div class="cs-fl">
          <el-button
            @click="copyData()"
            size="small">复制</el-button>
        </div>

        <el-button
          @click.native="dialogFormVisible = false"
          type="primary"
          size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as clipboard from 'clipboard-polyfill'

export default {
  props: {
    tableData: {
      default: () => []
    },
    group: {
      default: () => []
    }
  },
  data() {
    return {
      statusMap: {
        0: '成功',
        1: '失败'
      },
      dialogJson: '',
      dialogStatus: '',
      dialogFormVisible: false
    }
  },
  methods: {
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
    // 从结果集中获取JSON数据
    getObjectToJson(index) {
      this.dialogIndex = index
      this.dialogStatus = 'params'
      this.handleClick({ name: this.dialogStatus })
      this.dialogFormVisible = true
    },
    handleClick(tab) {
      const data = this.tableData[this.dialogIndex]
      switch (tab.name) {
        case 'params':
          this.dialogJson = JSON.stringify(data.params, null, 2)
          break

        case 'result':
          this.dialogJson = JSON.stringify(data.result, null, 2)
          break

        case 'header':
          this.dialogJson = JSON.stringify(data.header, null, 2)
          break
      }
    },
    copyData() {
      clipboard.writeText(this.dialogJson)
        .then(() => {
          this.$message.success('已复制到剪贴板')
        })
        .catch(err => {
          this.$message.error(err)
        })
    }
  }
}
</script>
