import { getSetting } from '@/api/login'
import storage from '@/utils/storage'
import { defineStore } from 'pinia'
const state = {
  info: storage.get('app_info')
}

const mutations = {
//   SET_INFO(data) => {
// 箭头函数 无法注入 this
// https://blog.csdn.net/xu4321083/article/details/79753800
  SET_INFO(data) {
    this.info = data
    storage.set('app_info', data)
  }
}

const actions = {
  settingDetail() {
    return new Promise((resolve, reject) => {
      getSetting()
        .then((response) => {
          const { data } = response
          this.SET_INFO(data)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

const useSystemStore = defineStore('systemStore', {
  state: () => state,
  getters: {
    getAppInfo: (state) => state.info
  },
  actions: {
    ...mutations,
    ...actions
  }
})

export { useSystemStore }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
