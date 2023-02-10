import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('../views/home/Home.vue'),
    meta: {
      title: '欢迎~(^U^)'
    }
  },
  {
    path: '/cate',
    component: () => import('../views/category/Category.vue'),
    meta: {
      title: '分类'
    }
  },
  {
    path: '/profile',
    component: () => import('../views/profile/Profile.vue'),
    meta: {
      title: '我的信息'
    }
  },
  {
    path: '/creation',
    component: () => import('../views/creation/Creation.vue'),
    meta: {
      title: '创作中心'
    }
  },
  {
    path: '/barrage',
    component: () => import('../views/barrage/Barrage.vue'),
    meta: {
      title: '留言'
    }
  },
  {
    path: '/link',
    component: () => import('../views/link/Link.vue'),
    meta: {
      title: '友链'
    }
  },
  {
    path: '/classification',
    component: () => import('../views/classification/Classification.vue'),
    meta: {
      title: '归档'
    }
  },
  {
    path: '/filtrate/:type/:name/:id',
    name: 'filtrate',
    component: () => import('../views/filtrateArticles/FiltrateArticles.vue'),
    props: true
  },
  {
    path: '/articleDetal/:id',
    name: 'articleDetail',
    component: () => import('../views/articleDetail/ArticleDetail.vue'),
    meta: {
      title: '文章详情'
    },
    props: true
  },
  {
    path: '/transfer/:id',
    name: 'transfer',
    component: () => import('../views/transfer/Transfer.vue'),
    meta: {
      title: '跳转中...'
    },
    props: true
  }
]
const router = createRouter({
  routes,
  history: createWebHistory(),
  scrollBehavior() {
    return {
      top: 0
    }
  }
})
router.beforeEach(to => {
  Nprogress.start()
  document.title = to.meta.title as string
})
router.afterEach(() => {
  Nprogress.done()
})
export default router
