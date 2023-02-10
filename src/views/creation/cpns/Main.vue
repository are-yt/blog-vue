<template>
  <div id="creation-main">
    <div class="container animate-into-bottom">
      <div class="tag-and-cate">
        <div class="itme">
          <ElSelect
            v-model="chooseTags"
            multiple
            placeholder="选择标签"
            @change="choose"
          >
            <ElOption
              v-for="item in tagList"
              :key="item.id"
              :value="item.name"
              :lable="item.id"
            />
          </ElSelect>
        </div>
        <div class="itme">
          <ElSelect v-model="chooseCate" placeholder="选择分类">
            <ElOption
              v-for="item in cateList"
              :key="item.id"
              :value="item.name"
              :lable="item.id"
            />
          </ElSelect>
        </div>
      </div>
      <div class="is-top">
        <ElButton class="btn" @click="isTop = !isTop">是否置顶?</ElButton>
        <ElSwitch id="is-top" v-model="isTop" class="switch" />
      </div>
      <div class="surface-and-control">
        <div class="surface">
          <input
            class="file"
            type="file"
            title="选择封面"
            @change="choosedFile"
          />
          <ElButton class="btn" type="primary">选择封面</ElButton>
          <img v-if="tempSurface" :src="tempSurface" />
        </div>
        <div class="control">
          <ElButton type="success" @click="save">保存</ElButton>
          <ElButton type="success" @click="release">发布</ElButton>
        </div>
      </div>
      <ElInput
        v-model="title"
        class="title"
        type="text"
        placeholder="标题,5~100字符"
      />
      <Editor
        class="editor"
        :upload-images="uploadImg"
        :value="content"
        :locale="locale"
        placeholder="输入正文"
        :max-length="1000"
        :plugins="plugins"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import locale from 'bytemd/locales/zh_Hans.json'
import { Editor } from '@bytemd/vue-next'
import 'bytemd/dist/index.css'
import gfm from '@bytemd/plugin-gfm'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import breaks from '@bytemd/plugin-breaks'
import hignLight from '@bytemd/plugin-highlight'
import gemoji from '@bytemd/plugin-gemoji'
import 'highlight.js/styles/github.css'
import req from '@/request'
import {
  TAGLIST,
  CATELIST,
  SAVEDRAFT,
  UPDATESURFACE,
  GETDRAFT,
  INSERTARTICLEIMG,
  RELEASEARTICLE,
  UPDATESURFACEFROMDRAFT,
  DELETEDRAFT,
  SAVECONTRIBUTEDATE
} from '@/request/apis'
const plugins = [gfm(), mediumZoom(), breaks(), hignLight(), gemoji()]
const title = ref('')
const content = ref('')
const isTop = ref(false)
const handleChange = (value: string) => {
  content.value = value
}
// 获取标签列表
const tagList = ref<any[]>([])
const chooseTags = ref<number[]>([])
req
  .request({
    ...TAGLIST
  })
  .then(res => {
    const { success, list } = res.data
    if (!success) {
      return ElMessage.warning({ message: '获取标签列表失败' })
    }
    tagList.value = list
  })
const choose = (choosed: any[]) => {
  if (choosed.length > 2) {
    choosed.splice(2, 1)
    return ElMessage.warning({ message: '最多选择两个标签' })
  }
}
// 获取分类列表
const cateList = ref<any[]>([])
const chooseCate = ref<any[]>([])
req
  .request({
    ...CATELIST
  })
  .then(res => {
    const { success, list } = res.data
    if (!success) {
      return ElMessage.warning({ message: '获取标签列表失败' })
    }
    cateList.value = list
  })
