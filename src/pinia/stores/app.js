import Cookies from 'js-cookie'
import { defineStore } from 'pinia'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium'
}

// export const useAppStore = defineStore('AppStore', {
//     state: state,
//     actions:
// })

const mutations = {
  TOGGLE_SIDEBAR: () => {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = false
    if (this.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (device) => {
    this.device = device
  },
  SET_SIZE: (size) => {
    this.size = size
    Cookies.set('size', size)
  }
}
/**
const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}
*/

const actions = {
  toggleSideBar() {
    this.TOGGLE_SIDEBAR()
  },
  closeSideBar({ withoutAnimation }) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  },
  toggleDevice(device) {
    this.TOGGLE_DEVICE(device)
  },
  setSize(size) {
    this.SET_SIZE(size)
  }
}

// NOTE https://blog.csdn.net/weixin_44096391/article/details/127549594 commit 和 dispatch

const useAppStore = defineStore('appStore', {
  state: () => state,
  getters: {
    getSidebar: (state) => state.sidebar,
    getSize: (state) => state.size,
    getDevice: (state) => state.device
  },
  actions: {
    ...mutations,
    ...actions
  }
})

export { useAppStore }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
