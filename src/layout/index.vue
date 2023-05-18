<template>
  <div :class="classObj.value" class="app-wrapper" :style="{'--current-color': settingsStore.theme}">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <side-bar class="sidebar-container" :style="{ backgroundColor: settingsStore.themeStyle === 'dark' ? variables.menuBg : variables.menuLightBg }" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script setup name="Layout">
import scss_color_variables from '@/styles/variables.module.scss'; 
// NOTE 以 module 编译 就不需要 inline 的参数 
// TODO 两种模式下分别都是啥意思 ？
import RightPanel from '@/components/RightPanel/index.vue';
import { AppMain, Navbar, Settings, Sidebar as SideBar, TagsView } from './components/index.js';
import useResizeHandler from './mixin/ResizeHandler.js';
// import { mapState } from 'pinia'
import { storeToRefs } from 'pinia';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { useAppStore, useSettingsStore } from '@/pinia/index.js';
// Default and named imports from CSS files are deprecated. Use the ?inline query instead.

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const {sidebar, device} =  storeToRefs(appStore);
const {showSettings, tagsView: needTagsView, fixedHeader} = storeToRefs(settingsStore);

function beforeMoute() {
  console.log('------------------ 没什么 卵用------>')
}
onBeforeMount(() => {
  // console.log('----onBeforeMount--->', variables.value.menuBg, classObj.value.mobile, variables.menuBg, classObj.mobile)
})

onMounted(() => {
})

const classObj = computed(() => {
  return {
    hideSidebar: !sidebar.value.opened,
    openSidebar: sidebar.value.opened,
    withoutAnimation: sidebar.value.withoutAnimation,
    mobile: device === 'mobile'
  }
});

// NOTE 手写 computed：https://zhuanlan.zhihu.com/p/533380866
// NOTE 原理 computed: https://zhuanlan.zhihu.com/p/526991742
const variables = computed(() => {
  // get: () => scss_color_variables variables.value is undefined
  return scss_color_variables
})

// const variables =  ref(scss_color_variables)

function handleClickOutside() {
  appStore.closeSideBar({ withoutAnimation: false })
}

const { $_isMobile, $_resizeHandler } = useResizeHandler(device, sidebar)

// https://github.com/JohnnyZhangQiao/pinia-use/blob/master/src/components/PiniaBasicOptions.vue
// https://juejin.cn/post/7089032094231298084
// https://blog.csdn.net/weixin_56663198/article/details/127606215

/**
export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    variables() {
      return variables
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
*/
</script>

<style lang="scss" scoped>
  @import "@/styles/mixin.scss";
  @import "@/styles/variables.module.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
