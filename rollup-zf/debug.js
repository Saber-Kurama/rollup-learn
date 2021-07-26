const path = require('path');
const rollup = require('./lib/rollup');
// 获取入口文件的绝对路径
let entry = path.resolve(__dirname, 'demo/demo1/main.js');

rollup(entry, './dist/bundle-test.js');