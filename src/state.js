import { observe } from './observer/index.js'
export function initState(vm) {
    const opts = vm.$options;
    // vue 的數據來源 屬性 方法 數據 計算屬性 watch
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethod(vm);
    }
    if (opts.data) {
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
    if (opts.watch) {
        initWatch(vm);
    }
}
function initProps() { }
function initMethod() { }
function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key];
        },
        set(newValue) {
            vm[target][key] = newValue;
        }
    })

}
function initData(vm) {
    //數據初始化工作
    let data = vm.$options.data;// 用戶傳遞的 data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    // 對象劫持 用戶改變了數據 希望能得到通知 => 刷新頁面
    // MVVM 模式 數據變化驅動視圖變化 

    // Object.defineProperty() 給屬性增加get 方法和set方法
    observe(data);
    // 將vm._data 用vm代理就可以了
    for (let key in data) {
        proxy(vm, '_data', key);
    }
}
function initComputed() { }
function initWatch() { } 