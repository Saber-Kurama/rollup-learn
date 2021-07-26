
const Scope = require("./scope");

/*
 * 分析依赖：找出当前模块使用了哪些变量，哪些变量在当前模块声明，哪些从别的模块导入
 * @param {*} ast 语法树
 * @param {*} magicString 源代码
 * @param {*} module 属于哪个模块
 */
function analyse(ast, magicString, module) {
  let scope = new Scope(); // 创建一个模块内的全局作用域
  //
  ast.body.forEach( statement => {
    console.log('statement', statement)
    Object.defineProperties(statement, {
      _defines: {value:{}}, // 存放当前模块定义的所有 全局变量
      _dependsOn: {value:{}}, // 当前模块没有定义但是使用到的变量，即依赖外部变量
      _included: {value:false}, // 防止语句被多次打包
      // start指此节点在源代码中的起始索引，end是结束索引
      _source: {value: magicString.snip(statement.start, statement.end)}
    });
  })
}
module.exports = analyse;