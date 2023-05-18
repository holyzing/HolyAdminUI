import { asyncRoutes, constantRoutes } from '@/router'
import { getRoutes } from '@/api/admin/sys-role'
import Layout from '@/layout/index.vue'
import { defineStore } from 'pinia'
// import sysuserindex from '@/views/sysuser/index'
import { defineAsyncComponent, resolveDynamicComponent } from 'vue'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Use names to determine if the current user has permission
 * @param names
 * @param route
 */
function hasPathPermission(paths, route) {
  if (route.path) {
    return paths.some((path) => route.path === path.path)
  } else {
    return true
  }
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  data.forEach((item) => {
    const menu = {
      path: item.path,
      component: item.component === 'Layout' ? Layout : loadView(item.component),
      hidden: item.visible !== '0',
      children: [],
      name: item.menuName,
      meta: {
        title: item.title,
        icon: item.icon,
        noCache: item.noCache
      }
    }
    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
}

export const loadView = (view) => {
  // 路由懒加载
  if (view.endsWith('.vue')) {
    view = view.substring(0, view.length-1-4)
  }

  // return (resolve) => require([`@/views${view}`], resolve)

  // NOTE vite 动态导入不识别 @ ？
  // NOTE The above dynamic import cannot be analyzed by Vite.
  // NOTE Plugin: vite:import-analysis
  // return defineAsyncComponent(() => import(`../../views${view}`))
  // return defineAsyncComponent(() =>import.meta.glob(`../../views${view}`))
  // return import(`../../views${view}.vue`)
  // return defineAsyncComponent(() => import(`@/views${view}.vue`))

  // TODO 如何更好的在运行时，动态导入组件 ？
  return () => import(`@/views${view}.vue`)
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param components
 */
export function filterAsyncPathRoutes(routes, paths) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPathPermission(paths, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncPathRoutes(tmp.children, paths)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  defaultRoutes: [],
  topbarRouters: [],
  sidebarRouters: []
}

const mutations = {
  SET_ROUTES: function(routes) {
    this.addRoutes = routes
    this.routes = constantRoutes.concat(routes)
  },
  SET_DEFAULT_ROUTES: function(routes) {
    this.defaultRoutes = constantRoutes.concat(routes)
  },
  SET_TOPBAR_ROUTES: function(routes) {
    // 顶部导航菜单默认添加统计报表栏指向首页
    // const index = [{
    //   path: 'dashboard',
    //   meta: { title: '统计报表', icon: 'dashboard' }
    // }]
    this.topbarRouters = routes // .concat(index)
  },
  SET_SIDEBAR_ROUTERS: function(routes) {
    this.sidebarRouters = routes
  }
}

const actions = {
  generateRoutes(roles) {
    return new Promise((resolve) => {
      const loadMenuData = []

      getRoutes()
        .then((response) => {
          // console.log(JSON.stringify(response))
          let data = response
          if (response.code !== 200) {
            this.$message({
              message: '菜单数据加载异常',
              type: 0
            })
          } else {
            data = response.data
            Object.assign(loadMenuData, data)

            generaMenu(asyncRoutes, loadMenuData)
            asyncRoutes.push({ path: '*', redirect: '/', hidden: true })
            this.SET_ROUTES(asyncRoutes)
            const sidebarRoutes = []
            generaMenu(sidebarRoutes, loadMenuData)
            this.SET_SIDEBAR_ROUTERS(constantRoutes.concat(sidebarRoutes))
            this.SET_DEFAULT_ROUTES(sidebarRoutes)
            this.SET_TOPBAR_ROUTES(sidebarRoutes)
            resolve(asyncRoutes)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    })
  }
}

const usePermissionStore = defineStore('permissionStore', {
  state: () => state,
  getters: {
    getPermissionRoutes: (state) => state.routes,
    getTopbarRouters: (state) => state.topbarRouters,
    getDefaultRoutes: (state) => state.defaultRoutes,
    getSidebarRouters: (state) => state.sidebarRouters
  },
  actions: {
    ...mutations,
    ...actions
  }
})

export { usePermissionStore }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
