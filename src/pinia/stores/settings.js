import variables from '@/styles/element-variables.module.scss'
import defaultSettings from '@/settings.js'
import { defineStore } from 'pinia'

const { showSettings, topNav, tagsView, fixedHeader, sidebarLogo, themeStyle } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  topNav: topNav,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  themeStyle: themeStyle
}

const actions = {
  changeSetting(data) {
    const {key, value} = data
    if (this.hasOwnProperty(key)) {
        this[key] = value
    }
  }
}

const useSettingsStore = defineStore('settingsStore', {
  state: () => state,
  actions: {
    ...actions
  }
})

export { useSettingsStore }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
