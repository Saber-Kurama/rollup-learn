const fs = require("fs");
const path = require("path");
const { default: MagicString } = require("magic-string");
const Module = require('./module.js');
const analyse = require('./ast/analyse.js');

class Bundle {
  constructor(options) {
    // 入口文件的绝对路径，包括后缀
    this.entryPath = options.entry.replace(/\.js$/, "") + ".js";
    this.module = {}; // 存放所有模块、入口文件和他依赖的模块
  }
  build(outputFileName) {
    // 从入口文件的绝对路径出发找到它的模块定义
    let entryModule = this.fetchModule(this.entryPath);
    // 把这个入口模块所有的语句进行展开，返回所有的语句组成的数组
    this.statements = entryModule.expandAllStatements();
    const {code} = this.generate();
    // console.log("??XXXX");
    // const code = "sanber";
    fs.writeFileSync(outputFileName, code, "utf-8");
  }
  // 获取模块信息
  fetchModule(import_path, importer) {
    let route
    if(!importer){ // 若没有模块导入此模块，这就是入口模块
      route = import_path 
    }
    if(route){
      // 读出此模块代码
      let code = fs.readFileSync(route, 'utf8');
      let module = new Module({
        code, // 模块源代码
        path: route, // 模块绝对路径
        bundle: this // 属于哪个bundle
      });
      return module;
    }
  }
  // 把this.statements生成代码
  generate() {
    let magicString = new MagicString.Bundle();
    this.statements.forEach(statement => {
      const source = statement._source;
      // if (statement.type === 'ExportNamedDeclaration'){
      //   source.remove(statement.start, statement.declaration.start)
      // }
      magicString.addSource({
        content:source,
        separator:'\n'
      });
    });
    return {code: magicString.toString()};
  }
}

module.exports = Bundle;
