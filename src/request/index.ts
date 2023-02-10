import Req from './basic'
import { baseURL } from './apis'
import { USERINFO } from '@/constants/localStorage'
export default new Req({
  baseURL,
  timeout: 5000,
  interceptors: {
    requestSucInterceptors(config) {
      const method = config.method
      let userInfo: any = localStorage.getItem(USERINFO)
      if (userInfo && method?.toLowerCase() !== 'get') {
        userInfo = JSON.parse(userInfo)
        config.headers = {
          Authorization: userInfo.token
        }
      }
      return config
    }
  }
})
