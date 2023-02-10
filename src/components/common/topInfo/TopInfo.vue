<template>
  <div id="top-info" class="animate-into-top" :style="style">
    <slot name="info">
      <div class="default-title">{{ props.title }}</div>
    </slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string
  bg: string
}>()
const style = {
  background: `url(${props.bg}) no-repeat`,
  backgroundPosition: 'center',
  backgroundSize: 'cover'
}
</script>

<style scoped lang="less">
#top-info {
  height: var(--top-info-height);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .default-title {
    font-size: 3.5rem;
    letter-spacing: 0.5rem;
    color: #fff;
  }
}
</style>
