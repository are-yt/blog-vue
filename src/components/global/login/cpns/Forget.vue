<template>
  <div id="login-forget">
    <div class="title">重置密码</div>
    <div class="form">
      <div class="item">
        <ElInput v-model="inputInfo.email" class="input" placeholder="邮箱" />
      </div>
      <div class="item">
        <ElInput v-model="inputInfo.code" class="input" placeholder="验证码" />
        <span @click="send">{{ stateText }}</span>
      </div>
      <div class="item">
        <ElInput
          v-model="inputInfo.newPassword"
          type="password"
          class="input"
          placeholder="新密码"
        />
      </div>
      <div class="item">
        <ElInput
          v-model="inputInfo.confirmPassword"
          type="password"
          class="input"
          placeholder="确认密码"
        />
      </div>
      <ElButton type="primary" @click="update">确认</ElButton>
    </div>
    <div class="switch">
      <span @click="emits('loginType', 0)">验证码登录</span>
      <span @click="emits('loginType', 1)">密码登录</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import req from '@/request'
import { SENDCODE, FORGET } from '@/request/apis'
import { useUser, useGlobal } from '@/store'
const emits = defineEmits<{
  (e: 'loginType', val: 0 | 1): void
}>()
const userStore = useUser()
const globalStore = useGlobal()
const stateText: Ref<'发送' | '重新发送' | number> = ref('发送')
const inputInfo = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})
let randomCode = ''
const send = () => {
  if (typeof stateText.value === 'number') {
    return
  }
  const email = inputInfo.email
  if (!email.trim()) {
    return ElMessage.warning({ message: '请先输入邮箱' })
  }
  randomCode = ''
  for (let i = 0; i < 6; i++) {
    randomCode += Math.floor(Math.random() * 10)
  }
  req
    .request({
      ...SENDCODE,
      data: {
        email,
        code: randomCode
      }
    })
    .then(res => {
      const { success, data, errMsg } = res.data
      if (!success || data !== '发送成功！') {
        return ElMessage.warning({ message: errMsg || data })
      }
      ElMessage.success({ message: '验证码已发送~' })
      stateText.value = 59
      let interval = setInterval(() => {
        if (typeof stateText.value === 'number') {
          if (stateText.value > 0) {
            stateText.value--
          } else {
            stateText.value = '重新发送'
            clearInterval(interval)
          }
        }
      }, 1000)
    })
}
const update = () => {
  // ...
  const { email, code, newPassword, confirmPassword } = inputInfo
  if (!email.trim() || !code.trim() || !newPassword.trim()) {
    return ElMessage.warning({ message: '错误输入' })
  } else if (newPassword !== confirmPassword) {
    return ElMessage.warning({ message: '请重新确认密码' })
  } else if (code !== randomCode) {
    return ElMessage.warning({ message: '验证码错误' })
  }
  req
    .request({
      ...FORGET,
      data: {
        email,
        newPassword
      }
    })
    .then(res => {
      const { success, errMsg } = res.data
      if (!success) {
        return ElMessage.warning({ message: errMsg })
      }
      ElMessage.success({ message: '修改成功,请重新登录' })
      userStore.clearUserInfo()
      globalStore.isLogin = false
    })
}
</script>

<style scoped lang="less">
#login-forget {
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
      span {
        width: 100px;
        text-align: center;
        color: #fff;
        font-weight: bold;
        cursor: pointer;
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
