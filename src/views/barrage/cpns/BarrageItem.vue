<template>
  <div id="barrage-item"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  avatar?: string
  content: string
  username: string
  mousecontent?: string
  userId: number
  id: number
  height: string
}>()
</script>

<style scoped lang="less"></style>
