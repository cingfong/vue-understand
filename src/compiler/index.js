// const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
// const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// const startTagOpen = new RegExp(`^${qnameCapture}`);    // 他匹配到的分組是一個標籤名 <xxx 匹配到的是開始標籤的名字
// const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);// 匹配到是 </xxx> 最終匹配到的分組就是結束標籤的名字

// const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;  // 匹配屬性
// // 第一個分組就是屬性的key value 就是分組 3/分組4分組5
// const startTagClose = /^\s*(\/?)>/;     //<div/> <br/>
// const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{asdasd}} 匹配到的內容就是我們表達式的變量

// // vue3 採用的不是正則
// // 對模板進行編譯處理
// function parseHTML(html) {   // html 最開始肯定是 </div>
//     function parseStartTag() {
//         const start = html.match(startTagOpen);
//         if (start) {
//             const match = {
//                 tagName: start[1],   // 標籤名
//                 attrs: []
//             }
//             console.log(match)
//         }
//         return false    // 不是開始標籤
//     }
//     while (html) {
//         // 如果 textEnd 為0 說明是一個開始標籤或者結束標籤
//         // 如果 textEnd > 0 說明就是文本的結束標籤
//         let textEnd = html.indexOf('<');    // 如果indexOf中的索引是 0 則說明是個標籤

//         if (textEnd == 0) {
//             parseStartTag();
//             break;
//         }
//     }

// }
export function compileToFunction(template) {

    // 1. 就是將 template 轉化成ast語法樹
    // let ast = parseHTML(template)
    console.log(template)
    // 2. 生成render方法(render方法執行後的返回的結果就是 虛擬DOM)
}