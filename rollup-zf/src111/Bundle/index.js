import { resolve } from 'path';
import fs from 'fs';
import Module from '../Module';

export default class Bundle {
  constructor (options) {
    // 入口文件
    this.entryPath = resolve( options.entry );
    console.log('this.entryPath', this.entryPath)

    this.modulePromises = {}; // 模块promise 为了异步处理的

    this.modules = {}; // 存放所有模块和它依赖的模块

    this.body = []; //这将存储我们导入的顶级AST节点

  }
  // 获取模块信息
  fetchModule(path) {
    if(!Reflect.has(this.modulePromises, path)){
      const code = fs.readFileSync(path, {encoding: 'utf-8'}); // 文件源码
      console.log('caode', code)
      // 每一个文件都是一个模块
      const module = new Module({path, code , bundle: this})
      this.modules[path] = module
    }
    return this.modules[ path ]
  }
  build(){
    console.log('???xx')
    // 从入口文件的绝对路径出发找到 它的模块定义
    let entryModule = this.fetchModule(this.entryPath)
    // sequence
  }

  // 把this.statements生成代码
  generate() {

  } 
}