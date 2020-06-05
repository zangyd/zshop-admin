<template>
  <div class="panel-search" flex="dir:top">
    <div class="panel-search__input-group" flex-box="0" flex="dir:top main:center cross:center" @click.self="handlePanelClick">
      <img :src="`${$publicPath}image/theme/${themeActiveSetting.name}/logo/all.png`" class="panel-search__logo" alt="">
      <el-autocomplete
        class="panel-search__input"
        ref="input"
        v-model="searchText"
        value-key="fullTitle"
        suffix-icon="el-icon-search"
        placeholder="搜索页面"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        :clearable="true"
        @keydown.esc.native="handleEsc"
        @select="handleSelect">
        <cs-panel-search-item slot-scope="{item}" :item="item"/>
      </el-autocomplete>
      <div class="panel-search__tip">
        您可以使用按键
        <el-button class="panel-search__key" type="text">{{hotkey.open}}</el-button>
        唤醒搜索面板，按
        <el-button class="panel-search__key" type="text" @click="handleEsc">{{hotkey.close}}</el-button>
        关闭
      </div>
    </div>
    <div v-if="resultsList.length > 0" class="panel-search__results-group" flex-box="1">
      <el-card shadow="never" style="border-radius: 0;">
        <div class="panel-search__results-group-inner">
          <cs-panel-search-item
            v-for="(item, index) in resultsList"
            :key="index"
            :item="item"
            :hover-mode="true"
            @click.native="handleResultsGroupItemClick(item.path)"/>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
import menuMixin from '../mixin/menu'
import { mapState, mapGetters } from 'vuex'

export default {
  mixins: [
    menuMixin
  ],
  components: {
    'cs-panel-search-item': () => import('./components/panel-search-item')
  },
  data() {
    return {
      searchText: '',
      results: []
    }
  },
  computed: {
    ...mapState('zshop/search', [
      'hotkey',
      'pool'
    ]),
    ...mapGetters('zshop', {
      themeActiveSetting: 'theme/activeSetting'
    }),
    // 这份数据是展示在搜索面板下面的
    resultsList() {
      return (this.results.length === 0 && this.searchText === '')
        ? this.pool.map(e => ({ value: e.fullTitle, ...e }))
        : this.results
    },
    // 根据 pool 更新 fuse 实例
    fuse() {
      return new Fuse(this.pool, {
        shouldSort: true,
        tokenize: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'fullTitle',
          'path'
        ]
      })
    }
  },
  methods: {
    /**
     * @description 过滤选项 这个方法在每次输入框的值发生变化时会触发
     */
    querySearch(queryString, callback) {
      const results = this.fuse.search(queryString).map(e => e.item)
      this.results = results
      callback(results)
    },
    /**
     * @description 聚焦输入框
     */
    focus() {
      setTimeout(() => {
        if (this.$refs.input) {
          this.$refs.input.focus()
        }

        // 还原
        this.searchText = ''
        this.results = []
      }, 500)
    },
    /**
     * @description 接收用户在列表中选择项目的事件
     */
    handleResultsGroupItemClick(path) {
      if (path !== this.$route.path) {
        this.handleMenuSelect(path)
      }

      this.handleEsc()
    },
    /**
     * @description 接收用户在下拉菜单中选中事件
     */
    handleSelect({ path }) {
      if (path !== this.$route.path) {
        this.$nextTick(() => {
          this.handleMenuSelect(path)
        })
      }

      this.handleEsc()
    },
    /**
     * @description 关闭输入框的下拉菜单
     */
    closeSuggestion() {
      if (this.$refs.input.activated) {
        this.$refs.input.suggestions = []
        this.$refs.input.activated = false
      }
    },
    /**
     * @description 接收用户点击空白区域的关闭
     */
    handlePanelClick() {
      this.handleEsc()
    },
    /**
     * @description 接收用户触发的关闭
     */
    handleEsc() {
      this.closeSuggestion()
      this.searchText = ''
      this.results = []

      this.$nextTick(() => {
        this.$emit('close')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel-search {
    margin: 20px;
    width: 100%;

    .panel-search__input-group {
      height: 240px;

      .panel-search__logo {
        height: 80px;
        margin-bottom: 20px;
      }

      .panel-search__input {
        width: 500px;
      }

      .panel-search__tip {
        margin-top: 20px;
        margin-bottom: 40px;
        font-size: 13px;
        color: $color-text-placehoder;

        .panel-search__key {
          padding: 1px 5px;
          margin: 0 2px;
          border-radius: 2px;
          background-color: $color-text-normal;
          color: $color-bg;
        }
      }
    }

    .panel-search__results-group {
      overflow: auto;

      .panel-search__results-group-inner {
        margin: -20px;
      }
    }
  }
</style>
