<template>
  <div id="article-detail-main" :class="globalStore.isDark ? '' : 'default-bg'">
    <input ref="copyRef" class="copy" type="text" :value="articleLink" />
    <div v-if="props.articleInfo" class="container animate-into-bottom">
      <div class="left">
        <Viewer
          ref="viewerRef"
          class="viewer"
          :plugins="plugins"
          :locale="locale"
          :value="props.articleInfo.content"
        />
        <div class="intro">
          <div @click="copy">
            <span>文章链接: </span>
            {{ articleLink }}
            <i class="iconfont icon-copy" title="复制链接"></i>
          </div>
          <div>
            <span>版权说明:</span>
            本站文章除特别说明，都为原创，转载请标明出处。
          </div>
        </div>
        <div class="tags-and-cate">
          <div>
            <i class="iconfont icon-guanli"></i>
            <span @click="filtrateForCate">
              {{ props.articleInfo.cate.name }}
            </span>
          </div>
          <div>
            <i class="iconfont icon-biaoqian1"></i>
            <span
              v-for="tag in props.articleInfo.tags"
              :key="tag.id"
              @click="filtrateForTag(tag.id, tag.name)"
            >
              {{ tag.name }}
            </span>
          </div>
        </div>
        <Comment ref="commentRef" @submit="submit" />
        <CommentList
          ref="commentListRef"
          :list="list"
          :total="total"
          :all-count="allCount"
          @endorse="endorse"
          @show-more-reply="showMoreReply"
          @loadmore="getCommentList"
          @reply="reply"
        />
      </div>
      <div class="right">
        <div class="directory">
          <div class="title">
            <i class="iconfont icon-Directorytree"></i>
            <span>目录</span>
          </div>
          <template v-if="!titleList.length">
            <div v-if="isFormatedDirectory">正在生成目录...</div>
            <div v-else>这篇文章没有目录~</div>
          </template>
          <div
            v-for="item in titleList"
            :key="item.id"
            :style="{
              ...item.style,
              color: item.show ? '#fff' : '',
              background: item.show ? '#90d7ec' : ''
            }"
            class="item"
            @click="go(item.id)"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Comment from '@/components/common/comment/Comment.vue'
import CommentList from '@/components/common/comment/CommentList.vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import locale from 'bytemd/locales/zh_Hans.json'
import { Viewer } from '@bytemd/vue-next'
import 'bytemd/dist/index.css'
import gfm from '@bytemd/plugin-gfm'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import breaks from '@bytemd/plugin-breaks'
import hignLight from '@bytemd/plugin-highlight'
import gemoji from '@bytemd/plugin-gemoji'
import 'highlight.js/styles/github.css'
import { useGlobal, useUser } from '@/store'
import { useGetScrollPosition } from '@/utils'
import req from '@/request'
import {
  SENDARTICLECOMMENT,
  GETARTICLECOMMENTLIST,
  ENDORSEARTICLECOMMENT
} from '@/request/apis'
const y = useGetScrollPosition().y
const globalStore = useGlobal()
const userStore = useUser()
const router = useRouter()
const plugins = [gfm(), mediumZoom(), breaks(), hignLight(), gemoji()]
const props = defineProps<{
  articleInfo: any
}>()
watch(
  () => props.articleInfo,
  () => {
    getCommentList()
  }
)
const articleLink = location.href
const copyRef = ref<HTMLInputElement>()
const copy = () => {
  copyRef.value?.select()
  document.execCommand('copy', false)
}
document.addEventListener('copy', () => {
  ElMessage.success({ message: '复制成功' })
})

const viewerRef = ref()
const titleList: any = ref([])
const isFormatedDirectory = ref(true)
watch(viewerRef, () => {
  // 文章DOM已绑定
  // 获取文章DOM的所有子节点
  const childNodes = document.querySelector('.viewer')?.children ?? []
  // 封装计算元素距离页面顶部的方法
  const getDistanceOffsetTop = (el: any) => {
    let top = 0
    while (el) {
      top += el.offsetTop
      el = el.offsetParent
    }
    return top
  }
  const titleTagList = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  // 遍历所有子节点，找到标题元素
  setTimeout(() => {
    // 子元素的渲染需要一点时间，因此这里给个延时，否则获取的每个标题元素与页面顶部之间的距离不准确
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i]
      const tagName = node.tagName.toLowerCase()
      if (titleTagList.includes(tagName)) {
        // 遍历到了标题标签，获取标题内容和距离信息，添加进数组
        const title = node.textContent
        const top = getDistanceOffsetTop(node)
        const titleObj = {
          tagName,
          title,
          top,
          show: false,
          id: i,
          style: {
            textIndent: `${parseInt(tagName.replace('h', ''))}rem`
          }
        }
        titleList.value.push(titleObj)
      }
    }
    titleList.value.length ? (titleList.value[0].show = true) : ''
    isFormatedDirectory.value = false
  }, 2000)
  // 默认当前处于第一个标题
})
// 监听滚动，当滚动距离+页面可视距离 > 某个标题元素距离顶部距离时，
// 代表这个滚动到了这个标题元素这里，给这个标题元素设置样式
let timer: any = null
watch(y, (scrollY: number) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    for (let i = 0; i < titleList.value.length; i++) {
      if (titleList.value[i].top <= scrollY) {
        titleList.value.forEach((item: any) => (item.show = false))
        titleList.value[i].show = true
      }
    }
  }, 500)
})

