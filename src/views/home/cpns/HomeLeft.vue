<template>
  <div id="home-left">
    <template v-for="(item, index) in list" :key="item.id">
      <div
        v-intersection.class="'animate-into-bottom'"
        class="blog-item"
        @click="detail(item.id)"
      >
        <img
          v-if="!(index % 2)"
          v-intersection.lazy
          src="~@/assets/images/lazyload.jpg"
          :datasrc="item.surface"
          class="left-surface"
        />
        <div class="info">
          <div class="title">{{ item.title }}</div>
          <div class="detail">
            <div v-if="item.top === '1'" class="top">
              <i class="iconfont icon-ditu-tuding"></i>
              <span>置顶</span>
            </div>
            <div>
              <i class="iconfont icon-icon"></i>
              <span>发表于: {{ item.createAt.split(' ')[0] }}</span>
            </div>
            <div>
              <i class="iconfont icon-guanli"></i>
              <span>{{ item.cateName }}</span>
            </div>
            <div class="tags">
              <i class="iconfont icon-biaoqian"></i>
              <span v-for="tag in item.tags" :key="tag" class="tag-item">
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="content">{{ item.content }}</div>
        </div>
        <img
          v-if="index % 2"
          v-intersection.lazy
          src="~@/assets/images/lazyload.jpg"
          :datasrc="item.surface"
          class="right-surface"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import req from '@/request'
import { GETHOTARTICLELIST } from '@/request/apis'
const router = useRouter()
// 获取首页热门文章
const list = ref<any[]>([])
req
  .request({
    ...GETHOTARTICLELIST
  })
  .then(res => {
    const { success, list: hotArticleList } = res.data
    if (!success) {
      return ElMessage.warning({
        message: '获取首页热门文章失败，请稍后再试或联系管理员查看错误日志'
      })
    }
    list.value = hotArticleList
  })
const detail = (id: number) => {
  router.push({ name: 'articleDetail', params: { id } })
}
</script>

<style scoped lang="less">
#home-left {
  .blog-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    margin: 3rem 0;
    box-shadow: 0 0 10px 1px #cccccc90;
    transition: all 0.5s;
    &:hover {
      box-shadow: 1px 1px 10px 1px #90d7ec;
    }
    cursor: pointer;
    img {
      width: 380px;
      height: 210px;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
    img.right-surface {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    .info {
      flex: 1;
      padding: 0 1rem;
      .title {
        font-size: 1.5rem;
        font-weight: 600;
      }
      .detail {
        display: flex;
        flex-wrap: wrap;
        div {
          margin-top: 0.5rem;
          margin-right: 0.5rem;
          padding-right: 0.5rem;
          border-right: 1px solid;
          font-size: 12px;
          display: flex;
          align-items: center;
          .iconfont {
            margin-right: 5px;
          }
          &:last-child {
            border-right: none;
          }
        }
        .tags {
          span {
            margin-right: 0.5rem;
          }
        }
        .top {
          color: #ff6b6b;
        }
      }
      .content {
        max-width: 80%;
        margin-top: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
    }
  }
}
</style>
