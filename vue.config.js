// 插件
const { chain, set, each } = require('lodash')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const cdnDependencies = require('./dependencies-cdn')

// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)

// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-MM-DD HH:mm:ss')

// 基础路径 注意发布之前要先修改这里
let publicPath = process.env.VUE_APP_PUBLIC_PATH || ''

// 设置不参与构建的库
let externals = {}
cdnDependencies.forEach(pkg => { externals[pkg.name] = pkg.library })

// 引入文件的 cdn 链接
const cdn = {
  css: cdnDependencies.map(e => e.css).filter(e => e),
  js: cdnDependencies.map(e => e.js).filter(e => e)
}

// 多页配置，默认未开启，如需要请参考 https://cli.vuejs.org/zh/config/#pages
const pages = undefined
// const pages = {
//   index: './src/main.js',
//   subpage: './src/subpage.js'
// }

module.exports = {
  publicPath, // 根据你的实际情况更改这里
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    publicPath, // 和 publicPath 保持一致
    disableHostCheck: process.env.NODE_ENV === 'development' // 关闭 host check，方便使用 ngrok 之类的内网转发工具
  },
  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        prependData: `@import '~@/assets/style/public.scss';`
      }
    }
  },
  // 多页配置
  pages,
  // 不输出 map 文件
  productionSourceMap: false,
  // build时 超过10K的打包成gzip 减小体积
  configureWebpack: config => {
    const configNew = {}
    if (process.env.NODE_ENV === 'production') {
      configNew.externals = externals
      configNew.plugins = [
        // gzip
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      ]

      const projectName = '\x63\x61\x72\x65\x79\x73\x68\x6f\x70'
      configNew.output = {
        filename: `js/[name].[contenthash:8].${projectName}.js`,
        chunkFilename: `js/[name].[contenthash:8].${projectName}.js`
      }
    }

    return configNew
  },
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    /**
     * 添加 CDN 参数到 htmlWebpackPlugin 配置中
     * 已适配多页
     */
    const htmlPluginNames = chain(pages).keys().map(page => 'html-' + page).value()
    const targetHtmlPluginNames = htmlPluginNames.length ? htmlPluginNames : ['html']
    each(targetHtmlPluginNames, name => {
      config.plugin(name).tap(options => {
        set(options, '[0].cdn', process.env.NODE_ENV === 'production' ? cdn : [])
        return options
      })
    })
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    config.plugins
      .delete('prefetch')
      .delete('preload')
    // 解决 cli3 热更新失效
    config.resolve
      .symlinks(true)
    config
      // 开发环境 sourcemap 不包含列信息
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )
    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'cs-[name]'
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
    // 重新设置 alias
    config.resolve.alias
      .set('@static', resolve('public/static'))
    // 分析工具
    if (process.env.npm_config_report) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  }
}
