class Scope {
  constructor(options = {}) {
    this.name = options.name;
    this.parent = options.parent; // parent 属性指向它额父作用域
    this.names = options.params || [] // 存放这个作用域内的所有变量
  }
  add (name) {
    this.names.push(name);
  }
  // 查找定义作用域
  findDefiningScope (name) {
    if (this.names.includes(name)) {
      return this
    }
    if (this.parent) {
      return this.parent.findDefiningScope(name)
    }
    return null;
  }
}

module.exports = Scope;