// 获取草稿数据
req
  .request({
    ...GETDRAFT
  })
  .then(res => {
    const { success, data } = res.data
    if (!success) {
      return ElMessage.warning({
        message: '获取草稿数据失败,请稍后再试或查看错误日志'
      })
    }
    if (!data) {
      return
    }
    const {
      cate,
      content: draftContent,
      surface,
      tags,
      title: draftTitle,
      top
    } = data
    for (let i = 0; i < tagList.value.length; i++) {
      tags.forEach((item: any) => {
        if (item === tagList.value[i].id) {
          chooseTags.value.push(tagList.value[i].name)
        }
      })
    }
    for (let i = 0; i < cateList.value.length; i++) {
      if (cate === cateList.value[i].id) {
        chooseCate.value = cateList.value[i].name
      }
    }
    isTop.value = top === '1' ? true : false
    content.value = draftContent
    title.value = draftTitle
    tempSurface.value = surface
  })
// 选择了封面图
const tempSurface = ref('')
let surfaceFileObj: any = null
const choosedFile = (e: any) => {
  const file = e.target.files[0]
  const type = file.type
  const reg = /^image\//
  if (!reg.test(type)) {
    return ElMessage.warning({ message: '请选择图片文件' })
  }
  surfaceFileObj = file
  const reader = new FileReader()
  reader.onload = e => {
    tempSurface.value = e.target ? (e.target.result as string) : ''
  }
  reader.readAsDataURL(file)
}

