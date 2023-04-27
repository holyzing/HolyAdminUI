import adaptive from './adaptive'

/**
const install = function(Vue) {
  Vue.directive('el-height-adaptive-table', adaptive)
}

if (window.Vue) {
  window['el-height-adaptive-table'] = adaptive
  Vue.use(install); // eslint-disable-line
}

adaptive.install = install
export default adaptive
 */
const install = function(app) {
  app.directive('el-height-adaptive-table', adaptive)
}

if (window.app) {
  window['el-height-adaptive-table'] = adaptive
  window.app.use(install); // eslint-disable-line
}

adaptive.install = install
export default adaptive
