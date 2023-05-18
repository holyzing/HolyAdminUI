<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color=" themeStyle === 'light' ? variables.menuLightBg : variables.menuBg"
        :text-color="themeStyle === 'light' ? 'rgba(0,0,0,.65)' : '#fff'"
        :active-text-color="theme"
        :unique-opened="true"
        :collapse-transition="true"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route) in sidebarRouters"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />

      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { useSettingsStore, useAppStore, usePermissionStore } from '@/pinia/index.js'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/variables.module.scss'
import { mapState } from 'pinia'

export default {
  name: 'Sidebar',
  components: { SidebarItem, Logo },
  computed: {
    ...mapState(usePermissionStore, [
      'sidebarRouters'
    ]),
    ...mapState(useAppStore, [
      'sidebar'
    ]),
    ...mapState(useSettingsStore, [
      'sidebarLogo', 'themeStyle', 'theme'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>