const commentRef = ref<InstanceType<typeof Comment>>()
const commentListRef = ref<InstanceType<typeof CommentList>>()
// 发布顶级评论
const submit = (htmlContent: string) => {
  if (userStore.userInfo.id < 0) {
    return ElMessage.warning({ message: '需要先登录' })
  }
  req
    .request({
      ...SENDARTICLECOMMENT(props.articleInfo.id),
      data: {
        content: htmlContent,
        replyId: null,
        parentId: null
      }
    })
    .then(res => {
      const { success, city, commentId } = res.data
      if (!success) {
        return ElMessage.warning({
          message: '发布评论失败，请稍后再试或联系管理员查看错误日志'
        })
      }
      ElMessage.success({ message: '评论成功' })
      commentRef.value?.resetContent()
      list.value.unshift({
        avatar: userStore.userInfo.avatar,
        createAt: '刚刚',
        id: commentId,
        city,
        content: htmlContent,
        endorse: [],
        nickname: userStore.userInfo.nickname,
        parent_id: null,
        reply_id: null,
        replyList: [],
        user_id: userStore.userInfo.id,
        showCount: 4
      })
      allCount.value++
    })
}
// 获取评论分页数据
let offset = 0
const size = 6
const total = ref(0)
const list = ref<any[]>([])
const allCount = ref(0)
const getCommentList = () => {
  req
    .request({
      ...GETARTICLECOMMENTLIST(offset, size, props.articleInfo.id)
    })
    .then(res => {
      const {
        total: totalComments,
        allCount: allCountComments,
        success,
        list: commentList
      } = res.data
      if (!success) {
        return ElMessage.warning({
          message: '获取评论数据失败，请稍后再试或联系管理员查看错误日志'
        })
      }
      total.value = totalComments
      allCount.value = allCountComments
      commentList.forEach((item: any) => (item.showCount = 4))
      list.value.push(...commentList)
      offset++
    })
}

// 点赞
const endorse = (commentId: number) => {
  req
    .request({
      ...ENDORSEARTICLECOMMENT(commentId)
    })
    .then(res => {
      const { endorse, success } = res.data
      if (!success) {
        return ElMessage.warning({ message: '点赞失败，请稍后再试' })
      }
      // 找到点赞操作的评论实时更新
      const id = userStore.userInfo.id
      for (let i = 0; i < list.value.length; i++) {
        if (list.value[i].id === commentId) {
          if (endorse) {
            // 这是点赞操作
            list.value[i].endorse.push(id)
          } else {
            // 取消点赞操作
            const index = list.value[i].endorse.findIndex(
              (item: any) => item === id
            )
            list.value[i].endorse.splice(index, 1)
          }
          break
        }
        for (let j = 0; j < list.value[i].replyList.length; j++) {
          if (list.value[i].replyList[j].id === commentId) {
            if (endorse) {
              // 点赞
              list.value[i].replyList[j].endorse.push(id)
            } else {
              // 取消点赞
              const index = list.value[i].replyList[j].endorse.findIndex(
                (item: any) => item === commentId
              )
              list.value[i].replyList[j].endorse.splice(index, 1)
            }
          }
        }
      }
      if (endorse) {
        ElMessage.success({ message: '点赞成功' })
      } else {
        ElMessage.success({ message: '取消点赞' })
      }
    })
}

// 展示更多子评论
const showMoreReply = (commentId: number) => {
  const index = list.value.findIndex((item: any) => item.id === commentId)
  list.value[index].showCount += 4
}

