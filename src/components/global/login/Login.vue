<template>
  <div class="wrapper" :style="{ zIndex }">
    <Transition name="login-show">
      <div
        v-if="globalVars.isLogin"
        id="login"
        :style="{ background: globalVars.isDark ? '#ffffff90' : '#00000090' }"
      >
        <i class="iconfont icon-close_circle close" @click="close"></i>
        <Code v-if="loginType === 0" @login-type="val => (loginType = val)" />
        <Password
          v-else-if="loginType === 1"
          @login-type="val => (loginType = val)"
        />
        <Forget
          v-else-if="loginType === 2"
          @login-type="val => (loginType = val)"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import Code from './cpns/Code.vue'
import Password from './cpns/Password.vue'
import Forget from './cpns/Forget.vue'
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useGlobal } from '@/store'
// 0为验证码登录，1为密码登录，2为忘记密码
const loginType: Ref<0 | 1 | 2> = ref(0)
const globalVars = useGlobal()
// 登录框层级，因为登录框是绝对定位，会覆盖页面，因此这里手动改层级
const zIndex = ref<1 | 0>(0)
watch(
  () => globalVars.isLogin,
  val => (val ? (zIndex.value = 1) : (zIndex.value = 0))
)
const close = () => {
  let timer = setTimeout(() => {
    // 应用完消失动画后再将层级设为0，不然zIndex直接为0会直接消失，看不到关闭的动画
    zIndex.value = 0
    clearTimeout(timer)
  }, 500)
  globalVars.isLogin = false
}
</script>

<style scoped lang="less">
.login-show-enter-from,
.login-show-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  #login {
    padding: 1rem;
    position: relative;
    width: 40%;
    height: 400px;
    border-radius: 5px;
    box-shadow: 0 0 10px 1px #cccccc80;
    transition: all 0.5s;
    z-index: var(--login-z-index);
    .close {
      position: absolute;
      right: 1rem;
      top: 1rem;
      font-size: 1.5rem;
      transition: all 0.5s;
      cursor: pointer;
      &:hover {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
