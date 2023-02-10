<template>
  <div :class="['top-bar', actionClass]">
    <h1 @click="home">C-y的个人博客</h1>
    <div class="navigators" :style="{ color: navigatorColor }">
      <div class="item" @click="search">
        <i class="iconfont icon-search"></i>
        <span class="title">搜索</span>
        <div
          class="border"
          :style="{ borderBottomColor: navigatorColor }"
        ></div>
      </div>
      <div class="item" @click="home">
        <i class="iconfont icon-home"></i>
        <span class="title">首页</span>
        <div
          class="border"
          :style="{ borderBottomColor: navigatorColor }"
        ></div>
      </div>
      <div class="item">
        <i class="iconfont icon-faxian"></i>
        <span class="title">发现</span>
        <i class="iconfont icon-select"></i>
        <div
          class="border"
          :style="{ borderBottomColor: navigatorColor }"
        ></div>
        <div class="select">
          <div class="sec-item" @click="classification">
            <i class="iconfont icon-guanli"></i>
            <span class="sec-title">归档</span>
          </div>
          <div class="sec-item" @click="cate">
            <i class="iconfont icon-fenlei"></i>
            <span class="sec-title">分类</span>
          </div>
        </div>
      </div>
      <div class="item" @click="link">
        <i class="iconfont icon-link"></i>
        <span class="title">友链</span>
        <div
          class="border"
          :style="{ borderBottomColor: navigatorColor }"
        ></div>
      </div>
      <div class="item" @click="barrage">
        <i class="iconfont icon-barrage-l"></i>
        <span class="title">留言</span>
        <div
          class="border"
          :style="{ borderBottomColor: navigatorColor }"
        ></div>
      </div>
      <div v-if="userStore.userInfo.id < 0" class="item" @click="login">
        <i class="iconfont icon-Profile"></i>
        <span class="title">登录</span>
        <div
          class="border"
          :style="{ borderBottomColor: navigatorColor }"
        ></div>
      </div>
      <div v-else class="item">
        <i class="iconfont icon-Profile"></i>
        <span class="title">我的</span>
        <i class="iconfont icon-select"></i>
        <div
          class="border"
          :style="{ borderBottomColor: navigatorColor }"
        ></div>
        <div class="select">
          <div class="sec-item" @click.stop="profile">
            <i class="iconfont icon-Profile"></i>
            <span class="sec-title">我的信息</span>
          </div>
          <div
            v-if="userStore.userInfo.type === '2'"
            class="sec-item"
            @click="creation"
          >
            <i class="iconfont icon-chuangzuo"></i>
            <span class="sec-title">创作中心</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, useCssModule, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGetScrollPosition } from '@/utils'
import { useGlobal, useUser } from '@/store'
const globalStore = useGlobal()
const userStore = useUser()
const router = useRouter()
const classes = useCssModule('top-bar')
const actionClass = ref('')
let actionName = ''
const navigatorColor = ref('')
const y = useGetScrollPosition().y
watch(y, (val: number, oldval: number) => {
  if (oldval - val <= 0) {
    // 正在向下滚动
    if (actionName === 'down') {
      return
    }
    actionClass.value = classes['down']
    actionName = 'down'
  } else if (oldval - val >= 0 && val !== 0) {
    // 正在向上滚动
    if (actionName === 'up') {
      return
    }
    actionName = 'up'
    navigatorColor.value = '#00000080'
    actionClass.value = classes['up']
  } else {
    // 触顶了
    navigatorColor.value = ''
    actionName = ''
    actionClass.value = ''
  }
})
const login = () => {
  globalStore.isLogin = true
}
const home = () => {
  router.push('/home')
}
const cate = () => {
  router.push('/cate')
}
const profile = () => {
  router.push('/profile')
}
const creation = () => {
  router.push('/creation')
}
const barrage = () => {
  router.push('/barrage')
}
const link = () => {
  router.push('/link')
}
const classification = () => {
  router.push('/classification')
}
const search = () => {
  globalStore.isSearch = true
}
</script>

<style lang="less" scoped module="top-bar">
.down {
  transform: translateY(-100%);
  animation: down 0.5s linear forwards;
}
@keyframes down {
  0% {
    opacity: 0.9;
  }
  50% {
    background: #fff;
  }
  100% {
    opacity: 0;
  }
}
.up {
  background: #ffffff90;
}
</style>

<style scoped lang="less">
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--top-bar-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 1rem;
  z-index: var(--top-bar-z-index);
  color: #fff;
  transition: all 0.5s;
  h1 {
    font-size: 1rem;
    font-family: 'cangeryuyang';
    margin-left: 3%;
    cursor: pointer;
  }
  .navigators {
    display: flex;
    align-items: center;
    .item {
      margin-right: 1rem;
      display: flex;
      align-items: center;
      font-weight: bold;
      position: relative;
      padding-bottom: 8px;
      cursor: pointer;
      .iconfont {
        margin-top: 3px;
        font-size: 18px;
      }
      .title {
        margin: 0 5px;
      }
      .border {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0%;
        border-bottom: 3px solid #90d7ec;
        transition: all 0.5s;
      }
      &:hover .border {
        width: 100%;
      }
      &:hover .select {
        display: block;
      }
      .select {
        position: absolute;
        top: 32px;
        left: 0;
        width: 100px;
        background: #fff;
        display: none;
        .sec-item {
          font-weight: normal;
          padding: 10px;
          display: flex;
          align-items: center;
          color: #000;
          .iconfont {
            font-size: 18px;
          }
          .sec-title {
            margin-left: 0.5rem;
            font-size: 12px;
          }
          &:hover {
            background: #90d7ec;
          }
        }
      }
    }
  }
}
</style>
