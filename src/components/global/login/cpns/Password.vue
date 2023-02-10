<template>
  <div id="login-password">
    <div class="title">登录-密码</div>
    <div class="form">
      <div class="item">
        <ElInput
          v-model="inputInfo.email"
          class="input"
          placeholder="邮箱"
          @keyup.enter="login"
        />
      </div>
      <div class="item">
        <ElInput
          v-model="inputInfo.password"
          type="password"
          class="input"
          placeholder="密码"
          @keyup.enter="login"
        />
      </div>
      <ElButton type="primary" @click="login"> 登录(默认密码为邮箱) </ElButton>
    </div>
    <div class="switch">
      <span @click="emits('loginType', 0)">验证码登录</span>
      <span @click="emits('loginType', 2)">找回密码</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import req from '@/request'
import { LOGIN } from '@/request/apis'
import { useUser, useGlobal } from '@/store'
const userStore = useUser()
const globalStore = useGlobal()
const emits = defineEmits<{
  (e: 'loginType', val: 0 | 2): void
}>()
const inputInfo = reactive({
  email: '',
  password: ''
})
const login = () => {
  // ...
  const { email, password } = inputInfo
  if (!email.trim() || !password.trim()) {
    return ElMessage.warning({ message: '错误输入' })
  }
  req
    .request({
      ...LOGIN,
      data: {
        type: 'password',
        email,
        password
      }
    })
    .then(res => {
      const {
        errMsg,
        nickname,
        success,
        token,
        type,
        message,
        id,
        avatar,
        subscribe
      } = res.data
      if (!success) {
        return ElMessage.warning({ message: errMsg })
      }
      ElMessage.success({ message })
      userStore.updateUserInfo({
        nickname,
        id,
        token,
        type,
        avatar: avatar ?? ''
      })
      globalStore.isLogin = false
      if (subscribe) {
        globalStore.isSubscribe = true
      }
    })
}
</script>

<style scoped lang="less">
#login-password {
  .title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #ffffff80;
  }
  .form {
    width: 90%;
    margin: 1rem auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 300px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .input {
        flex: 1;
        background: #ffffff80;
      }
    }
  }
  .switch {
    width: 90%;
    margin: 1rem auto;
    color: #fff;
    display: flex;
    justify-content: space-between;
    span {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
