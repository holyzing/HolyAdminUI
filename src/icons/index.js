type: "module"

// import Vue from 'vue'
// import _ from '@/components/SvgIcon/index.vue'// svg component

// register globally
// Vue.component('svg-icon', SvgIcon)

// const req = require.context('./svg', false, /\.svg$/)
// const requireAll = requireContext => requireContext.keys().map(requireContext)
// requireAll(req)

// https://blog.csdn.net/weixin_45709829/article/details/123782651
// 获取 keys 的几种方法

// @ts-ignore 忽略TS 类型检查
// -----------------------------

const imports = import.meta.glob('./svg/*.svg')

Object.keys(imports)

const importsAll = function (imports) {
    // caught ReferenceError: keys is not defined
    // NOTE: 当成 TS 了 ？
    let keys1 = []
    for (let key in imports) {
        keys1.push(key)
    }
    const keys = Object.keys(imports)
    console.log(typeof Object, typeof keys1, typeof keys) // fuction, object
    return keys.map(imports)
}
const icons = importsAll(imports)
export default icons
