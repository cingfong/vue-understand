// 重寫希望的數組中的部分方法


let oldArrayProto = Array.prototype; // 獲取數組的原型
export let newArrayProto = Object.create(oldArrayProto);

let methods = [ // 找到所有的變異方法
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]   // concat slice 都不會改變原數組
methods.forEach(method => {
    newArrayProto[method] = function (...args) {    // 重寫數組方法
        const result =
            oldArrayProto[method].call(this, ...args)// 內部調用原來的方法 ， 切片編成
        // 需要對新增的數組進行劫持
        let inserted;
        let ob = this.__ob__;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
            default:
                break;
        }
        if (inserted) {
            // 對新增的內容再次進行觀測
            ob.observeArray(inserted);
        }
        // console.log('method', method)
        return result;
    }
})

