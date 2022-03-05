
const Scope = require("./scope");
const walk = require("./acorn");

/*
 * 分析依赖：找出当前模块使用了哪些变量，哪些变量在当前模块声明，哪些从别的模块导入
 * @param {*} ast 语法树
 * @param {*} magicString 源代码
 * @param {*} module 属于哪个模块
 */
function analyse(ast, magicString, module) {
  let scope = new Scope(); // 创建一个模块内的全局作用域
  // 遍历当前语法树的所有顶级节点
  ast.body.forEach( statement => {
    // 给作用域添加变量 var function const let
    function addToScope (declaration) {
      var name = declaration.id.name; // 获得当前声明变量
      scope.add(name); // 把write()这个变量添加到当前全局作用域
      if(!scope.parent) {
        statement._defines[name] = true; // 在全局作用域下声明全局变量write
      }
    }
    Object.defineProperties(statement, {
      _defines: {value:{}}, // 存放当前模块定义的所有 全局变量
      _dependsOn: {value:{}}, // 当前模块没有定义但是使用到的变量，即依赖外部变量
      _included: {value:false}, // 防止语句被多次打包
      // start指此节点在源代码中的起始索引，end是结束索引
      _source: {value: magicString.snip(statement.start, statement.end)}
    });
    walk(statement, {
      enter(node, parent) {
        let newScope;
        switch (node.type) {
          case 'FunctionDeclaration':
            const params = node.params.map(x=>x.name);
            addToScope(node);
            // 遍历到函数声明，创建一个新的作用域链
            newScope = new Scope({
              parent: scope, // 父作用域就是当前作用域
              params
            })
            break;
          case 'VariableDeclaration': // 并不会生成新作用域
            node.declarations.forEach(addToScope);
            break;
        }
        if (newScope) { // 当前节点生成一个新作用域
          // 此节点生成一个新作用域，在该节点下放一个_scope，指向新的作用域
          Object.defineProperty(node, '_scope', {value: newScope});
          scope = newScope;
        }
      },
      leave(node) {
        if(node._scope) { // 此节点生成新的作用域，等离开这个节点，scope回到父作用域
          scope = scope.parent
        }
      }
    })
  });
  ast._scope = scope;
  // 找出外部依赖 _dependOn
  ast.body.forEach(statement => {
    walk(statement, {
      enter(node) {
        if(node._scope){ // 当前节点有一个scope，产生新的作用域
          scope = node._scope;
          console.log('-----遍历', node._scope);
        }
        
        if(scope && node.type === 'Identifier'){
          const definingScope = scope.findDefiningScope(node.name);
          if(!definingScope){
            statement._dependsOn[node.name] = true; // 外部依赖变量
          }
        }
      },
      leave(node) {
        if(node._scope) {
          scope = scope.parent
        }
      }
    })
  })
}
module.exports = analyse;