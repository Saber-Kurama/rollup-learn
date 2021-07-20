// export 的 用法
// module.exports 与 exports 指向同一个空对象 {} - 且叫它 M。
// 也就是说，不管是 exports.pi = 3.14 还是 module.exports.pi = 3.14，都是在操作 M 对象
exports.name = "saber";

// const sabername = "saber";
// module.exports = { sabername };
// 

// export 和 require 没有复合写法