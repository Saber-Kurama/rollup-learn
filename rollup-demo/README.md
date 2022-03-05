## Rollup

个人认为采用 rollup 的三个场景
1. node 库
2. 组件库
3. 小型web项目(类似 h5 针对高级浏览器) 

#### rollup 开发 node 库

在开发 node 库的时候，我们可以直接使用 babel 或者 ts

node 库 使用场景
1. node 环境， 这种环境下我们只需要解决（ts 的支持，es6 中的import， 或者 node版本）
2. web 环境，解决的问题（ts的支持， babel）

##### node 环境

##### require 和 import 的 区别

[Module 的语法](https://es6.ruanyifeng.com/#docs/module)

###### export 命令

```
export default fs
export const fs
export function readFile
export {readFile, read}
export * from 'fs'
export { n as saber }
```

###### import 命令

import命令具有提升效果，会提升到整个模块的头部，首先执行
import命令是编译阶段执行的，在代码运行之前
由于import是静态执行，所以不能使用表达式和变量

目前阶段，通过 Babel 转码，CommonJS 模块的require命令和 ES6 模块的import命令，可以写在同一个模块里面，但是最好不要这样做。因为import在静态解析阶段执行，所以它是一个模块之中最早执行的。下面的代码可能不会得到预期结果。

```
require('core-js/modules/es6.symbol');
require('core-js/modules/es6.promise');
import React from 'React';
```

正是因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句。

```
// 正确
export var a = 1;

// 正确
var a = 1;
export default a;

// 错误
export default var a = 1;
```

```
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar }
```

###### Module 的加载实现

1. 浏览器加载
异步 默认方式 defer 可以设置 async

`<script type="module" src="./foo.js" async></script>`

2. ES6 模块与 CommonJS 模块的差异

* CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
* CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
* CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。

 ES6 模块与 CommonJS 模块尽量不要混用。
##### Node.js 的模块加载方法

node 中加载 es6 模块的方式

1. .mjs
  Node.js 要求 ES6 模块采用`.mjs`后缀文件名。

2. package.json 中的 `type`

```
{
   "type": "module"
}
```
加载 commonjs 就需要后缀 为 `.cjs` 

3. package.json 的配置
 
 package.json 的 main 字段

 package.json 的 exports 字段
 (1) 子目录别名
 (2) main 的别名
 (3) 条件加载
 打开 `--experimental-conditional-exports`
 ```
 {
  "type": "module",
  "exports": {
    ".": {
      "require": "./main.cjs",
      "default": "./main.js"
    }
  }
}
 ```
4. babel
 ##### 循环加载

 ###### CommonJS 的加载原理
 CommonJS 的一个模块，就是一个脚本文件。require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。  
###### CommonJS 模块循环加载

CommonJS 模块的重要特性是加载时执行，即脚本代码在require的时候，就会全部执行。一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。

总之，CommonJS 输入的是被输出值的拷贝，不是引用。

```
var a = require('a'); // 安全的写法
var foo = require('a').foo; // 危险的写法

exports.good = function (arg) {
  return a.foo('good', arg); // 使用的是 a.foo 的最新值
};

exports.bad = function (arg) {
  return foo('bad', arg); // 使用的是一个部分加载时的值
};
```
##### ES6 模块的循环加载

ES6 处理“循环加载”与 CommonJS 有本质的不同。ES6 模块是动态引用，如果使用import从一个模块加载变量（即import foo from 'foo'），那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。

