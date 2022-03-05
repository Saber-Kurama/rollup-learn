/*
 * @param {*} ast 要遍历的语法树
 * @param {*} param1 配置对象
 */
function walk(ast, {enter, leave}) {
  visit(ast, null, enter, leave)
}
/**
 * 访问此node节点
 * @param {*} node 遍历的节点
 * @param {*} parent 父节点
 * @param {*} enter 进入的方法
 * @param {*} leave 离开的方法
 */

function visit (node, parent, enter, leave) {
  if (!node) return;
  if (enter) { // 先执行此节点的enter方法
    enter.call(null, node, parent) // 指定enter中的this
  }
  // 再遍历子节点，找出哪些是对象的子节点
  let keys =  Object.keys(node).filter(key => typeof node[key] === 'object');
  keys.forEach(key => {
    let value = node[key];
    if(Array.isArray(value)) {
      value.forEach(val => {
        visit(val, node, enter, leave);
      })
    } else if (value && value.type) { // 遍历时只遍历有type属性的对象
      visit(value, node, enter, leave)
    }
  });
  // 再执行离开方法
  if (leave) {
    leave(node, parent)
  }
}

module.exports = walk