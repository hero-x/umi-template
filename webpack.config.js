/**
 * 不是真实的 webpack 配置，仅为兼容 webstorm 和 intellij idea 代码跳转
 * ref: https://github.com/umijs/umi/issues/1109#issuecomment-423380125
 */
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  resolve: {
    alias: {
      '@': resolve('src'),
      '@styles': resolve('src/styles'),
      '@pages': resolve('src/pages'),
      '@components': resolve('src/components'),
      '@assets': resolve('src/assets'),
      '@layouts': resolve('src/layouts'),
      '@models': resolve('src/models'),
      '@utils': resolve('src/utils'),
      '@config': resolve('src/config'),
      '@common': resolve('src/common'),
      '@enum': resolve('src/enum'),
      '@services': resolve('src/services')
    }
  }
}
