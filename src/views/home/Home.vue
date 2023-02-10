<template>
  <div id="home" :class="globalVars.isDark ? '' : 'default-bg'">
    <Welcome />
    <div class="container">
      <div class="left">
        <Contributes v-bind="ctbConfig" :data="contributes" />
        <hr class="segmentation" />
        <HomeLeft />
      </div>
      <div class="right">
        <HomeRight />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Welcome from './cpns/Welcome.vue'
import HomeRight from './cpns/HomeRight.vue'
import HomeLeft from './cpns/HomeLeft.vue'
import { useGlobal } from '@/store'
import req from '@/request'
import { GETCONTRIBUTE } from '@/request/apis'
const contributes = ref<any[]>([])
req
  .request({
    ...GETCONTRIBUTE
  })
  .then(res => {
    const { success, list } = res.data
    if (!success) {
      return ElMessage.warning({
        message: '获取贡献数据失败，请稍后再试或联系管理员查看错误日志'
      })
    }
    contributes.value = list
  })
const globalVars = useGlobal()
const ctbConfig = {
  tipActionName: '发表'
}
</script>

<style scoped lang="less">
#home {
  transition: all 0.5s;
  position: relative;
  z-index: 0;
  .container {
    width: 80%;
    margin: 0 auto;
    padding: 2rem 0;
    display: flex;
    justify-content: space-between;
    .left {
      width: 0; /* 设置width为0让google浏览器下重新计算flex子元素left的宽度，子元素宽度超过父元素会宽度自适应失败 */
      flex: 0.9;
      .segmentation {
        margin: 2rem auto;
        border: 2px dashed;
      }
    }
    .right {
      width: 280px;
      border-radius: 5px;
      position: relative;
    }
  }
}
</style>
