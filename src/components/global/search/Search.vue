<template>
  <div id="search" :style="{ zIndex }">
    <Transition appear>
      <div v-if="globalStore.isSearch" class="inner">
        <div class="title">
          <span>本地搜索</span>
          <i
            class="iconfont icon-close_circle"
            @click="globalStore.isSearch = false"
          ></i>
        </div>
        <div class="search-box">
          <i class="iconfont icon-search"></i>
          <input v-model="value" type="text" @input="inputWord" />
        </div>
        <hr class="fragment" />
        <div class="search-res">
          <div class="state">{{ stateText }}</div>
          <div
            v-for="item in [...list].splice(0, showLength)"
            :key="item.id"
            class="item"
            @click="articleDetail(item.id)"
          >
            <img :src="item.surface" />
            <div class="info">
              <div v-html="item.title"></div>
              <div class="time">{{ item.createAt.split(' ')[0] }}</div>
              <div class="content" v-html="item.content"></div>
            </div>
          </div>
          <ElButton
            v-if="list.length > showLength"
            type="success"
            size="small"
            class="btn"
            @click="showLength += 4"
            >更多</ElButton
          >
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGlobal } from '@/store'
import req from '@/request'
import { SEARCHARTICLES } from '@/request/apis'
const globalStore = useGlobal()
const router = useRouter()
const zIndex = ref(-1)
watch(
  () => globalStore.isSearch,
  (val: boolean) => {
    if (val) {
      zIndex.value = 1
    } else {
      setTimeout(() => {
        zIndex.value = -1
      }, 500)
    }
  }
)
const value = ref('')
const list = ref<any[]>([])
const stateText = ref('')
const showLength = ref(4)
let timer: any = null
const inputWord = () => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    if (!value.value.trim()) {
      return
    }
    stateText.value = '正在搜索...'
    list.value = []
    showLength.value = 4
    req
      .request({
        ...SEARCHARTICLES(value.value)
      })
      .then(res => {
        const { success, list: searchList } = res.data
        if (!success) {
          return ElMessage.warning({ message: '查询失败，请稍后再试' })
        }
        // 把文章信息的相关关键字标识出来
        const reg = eval(`/${value.value}/`)
        console.log(reg)
        searchList.forEach((item: any) => {
          item.title = item.title.replace(
            reg,
            `<span style="color: #90d7ec">${value.value}</span>`
          )
          item.content = item.content.replace(
            reg,
            `<span style="color: #90d7ec">${value.value}</span>`
          )
        })
        list.value = searchList
        if (!searchList.length) {
          stateText.value = '无搜索结果'
        } else {
          stateText.value = ''
        }
      })
  }, 1000)
}
const articleDetail = (id: number) => {
  // 文章详情页面可能被复用，如果做处理比较复杂，直接跳转到一个中转站再跳到文章详情去可以避免被复用
  router.push({ name: 'transfer', params: { id } })
  globalStore.isSearch = false
}
</script>

<style scoped lang="less">
.v-enter-from,
.v-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s;
}
#search {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  .inner {
    padding: 1rem;
    border-radius: 10px;
    background: #29282890;
    width: 500px;
    max-height: 500px;
    overflow: auto;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        color: #90d7ec;
        font-weight: bold;
        font-size: 20px;
      }
      .iconfont {
        font-size: 18px;
        cursor: pointer;
      }
    }
    .search-box {
      margin: 1rem 0;
      position: relative;
      input {
        display: block;
        width: 100%;
        height: 30px;
        border-radius: 20px;
        border: 2px solid #90d7ec;
        background: none;
        color: #fff;
        text-indent: 2rem;
        &:focus {
          outline: none;
        }
      }
      .iconfont {
        position: absolute;
        left: 1rem;
        font-size: 20px;
        color: #fff;
        top: 8px;
      }
    }
    .fragment {
      margin: 1rem 0;
      border-bottom: 2px dashed #90d7ec;
    }
    .search-res {
      .state {
        color: #fff;
      }
      .item {
        margin: 1.5rem 0;
        border-radius: 5px;
        background: #fff;
        padding: 0.5rem;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        transition: all 0.5s;
        color: #00000080;
        &:hover {
          transform: translateY(-10px);
          box-shadow: 0 0 10px 1px #cccccc80;
        }
        img {
          width: 80px;
          height: 80px;
          border-radius: 5px;
        }
        .info {
          width: 0;
          flex: 0.96;
          .time {
            margin: 0.5rem 0;
            color: #cccccc80;
            font-size: 12px;
          }
          .content {
            max-width: 90%;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }
      .btn {
        display: block;
        margin: 1rem auto;
      }
    }
  }
}
</style>
