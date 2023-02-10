import axios from 'axios'
import { ElLoading } from 'element-plus'
import type { AxiosInstance } from 'axios'
import type IInstanceConfig from './types'
import type { IInterceptors, IReqConfig } from './types'
export default class Req {
  private axios: AxiosInstance
  constructor(config: IInstanceConfig) {
    this.axios = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 5000,
      withCredentials: true // 跨域请求时允许携带cookie等有关身份信息的数据,这还不够，还需要后端设置Access-Control-Allow-Credentials
    })
    this.init(config.interceptors)
  }
  private init(interceptors: IInterceptors | undefined): void {
    if (!interceptors) {
      return
    }
    this.axios.interceptors.request.use(
      interceptors.requestSucInterceptors,
      interceptors.requestErrInterceptors
    )
    this.axios.interceptors.response.use(
      interceptors.responseSucInterceptors,
      interceptors.responseErrInterceptors
    )
  }
  request(config: IReqConfig): Promise<any> {
    let loadingInstance: any = null
    if (config.isLoading) {
      loadingInstance = ElLoading.service({
        target: 'body',
        text: 'loading...',
        background: '#00000050'
      })
    }
    if (config.interceptors) {
      this.axios.interceptors.request.use(
        config.interceptors.requestSucInterceptors,
        config.interceptors.requestErrInterceptors
      )
      this.axios.interceptors.response.use(
        config.interceptors.responseSucInterceptors,
        config.interceptors.responseErrInterceptors
      )
    }
    return new Promise((resolve, reject) => {
      this.axios
        .request(config)
        .then(res => {
          resolve(res)
          loadingInstance?.close()
        })
        .catch(err => {
          reject(err)
          loadingInstance?.close()
        })
    })
  }
  get(config: IReqConfig): Promise<any> {
    return this.request({
      ...config,
      method: 'GET'
    })
  }
  post(config: IReqConfig): Promise<any> {
    return this.request({
      ...config,
      method: 'POST'
    })
  }
}
