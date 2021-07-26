let Bundle = require('./bundle.js');

function rollup(entry, outputFileName){
  // Bundle为打包对象，包含所有的模块信息
  const bundle = new Bundle({entry});
  // 调用build方法进行编译
  // bundle.build(outputFileName);
}

module.exports = rollup;