// 保存文章封面图-手动选择的
const saveSurface = (
  articleId: any,
  sucPrompt: string,
  isDeleteDraft = false
) => {
  if (!surfaceFileObj) {
    return
  }
  const formdata = new FormData()
  formdata.append('surface', surfaceFileObj)
  req
    .request({
      ...UPDATESURFACE(articleId),
      data: formdata
    })
    .then(res => {
      const { success, errMsg } = res.data
      if (!success) {
        return ElMessage.warning({ message: errMsg })
      }
      ElMessage.success({ message: sucPrompt })
      // 这个方法是保存文章和发表文章公用的，而发表文章完成后要删除草稿文章数据
      // 因此通过传入参数来判断是否要执行删除草稿文章的方法
      if (isDeleteDraft) {
        deleteDraft()
        clearInput()
        saveContribute()
      }
    })
}
// 保存文章封面图-草稿保存的封面图
const saveSurfaceFromDraft = (articleId: any) => {
  req
    .request({
      ...UPDATESURFACEFROMDRAFT(articleId)
    })
    .then(res => {
      const { success, errMsg } = res.data
      if (!success) {
        return ElMessage.warning({ message: errMsg })
      }
      // 到这里发表文章的数据全部上传成功
      ElMessage.success({ message: '发表文章成功' })
      // 删除草稿文章数据
      deleteDraft()
      clearInput()
      saveContribute()
    })
}
// 删除草稿文章信息
const deleteDraft = () => {
  req
    .request({
      ...DELETEDRAFT
    })
    .then(res => {
      const { success, errMsg } = res.data
      if (!success) {
        return ElMessage.warning({ message: errMsg })
      }
    })
}
// 发布成功后保存贡献记录
const saveContribute = () => {
  req.request({
    ...SAVECONTRIBUTEDATE
  })
}
// 发布成功后清空所有内容
const clearInput = () => {
  title.value = ''
  content.value = ''
  isTop.value = false
  chooseTags.value = []
  chooseCate.value = []
  surfaceFileObj = null
  tempSurface.value = ''
}
// 保存文章信息
const save = () => {
  const tags: any[] = []
  for (let i = 0; i < chooseTags.value.length; i++) {
    tagList.value.forEach((item: any) => {
      if (item.name === chooseTags.value[i]) {
        tags.push(item.id)
      }
    })
  }
  let cate = 0
  for (let i = 0; i < cateList.value.length; i++) {
    if (cateList.value[i].name === chooseCate.value) {
      cate = cateList.value[i].id as number
    }
  }
  req
    .request({
      ...SAVEDRAFT,
      data: {
        title: title.value,
        content: content.value,
        isTop: isTop.value,
        tags,
        cate
      }
    })
    .then(res => {
      const { success, id } = res.data
      if (!success) {
        return ElMessage.warning({
          message: '保存文章失败，请稍后再试,或联系管理员查看错误日志'
        })
      }
      // 保存草稿文章成功
      ElMessage.success({ message: '保存草稿成功' })
      saveSurface(id, '保存文章封面成功')
    })
}
// 上传文章内的图片
const uploadImgMethod = (
  formdata: FormData
): Promise<{ success: boolean; list: any }> => {
  return new Promise(resolve => {
    req
      .request({
        ...INSERTARTICLEIMG,
        data: formdata
      })
      .then(res => {
        const { success, errMsg, list } = res.data
        if (!success) {
          return ElMessage.warning({ message: errMsg })
        }
        resolve({ success: true, list })
      })
      .catch(() => {
        resolve({ success: false, list: {} })
      })
  })
}
const uploadImg = async (files: any) => {
  const showList = []
  for (let i = 0; i < files.length; i++) {
    const type = files[i].type
    const reg = /^image\//
    if (!reg.test(type)) {
      return ElMessage.warning({
        message: `${files[i].name}是非图片类型的文件，无法插入`
      })
    }
    const formdata = new FormData()
    formdata.append('articleImg', files[i])
    const { success, list } = await uploadImgMethod(formdata)
    if (success) {
      showList.push(list)
    } else {
      return ElMessage.warning({ message: `${files[i].name}插入失败` })
    }
  }
  return showList
}
// 发布
const release = () => {
  if (
    !title.value.trim() ||
    !content.value.trim() ||
    !chooseTags.value.length ||
    !chooseCate.value ||
    (!surfaceFileObj && !tempSurface.value) === true
  ) {
    return ElMessage.warning({
      message: '必填内容不能为空:标题、内容、标签、分类以及封面图'
    })
  } else if (title.value.length < 5 || title.value.length > 100) {
    return ElMessage.warning({ message: '标题字数规则: 5<=length<=100' })
  }
  // 先上传文章基本数据: title、content、tags、cate、top
  const tags: number[] = []
  for (let i = 0; i < chooseTags.value.length; i++) {
    tagList.value.forEach((item: any) => {
      if (item.name === chooseTags.value[i]) {
        tags.push(item.id)
      }
    })
  }
  let cate = 0
  for (let i = 0; i < cateList.value.length; i++) {
    if (cateList.value[i].name === chooseCate.value) {
      cate = cateList.value[i].id
    }
  }
  req
    .request({
      ...RELEASEARTICLE,
      data: {
        title: title.value,
        content: content.value,
        isTop: isTop.value,
        tags,
        cate
      }
    })
    .then(res => {
      const { success, newArticleId } = res.data
      if (!success) {
        return ElMessage.warning({
          message: '发表文章失败，请稍后再试或查看错误日志'
        })
      }
      if (surfaceFileObj) {
        // 重新选择的封面图
        saveSurface(newArticleId, '发表成功', true)
      } else {
        // 是草稿保存的封面图
        saveSurfaceFromDraft(newArticleId)
      }
    })
}
</script>

<style scoped lang="less">
#creation-main {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    width: 70%;
    box-shadow: 0 0 10px 1px #cccccc80;
    border-radius: 10px;
    .tag-and-cate {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
    .surface-and-control {
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .surface {
        position: relative;
        display: flex;
        align-items: flex-start;
        .btn {
          width: 100px;
          height: 30px;
          background: #90d7ec;
        }
        .file {
          position: absolute;
          z-index: 1;
          left: 0;
          right: 0;
          width: 100px;
          height: 30px;
          opacity: 0;
          cursor: pointer;
        }
        img {
          margin-left: 1rem;
          width: 230px;
          height: 150px;
          border-radius: 5px;
        }
      }
    }
    .is-top {
      margin-bottom: 2rem;
      .btn {
        width: 100px;
        background: #90d7ec;
        color: #fff;
      }
      .switch {
        margin-left: 1rem;
      }
    }
    .title {
      width: 100%;
    }
    .editor {
      position: relative;
      z-index: 100;
      :deep(.bytemd) {
        height: 70vh;
      }
      :deep(img) {
        width: 100%;
        max-height: 300px;
      }
    }
  }
}
</style>
