<template>
  <div id="article-detail">
    <TopInfo bg="http:///p8.qhimg.com/t01c3a181e969589456.jpg">
      <template #info>
        <div v-if="articleInfo" class="info-slot">
          <div class="title">{{ articleInfo.title }}</div>
          <div class="time">
            <span>发表时间: {{ articleInfo.createAt.split(' ')[0] }}</span>
            <span>最近修改: {{ articleInfo.updateAt.split(' ')[0] }}</span>
          </div>
          <div class="view-count">点击量: {{ articleInfo.viewCount }}</div>
        </div>
      </template>
    </TopInfo>
    <Main :article-info="articleInfo" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import req from '@/request'
import { GETARTICLEDETAIL, ADDARTICLECLICKCOUNT } from '@/request/apis'
import TopInfo from '@/components/common/topInfo/TopInfo.vue'
import Main from './cpns/Main.vue'
const props = defineProps<{
  id: string
}>()
// 获取文章详情信息
const articleInfo = ref<any>()
const getArticleInfo = () => {
  req
    .request({
      ...GETARTICLEDETAIL(Number(props.id))
    })
    .then(res => {
      const { success, data } = res.data
      if (!success) {
        return ElMessage.warning({
          message: '获取文章详情失败，请稍后再试或联系管理员查看错误日志'
        })
      }
      articleInfo.value = data
    })
}
getArticleInfo()
// 增加文章点击量
const addArticleClickCount = () => {
  req.request({
    ...ADDARTICLECLICKCOUNT(Number(props.id))
  })
}
addArticleClickCount()
</script>

<style scoped lang="less">
#article-detail {
  .info-slot {
    text-align: center;
    font-weight: bold;
    color: #fff;
    div {
      margin: 1.5rem 0;
    }
    .title {
      font-size: 2rem;
      letter-spacing: 5px;
    }
    .time {
      span {
        margin-left: 1rem;
      }
    }
    .tags-and-cate {
      display: flex;
      div {
        flex: 1;
        margin: 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        .iconfont {
          font-size: 16px;
        }
        span {
          margin-left: 0.5rem;
        }
      }
    }
  }
}
</style>
