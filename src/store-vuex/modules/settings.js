import variables from '@/styles/element-variables.scss?inline'
import defaultSettings from '@/settings.js'

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
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

