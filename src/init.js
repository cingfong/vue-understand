import { compileToFunction } from './compiler/index'
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
        if (options.el) {
            vm.$mount(options.el);  // 實力數據的掛載
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        el = document.querySelector(el);
        let ops = vm.$options
        if (!ops.render) {  // 先進行查找有沒有render函數
            let template;   // 沒有render看一下是否寫了tempate，沒寫temmplate採用外部的template
            if (!ops.template && el) {  // 沒有寫模板 但寫了el
                template = el.outerHTML
            } else {
                if (el) {
                    template = ops.template
                }
            }
            // 寫的template 就用 寫了的template
            if (template) {
                // 這裡需要對模板進行編譯
                const render = compileToFunction(template);
                ops.render = render;    // jsx 最終會被編譯成h('xxx')
            }
        }
        ops.render; // 最終就可以獲取render方法

        // script 標籤引用的vue.global.js 這個編譯過程是在瀏覽器運行的
        // runtime是不包含模板編譯的，整個編譯室打包的時候通過loader來轉義.vue文件的，用runtime的時候不能使用template
    }
}