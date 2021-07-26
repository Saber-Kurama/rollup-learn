const path = require('path');
const rollup = require('./src/rollup');
// 获取入口文件的绝对路径
let entry = path.resolve(__dirname, 'demo/demo1/main.js');

rollup(entry,  path.resolve(__dirname, 'dist/bundle-test.js'));