// 回复评论
const reply = (htmlContent: string, parentId: number, replyId: number) => {
  if (userStore.userInfo.id < 0) {
    return ElMessage.warning({ message: '请先登录' })
  }
  req
    .request({
      ...SENDARTICLECOMMENT(props.articleInfo.id),
      data: {
        content: htmlContent,
        parentId,
        replyId
      }
    })
    .then(res => {
      const { city, commentId, success } = res.data
      if (!success) {
        return ElMessage.warning({ message: '回复评论失败，请稍后再试' })
      }
      ElMessage.success({ message: '评论成功' })
      commentListRef.value?.clearReplyCommentId()
      allCount.value++
      // 找到回复的评论实时添加
      let reply_name = ''
      let isFind = false
      if (replyId) {
        for (let i = 0; i < list.value.length; i++) {
          list.value[i].replyList.find((item: any) => {
            if (item.user_id === replyId) {
              reply_name = item.nickname
              isFind = true
              return true
            }
          })
          if (isFind) {
            break
          }
        }
      }
      const index = list.value.findIndex((item: any) => item.id === parentId)
      list.value[index].replyList.unshift({
        avatar: userStore.userInfo.avatar,
        createAt: '刚刚',
        id: commentId,
        city,
        content: htmlContent,
        endorse: [],
        nickname: userStore.userInfo.nickname,
        parent_id: parentId,
        reply_id: replyId,
        reply_name,
        user_id: userStore.userInfo.id
      })
    })
}

const filtrateForCate = () => {
  const { id, name } = props.articleInfo.cate
  router.push({ name: 'filtrate', params: { id, name, type: 0 } })
}
const filtrateForTag = (id: number, name: string) => {
  router.push({ name: 'filtrate', params: { type: 1, name, id } })
}

const go = (id: number) => {
  const index = titleList.value.findIndex((item: any) => item.id === id)
  titleList.value.forEach((item: any) => (item.show = false))
  titleList.value[index].show = true
  const top = titleList.value[index].top
  const scrollY = y.value
  if (scrollY <= top) {
    // 要去的地方在当前之下
    const speed = (top - scrollY) / 8
    let interval = setInterval(() => {
      if (y.value + speed >= top) {
        if (document.body.scrollTop) {
          document.body.scrollTop = top + 10
        } else {
          document.documentElement.scrollTop = top + 10
        }
        clearInterval(interval)
      } else if (document.body.scrollTop) {
        document.body.scrollTop += speed
      } else {
        document.documentElement.scrollTop += speed
      }
    }, 20)
  } else {
    // 要导航的文章内容在当前位置之上
    const speed = (scrollY - top) / 8
    let interval = setInterval(() => {
      if (y.value - speed <= top) {
        if (document.body.scrollTop) {
          document.body.scrollTop = top + 10
        } else {
          document.documentElement.scrollTop = top + 10
        }
        clearInterval(interval)
      } else if (document.body.scrollTop) {
        document.body.scrollTop -= speed
      } else {
        document.documentElement.scrollTop -= speed
      }
    }, 20)
  }
}
</script>

<style scoped lang="less">
#article-detail-main {
  min-height: calc(100vh - var(--top-info-height));
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .copy {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
  .container {
    width: 80%;
    display: flex;
    position: relative;
    justify-content: space-between;
    margin: 2rem 0;
    .left {
      flex: 0.96;
      padding: 1rem;
      box-shadow: 0 0 10px 1px #cccccc80;
      border-radius: 10px;
      .viewer {
        line-height: 1.5rem;
        :deep(img) {
          width: 100%;
          max-height: 500px;
        }
        :deep(.bytemd) {
          line-height: 1.5rem;
        }
        :deep(p) {
          text-indent: 2rem;
        }
      }
      .intro {
        padding: 0 1rem;
        border-radius: 5px;
        border: 1px solid #90d7ec;
        div {
          margin: 1rem 0;
          color: #00000080;
          span {
            color: #90d7ec;
          }
          .iconfont {
            margin-left: 0.5rem;
            color: #90d7ec;
            cursor: pointer;
          }
        }
      }
      .tags-and-cate {
        div {
          margin: 1rem 0;
          display: flex;
          align-items: center;
          span {
            margin-left: 1rem;
            color: #00000080;
            cursor: pointer;
            &:hover {
              color: #90d7ec;
            }
          }
        }
      }
    }
    .right {
      width: 220px;
      position: relative;
      .directory {
        position: sticky;
        top: 10px;
        padding: 1rem;
        border-radius: 5px;
        box-shadow: 0 0 10px 1px #cccccc80;
        .title {
          margin-bottom: 1rem;
          .iconfont {
            font-size: 16px;
          }
          span {
            font-weight: bold;
            margin-left: 0.5rem;
          }
        }
        .item {
          display: block;
          text-decoration: none;
          color: #000;
          padding: 0.5rem;
          background: #ffffff80;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
