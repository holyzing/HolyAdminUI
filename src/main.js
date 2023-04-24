import { createApp } from 'vue'
import { createPinia } from 'pinia' // 替代 Vuex 进行状态管理

// NOTE 浏览器样式统一与修复 https://github.com/necolas/normalize.css
import 'normalize.css/normalize.css'
// NOTE https://codemirror.net/ 已经发布了版本 6，版本六中没有这个 css 文件
// import 'codemirror/lib/codemirror.css'
// NOTE https://www.remixicon.cn/
import 'remixicon/fonts/remixicon.css'

// VUE2 import Vue from 'vue'
// import VueDND from 'awe-dnd'              // NOTE 组件拖拽插件, 暂不确认是否支持 vue3，但vue3 可以使用 https://haochenguang.gitee.io/vue3-dnd/guide/ 来替代
// import Viser from 'viser-vue'             // NOTE 数据可视化组件（绘制饼图），不兼容vue3, 可使用 g2plot 替代
import Cookies from 'js-cookie' // NOTE 处理 cookie 的工具库
// import Element from 'element-ui'          // NOTE 基于 vue2 的强大的 UI 组件库， Vue3 使用 element-plus
import Element from 'element-plus' // NOTE 基于 vue3 的强大的 UI 组件库   https://element-plus.gitee.io/zh-CN/guide/design.html
// import VueParticles from 'vue-particles'  // NOTE 2018年 最后一次更新的 动态粒子特效插件，并没有说明支持 vue3，使用 particles.vue3 代替
import VueParticles from 'particles.vue3' // NOTE 依赖 vue-particles 实现的 支持 Vue3 的动态粒子特效
import VueCodemirror from 'vue-codemirror' // NOTE 封装了 codemirror 的 vue 组件
// ------------------------------------------------------------------

//
/**
 NOTE Preprocessor dependency "sass" not found.
 Sass 是一门高于 CSS 的元语言，它能用来清晰地、结构化地描述文件样式，有着比普通 CSS 更加强大的功能，扩展名是 .sass。
 Scss 是 Sass 3 引入新的语法，是Sassy CSS的简写，是CSS3语法的超集，也就是说所有有效的CSS3样式也同样适合于Sass，扩展名是 .scss。
 Scss就是Sass的升级版，贴近于CSS的写法。

 开发阶段使用，发布生产包会编译成 浏览器识别的 css
 https://www.sass.hk/
 */

import App from './App.vue'
// TODO import store from './store'
import router from './router'
import permission from './directive/permission'
import * as filters from './filters' // global filters

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import './styles/element-variables.scss'
// ------------------------------------------------------------------

import '@/utils/dialog'
import { getDicts } from '@/api/admin/dict/data'
import { getItems, setItems } from '@/api/table'
import { getConfigKey } from '@/api/admin/sys-config'
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  /* download,*/ selectItemsLabel
} from '@/utils/costum'

import '@/styles/index.scss' // global css
import '@/styles/admin.scss'
import Pagination from '@/components/Pagination/index.vue'
import BasicLayout from '@/layout/BasicLayout.vue'
// ------------------------------------------------------------------

const app = createApp(App)

// 处理所有后代组件的错误
app.config.errorHandler = (err) => {
  // TODO handle all error
  console.log(err)
}

app.config.warnHandler = (warn) => {
  // TODO handle all error
  console.log(warn)
}

// 全局方法挂载 https://blog.csdn.net/m0_63969219/article/details/124579365
// VUE2 Vue.prototype.getDicts = getDicts
app.provide('getDicts', getDicts)
app.provide('getItems', getItems)
app.provide('setItems', setItems)
app.provide('getConfigKey', getConfigKey)
app.provide('parseTime', parseTime)
app.provide('resetForm', resetForm)
app.provide('addDateRange', addDateRange)
app.provide('selectDictLabel', selectDictLabel)
app.provide('selectItemsLabel', selectItemsLabel)

// 插件安装
// VUE2 Vue.use(Viser)
app.use(router)
app.use(createPinia())
app.use(permission)
// app.use(Viser)
// app.use(VueDND)
app.use(VueParticles)
app.use(VueCodemirror)
app.use(Element, { size: Cookies.get('size') || 'medium' }) // set element-ui default size

// 挂载全局组件
// VUE2 Vue.component('Pagination', Pagination)
app.component('Pagination', Pagination)
app.component('BasicLayout', BasicLayout)

// VUE2 Vue.config.productionTip = false
// TODO 使用 symbol
app.provide('productionTip', false)

// VUE2 Vue.prototype.msgSuccess = function (msg) {
// VUE2   this.$message({ showClose: true, message: msg, type: 'success' })
// VUE2 }

app.config.globalProperties.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}
app.config.globalProperties.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}
app.config.globalProperties.msgInfo = function(msg) {
  this.$message.info(msg)
}

console.info(`
欢迎使用go-admin，谢谢您对我们的支持，在使用过程中如果有什么问题，请访问
https://github.com/go-admin-team/go-admin
或者
https://github.com/go-admin-team/go-admin-ui
向我们反馈，谢谢！`)

// VUE2 Object.keys(filters).forEach((key) => { Vue.filter(key, filters[key]) })
Object.keys(filters).forEach((key) => {
  app.filter(key, filters[key])
})

// VUE2 new Vue({ el: '#app', router, store, render: (h) => h(App) })
app.mount('#app') // 返回根组件实例, 可以链式调用
