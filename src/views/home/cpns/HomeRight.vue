<template>
  <div id="home-right">
    <div class="info">
      <img src="~@/assets/images/avatar.jpg" />
      <div class="nickname">C y</div>
      <div class="intro">悟已往之不谏，知来者之可追。</div>
      <div class="data">
        <div class="item">
          <div>文章</div>
          <span>{{ articleCount }}</span>
        </div>
        <div class="item">
          <div>标签</div>
          <span>{{ tagCount }}</span>
        </div>
        <div class="item">
          <div>分类</div>
          <span>{{ cateCount }}</span>
        </div>
      </div>
      <ElButton type="success" class="subscribe" @click="subscribe">
        {{ globalStore.isSubscribe ? '已订阅' : '订阅' }}
        ({{ globalStore.totalSubscribe }})
      </ElButton>
    </div>
  </div>
  <div class="sticky-wrapper">
    <div class="tags">
      <div class="wrapper">
        <template v-for="(item, index) in tagList" :key="item.id">
          <span
            ref="tagItem"
            :style="{ ...item.style, animationDelay: `${index / 2}s` }"
            @click="filtrate(item)"
          >
            {{ item.name }}
          </span>
        </template>
      </div>
    </div>
    <div class="notice">
      <div class="title">
        <i class="iconfont icon-notice"></i>
        <span>公告</span>
      </div>
      <div class="content">你好~~~暂时没有公告~</div>
    </div>
    <div class="statement">
      <div class="title">
        <i class="iconfont icon-wxbbaobiao"></i>
        <span>网站资讯</span>
      </div>
      <div class="content">
        <p>已运行时间: {{ running_time }}</p>
        <p>总访问数: {{ viewCount }}次</p>
        <p>最后更新时间: {{ lastUpdateTime }}天前</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, effectScope, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGlobal, useUser } from '@/store'
import req from '@/request'
import { SUBSCRIBE, TAGLIST, GETDATA, STATISTICS } from '@/request/apis'
import { ALLOWSUBSCRIBE } from '@/constants/localStorage'
const globalStore = useGlobal()
const userStore = useUser()
const router = useRouter()
const subscribe = () => {
  let allowsubscribe: any = localStorage.getItem(ALLOWSUBSCRIBE)
  allowsubscribe = allowsubscribe ? Number(allowsubscribe) : 0
  const timeDifference = Date.now() - allowsubscribe
  if (allowsubscribe && timeDifference <= 1000 * 60) {
    return ElMessage.info({
      message: `操作频率太快啦~${Math.ceil(60 - timeDifference / 1000)}s后再试`
    })
  }
  localStorage.setItem(ALLOWSUBSCRIBE, Date.now() + '')
  if (userStore.userInfo.id <= 0) {
    return ElMessage.info({ message: '需要先登录~' })
  }
  const flag = !globalStore.isSubscribe
  req.request({ ...SUBSCRIBE(flag) }).then(res => {
    const { errMsg, success, message } = res.data
    if (!success) {
      return ElMessage.warning({ message: errMsg })
    }
    ElMessage.success({ message })
    if (flag) {
      // 这是一次订阅操作
      globalStore.isSubscribe = true
      globalStore.totalSubscribe += 1
    } else {
      // 这是一次取消订阅操作
      globalStore.isSubscribe = false
      globalStore.totalSubscribe -= 1
    }
  })
}

// 获取标签列表
const tagList = ref<any>([])
const randomColorList = ['#90d7ec', '#008c8c', 'lightblue', 'gray', '#748ffc']
const randomPosition = ['10px', '20px', '30px', '40px']
const randomFontSize = ['16px', '18px', '20px']
req
  .request({
    ...TAGLIST
  })
  .then(res => {
    // 遍历所有标签，给每个标签对象加一些随机样式
    const { list, success, errMsg } = res.data
    if (!success) {
      return ElMessage.warning({ message: errMsg })
    }
    list.forEach((item: any) => {
      item.style = {}
      item.style.color =
        randomColorList[Math.floor(Math.random() * randomColorList.length)]
      item.style.position =
        randomPosition[Math.floor(Math.random() * randomPosition.length)]
      item.style.fontSize =
        randomFontSize[Math.floor(Math.random() * randomFontSize.length)]
    })
    tagList.value = list
  })
const tagItem = ref()
const scope = effectScope()

