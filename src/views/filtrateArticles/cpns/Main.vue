<template>
  <div id="filtrate-main" :class="globalStore.isDark ? '' : 'default-bg'">
    <div class="container animate-into-bottom">
      <div v-if="props.list.length" class="list">
        <template v-for="item in props.list" :key="item.id">
          <div class="item" @click="detail(item.id)">
            <img :src="item.surface" />
            <div class="info">
              <div class="title">{{ item.title }}</div>
              <div class="time-and-cate">
                <div class="time">{{ item.createAt.split(' ')[0] }}</div>
                <div class="cate" @click.stop="filtrate(0, item.cate)">
                  {{ item.cate.name }}
                </div>
              </div>
              <div class="fragment"></div>
              <div class="tags">
                <div
                  v-for="tagItem in item.tags"
                  :key="tagItem.id"
                  class="tag-item"
                  @click.stop="filtrate(1, tagItem)"
                >
                  {{ tagItem.name }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <ElButton
        v-if="props.list.length < props.total"
        type="success"
        class="btn"
        @click="loadMore"
        >更多</ElButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGlobal } from '@/store'
const router = useRouter()
const globalStore = useGlobal()
const props = defineProps<{
  list: any[]
  total: number
}>()
const emits = defineEmits<{
  (e: 'loadMore'): void
}>()
const loadMore = () => {
  emits('loadMore')
}
const filtrate = (type: 0 | 1, item: any) => {
  const { id, name } = item
  router.push({ name: 'filtrate', params: { type, id, name } })
}
const detail = (id: number) => {
  router.push({ name: 'articleDetail', params: { id } })
}
</script>

<style scoped lang="less">
#filtrate-main {
  min-height: calc(100vh - var(--top-info-height));
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    width: 70%;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 10px 1px #cccccc80;
    .list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .item {
        width: 275px;
        border-radius: 5px;
        box-shadow: 1px 1px 10px 3px #cccccc80;
        cursor: pointer;
        transition: all 0.5s;
        transform: perspective(500px) translate3d(0, 0, 0);
        &:hover {
          transform: perspective(500px) translate3d(-5px, -5px, 5px);
          box-shadow: 1px 1px 10px 3px #cccccc;
        }
        margin: 1rem 0;
        img {
          width: 100%;
          height: 180px;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        }
        .info {
          padding: 1rem 0.5rem;
          .title {
            font-weight: bold;
          }
          .time-and-cate {
            margin-top: 0.5rem;
            display: flex;
            justify-content: space-between;
            .time {
              font-size: 12px;
              color: #cccccc;
            }
          }
          .fragment {
            border: 1px solid #90d7ec;
            margin: 0.5rem 0;
          }
          .tags {
            display: flex;
            flex-wrap: wrap;
            margin-top: 1rem;
            .tag-item {
              margin-right: 0.5rem;
              padding: 5px 10px;
              border-radius: 5px;
              background: #90d7ec;
              color: #fff;
            }
          }
        }
        animation: blowup 1s;
        @keyframes blowup {
          0% {
            transform: scale(0.8);
          }
          100% {
            transform: scale(1);
          }
        }
      }
    }
    .btn {
      display: block;
      margin: 2rem auto 0 auto;
    }
  }
}
</style>
