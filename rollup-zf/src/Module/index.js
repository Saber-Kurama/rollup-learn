
import { parse } from 'acorn';

export default class Module {
  constructor({path, code, bundle}){
    this.path = path;
		this.code = code;
		this.bundle = bundle;

    this.ast = parse( code, {
			ecmaVersion: 6,
			sourceType: 'module'
		});
    console.log('this.ast', this.ast)
  }
  expandAllStatements() {
    
  }
}