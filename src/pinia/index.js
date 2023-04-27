// 替代 Vuex 进行状态管理
/**
interface State {
  firstName: string
  lastName: string
  userId: number | null
}
*/

import { useAppStore } from './stores/app.js'
import { useErrorLogStore } from './stores/errorLog.js'
import { usePermissionStore } from './stores/permission.js'
import { useSettingsStore } from './stores/settings.js'
import { useSystemStore } from './stores/system.js'
import { useTagsViewStore } from './stores/tagsView.js'
import { useUserStore } from './stores/user.js'

// https://blog.csdn.net/qq_61233877/article/details/125099107
// https://blog.csdn.net/qq_45770253/article/details/123509461#t4

// pinia 不建议通过全局使用 store，它是扁平的？

export { useAppStore } from './stores/app.js'
export { useErrorLogStore } from './stores/errorLog.js'
export { usePermissionStore } from './stores/permission.js'
export { useSettingsStore } from './stores/settings.js'
export { useSystemStore } from './stores/system.js'
export { useTagsViewStore } from './stores/tagsView.js'
export { useUserStore } from './stores/user.js'

export default {
  useAppStore,
  useErrorLogStore,
  usePermissionStore,
  useSettingsStore,
  useSystemStore,
  useTagsViewStore,
  useUserStore
}
