let MagicString = require("magic-string");
const { parse } = require("acorn");
const analyse = require("./ast/analyse.js");

// 判断obj对象上是否有prop属性
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
 * 每个文件都是一个模块，每个模块都会有一个Module实例
 */

class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code, { filename: path });
    this.path = path; // 模块的路径
    this.bundle = bundle; // 属于哪个bundle的实例
    this.ast = parse(code, {
      // 把源代码转换成抽象语法树
      ecmaVersion: 6,
      sourceType: "module",
    });
    this.analyse();
  }
  // 分析
  analyse() {
    this.imports = []; // 存放当前模块的所有导入
    this.exports = []; // 存放当前模块的所有导出
    this.ast.body.forEach((node) => {
      if (node.type === "ImportDeclaration") {
        // 这是一个导入声明语句
        let source = node.source.value; // ./test.js 从哪个模块进行的导入
        let specifiers = node.specifiers;
        specifiers.forEach((specifier) => {
          let name = specifier.imported ? specifier.imported.name : ""; // name
          let localName = specifier.local ? specifier.local.name : ""; // name

          // 本地的哪个变量，是从哪个模块的哪个变量导出的
          // this.imports.age = {name: 'age', localName: "age", source: './test.js}
          this.imports[localName || name] = { name, localName, source };
        });
      } else if (node.type === "ExportNamedDeclaration") {
        let declaration = node.declaration;
        if (declaration.type === "VariableDeclaration") {
          let name = declaration.declarations[0].id.name; // age
          // 记录一下当前模块的导出，这个age是通过哪个表达式创建的
          // this.exports['age'] = {node, localName: name, expression}
          this.exports[name] = {
            node,
            localName: name,
            expression: declaration,
          };
        }
      }
      // else if (/^Export/.test(node.type)) {
      //   let declaration = node.declaration;
      //   if (!declaration.declarations) return // 无声明直接返回，引入类等情况未考虑
      //   let name = declaration.declarations[0].id.name; // age
      //   // 记录一下当前模块的导出，这个age是通过哪个表达式创建的
      //   // this.exports['age'] = {node, localName: name, expression}
      //   this.exports[name] = {
      //     node,
      //     localName: name,
      //     expression: declaration
      //   }
      // }
    });
    analyse(this.ast, this.code, this);
    this.definitions = {}; // 存放所有全局变量的定义语句
    this.ast.body.forEach(statement => {
      Object.keys(statement._defines).forEach(name => {
        this.definitions[name] = statement; // 全局变量语句
      })
    })
  }
  // 展开这个模块的语句，把这些语句中定义的变量的语句都放到结果里
  expandAllStatements() {
    let allStatements = [];
    console.log('this.ast--', this.ast)
    this.ast.body.forEach((statement) => {
      if(statement.type === 'ImportDeclaration') return; // 导入声明不打包
      let statements = this.expandStatement(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }
  // 展开一个节点：找到当前节点依赖的变量，访问的变量以及这些变量的声明语句
  // 这些语句可能是在当前模块声明的，也可能是在导入的模块声明的
  expandStatement(statement) {
    let result = [];
    const dependencies = Object.keys(statement._dependsOn); // 外部依赖
    console.log('statement._dependsOn---', statement._dependsOn)
    console.log('dependencies---', dependencies)
    dependencies.forEach(name=> {
      // 找到定义这个变量的声明节点
      let definition = this.define(name);
      result.push(...definition);
    })
    if (!statement._included) {
      console.log("set --- statement._included");
      // statement._included = true; // 这个节点已被添加入结果，以后不需要重复添加:  TODO：include不允许修改赋值
      // tree-shaking核心在此处
      result.push(statement);
    }
    return result;
  }
  define(name) {
    // 查找导入变量中有无name
    if(hasOwnProperty(this.imports, name)) {
      // this.imports.age = {name: 'age', localName: "age", source: './test.js}
      const importDeclaration = this.imports[name]
      // 获取依赖模块
      const module = this.bundle.fetchModule(importDeclaration.source, this.path)
      // this.exports['age'] = {node, localName: name, expression}
      // const exportData= module.exports[importDeclaration.name]
      // 调用依赖模块方法，返回定义变量的声明语句   exportData.localName
      return module.define(name)
    } else {
      // key是当前模块变量名，value是定义这个变量的语句
      let statement = this.definitions[name];
      // 变量存在且变量未被标记
      console.log('define--log', statement && statement._included)
      if (statement && !statement._included) {
        return this.expandStatement(statement);
      } else {
        return []
      }
    }
  }
}

module.exports = Module;
