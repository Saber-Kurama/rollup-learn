let MagicString = require('magic-string');
const {parse} = require('acorn');
const analyse = require('./ast/analyse.js')
/**
 * 每个文件都是一个模块，每个模块都会有一个Module实例
 */

class Module {
  constructor({code, path, bundle}) {
    this.code = new MagicString(code, {filename: path});
    this.path = path; // 模块的路径
    this.bundle = bundle; // 属于哪个bundle的实例
    this.ast = parse(code, { // 把源代码转换成抽象语法树
      ecmaVersion: 6,
      sourceType: 'module'
    });
    this.analyse();
  }
  // 分析
  analyse() {
    analyse(this.ast, this.code, this)
  }
  // 展开这个模块的语句，把这些语句中定义的变量的语句都放到结果里
  expandAllStatements() {
    let allStatements = [];
    this.ast.body.forEach( statement => {
      let statements = this.expandStatement(statement);
      allStatements.push(...statements);
    })
    return allStatements;
  }
  // 展开一个节点：找到当前节点依赖的变量，访问的变量以及这些变量的声明语句
  // 这些语句可能是在当前模块声明的，也可能是在导入的模块声明的
  expandStatement(statement) {
    let result = []
    if (!statement._included){
      console.log('set --- statement._included')
      // statement._included = true; // 这个节点已被添加入结果，以后不需要重复添加:  TODO：include不允许修改赋值
      // tree-shaking核心在此处
      result.push(statement); 
    }
    return result
  }
}

module.exports =  Module