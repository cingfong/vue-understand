const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);    // 他匹配到的分組是一個標籤名 <xxx 匹配到的是開始標籤的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);// 匹配到是 </xxx> 最終匹配到的分組就是結束標籤的名字

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;  // 匹配屬性
// 第一個分組就是屬性的key value 就是分組 3/分組4分組5
const startTagClose = /^\s*(\/?)>/;     //<div/> <br/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{asdasd}} 匹配到的內容就是我們表達式的變量

// vue3 採用的不是正則
// 對模板進行編譯處理
//*************************單標籤會出錯*************************************/
function parseHTML(html) {   // html 最開始肯定是 </div>
    const ELEMENT_TYPE = 1;
    const TEXT_TYPE = 3;
    const stack = [];   // 用於存放元素的
    let currentParent;  // 指向的是栈中最後一個
    let root;           // 根節點

    // 最終需要轉化成一顆抽象語法樹

    function createASTElement(tag, attrs) {
        return {
            tag,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }
    // 利用栈型結構 來構造一個樹
    function start(tag, attrs) {
        let node = createASTElement(tag, attrs); // 創造一個ast節點
        if (!root) {  // 看一下是否是空樹
            root = node; // 如果為空則當前是樹的根節點
        }
        if (currentParent) {
            node.parent = currentParent;    // 只賦予了parent屬性
            currentParent.children.push(node); // 還需要讓父親記住自己
        }
        stack.push(node);
        currentParent = node;   // currentParent為栈中的最後一個
    }
    function chars(text) {
        text = text.replace(/\s/g,'');  //如果空格超過2就刪除2以上的，是否導致文本中有空格都被移除?
        currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent
        })
    }
    function end(tag) {
        let node = stack.pop();    //彈出最後一個，node可以拿來校驗標籤是否合法
        currentParent = stack[stack.length - 1];
    }
    function advance(n) {
        html = html.substring(n);
    }
    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],   // 標籤名
                attrs: []
            }
            advance(start[0].length);
            // 如果不是開始標籤的結束 就一直匹配下去
            let attr, end;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] || true })
            }
            if (end) {
                advance(end[0].length)
            }
            return match;
        }
        return false    // 不是開始標籤
    }
    while (html) {
        // 如果 textEnd 為0 說明是一個開始標籤或者結束標籤
        // 如果 textEnd > 0 說明就是文本的結束標籤
        let textEnd = html.indexOf('<');    // 如果indexOf中的索引是 0 則說明是個標籤

        if (textEnd == 0) {
            const startTagMatch = parseStartTag();  // 開始標籤的匹配結果
            if (startTagMatch) { // 解析到的開始標籤
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue;
            }
            let endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1]);
                continue;
            }
        }
        if (textEnd > 0) {
            let text = html.substring(0, textEnd);   // 文本內容
            if (text) {
                chars(text)
                advance(text.length);   // 解析到的文本
            }
        }
    }
    console.log(html)
}
export function compileToFunction(template) {

    // 1. 就是將 template 轉化成ast語法樹
    let ast = parseHTML(template);
    // 2. 生成render方法(render方法執行後的返回的結果就是 虛擬DOM)
}