
const fs = require('fs');
const path = require('path');
const { default: MagicString } = require('magic-string');

class Bundle{
  constructor(options) {
    // 入口文件的绝对路径，包括后缀
    this.entryPath = options.entry.replace(/\.js$/, '') + '.js';
    this.module = {}; // 存放所有模块、入口文件和他依赖的模块
  }
}

module.exports = Bundle;
