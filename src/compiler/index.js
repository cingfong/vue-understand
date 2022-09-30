// 11m00s
import { parseHTML } from './parse';
function genProps(attrs) {
    let str = ''// {name,value}
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {
            let obj = {};
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':');
                obj[key] = value;
            });
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{asdasd}} 匹配到的內容就是我們表達式的變量
function gen(node) {
    if (node.type === 1) {
        return codegen(node)
    } else {
        //文本
        let text = node.text
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        } else {
            let tokens = [];
            let match;
            defaultTagRE.lastIndex = 0;
            let lastIndex = 0
            while (match = defaultTagRE.exec(text)) {
                let index = match.index // 匹配位置 
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                tokens.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            if (lastIndex < text.length) {  // 若有剩餘文本，將剩餘文本放入tokens中
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join('+')})`
        }
    }
}

function genChildren(children) {
    return children.map(child => gen(child)).join(',')
}
function codegen(ast) {
    let children = genChildren(ast.children);
    let code = (`_c('${ast.tag}',${ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'
        }${ast.children.length ? `,${children}` : ''
        })`)
    return code;
}
export function compileToFunction(template) {

    // 1. 就是將 template 轉化成ast語法樹
    let ast = parseHTML(template);
    // 2. 生成render方法(render方法執行後的返回的結果就是 虛擬DOM)
    console.log(ast)
    console.log(codegen(ast))
}