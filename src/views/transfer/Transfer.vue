<template>
  <div id="transfer"></div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps<{
  id: any
}>()
router.replace({ name: 'articleDetail', params: { id: props.id } })
</script>

<style scoped lang="less"></style>
