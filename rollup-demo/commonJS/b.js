// import 的用法
// commonjs 用法 简单
const { name } = require("./a");
// 整体加载
const sabername = require("./a");
// // 别名
// const { name: name1} = require("./a")
// const sabername1 = require('./a')

console.log("name---", name);
console.log('saber--name', sabername)

// console.log("name1---", name1);
// console.log('saber--name1', sabername1)
