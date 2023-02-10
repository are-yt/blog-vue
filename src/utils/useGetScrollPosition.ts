import { ref, onMounted } from 'vue'
export const useGetScrollPosition = (): any => {
  const scrollY = ref(0)
  const scrollX = ref(0)
  onMounted(() => {
    document.addEventListener('scroll', () => {
      scrollY.value = window.scrollY
      scrollX.value = window.scrollX
    })
  })
  return {
    x: scrollX,
    y: scrollY
  }
}
