import type { AxiosRequestConfig, AxiosResponse } from 'axios'
export interface IInterceptors {
  requestSucInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestErrInterceptors?: (err: any) => any
  responseSucInterceptors?: (response: AxiosResponse) => AxiosResponse
  responseErrInterceptors?: (err: any) => any
}
export interface IReqConfig extends AxiosRequestConfig {
  isLoading?: boolean
  interceptors?: IInterceptors
}
export default interface IInstanceConfig {
  baseURL?: string
  timeout?: number
  interceptors?: IInterceptors
}
