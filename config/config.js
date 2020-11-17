import { defineConfig } from 'umi'
const webpackConfig = require('../webpack.config')

export default defineConfig({
  title: '首页',
  base: '/',
  publicPath: './',
  crossorigin: true, // 为所有非三方脚本加上 crossorigin="anonymous" 属性，通常用于统计脚本错误。
  hash: true,
  history: {
    type: 'hash'
  },
  ignoreMomentLocale: true, // 忽略 moment 的 locale 文件，用于减少尺寸
  antd: {
    dark: false
  },
  define: {
    'process.env.RELEASE': 'dev', // 默认是测试环境
  },
  alias: webpackConfig.resolve.alias,
  dva: {
    immer: true, // 表示是否启用 immer 以方便修改 reducer
    hmr: true // 表示是否启用 dva model 的热更新
  },
  // 是否启用按需加载，即是否把构建产物进行拆分，在需要的时候下载额外的 JS 再执行
  // dynamicImport: {
  //   loading: '@/components/PageLoading/index',
  // },
  nodeModulesTransform: {
    type: 'none'
  },
  routes: [
    { path: '/',
      component: '../layouts/index',
      routes: [
        { path: '/', component: './index', title: '首页' },
      ]
    },
    { path: '*', component: './404', title: '无法找到页面' }
  ],
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed' // stat  // gzip
  }
})
