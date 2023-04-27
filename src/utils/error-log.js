// import Vue from 'vue'
// import store from '@/store/index.js'
import { isString, isArray } from '@/utils/validate.js'
// import settings from '@/settings'
import settings from '@/settings.js'
import { useErrorLogStore } from '@/pinia/stores/errorLog'

// you can set in settings.js
// errorLog:'production' | ['production', 'development']
const { errorLog: needErrorLog } = settings

function checkNeed() {
  const env = process.env.NODE_ENV
  if (isString(needErrorLog)) {
    return env === needErrorLog
  }
  if (isArray(needErrorLog)) {
    return needErrorLog.includes(env)
  }
  return false
}

if (checkNeed()) {
  Vue.config.errorHandler = function (err, vm, info, a) {
    // Don't ask me why I use Vue.nextTick, it just a hack.
    // detail see https://forum.vuejs.org/t/dispatch-in-vue-config-errorhandler-has-some-problem/23500
    Vue.nextTick(() => {
      const errorLogStore = useErrorLogStore()
      errorLogStore.addErrorLog(err, vm, info, window.location.href)
      console.error(err, info)
    })
  }
}
