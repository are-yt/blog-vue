<template>
  <div id="home-welcome">
    <div class="background">
      <div class="greeting">HELLO</div>
    </div>
    <div class="intro-wrapper">
      <div>
        <span class="intro">{{ intro1 }}</span>
        <span v-if="intro1.length !== text1.length" class="cursor"></span>
      </div>
      <div>
        <span class="intro">{{ intro2 }}</span>
        <span
          v-if="
            intro1.length === text1.length && intro2.length !== text2.length
          "
          class="cursor"
        ></span>
      </div>
    </div>
    <i class="iconfont icon-down"></i>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watchEffect, ref } from 'vue'
import { useGetScrollPosition } from '@/utils'
const pos = useGetScrollPosition()
const x = pos.x
const y = pos.y
const text1 =
  '这里是我的个人向博客站点,我会尽量分享一些不限类别、有质量的文章'.split('')
const text2 = '期待在下方订阅这个频道~(^u^)'.split('')
const intro1 = ref('')
const intro2 = ref('')
let index = 0
onMounted(() => {
  const background = document.querySelector('.background') as HTMLElement
  watchEffect(() => {
    if (y.value !== 0) {
      background.style.backgroundPosition = `${x.value}px ${y.value}px`
    }
  })
  let interval = setInterval(() => {
    if (intro1.value.length !== text1.length) {
      intro1.value += text1[index++]
    } else if (
      intro1.value.length === text1.length &&
      intro2.value.length !== text2.length
    ) {
      index = index === intro1.value.length ? 0 : index
      intro2.value += text2[index++]
    } else {
      clearInterval(interval)
    }
  }, 100)
})
</script>

<style scoped lang="less">
#home-welcome {
  position: relative;
  height: 100vh;
  .background {
    user-select: none;
    position: relative;
    height: inherit;
    background: url(http:///p1.qhimg.com/t012e62633a2eea392b.jpg) no-repeat;
    background-size: cover;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-image: inherit;
      background-size: cover;
      z-index: -1;
    }
    .greeting {
      text-align: center;
      font-weight: bold;
      font-size: 12rem;
      color: #fff;
      letter-spacing: 15px;
    }
  }
  .intro-wrapper {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-size: 1rem;
    color: #fff;
    font-weight: 600;
    div {
      margin-top: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .cursor {
        height: 16px;
        border-right: 1px solid #fff;
        animation: fade 1s;
        @keyframes fade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      }
    }
  }
  .icon-down {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    color: #fff;
    animation: bounce 2s infinite;
    @keyframes bounce {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-15px);
      }
      100% {
        transform: translateY(0);
      }
    }
  }
}

@media (max-width: 640px) {
  #home-welcome {
    .background {
      .greeting {
        font-size: 4rem;
      }
    }
  }
}
</style>
