import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { USERINFO } from '@/constants/localStorage'
interface IUserInfo {
  id: number
  nickname: string
  type: '1' | '2'
  token: string
  avatar: string
}
interface IInitUserInfo {
  id: number
  nickname: string
  type: '1' | '2'
  avatar: string
}
export const useUser = defineStore('user', () => {
  const userInfo = reactive<IInitUserInfo>({
    id: -1,
    nickname: '',
    type: '1',
    avatar: ''
  })
  const updateUserInfo = (info: IUserInfo) => {
    const { id, nickname, type, avatar } = info
    userInfo.id = id
    userInfo.nickname = nickname
    userInfo.type = type
    userInfo.avatar = avatar
    localStorage.setItem(USERINFO, JSON.stringify(info))
  }
  const clearUserInfo = () => {
    userInfo.id = -1
    userInfo.nickname = ''
    userInfo.type = '1'
    localStorage.removeItem(USERINFO)
  }
  return {
    userInfo,
    updateUserInfo,
    clearUserInfo
  }
})
