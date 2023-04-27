import { login, logout, getInfo, refreshtoken } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
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

const mutations = {
  SET_TOKEN: (token) => {
    this.token = token
  },
  SET_INTRODUCTION: (introduction) => {
    this.introduction = introduction
  },
  SET_NAME: (name) => {
    this.name = name
  },
  SET_AVATAR: (avatar) => {
    if (avatar.indexOf('http') !== -1) {
      this.avatar = avatar
    } else {
      this.avatar = process.env.VUE_APP_BASE_API + avatar
    }
  },
  SET_ROLES: (roles) => {
    this.roles = roles
  },
  SET_PERMISSIONS: (permisaction) => {
    this.permisaction = permisaction
  }
}

const actions = {
  // user login
  login(userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then((response) => {
          const { token } = response
          this.SET_TOKEN(token)
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
            this.SET_TOKEN('')
            removeToken()
            resolve()
          }

          const { roles, name, avatar, introduction, permissions } = response.data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }
          this.SET_PERMISSIONS(permissions)
          this.SET_ROLES(roles)
          this.SET_NAME(name)
          this.SET_AVATAR(avatar)
          this.SET_INTRODUCTION(introduction)
          resolve(response)
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
          this.SET_TOKEN('')
          this.SET_ROLES([])
          this.SET_PERMISSIONS([])
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
          this.SET_TOKEN(token)
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
      this.SET_TOKEN('')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles(role) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const token = role + '-token'

      this.SET_TOKEN(token)
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
    ...mutations,
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
