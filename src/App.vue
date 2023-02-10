<template>
  <div id="app">
    <TopBar />
    <HideTools />
    <Login />
    <Search />
    <router-view #="{ Component }">
      <KeepAlive include="Home">
        <component :is="Component" />
      </KeepAlive>
    </router-view>
    <Footer v-show="globalVars.isShowFooter" />
  </div>
</template>

<script setup lang="ts">
import TopBar from './components/global/topbar/TopBar.vue'
import HideTools from './components/global/hideTools/HideTools.vue'
import Login from './components/global/login/Login.vue'
import Search from './components/global/search/Search.vue'
import Footer from './components/global/footer/Footer.vue'
import { ElMessage } from 'element-plus'
import { useDark } from '@vueuse/core'
import { useGlobal, useUser } from './store'
import req from './request'
import { USERINFO } from './constants/localStorage'
import {
  LOGINVERIFY,
  ISSUBSCRIBE,
  ISVIEWED,
  GETSUBSCRIBETOTAL
} from './request/apis'
const globalVars = useGlobal()
const userStore = useUser()
globalVars.isDark = useDark().value
const userInfoStr = localStorage.getItem(USERINFO)
// 判断登录状态，装载用户信息
if (userInfoStr) {
  const userInfoObj = JSON.parse(userInfoStr)
  req
    .request({
      ...LOGINVERIFY
    })
    .then(res => {
      const {
        data: { code },
        errMsg,
        success
      } = res.data
      if (!success && code === -1) {
        // token过期
        globalVars.isLogin = false
        userStore.clearUserInfo()
        return ElMessage.warning({ message: errMsg })
      } else if (code === 1) {
        // token有效
        const { id, nickname, token, type, avatar } = userInfoObj
        userStore.updateUserInfo({ id, nickname, token, type, avatar })
      }
    })
}

// 查询用户是否已订阅
if (userInfoStr) {
  const userInfoObj = JSON.parse(userInfoStr)
  req.request({ ...ISSUBSCRIBE(userInfoObj.id) }).then(res => {
    const { errMsg, success, subscribe } = res.data
    if (!success) {
      return ElMessage.warning({ message: errMsg })
    }
    if (subscribe) {
      globalVars.isSubscribe = true
    }
  })
}

// 获取订阅数量
req
  .request({
    ...GETSUBSCRIBETOTAL
  })
  .then(res => {
    const { success, total } = res.data
    if (!success) {
      return ElMessage.warning({ message: '获取订阅总数失败' })
    }
    globalVars.totalSubscribe = total
  })

// 用户访问量控制
req.request({
  ...ISVIEWED
})
</script>

<style src="normalize.css"></style>
<style src="./assets/font/font.css"></style>
<style src="./assets/css/iconfont/iconfont.css"></style>
<style src="element-plus/theme-chalk/dark/css-vars.css"></style>
<style src="./assets/css/common.css"></style>
<style src="./assets/css/globalVars.css"></style>
<style lang="less">
#app {
  max-width: 100%;
  min-height: 100vh;
  position: relative;
  font-size: 14px;
  font-family: 'cangeryuti';
}
</style>
