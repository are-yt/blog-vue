<template>
  <div id="cate-main" :class="globalStore.isDark ? '' : 'default-bg'">
    <div class="container animate-into-bottom">
      <div class="title">分类-{{ cateList.length }}</div>
      <template v-for="item in cateList" :key="item.id">
        <div class="item" @click="filtrate(item)">
          <div class="inner">
            <div class="state">
              <img src="~@/assets/images/circle-no-select.svg" />
            </div>
            <span class="name">{{ item.name }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGlobal } from '@/store'
import req from '@/request'
import { CATELIST } from '@/request/apis'
const globalStore = useGlobal()
const router = useRouter()
const cateList = ref<any[]>([])
req
  .request({
    ...CATELIST
  })
  .then(res => {
    const { success, errMsg, list } = res.data
    if (!success) {
      return ElMessage.warning({ message: errMsg })
    }
    cateList.value = list
  })
const filtrate = (item: any) => {
  const { id, name } = item
  router.push({ name: 'filtrate', params: { type: '0', id, name } })
}
</script>

<style scoped lang="less">
#cate-main {
  min-height: calc(100vh - var(--top-info-height));
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    width: 50%;
    border-radius: 10px;
    box-shadow: 0 0 10px 1px #cccccc80;
    padding: 1rem;
    .title {
      text-align: center;
      font-size: 2rem;
      font-weight: bold;
      letter-spacing: 10px;
    }
    .item {
      display: flex;
      align-items: center;
      margin: 1rem 0;
      .inner {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        .state {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          img {
            width: inherit;
            height: inherit;
          }
        }
        .name {
          margin-left: 1rem;
        }
        &:hover .state {
          background: #90d7ec;
        }
      }
    }
  }
}
</style>
