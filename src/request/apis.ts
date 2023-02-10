export const baseURL = 'http://162.14.76.147:3001'
// 验证码登录/注册
export const LOGIN = {
  url: '/user/login',
  method: 'POST'
}
// 发送验证码
export const SENDCODE = {
  url: '/code/send',
  method: 'POST'
}
// 忘记密码
export const FORGET = {
  url: '/user/forget',
  method: 'POST'
}
// 登录状态校验
export const LOGINVERIFY = {
  url: '/user/token/verify',
  method: 'POST'
}
// 订阅与取消订阅
export const SUBSCRIBE = (flag: boolean): any => {
  return {
    url: `/subscribe/handle/${flag}`,
    method: 'POST'
  }
}
// 查询是否已订阅
export const ISSUBSCRIBE = (id: number): any => {
  return {
    url: `/subscribe/query/${id}`,
    method: 'GET'
  }
}
// 获取订阅数量
export const GETSUBSCRIBETOTAL = {
  url: '/subscribe/total',
  method: 'GET'
}
// 获取标签列表
export const TAGLIST = {
  url: '/tag/list',
  method: 'GET'
}
// 获取分类列表
export const CATELIST = {
  url: '/cate/list',
  method: 'GET'
}
// 修改昵称
export const UPDATENICKNAME = (name: string): any => {
  return {
    url: `/user/update/name/${name}`,
    method: 'POST'
  }
}
// 修改头像
export const UPDATEAVATAR = {
  url: '/user/update/avatar',
  method: 'POST'
}
// 保存文章草稿信息
export const SAVEDRAFT = {
  url: '/articles/save',
  method: 'POST'
}
// 更新文章封面图-手动选择的方式
export const UPDATESURFACE = (articleId: number): any => {
  return {
    url: `/articles/save/surface/${articleId}`,
    method: 'POST'
  }
}
// 获取草稿数据
export const GETDRAFT = {
  url: '/articles/get/draft',
  method: 'POST'
}
// 插入文章内图片
export const INSERTARTICLEIMG = {
  url: '/articles/img',
  method: 'POST'
}
// 发表文章
export const RELEASEARTICLE = {
  url: '/articles/release',
  method: 'POST'
}
// 上传发表文章封面-通过草稿保存的封面图更新
export const UPDATESURFACEFROMDRAFT = (articleId: number): any => ({
  url: `/articles/save/surface/draft/${articleId}`,
  method: 'POST'
})
// 删除草稿文章-文章发表后
export const DELETEDRAFT = {
  url: '/articles/draft',
  method: 'DELETE'
}
// 保存贡献记录
export const SAVECONTRIBUTEDATE = {
  url: '/articles/save/contribute',
  method: 'POST'
}
// 留言
export const LEAVEWORD = {
  url: '/leaveword/send',
  method: 'POST'
}
// 获取留言列表
export const GETLEAVEWORDLIST = {
  url: '/leaveword/list',
  method: 'GET'
}
// 获取贡献数据
export const GETCONTRIBUTE = {
  url: '/articles/contribute/get',
  method: 'GET'
}
// 获取文章、标签、分类数量
export const GETDATA = {
  url: '/info/data',
  method: 'GET'
}
// 用户访问量控制
export const ISVIEWED = {
  url: '/info/is/view',
  method: 'GET'
}
// 网站统计信息
export const STATISTICS = {
  url: '/info/statistics',
  method: 'GET'
}
// 发布友链评论
export const SUBMITLINKCOMMENT = {
  url: '/link/submit/comment',
  method: 'POST'
}
// 获取友链评论列表
export const GETLINKCOMMENTLIST = (offset: number, size: number): any => {
  return {
    url: `/link/comment/list/${offset}/${size}`,
    method: 'GET'
  }
}
// 友链评论点赞
export const LINKCOMMENTENDORSE = (commentId: number): any => {
  return {
    url: `/link/comment/endorse/${commentId}`,
    method: 'POST'
  }
}
// 获取友链列表
export const GETLINKLIST = {
  url: '/link/list',
  method: 'GET'
}
// 获取归档分页数据
export const GETCLASSIFICATIONLIST = (offset: number, size: number): any => {
  return {
    url: `/class/list/${offset}/${size}`,
    method: 'GET'
  }
}
// 获取首页热门文章
export const GETHOTARTICLELIST = {
  url: '/articles/hot/list',
  method: 'GET'
}
// 通过标签或分类筛选文章
export const FILTRATEARTICLE = (
  type: 0 | 1,
  id: number,
  offset: number,
  size: number
): any => {
  return {
    url: `/articles/filtrate/${type}/${id}/${offset}/${size}`,
    method: 'GET'
  }
}
// 获取文章详情
export const GETARTICLEDETAIL = (articleId: number): any => {
  return {
    url: `/articles/detail/${articleId}`,
    method: 'GET'
  }
}
// 增加文章点击量
export const ADDARTICLECLICKCOUNT = (articleId: number): any => {
  return {
    url: `/articles/click/${articleId}`,
    method: 'GET'
  }
}
// 发布文章评论
export const SENDARTICLECOMMENT = (articleId: number): any => {
  return {
    url: `/articles/comment/send/${articleId}`,
    method: 'POST'
  }
}
// 获取文章评论分页数据
export const GETARTICLECOMMENTLIST = (
  offset: number,
  size: number,
  articleId: number
): any => {
  return {
    url: `/articles/comment/list/${offset}/${size}/${articleId}`,
    method: 'GET'
  }
}
// 点赞评论信息
export const ENDORSEARTICLECOMMENT = (commentId: number): any => {
  return {
    url: `/articles/comment/endorse/${commentId}`,
    method: 'POST'
  }
}
// 搜索文章
export const SEARCHARTICLES = (key: string): any => {
  return {
    url: `/articles/search/${key}`,
    method: 'GET'
  }
}
