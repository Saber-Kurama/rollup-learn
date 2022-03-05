## 

### 参照 

[rollup](https://gitee.com/zhufengpeixun/rollup)

### 前置知识

#### magic-string 魔法字符串

#### AST 和 acorn

#### 作用域 和 作用域链

### node 使用 es6 模块

使用   "type":"module",
Error [ERR_MODULE_NOT_FOUND]: Cannot find module

[](https://stackoverflow.com/questions/65384754/error-err-module-not-found-cannot-find-module)
[使用ts-node运行ts脚本及踩坑
](https://zhuanlan.zhihu.com/p/357097559)

1. 加上 `.js`后缀名
2. `node --experimental-specifier-resolution=node index.js`
可以将 这个 指令 加到 scripts 中

__dirname 未定义

[__dirname 未定义](https://github.com/nodejs/help/issues/2907)