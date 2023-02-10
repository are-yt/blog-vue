<template>
  <div id="creation" :class="globalStore.isDark ? '' : 'default-bg'">
    <TopInfo
      title="创作中心"
      bg="http:///p1.qhimg.com/t011917e5b14e3cd8e8.jpg"
    />
    <Main />
  </div>
</template>

<script setup lang="ts">
import TopInfo from '@/components/common/topInfo/TopInfo.vue'
import Main from './cpns/Main.vue'
import { useGlobal } from '@/store'
const globalStore = useGlobal()
</script>

<style scoped lang="less"></style>
