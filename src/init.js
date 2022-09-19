import { initState } from './state'
// 在原型上添加一個 init 方法
export function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
        // 數據的劫持
        const vm = this; // vue 中使用 this.$options 指代的就是用戶傳遞的屬性
        vm.$options = options;
        // 初始化狀態
        initState(vm); // 分割代碼
    }
}