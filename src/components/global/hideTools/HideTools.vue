<template>
  <Transition name="show-in">
    <div v-show="isShow" id="hide-tools">
      <div class="backtop" @click="backtop">
        <i class="iconfont icon-top-filling"></i>
      </div>
      <div class="theme" @click="toggleTheme()">
        <i v-if="isDark" class="iconfont icon-igw-f-moon"></i>
        <i v-else class="iconfont icon-Sun"></i>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { useGetScrollPosition } from '@/utils'
import { useGlobal } from '@/store'
const globalVars = useGlobal()
const y = useGetScrollPosition().y
const isShow = computed(() => y.value >= 100)
const isDark = useDark()
watch(isDark, val => {
  globalVars.isDark = val
})
const toggleTheme = useToggle(isDark)
const backtop = () => {
  if (document.documentElement) {
    let interval = setInterval(() => {
      const scrollY = document.documentElement.scrollTop
      const speed = scrollY / 5
      document.documentElement.scrollTop -= speed
      if (scrollY <= speed) {
        document.documentElement.scrollTop = 0
        clearInterval(interval)
      }
    }, 10)
  } else {
    let interval = setInterval(() => {
      const scrollY = document.body.scrollTop
      const speed = scrollY / 10
      document.body.scrollTop -= speed
      if (scrollY <= speed) {
        document.body.scrollTop = 0
        clearInterval(interval)
      }
    }, 10)
  }
}
</script>

<style scoped lang="less">
.show-in-enter-from,
.show-in-leave-to {
  transform: translateX(100%);
}
.show-in-enter-active,
.show-in-leave-active {
  transition: transform 0.5s;
}
#hide-tools {
  position: fixed;
  right: 0;
  bottom: 8%;
  z-index: var(--hide-tools-z-index);
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .backtop,
  .theme {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    background: #90d7ec;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .theme {
    margin-top: 0.5rem;
  }
}
</style>
