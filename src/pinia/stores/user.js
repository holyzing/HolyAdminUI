import { login, logout, getInfo, refreshtoken } from '@/api/user.js'
import { getToken, setToken, removeToken } from '@/utils/auth.js'
import router, { resetRouter } from '@/router/index.js'
import storage from '@/utils/storage'
import { defineStore } from 'pinia'

import { usePermissionStore } from './permission.js'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  permissions: [],
  permisaction: []
}

const actions = {
  // user login
  login(userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then((response) => {
          const { token } = response
          this.token = token
          setToken(token)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo() {
    return new Promise((resolve, reject) => {
      getInfo()
        .then((response) => {
          if (!response || !response.data) {
            this.token = ''
            removeToken()
            resolve()
          }

          const { roles, name, avatar, introduction, permissions } = response.data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }
          this.permissions = permissions
          this.roles = roles
          this.name = name
          if (avatar.indexOf('http') !== -1) {
            this.avatar = avatar
          } else {
            this.avatar = process.env.VITE_BASE_API + avatar
          }
          this.introduction = introduction
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // 退出系统
  LogOut() {
    return new Promise((resolve, reject) => {
      logout(this.token)
        .then(() => {
          this.token = ''
          this.roles = []
          this.permissions = []
          removeToken()
          storage.clear()
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // 刷新token
  refreshToken() {
    return new Promise((resolve, reject) => {
      refreshtoken({ token: this.token })
        .then((response) => {
          const { token } = response
          this.token = token
          setToken(token)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  async resetToken() {
    return await new Promise((resolve) => {
      this.token = ''
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles(role) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const token = role + '-token'

      this.token = token
      setToken(token)

      const { roles } = await getInfo()

      resetRouter()

      const permissionStore = usePermissionStore()

      // generate accessible routes map based on roles
      // const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
      const accessRoutes = await permissionStore.generateRoutes(roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

const useUserStore = defineStore('userStore', {
  state: () => state,
  getters: {
    getName: () => this.name,
    getToken: (state) => this.token,
    getRoles: (state) => state.roles,
    getAvatar: (state) => state.avatar,
    getIntroduction: (state) => state.introduction,
    getPermisaction: (state) => state.permisaction
  },
  actions: {
    ...actions
  }
})

export { useUserStore }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
