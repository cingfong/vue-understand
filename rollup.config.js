import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
    input: './src/index.js',    //以哪個文件作為打包的入口
    output: {
        file: 'dist/umd/vue.js', //出口路徑
        name: 'Vue',            //指定打包後全局變量名稱
        format: 'umd',      //統一模塊規範(commonjs、amd、life)
        sourcemap: true         // es6->es5 開啟原馬調適可以找到原代碼報錯位置
    },
    plugins: [   //使用的插件
        babel({
            exclude: "node_modules/**"
        }),
        process.env.ENV === 'development' ? serve({
            open: true,
            openPage: '/public/2.index.html',
            port: 8000,
            contentBase: ''
        }) : null
    ]
}