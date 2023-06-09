import router from './router/index.js'
import { useUserStore, usePermissionStore } from './pinia/index.js'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress' // NOTE: 8年前构建的虚假进度条工具包
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth.js' // get token from cookie
import getPageTitle from '@/utils/get-page-title.js'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = userStore.roles && userStore.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // const { roles } = await store.dispatch('user/getInfo')
          const { roles } = await userStore.getInfo()

          // generate accessible routes map based on roles
          // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          const accessRoutes = await permissionStore.generateRoutes(roles)

          for (let index = 0; index < accessRoutes.length; index++) {
            router.addRoute(accessRoutes[index])
          }
          // NOTE: Vue4 已经没有了该方法
          // dynamically add accessible routes
          // router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          // await store.dispatch('user/resetToken')
          ElMessage.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
