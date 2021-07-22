import { resolve } from 'path';
import fs from 'fs';
import Module from '../Module';

export default class Bundle {
  constructor (options) {
    // 入口文件
    this.entryPath = resolve( options.entry );
    console.log('this.entryPath', this.entryPath)

    this.modulePromises = {}; // 模块信息
    this.modules = {}; // 存放所有模块和它依赖的模块

  }
  // 获取模块信息
  fetchModule(path) {
    if(!Reflect.has(this.modulePromises, path)){
      const code = fs.readFileSync(path, {encoding: 'utf-8'}); // 文件源码
      console.log('caode', code)
      // 每一个文件都是一个模块
      const module = new Module({path, code , bundle: this})
    }
    return this.modulePromises[ path ]
  }
  build(){
    console.log('???xx')
    // 从入口文件的绝对路径出发找到 它的模块定义
    let entryModule = this.fetchModule(this.entryPath)
    // 把这个入口模块所有的语句进行展开，返回所有的语句组成的数组
    this.statements = entryModule.expandAllStatements();
    const {code} = this.generate();
    fs.writeFileSync(outputFileName, code, 'utf8');
  }

  // 把this.statements生成代码
  generate() {
    
  } 
}