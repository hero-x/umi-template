import { Modal } from 'antd'
import _ from 'lodash'
import axios, { AxiosRequestConfig } from 'axios'
import moment from 'moment'
import { stringify } from 'qs'
import { BASEURL } from '@/config'

const baseURL = BASEURL()
let tokenLoading: boolean = false
let refreshToken = '' // 刷新token url
if (process.env.RELEASE === 'build') {
  refreshToken = ''
}

type Token = { token: string; expired_time: number }
type TimerConfig = {
  [propName: string]: any
}
const timer: TimerConfig = {}

/**
 * 获取token
 * @returns {Promise<any>}
 */
function getToken(config: AxiosRequestConfig) {
  return new Promise(async (resolve, reject) => {
    const tokenString: string | null = localStorage.getItem('token')
    try {
      const token: Token = tokenString && JSON.parse(tokenString)
      if (!tokenLoading) {
        // token 校验
        if (token && token.expired_time) {
          // token 已过期
          if (token.expired_time <= moment().unix()) {
            tokenLoading = true
            try {
              let data = await axios({
                url: refreshToken,
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + token.token
                }
              })
              localStorage.setItem(
                'token',
                JSON.stringify({
                  token: data.data.access_token,
                  expired_time: data.data.expires
                })
              )
              tokenLoading = false
              resolve(data.data.access_token)
            } catch (e) {
              //goto Login
              tokenLoading = false
              window.location.href = '' // 重定向到登录的地址
              reject(e)
            }
          } else {
            resolve(token.token)
          }
        } else {
          //没有登录信息 重定向到登录
          tokenLoading = false
          window.location.href = ''
        }
      } else {
        timer[config.url || ''] = setTimeout(() => {
          // 等待token 过去结束后继续执行
          getToken(config)
            .then(token => {
              if (timer[config.url || '']) {
                clearTimeout(timer[config.url || ''])
                timer[config.url || ''] = undefined
              }
              resolve(token)
            })
            .catch(err => {
              if (timer[config.url || '']) {
                clearTimeout(timer[config.url || ''])
                timer[config.url || ''] = undefined
              }
              reject(err)
            })
        }, 300)
      }
    } catch (e) {
      // 发生任何异常都重定向到登录
      window.location.href = ''
    }
  })
}

type PendingRequest = { method: string | undefined; u: string; f: () => void }

let pendingRequest: PendingRequest[] = [] //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
//处理重复请求
let removePending = (config: AxiosRequestConfig) => {
  pendingRequest.map((p, index) => {
    // GET 方法暂时不过滤
    if (
      p.method &&
      p.method.toLowerCase() !== 'options' &&
      p.method.toLowerCase() !== 'get' &&
      p.u === config.url + '&' + config.method
    ) {
      //当当前请求在数组中存在时执行函数体
      console.log('cancel axios :', p)
      p.f() //执行取消操作
      pendingRequest.splice(index, 1) //把这条记录从数组中移除
    }
  })
}

const fetch = axios.create({ baseURL })

fetch.defaults.baseURL = baseURL
fetch.interceptors.request.use(async function(configuration: AxiosRequestConfig) {
  let config = _.cloneDeep(configuration)
  config.headers = config.headers || {}
  // 处理请求重复
  removePending(config) //在一个ajax发送前执行一下取消操作
  // get 请求参数格式处理
  if (config.method && config.method.toLowerCase() === 'get') {
    if (config.params && config.params.customErrorDisplay) {
      // 处理get下无法传headers的情况
      config.headers.customErrorDisplay = true
      delete config.params.customErrorDisplay
    }
    config.paramsSerializer = function(params) {
      return stringify(params, { arrayFormat: 'indices' })
    }
  }
  if (
    config.method &&
    config.method.toLowerCase() !== 'get' &&
    config.method.toLowerCase() !== 'options'
  ) {
    config.cancelToken = new axios.CancelToken(c => {
      // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
      pendingRequest.push({ method: config.method, u: config.url + '&' + config.method, f: c })
    })
  }
  let token
  try {
    token = await getToken(config)
    config.headers['Authorization'] = `Bearer ${token}`
    if (!config.headers.hasOwnProperty('accept')) {
      config.headers['Accept'] = 'application/json; charset=utf-8'
      config.headers['Content-Type'] = 'application/json'
      if (config.data && typeof config.data === 'object') {
        config.data = JSON.stringify(config.data)
      }
    }
  } catch (e) {
    //goto login
    console.log('getToken', e)
    config.cancelToken = new axios.CancelToken(c => {
      c()
    })
    return config
  }
  return config
})

fetch.interceptors.response.use(
  function(response) {
    // 处理请求重复
    removePending(response.config) //在一个ajax发送前执行一下取消操作
    return response.data || {}
  },
  function(error) {
    if (error.toString() === 'Cancel') {
      // 请求取消-一般由重复请求，刷新token失败取消下一步请求引起
    } else if (error.response && error.response.data) {
      console.log('----error----', error)
      if (!error.response.config.headers.customErrorDisplay) {
        Modal.error({
          title: '请求错误',
          content: error.response.data.message || error.response.data.errmsg
        })
      }
    } else if (error.request) {
      Modal.error({
        title: '请求错误',
        content: '请求404路由，或无数据返回'
      })
    } else {
      Modal.error({
        title: '请求错误',
        content: error.toString()
      })
    }
    return Promise.reject(error)
  }
)
export { fetch, getToken }
