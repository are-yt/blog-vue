<template>
  <div id="classification-main" :class="globalStore.isDark ? '' : 'default-bg'">
    <div class="container animate-into-bottom">
      <div
        v-for="item in list"
        :key="item.id"
        class="time-line"
        @click="filtrate(item.id)"
      >
        <div class="title">{{ item.title }}</div>
        <div class="time" :style="globalStore.isDark ? 'color: #ffffff80' : ''">
          {{ item.createAt.split(' ')[0] }}
        </div>
        <div class="content">
          <img :src="item.surface" />
          <div class="intro">
            <span :style="globalStore.isDark ? 'color: #ffffff80' : ''">
              {{ item.content }}
            </span>
          </div>
        </div>
      </div>
      <div class="pagination-wrapper">
        <ElPagination
          class="pagination"
          :page-size="size"
          :total="total"
          layout="prev,pager,next"
          :hide-on-single-page="true"
          :background="true"
          @current-change="choosePage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import req from '@/request'
import { GETCLASSIFICATIONLIST } from '@/request/apis'
import { useGlobal } from '@/store'
const globalStore = useGlobal()
const router = useRouter()

// 获取分页数据
let offset = 0
const size = 4
const total = ref(0)
const list = ref<any[]>([])
const getList = () => {
  req
    .request({
      ...GETCLASSIFICATIONLIST(offset, size)
    })
    .then(res => {
      const { list: articleList, success, total: totalCount } = res.data
      if (!success) {
        return ElMessage.warning({
          message: '获取归档信息失败，请稍后再试或联系管理员查看错误日志'
        })
      }
      list.value = articleList
      total.value = totalCount
    })
}
getList()

// 切换页数
const choosePage = (page: number) => {
  offset = page - 1
  getList()
}

const filtrate = (id: number) => {
  router.push({ name: 'articleDetail', params: { id } })
}
</script>

<style scoped lang="less">
#classification-main {
  min-height: calc(100vh - var(--top-info-height));
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  .container {
    width: 60%;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 0 10px 1px #cccccc80;
    .time-line {
      padding: 1rem;
      border-left: 3px solid #90d7ec;
      position: relative;
      .title {
        font-weight: 600;
      }
      .time {
        color: #00000080;
        font-size: 12px;
        margin: 0.5rem 0;
      }
      .content {
        display: flex;
        img {
          width: 100px;
          height: 100px;
          border-radius: 10px;
        }
        .intro {
          margin-left: 1rem;
          color: #00000080;
          span {
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
          }
        }
      }
      &::before {
        content: '';
        position: absolute;
        left: -6px;
        top: 0px;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background: #90d7ec;
      }
      &:hover {
        background: #00000020;
        cursor: pointer;
      }
    }
    .pagination-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1rem;
      .pagination {
        background: transparent;
      }
    }
  }
}
</style>
