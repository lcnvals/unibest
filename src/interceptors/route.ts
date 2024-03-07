/**
 * by 菲鸽 on 2024-03-06
 * 路由拦截，通常也是登录拦截
 * 可以设置路由白名单，或者黑名单，看业务需要选哪一个
 * 我这里应为大部分都可以随便进入，所以使用黑名单
 */
import { useUserStore } from '@/store'
import { getAllNeedLoginPages, allNeedLoginPages } from '@/utils'

// TODO Check
const loginRoute = '/pages/login/index'

const isDev = false
// 黑名单登录拦截器 - （适用于大部分页面不需要登录，少部分页面需要登录）
const navigateToInterceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  invoke({ url }: { url: string }) {
    console.log(url)
    let needLoginPages = allNeedLoginPages
    // 为了防止开发时出现BUG，这里每次都获取一下。生产环境可以移到函数外，性能更好
    if (isDev) {
      needLoginPages = getAllNeedLoginPages()
    }
    if (needLoginPages.includes(url)) {
      const userStore = useUserStore()
      const isLogin = !!userStore.userInfo.token
      if (isLogin) {
        return true
      }
      const redirectRoute = `${loginRoute}?redirect=${url}`
      uni.navigateTo({ url: redirectRoute })
      return false
    }
    return true
  },
}

export const routeInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('navigateTo', navigateToInterceptor)
  },
}