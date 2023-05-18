// import store from '@/store/index.js'

import { useAppStore } from '@/pinia/index.js'
import { watch, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default function useResizeHandler(device, sidebar) {
  // NOTE 通过配置声明周期钩子函数,在这里不起用作用，需要在 setup 中起作用
  function beforMount() {
    console.log('setup outter', 'beforMount')
  }

  function sayHelloSetup() {
    console.log('setup outter', sayHelloSetup)
  }

  const appStore = useAppStore()
  const route = useRoute()

  function $_isMobile() {
    const rect = body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  function $_resizeHandler() {
    if (!document.hidden) {
      const isMobile = $_isMobile()
      const appStore = useAppStore()
      appStore.toggleDevice(isMobile ? 'mobile' : 'desktop')
      // store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

      if (isMobile) {
        appStore.closeSideBar({ withoutAnimation: true })
        // store.dispatch('app/closeSideBar', { withoutAnimation: true })
      }
    }
  }

  watch(
    () => route.path,
    (newRoute, oldRoute) => {
      // NOTE 运行时，组合式API中有变量 device, sidebar
      if (device === 'mobile' && sidebar.opened) {
        appStore.closeSideBar({ withoutAnimation: false })
      }
    }
  )

  // NOTE 通过生命周期钩子函数在 setup 中设置声明周期回调函数, 组合式 API 中是没有 this 的
  onBeforeMount(() => {
    // console.log('setup outter', 'onBeforeMount', this)
    window.addEventListener('resize', $_resizeHandler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', $_resizeHandler)
  })

  onMounted(() => {
    const isMobile = $_isMobile()
    if (isMobile) {
      // const appStore = useAppStore()
      appStore.toggleDevice('mobile')
      appStore.closeSideBar({ withoutAnimation: true })
    }
  })

  return {
    $_isMobile,
    $_resizeHandler,
  }
}

/**
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
      }
    }
  }
*/
