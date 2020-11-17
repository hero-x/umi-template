import { fetch } from '@/utils/request'
// 配置仓库
export const getData = (params?: { clue?: string } & PageParams) => {
  return fetch.get('/url', { params })
}
