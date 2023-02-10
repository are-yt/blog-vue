<template>
  <div id="comment-list">
    <div class="title">{{ props.allCount }}个评论</div>
    <div class="list">
      <template v-for="item in props.list" :key="item.id">
        <div class="item">
          <div class="fir-comment">
            <div class="left">
              <img v-if="item.avatar" :src="item.avatar" class="avatar" />
              <img v-else src="~@/assets/images/avatar.svg" class="avatar" />
              <div class="info">
                <div class="nickname">
                  <span>{{ item.nickname }}</span>
                  <span>发布于: {{ item.city }}</span>
                </div>
                <div class="time">{{ item.createAt.split(' ')[0] }}</div>
                <div class="content">
                  <span v-html="item.content"></span>
                </div>
                <div class="control">
                  <div
                    :style="
                      item.endorse.includes(userStore.userInfo.id)
                        ? { color: '#90d7ec' }
                        : ''
                    "
                    @click="endorse(item.id)"
                  >
                    <i class="iconfont icon-dianzan"></i>
                    <span>{{ item.endorse.length }}</span>
                  </div>
                  <div>
                    <i class="iconfont icon-barrage-l"></i>
                    <span>{{ item.replyList.length }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="right" @click.stop="replyStart(item.id, item.id, null)">
              回复
            </div>
          </div>
          <Comment
            v-if="currentReplyCommentId === item.id"
            :show-title="false"
            :placeholder="`回复给@${item.nickname}:`"
            @click.stop="currentReplyCommentId = item.id"
            @submit="submit"
          />
          <div class="sec-comment">
            <template
              v-for="item2 in [...item.replyList].splice(0, item.showCount)"
              :key="item2.id"
            >
              <div class="item">
                <div class="left">
                  <img v-if="item2.avatar" :src="item2.avatar" />
                  <img v-else src="~@/assets/images/avatar.svg" />
                  <div class="info">
                    <div class="nickname">
                      <span>{{ item2.nickname }}</span>
                      <span>发布于: {{ item2.city }}</span>
                    </div>
                    <div class="time">
                      <span>{{ item2.createAt.split(' ')[0] }}</span>
                      <span
                        class="control"
                        :style="
                          item2.endorse.includes(userStore.userInfo.id)
                            ? { color: '#90d7ec' }
                            : ''
                        "
                        @click="endorse(item2.id)"
                      >
                        <i class="iconfont icon-dianzan"></i>
                        <span>{{ item2.endorse.length }}</span>
                      </span>
                    </div>
                    <div class="content">
                      <span v-if="item2.reply_id" class="reply-info">
                        回复给@{{ item2.reply_name }}:
                      </span>
                      <span v-html="item2.content"></span>
                    </div>
                  </div>
                </div>
                <div
                  class="right"
                  @click.stop="replyStart(item2.id, item.id, item2.user_id)"
                >
                  回复
                </div>
              </div>
              <Comment
                v-if="currentReplyCommentId === item2.id"
                :show-title="false"
                :placeholder="`回复给@${item2.nickname}:`"
                @click.stop="currentReplyCommentId = item2.id"
                @submit="submit"
              />
            </template>
            <div
              v-if="item.replyList.length > item.showCount"
              class="more-reply"
            >
              <span>共{{ item.replyList.length }}条回复,</span>
              <span @click="showMoreReply(item.id)">查看更多</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <ElButton
      v-if="props.total > props.list.length"
      class="show-more"
      type="success"
      @click="loadmore"
      >更多评论</ElButton
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Comment from './Comment.vue'
import { useUser } from '@/store'
const props = defineProps<{
  list: any[]
  allCount: number
  total: number
}>()
const emits = defineEmits<{
  (e: 'endorse', commentId: number): void
  (e: 'reply', content: string, parent_id: any, reply_id: any): void
  (e: 'showMoreReply', commentId: number): void
  (e: 'loadmore'): void
}>()
const userStore = useUser()
const endorse = (commentId: number) => {
  emits('endorse', commentId)
}

// 点击回复按钮
let replyId = 0
let parentId = 0
const replyStart = (commentId: number, parent_id: any, reply_id: any) => {
  currentReplyCommentId.value = commentId
  replyId = reply_id
  parentId = parent_id
}

// 回复评论
const submit = (htmlContent: string) => {
  // ...
  emits('reply', htmlContent, parentId, replyId)
}

// 查看更多子评论
const showMoreReply = (commentId: number) => {
  emits('showMoreReply', commentId)
}

// 加载更多评论
const loadmore = () => {
  emits('loadmore')
}

// 记录正在回复的评论,用于在对应评论下展示回复框
const currentReplyCommentId = ref(0)
const clearReplyCommentId = () => {
  currentReplyCommentId.value = 0
}
defineExpose({ clearReplyCommentId })
</script>

<style scoped lang="less">
#comment-list {
  .title {
    font-size: 1rem;
    font-weight: bold;
    color: #ccc;
  }
  .list {
    margin: 1rem 0;
    .item {
      margin: 2rem 0;
      .fir-comment {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          flex: 1;
          img {
            width: 36px;
            height: 36px;
            border-radius: 36px;
          }
          .info {
            margin-left: 1rem;
            .nickname {
              span:nth-child(1) {
                font-weight: bold;
              }
              span:nth-child(2) {
                color: #00000080;
                margin-left: 0.5rem;
              }
            }
            .time {
              margin-top: 0.5rem;
              color: #ccc;
            }
            .content {
              margin-top: 0.5rem;
            }
            .control {
              display: flex;
              align-items: center;
              margin-top: 0.5rem;
              div {
                margin-right: 1rem;
                color: #00000080;
                span {
                  margin-left: 0.5rem;
                }
                &:nth-child(1) {
                  cursor: pointer;
                  transition: all 0.5s;
                  &:hover {
                    color: #90d7ec;
                    transform: scale(1.1);
                  }
                }
              }
            }
          }
        }
        .right {
          width: 50px;
          cursor: pointer;
          color: #90d7ec;
        }
      }
      .sec-comment {
        margin-left: calc(36px + 1rem);
        margin-top: 1rem;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left {
            flex: 1;
            display: flex;
            img {
              width: 36px;
              height: 36px;
              border-radius: 36px;
            }
            .info {
              margin-left: 1rem;
              .nickname {
                span:nth-child(1) {
                  font-weight: bold;
                }
                span:nth-child(2) {
                  color: #00000080;
                  margin-left: 0.5rem;
                }
              }
              .time {
                color: #ccc;
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                .control {
                  margin-left: 1rem;
                  color: #00000080;
                  cursor: pointer;
                  span {
                    margin-left: 0.5rem;
                  }
                  &:hover {
                    color: #90d7ec;
                  }
                }
              }
              .content {
                margin-top: 1rem;
                display: flex;
                .reply-info {
                  color: #00000080;
                  margin-right: 5px;
                }
              }
            }
          }
          .right {
            width: 50px;
            color: #90d7ec;
            cursor: pointer;
          }
        }
        .more-reply {
          font-size: 12px;
          span:nth-child(2) {
            color: #90d7ec;
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
    }
  }
  .show-more {
    display: block;
    margin: 0 auto;
  }
}
</style>
