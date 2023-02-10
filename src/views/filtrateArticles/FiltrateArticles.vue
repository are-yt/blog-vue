<template>
  <div id="filtrate">
    <TopInfo :title="title" bg="http:///p1.qhimg.com/t011fafa2d5a51becd2.jpg" />
    <Main :list="list" :total="total" @load-more="getList" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import TopInfo from '@/components/common/topInfo/TopInfo.vue'
import Main from './cpns/Main.vue'
import req from '@/request'
import { FILTRATEARTICLE } from '@/request/apis'
// type为0表示分类筛选；为1表示标签筛选
const props = defineProps<{
  type: '0' | '1'
  id: string
  name: string
}>()
watch(
  () => props.name,
  () => {
    title.value = (props.type === '0' ? '分类' : '标签') + '-' + props.name
    document.title = title.value
    offset = 0
    list.value = []
    total.value = 0
    getList()
  }
)
const title = ref((props.type === '0' ? '分类' : '标签') + '-' + props.name)
document.title = title.value
// 获取筛选分页数据
let offset = 0
const size = 3
const list = ref<any[]>([])
const total = ref(0)
const getList = () => {
  const id = Number(props.id)
  const type = props.type === '0' ? 0 : 1
  req
    .request({
      ...FILTRATEARTICLE(type, id, offset, size)
    })
    .then(res => {
      const { success, list: articleList, total: articleTotal } = res.data
      if (!success) {
        return ElMessage.warning({
          message: '获取相关文章数据失败，请稍后再试或联系管理员查看错误日志'
        })
      }
      list.value.push(...articleList)
      total.value = articleTotal
      offset++
    })
}
getList()
</script>

<style scoped lang="less"></style>
