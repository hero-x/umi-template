const host = document.location.host
const protocol = document.location.protocol

export const DATE_FORMAT: string = 'YYYY-MM-DD'
// 有三种环境dev build test-build
const ENV = process.env.RELEASE
export const isDev: boolean = ENV !== 'build'
export const OSS_BUCKET_NAME = ''
export const BASEURL = () => {
  if (ENV === 'build' || ENV === 'test-build') {
    // 正式环境
    return ''
  }
  // 测试环境
  return ''
}
