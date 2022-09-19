(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    function isObject(data) {
      // if (typeof data !== 'object' && data !== null) {
      //     return true;
      // }
      return typeof data === 'object' && data !== null;
    }

    // 重寫希望的數組中的部分方法
    let oldArrayProto = Array.prototype; // 獲取數組的原型

    let newArrayProto = Object.create(oldArrayProto);
    let methods = [// 找到所有的變異方法
    'push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']; // concat slice 都不會改變原數組

    methods.forEach(method => {
      newArrayProto[method] = function (...args) {
        // 重寫數組方法
        const result = oldArrayProto[method].call(this, ...args); // 內部調用原來的方法 ， 切片編成
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
        }

        if (inserted) {
          // 對新增的內容再次進行觀測
          ob.observeArray(inserted);
        } // console.log('method', method)


        return result;
      };
    });

    // 把data中的數據 都使用Object.defineProperty 重新定義 es5

    class Observer {
      constructor(data) {
        Object.defineProperty(data, '__ob__', {
          value: this,
          enumerable: false // 將__ob__變成不可枚舉()循環時無法獲取到

        }); // data.__ob__ = this; // 給數據加了一個標示，如果數據上有__ob__則說明這個屬性被觀測過了

        if (Array.isArray(data)) {
          //這裡可以重寫數組中的方法 7個變異方法 是可以修改數組本身的
          data.__proto__ = newArrayProto; // 需要保留數組原有的特性，並且可以重寫部分方法

          this.observeArray(data); // 如果數組中放的是對象，可以監控到對象的變化
        } else {
          // vue 如果數據層次過多，需要遞歸的去解析對象中的屬性，依次增加set和get方法
          this.walk(data);
        }
      }

      walk(data) {
        // let keys = Object.keys(data);
        // keys.forEach((key, index) => {
        //     defineReactive(data, key, data[key]);
        // })
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
      }

      observeArray(data) {
        // 觀測數組
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

          value = newValue;
        }

      });
    }

    function observe(data) {
      let isObj = isObject(data);
      if (!isObj) return;

      if (data.__ob__ instanceof Observer) {
        // 說明這個對象被代理過了
        return data.__ob__;
      } // 如果對象被劫持過了，那就不需要再被劫持了


      return new Observer(data); // 用來觀測數據
    }

    function initState(vm) {
      const opts = vm.$options; // vue 的數據來源 屬性 方法 數據 計算屬性 watch

      if (opts.props) ;

      if (opts.methods) ;

      if (opts.data) {
        initData(vm);
      }

      if (opts.computed) ;

      if (opts.watch) ;
    }

    function proxy(vm, target, key) {
      Object.defineProperty(vm, key, {
        get() {
          return vm[target][key];
        },

        set(newValue) {
          vm[target][key] = newValue;
        }

      });
    }

    function initData(vm) {
      //數據初始化工作
      let data = vm.$options.data; // 用戶傳遞的 data

      data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 對象劫持 用戶改變了數據 希望能得到通知 => 刷新頁面
      // MVVM 模式 數據變化驅動視圖變化 
      // Object.defineProperty() 給屬性增加get 方法和set方法

      observe(data); // 將vm._data 用vm代理就可以了

      for (let key in data) {
        proxy(vm, '_data', key);
      }
    }

    function initMixin(Vue) {
      // 初始化流程
      Vue.prototype._init = function (options) {
        // 數據的劫持
        const vm = this; // vue 中使用 this.$options 指代的就是用戶傳遞的屬性

        vm.$options = options; // 初始化狀態

        initState(vm); // 分割代碼
      };
    }

    // Vue 核心代碼，只是 Vue 的一個聲明

    function Vue(options) {
      //進行 Vue 的初始化操作
      this._init(options);
    }

    initMixin(Vue); // 給Vue原型上添加一個_init方法

    return Vue;

}));
//# sourceMappingURL=vue.js.map
