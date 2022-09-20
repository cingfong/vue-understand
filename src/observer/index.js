// 把data中的數據 都使用Object.defineProperty 重新定義 es5
// Object.definProperty 不能兼容 ie8 及以下 vue2 不能兼容ie8以下
import { isObject } from '../util/index.js';
import { newArrayProto } from './array';

class Observer {
    constructor(data) {
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false // 將__ob__變成不可枚舉()循環時無法獲取到
        })
        // data.__ob__ = this; // 給數據加了一個標示，如果數據上有__ob__則說明這個屬性被觀測過了
        if (Array.isArray(data)) {
            //這裡可以重寫數組中的方法 7個變異方法 是可以修改數組本身的
            data.__proto__ = newArrayProto // 需要保留數組原有的特性，並且可以重寫部分方法
            this.observeArray(data);        // 如果數組中放的是對象，可以監控到對象的變化

        } else {
            // vue 如果數據層次過多，需要遞歸的去解析對象中的屬性，依次增加set和get方法
            this.walk(data);
        }
    }
    walk(data) {
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }
    observeArray(data) { // 觀測數組
        data.forEach(item => observe(item));
    }
}

function defineReactive(data, key, value) {
    observe(value); // 遞歸實現深度檢測
    Object.defineProperty(data, key, {
        get() {
            return value;
        },
        set(newValue) {
            if (newValue === value) return;
            observe(newValue); // 繼續劫持用戶設置的值，因為有可能用戶設置是一個對象(新值若是全新的object 沒有設置會無法劫持)
            value = newValue
        }
    })
}

export function observe(data) {
    let isObj = isObject(data);
    if (!isObj) return;
    if (data.__ob__ instanceof Observer) {  // 說明這個對象被代理過了
        return data.__ob__;
    }
    // 如果對象被劫持過了，那就不需要再被劫持了
    return new Observer(data); // 用來觀測數據
}