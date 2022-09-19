// Vue 核心代碼，只是 Vue 的一個聲明
import { initMixin } from './init';
function Vue(options) {
    //進行 Vue 的初始化操作
    this._init(options);
}
initMixin(Vue); // 給Vue原型上添加一個_init方法
export default Vue