scope.run(() => {
  // 监听标签ref对象的绑定，然后给每个标签元素添加鼠标移入移出事件
  // 监听完毕销毁监听
  watch(tagItem, tags => {
    for (let i = 0; i < tags.length; i++) {
      tags[i].addEventListener('mouseenter', function (this: HTMLElement) {
        // 给每个标签添加鼠标移入事件
        // 鼠标移入暂停所有标签的动画并降低其他标签透明度
        tags.forEach((item: HTMLElement) => {
          item.style.animationPlayState = 'paused'
          item.style.opacity = '0.5'
        })
        this.style.opacity = '1'
        this.style.fontWeight = 'bold'
      })
      tags[i].addEventListener('mouseleave', function (this: HTMLElement) {
        // 给每个标签添加鼠标移出事件
        // 但凡有一个标签鼠标移出则所有动画继续并还原样式
        tags.forEach((item: HTMLElement) => {
          item.style.animationPlayState = 'running'
          item.style.opacity = '1'
        })
        this.style.fontWeight = 'normal'
      })
    }
    scope.stop()
  })
})
// 获取文章、标签、分类数量信息
const articleCount = ref(0)
const tagCount = ref(0)
const cateCount = ref(0)
req
  .request({
    ...GETDATA
  })
  .then(res => {
    const { success, data } = res.data
    if (!success) {
      return ElMessage.warning({
        message: '获取信息数据失败，请稍后再试或联系管理员查看错误日志'
      })
    }
    articleCount.value = data.articleCount
    tagCount.value = data.tagCount
    cateCount.value = data.cateCount
  })
// 获取网站统计信息
const running_time = ref('')
const lastUpdateTime = ref(0)
const viewCount = ref(0)
req
  .request({
    ...STATISTICS
  })
  .then(res => {
    const { data, success } = res.data
    if (!success) {
      return ElMessage.warning({
        message: '获取网站统计信息失败，请稍后再试或联系管理员查看错误日志'
      })
    }
    const { run_hours, last_update, views } = data
    running_time.value = `${Math.floor(run_hours / 24)}天${run_hours % 24}小时`
    const lastDate = new Date(last_update)
    const now = new Date()
    lastUpdateTime.value = Math.ceil(
      (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    viewCount.value = views
  })

const filtrate = (item: any) => {
  const { id, name } = item
  router.push({ name: 'filtrate', params: { type: '1', id, name } })
}
</script>

<style scoped lang="less">
#home-right {
  position: relative;
  .info {
    box-shadow: 0 0 10px 1px #cccccc90;
    text-align: center;
    padding: 1rem 0;
    img {
      display: block;
      width: 90px;
      height: 90px;
      border-radius: 90px;
      margin: 0 auto;
    }
    .nickname {
      font-size: 18px;
      font-weight: 600;
      margin: 0.5rem 0;
    }
    .intro {
      background: url(http:///p1.qhimg.com/t012e62633a2eea392b.jpg) no-repeat;
      background-size: cover;
      background-position: 10%;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .data {
      width: 80%;
      margin: 1rem auto;
      display: flex;
      justify-content: space-around;
      .item {
        div {
          margin-bottom: 5px;
        }
      }
    }
    .subscribe {
      display: block;
      margin: auto;
      width: 90%;
    }
  }
}
.sticky-wrapper {
  position: sticky;
  top: 10px;
  .tags {
    padding: 1rem 0;
    box-shadow: 0 0 10px 1px #cccccc90;
    margin-top: 1rem;
    border-radius: 5px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    .wrapper {
      width: 80%;
      height: 80%;
      position: relative;
      span {
        position: absolute;
        transform-style: preserve-3d;
        transform-origin: 140px;
        animation: rot 6s linear forwards infinite;
        @keyframes rot {
          0% {
            transform: rotate3d(0, 0, 0, 0);
          }
          100% {
            transform: rotate3d(-1, 1, 0, 360deg);
          }
        }
        left: 10px;
        top: 10px;
        cursor: pointer;
      }
    }
  }
  .notice {
    margin: 1rem 0;
    padding: 1rem 0.5rem;
    border-radius: 5px;
    box-shadow: 0 0 10px 1px #cccccc90;
    .title {
      display: flex;
      align-items: center;
      .icon-notice {
        color: #fa5252;
        margin-right: 0.5rem;
        animation: rock 3s infinite;
        @keyframes rock {
          0% {
            transform: rotate(0);
          }
          5% {
            transform: rotate(-40deg);
          }
          10% {
            transform: rotate(0);
          }
          15% {
            transform: rotate(40deg);
          }
          20% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(0);
          }
        }
      }
    }
    .content {
      margin-top: 0.5rem;
      margin-left: 1.5rem;
    }
  }
  .statement {
    padding: 1rem 0.5rem;
    box-shadow: 0 0 10px 1px #cccccc90;
    border-radius: 5px;
    .title {
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 1rem;
        margin-right: 0.5rem;
      }
    }
    .content {
      margin-left: 1.5rem;
    }
  }
}
</style>
