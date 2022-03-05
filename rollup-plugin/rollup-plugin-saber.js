// 插件的一些测试
import path from "path";
import fs from 'fs'

export default () => {
  return {
    name: "rollup-plugin-saber",
    // options Hook
    options(inputOptions) {
      // 上下文 meta: { rollupVersion, watchMode }
      // console.log(this.meta.rollupVersion); // 获取rollup版本信息
      // console.log(this.meta.watchMode); // 获取watchMode
      // inputOptions.input = "./src/index1.js"; // 修改入口文件路径
      // console.log('inputOptions1', inputOptions)
      // return inputOptions;
      return inputOptions;
    },
    // buildStart hook
    buildStart(inputOptions) {
      // 注意这里的inputOptions是经过合并处理过后的
      // 可通过引用类型 直接修改
      // inputOptions.xx = xx
      console.log('buildStart');
    },
    // resolveId Hook
    // resolveId Hook也是比较常用的hook，需要注意的是，如果有插件返回了值，那么后续所有插件的resolveId都不会被执行。
    resolveId(id, importer) {
      console.log("id", id);
      console.log("importer", importer);
      console.log('__dirname', __dirname)
      // const fullPath = id.replace("@", path.resolve(__dirname, "src"));
      // return id.includes(".js") ? fullPath : fullPath + ".js";
      // if() => { return xx } return null
    },
    // 另一种写法
    // resolveId(id) {
    //   const fullPath = id.replace('@', path.resolve(__dirname, 'src'));
    //   return {
    //     id: id.includes('.js') ? fullPath : fullPath + '.js',
    //     meta: xxx, // 模块meta信息
    //     moduleSideEffects: true, // 设置当前模块是否有副作用
    //     syntheticNamedExports: xxx // 默认为false,用法可参考 https://rollupjs.org/guide/en/#synthetic-named-exports
    //   }
    // }

    // load hook
    load(id) {
      // 读取文件内容
      console.log('load--', id);
      const content = fs.readFileSync(id);
      console.log('content--', content);
      return "/*这是一段注释*/" + content.toString();
    },
    // 另一个写法
    // load(id) {
    //   // 读取文件内容
    //   const content = fs.readFileSync(id);
    //   // 也可以对代码进行转换 生成等操作
    //   transform(content);
    //   generate();
    //   return {
    //     code: "/*这是一段注释*/" + content.toString(),
    //   };
    // },

    // transform Hook   hookReduceArg0 异步串行
    // transform(code, id) {
    //   return {
    //       code,
    //       map,
    //       ast
    //   }
    // },
    // 另一个写法
    // transform(code, id) {
    //   return code
    // },
    // moduleParsed Hook 模块解析

    // 下面是 generate 阶段
    renderStart(inputOptions, outputOptions) {},
    banner() {},
    footer() {},
    intro() {},
    outro() {
      console.log("outro");
    },
    // 在创建完chunk后，就会进入chunk的优化渲染阶段了，做的事情其实也比较简单，就是调用了所有ast节点的render方法，然后会把included为false的节点代码删除，也就是我们常说的tree shaking。
    renderDynamicImport() {},
    augmentChunkHash() {},
    resolveImportMeta() {},
    resolveFileUrl() {},
    renderChunk() {},
    generateBundle() {},
    writeBundle() {}
  };
};
