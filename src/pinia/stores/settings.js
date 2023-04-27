import variables from '@/styles/element-variables.scss?inline'
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

const mutations = {
  CHANGE_SETTING: ({ key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (this.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting(data) {
    this.CHANGE_SETTING(data)
  }
}

const useSettingsStore = defineStore('settingsStore', {
  state: () => state,
  actions: {
    ...mutations,
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
