<template>
  <div id="profile">
    <TopInfo
      bg="http:///p4.qhimg.com/t0196dfad56317fe205.jpg"
      title="我的信息"
    />
    <Main />
  </div>
</template>

<script setup lang="ts">
import TopInfo from '@/components/common/topInfo/TopInfo.vue'
import Main from './cpns/Main.vue'
</script>

<style scoped lang="less"></style>
