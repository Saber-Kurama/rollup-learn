## rollup 构建 node 库

### 参考
[让Node.js Package 同时支持 CommonJs 和 ESM](https://zespia.tw/blog/2021/03/21/nodejs-dual-package/)

### 构建出来的产物

目录结构大概是(可以没有dist)

```
--dist
    -- cjs
        -- index.js
    -- esm
        -- index.js    
```

或者

```
---index.cjs.js
---index.esm.js
```

pacakge.json 的配置

```
{
  ...
  main: 'index.cjs.js',
  module: 'index.cjs.js'
  ...
}
```

package.json 区分的话

* module
* exports， type可以设置为 module 
* 后缀名 cjs 和 mjs

防止node 找不 还是建议 .js 后缀 和 module

#### rollup 插件

##### @rollup/plugin-node-resolve

帮助Rollup查找外部模块。 主要是针对 package.json 中的 export 和 main ， module

配合 @rollup/plugin-commonjs 一起使用

##### @rollup/plugin-commonjs

rollup-plugin-node-resolve 插件可以解决 ES6模块的查找导入，但是npm中的大多数包都是以CommonJS模块的形式出现的，所以需要使用这个插件将CommonJS模块转换为 ES2015 供 Rollup 处理

#### 这里有一个问题
关于 node_modules 中的代码是否打包到我们的自己的源码中
1. 不需要 
不需要找包---》 不知道包是否存在 不使用上面插件
2. 需要
使用上面插件，可以使用 external:['lodash'] 这样额配置，将一些依赖不打到包里

##### rollup-plugin-babel

##### @rollup/plugin-typescript


##### @open-wc/building-rollup

了解 https://open-wc.org/

##### rollup-plugin-terser
压缩代码


##### rollup-plugin-serve
开启本地服务器

##### rollup-plugin-livereload
开启热更新
