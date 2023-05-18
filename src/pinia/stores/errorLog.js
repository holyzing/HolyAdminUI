import { defineStore } from 'pinia'

const state = {
  logs: []
}

const mutations = {
  ADD_ERROR_LOG: function(log) {
    this.logs.push(log)
  },
  CLEAR_ERROR_LOG: function() {
    this.logs.splice(0)
  }
}

const actions = {
  addErrorLog(log) {
    this.ADD_ERROR_LOG(log)
  },
  clearErrorLog() {
    this.CLEAR_ERROR_LOG()
  }
}

const useErrorLogStore = defineStore('errorLogStore', {
  state: () => state,
  getters: {
    getErrorLogs: (state) => state.logs
  },
  actions: {
    ...mutations,
    ...actions
  }
})

export { useErrorLogStore }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
