import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useGlobal = defineStore('global', () => {
  const isLogin = ref(false)
  const isDark = ref(false)
  const isSubscribe = ref(false)
  const totalSubscribe = ref(0)
  const isSearch = ref(false)
  const isShowFooter = ref(true)
  return {
    isLogin,
    isDark,
    isSubscribe,
    totalSubscribe,
    isSearch,
    isShowFooter
  }
})
