<template>
  <div
    id="link-main"
    :class="globalStore.isDark ? '' : 'default-bg'"
    @click="handleClick"
  >
    <div class="container animate-into-bottom">
      <div class="links">
        <div class="title">
          <i class="iconfont icon-link"></i>
          <span>大佬链接</span>
        </div>
        <div class="list">
          <div
            v-for="item in links"
            :key="item.id"
            class="item"
            @click="open(item.link)"
          >
            <img :src="item.avatar" />
            <div class="desc">
              <div class="name">{{ item.name }}</div>
              <p class="info">{{ item.intro }}</p>
            </div>
            <div class="layer"></div>
          </div>
        </div>
      </div>
      <div class="add-info">
        <div class="title">
          <i class="iconfont icon-icon_tianjia"></i>
          <span>添加</span>
        </div>
        <div class="info-detail">
          <div class="desc">在下方评论以下格式内容可以上友链哦~</div>
          <div class="fragment">
            <div>名称: c-y的个人博客</div>
            <div>说明: c-y的个人向博客站点</div>
            <div>展示头像: xxxxxxxxxxxxxxxx</div>
            <div>链接地址: xxxxxxxxxxx</div>
          </div>
        </div>
      </div>
      <Comment ref="commentRef" @submit="submit" />
      <CommentList
        ref="commentListRef"
        :list="list"
        :total="total"
        :all-count="allCount"
        @endorse="endorse"
        @reply="reply"
        @show-more-reply="showMoreReply"
        @loadmore="getCommentList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Comment from '@/components/common/comment/Comment.vue'
import CommentList from '@/components/common/comment/CommentList.vue'
import { useGlobal, useUser } from '@/store'
import req from '@/request'
import {
  SUBMITLINKCOMMENT,
  GETLINKCOMMENTLIST,
  LINKCOMMENTENDORSE,
  GETLINKLIST
} from '@/request/apis'
const globalStore = useGlobal()
const userStore = useUser()
const commentRef = ref<InstanceType<typeof Comment>>()
const commentListRef = ref<InstanceType<typeof CommentList>>()
// 获取友链列表
const links = ref<any[]>([])
req
  .request({
    ...GETLINKLIST
  })
  .then(res => {
    const { success, list } = res.data
    if (!success) {
      return ElMessage.warning({ message: '获取友链数据失败' })
    }
    links.value = list
  })
