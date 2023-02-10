<template>
  <div id="barrage">
    <div class="control">
      <input v-model="content" type="text" placeholder="这里留言" />
      <span @click="send">确定</span>
    </div>
    <div ref="barrageWrapper" class="wrapper">
      <template v-for="item in showList" :key="item.id">
        <div
          class="item"
          :style="item.style"
          :class="
            userStore.userInfo.id === item.user_id ? 'self-leaveword' : ''
          "
          :title="item.createAt"
        >
          <img v-if="item.avatar" :src="item.avatar" />
          <img v-else src="~@/assets/images/avatar.svg" />
          <div class="nickname">{{ item.nickname }}:</div>
          <div class="content">{{ item.content }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, effectScope, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import req from '@/request'
import { LEAVEWORD, GETLEAVEWORDLIST } from '@/request/apis'
import { useUser, useGlobal } from '@/store'
const userStore = useUser()
const globalStore = useGlobal()
// 这个页面不显示footer
globalStore.isShowFooter = false
const content = ref('')
const list = ref<any[]>([])
const showList = ref<any[]>([])
// 获取留言列表
const getList = () => {
  req
    .request({
      ...GETLEAVEWORDLIST
    })
    .then(res => {
      const { success, data } = res.data
      if (!success) {
        return ElMessage.warning({
          message: '获取留言列表失败，请稍后再试或联系管理员查看错误日志'
        })
      }
      list.value = data
    })
}
getList()
// 发送留言
const send = () => {
  if (userStore.userInfo.id <= 0) {
    return ElMessage.warning({ message: '需要先登录~' })
  }
  if (content.value.trim().length < 2 || content.value.trim().length > 100) {
    return ElMessage.warning({ message: '留言内容规则: 2<=length<=100' })
  }
  req
    .request({
      ...LEAVEWORD,
      data: {
        content: content.value
      }
    })
    .then(res => {
      const { success, errMsg } = res.data
      if (!success) {
        return ElMessage.warning({ message: errMsg })
      }
      ElMessage.success({ message: '留言成功' })
      showList.value.push({
        content: content.value,
        id: Date.now(),
        avatar: userStore.userInfo.avatar,
        nickname: userStore.userInfo.nickname,
        user_id: userStore.userInfo.id,
        createAt: '刚刚',
        style: {
          top: 0,
          animationDuration: 10 - Math.floor(Math.random() * 3) + 's'
        }
      })
      list.value.push({ content: content.value, id: userStore.userInfo.id })
      content.value = ''
    })
}
// 用于获取弹幕外层容器的高度，并计算弹幕可分为多少层，并监听animationend事件委托用于销毁弹幕元素
const barrageWrapper = ref<HTMLElement>()
// 每层弹幕的高度
const tierHeight = 80
// 可分为多少层，每波弹幕数量取决于这个层级数量
let tierCount = 0
// 获取当前视图宽度，得到弹幕位移距离
const moveDistance =
  -(document.body.clientWidth || document.documentElement.clientWidth) + 'px'
const scope = effectScope()
let playedBarrageCount = 0
scope.run(() => {
  watch(barrageWrapper, () => {
    // 获取弹幕外层的总高度
    const height = getComputedStyle(
      barrageWrapper.value as HTMLElement
    ).getPropertyValue('height')
    // 根据弹幕高度获取最多可以显示多少层弹幕
    tierCount = Math.floor(parseInt(height) / tierHeight)
    barrageWrapper.value?.addEventListener('webkitAnimationEnd', (el: any) => {
      playedBarrageCount++
      if (playedBarrageCount === list.value.length) {
        // 最后一个弹幕都消失了，则再重新播放弹幕
        playedBarrageCount = 0
        showList.value = []
      }
      el.target.style.display = 'none'
    })
    watch(list, () => {
      // 还要监听一下list，因为在弹幕外层容器绑定完成时留言数据可能还没有请求回来
      // 方案一：先加一波弹幕进去，因为定时器延时会导致第一波弹幕延后加载导致空屏一段时间
      // for (let i = 0; i < tierCount; i++) {
      //   if (showList.value.length === list.value.length) {
      //     return
      //   } else {
      //     const obj = list.value[showList.value.length]
      //     obj.style = {}
      //     obj.style.top = i * tierHeight + 'px'
      //     obj.style.animationDuration = 10 - Math.floor(Math.random() * 3) + 's'
      //     showList.value.push(obj)
      //   }
      // }
      // 方案二：不提前加载第一波弹幕，给出一个提示弹幕作为开头
      showList.value.push({
        user_id: 0,
        createAt: '',
        content: `${list.value.length}条弹幕即将来袭，自动轮播已开启~`,
        avatar: '',
        nickname: '系统弹幕',
        style: {
          top: Math.floor(tierCount / 2) * tierHeight + 'px',
          animationDuration: '8s'
        }
      })
      setInterval(() => {
        // 每一波显示弹幕的数量取决于有多少层数的弹幕
        for (let i = 0; i < tierCount; i++) {
          if (showList.value.length === list.value.length) {
            // 循环播放弹幕，不终止定时器
            // clearInterval(timer)
            return
          } else {
            const obj = list.value[showList.value.length]
            obj.style = {}
            obj.style.top = i * tierHeight + 'px'
            obj.style.animationDuration =
              10 - Math.floor(Math.random() * 3) + 's'
            showList.value.push(obj)
          }
        }
      }, 3000)
      scope.stop()
    })
  })
})
onBeforeUnmount(() => {
  // 离开这个页面后恢复footer的展示
  globalStore.isShowFooter = true
})
</script>

<style scoped lang="less">
#barrage {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: url('http:///p7.qhimg.com/t01e34e13395a83c8f5.jpg') no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  .control {
    width: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    /* 控制区域下面还有弹幕外层盒子遮盖，因此这里设置一个z-index */
    z-index: 1;
    input {
      width: 100px;
      height: 25px;
      background: transparent;
      border: 2px solid #fff;
      border-radius: 10px;
      transition: all 0.5s;
      color: #fff;
      &:focus {
        width: 140px;
        outline: 0;
      }
    }
    span {
      flex: 0.9;
      height: 25px;
      border-radius: 10px;
      border: 2px solid #fff;
      text-align: center;
      line-height: 25px;
      cursor: pointer;
    }
  }
  .wrapper {
    position: absolute;
    top: var(--top-bar-height);
    left: 0;
    right: 0;
    height: calc(100vh - var(--top-bar-height));
    .item {
      position: absolute;
      right: 0;
      top: 0;
      padding: 5px;
      border-radius: 20px;
      background: #ffffff80;
      display: flex;
      align-items: center;
      cursor: pointer;
      animation: barrage 5s linear;
      img {
        width: 30px;
        height: 30px;
        border-radius: 30px;
      }
      .nickname {
        font-weight: bold;
        margin-left: 10px;
      }
      .content {
        margin-left: 10px;
      }
      @keyframes barrage {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(v-bind('moveDistance'));
        }
      }
      &:hover {
        animation-play-state: paused;
      }
    }
    .self-leaveword {
      background: #90d7ec;
      color: #fff;
    }
  }
}
</style>
