<template>
  <div id="comment">
    <div v-if="props.showTitle" class="title">
      <i class="iconfont icon-comment"></i>
      <span>评论</span>
    </div>
    <div class="wrapper">
      <img
        v-if="userStore.userInfo.avatar"
        class="avatar"
        :src="userStore.userInfo.avatar"
      />
      <img v-else src="~@/assets/images/avatar.svg" class="avatar" />
      <div class="input-area">
        <textarea
          v-model="inputContent"
          :placeholder="props.placeholder"
        ></textarea>
        <div class="control">
          <img
            src="~@/assets/images/emoji.svg"
            class="emoji-icon"
            @click="isShowEmoji = !isShowEmoji"
          />
          <ElButton class="submit" type="success" @click="submit">
            提交
          </ElButton>
        </div>
        <div v-if="isShowEmoji" class="emoji-list">
          <img
            v-for="(value, key) in emojiList"
            :key="key"
            :src="value"
            :title="key"
            @click="addEmoji(key)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import emojiList from '@/assets/js/emoji'
import { useUser } from '@/store'
const props = withDefaults(
  defineProps<{
    showTitle?: boolean
    placeholder?: string
  }>(),
  {
    showTitle: true,
    placeholder: '这里留言...'
  }
)
const userStore = useUser()
const emits = defineEmits<{
  (e: 'submit', htmlContent: string): void
}>()
const isShowEmoji = ref(false)
const inputContent = ref('')
const addEmoji = (key: string) => {
  inputContent.value += key
}
const submit = () => {
  if (userStore.userInfo.id < 0) {
    return ElMessage.warning({ message: '需要先登录' })
  }
  if (!inputContent.value.trim()) {
    return ElMessage.warning({ message: '检查到空评论' })
  }
  // 先将输入的评论信息转为可展示的html片段
  let htmlContent = inputContent.value
  for (let item in emojiList) {
    // '[支持]': 'https://static.talkxj.com/emoji/zhichi.jpg'
    let _item = item
    _item = item.replace(/(\[|\])/g, '')
    const reg = eval(`/\\[${_item}\\]/g`)
    if (reg.test(item)) {
      htmlContent = htmlContent.replace(
        reg,
        `<img src='${
          (emojiList as any)[item]
        }' style='width: 20px; height: 20px' />`
      )
    }
  }
  htmlContent = `<span style='display: flex; align-items: center'>${htmlContent}</span>`
  emits('submit', htmlContent)
}
const resetContent = () => {
  console.log('reset content~~')
  inputContent.value = ''
}
defineExpose({
  resetContent
})
</script>

<style scoped lang="less">
#comment {
  .title {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    color: #90d7ec;
    .iconfont {
      margin: 3px 0.5rem 0 0;
      font-size: 1.2rem;
    }
  }
  .wrapper {
    margin: 1rem 0;
    border-radius: 5px;
    border: 1px solid #00000030;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 40px;
    }
    .input-area {
      flex: 0.98;
      position: relative;
      textarea {
        width: 100%;
        resize: none;
        min-height: 191px;
        border: none;
        background: none;
        &:focus {
          outline: none;
        }
      }
      .control {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .emoji-icon {
          width: 30px;
          height: 30px;
          cursor: pointer;
        }
        .submit {
          background: #90d7ec;
        }
      }
      .emoji-list {
        display: flex;
        flex-wrap: wrap;
        img {
          margin: 10px 5px 0 0;
          width: 20px;
          height: 20px;
          transition: all 0.5s;
          &:hover {
            transform: scale(1.3);
          }
        }
      }
    }
  }
}
</style>