// 发布顶层评论
const submit = (htmlContent: string) => {
  req
    .request({
      ...SUBMITLINKCOMMENT,
      data: {
        content: htmlContent,
        reply_id: null,
        parent_id: null
      }
    })
    .then(res => {
      const { success, comment_id, city } = res.data
      if (!success) {
        return ElMessage.warning({
          message: '发表评论失败，请稍后再试或联系管理员查看错误日志'
        })
      }
      ElMessage.success({ message: '发表成功' })
      commentRef.value?.resetContent()
      list.value.unshift({
        avatar: userStore.userInfo.avatar,
        createAt: '刚刚',
        id: comment_id,
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

// 发布回复评论
const reply = (htmlContent: string, parent_id: number, reply_id: number) => {
  req
    .request({
      ...SUBMITLINKCOMMENT,
      data: {
        content: htmlContent,
        parent_id,
        reply_id: reply_id ?? null
      }
    })
    .then(res => {
      const { success, city, comment_id } = res.data
      if (!success) {
        return ElMessage.warning({
          message: '发布评论失败，请稍后再试或联系管理员查看错误日志'
        })
      }
      ElMessage.success({ message: '发布评论成功' })
      commentListRef.value?.clearReplyCommentId()
      for (let i = 0; i < list.value.length; i++) {
        if (list.value[i].id === parent_id) {
          let reply_name = ''
          if (reply_id) {
            // 找到被回复的用户名
            list.value.find((item: any) => {
              if (item.user_id === reply_id) {
                console.log(item.nickname)
                reply_name = item.nickname
                return true
              }
              item.replyList.find((item: any) => {
                if (item.user_id === reply_id) {
                  reply_name = item.nickname
                  return true
                }
              })
            })
          }
          list.value[i].replyList.unshift({
            avatar: userStore.userInfo.avatar,
            createAt: '刚刚',
            id: comment_id,
            city,
            content: htmlContent,
            endorse: [],
            nickname: userStore.userInfo.nickname,
            parent_id,
            reply_id,
            reply_name,
            user_id: userStore.userInfo.id
          })
        }
      }
      allCount.value++
    })
}

// 查看更多子评论
const showMoreReply = (commentId: number) => {
  const index = list.value.findIndex((item: any) => item.id === commentId)
  list.value[index].showCount += 4
}

// 获取评论列表
let offset = 0
let size = 4
const list = ref<any[]>([])
const total = ref(0)
const allCount = ref(0)
const getCommentList = () => {
  req
    .request({
      ...GETLINKCOMMENTLIST(offset, size)
    })
    .then(res => {
      const {
        success,
        total: totalCount,
        list: comments,
        allCount: allComments
      } = res.data
      if (!success) {
        return ElMessage.warning({
          message: '获取评论数据失败，请稍后再试或联系管理员查看错误日志'
        })
      }
      comments.forEach((item: any) => (item.showCount = 4))
      total.value = totalCount
      list.value.push(...comments)
      allCount.value = allComments
      offset++
    })
}
getCommentList()

// 点赞
const endorse = (commentId: number) => {
  if (userStore.userInfo.id < 0) {
    return ElMessage.warning({ message: '请先登录' })
  }
  req
    .request({
      ...LINKCOMMENTENDORSE(commentId)
    })
    .then(res => {
      const { endorse, message, success } = res.data
      if (!success) {
        return ElMessage.warning({ message: '点赞失败，请稍后再试' })
      }
      ElMessage.success({ message })
      const id = userStore.userInfo.id
      for (let i = 0; i < list.value.length; i++) {
        if (list.value[i].id === commentId) {
          if (endorse) {
            // 这是点赞操作
            list.value[i].endorse.push(id)
          } else {
            // 取消点赞操作
            const index = list.value[i].endorse.findIndex(
              (item: number) => item === id
            )
            list.value[i].endorse.splice(index, 1)
          }
          break
        }
        for (let j = 0; j < list.value[i].replyList.length; j++) {
          if (list.value[i].replyList[j].id === commentId) {
            if (endorse) {
              // 点赞操作
              list.value[i].replyList[j].endorse.push(id)
            } else {
              // 取消点赞操作
              const index = list.value[i].replyList[j].endorse.findIndex(
                (item: number) => item === id
              )
              list.value[i].replyList[j].endorse.splice(index, 1)
            }
          }
        }
      }
    })
}

const handleClick = () => {
  commentListRef.value?.clearReplyCommentId()
}

// 打开外链
const open = (link: string) => {
  window.open(link, '__target')
}
</script>

<style scoped lang="less">
#link-main {
  min-height: calc(100vh - var(--top-info-height));
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    width: 60%;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 0 10px 1px #cccccc80;
    margin: 2rem 0;
    .links {
      .title {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        font-weight: bold;
        color: #90d7ec;
        .iconfont {
          font-size: 2rem;
          margin-right: 0.5rem;
        }
      }
      .list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 1rem;
        .item {
          width: 246px;
          border-radius: 10px;
          padding: 1rem;
          box-shadow: 0 0 10px 1px #cccccc80;
          cursor: pointer;
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1rem 0;
          img {
            width: 80px;
            height: 80px;
            border-radius: 80px;
            position: relative;
            transition: transform 0.5s;
          }
          .desc {
            position: relative;
            flex: 0.9;
            text-align: center;
            .name {
              font-weight: bold;
              font-size: 1.2rem;
            }
            .info {
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              color: #00000080;
            }
          }
          .layer {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 0;
            height: 0;
            z-index: -1;
            background: #90d7ec50;
            border-radius: inherit;
            transition: all 0.5s;
          }
          &:hover .layer {
            display: block;
            width: 100%;
            height: 100%;
          }
          &:hover img {
            transform: rotate(360deg);
          }
        }
      }
    }
    .add-info {
      margin: 1rem 0;
      .title {
        display: flex;
        align-items: center;
        font-size: 1.2rem;
        color: #90d7ec;
        .iconfont {
          font-size: 1.2rem;
          margin: 3px 0.5rem 0 0;
        }
      }
      .info-detail {
        margin: 1rem 0;
        .fragment {
          width: 90%;
          padding: 1rem;
          border-radius: 10px;
          border-left: 5px solid #90d7ec;
          background: #90d7ec50;
          div {
            margin: 10px 0;
          }
        }
        .desc {
          margin: 1rem 0;
        }
      }
    }
  }
}
</style>
