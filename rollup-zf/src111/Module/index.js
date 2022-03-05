
import { parse } from 'acorn';
import analyse from '../ast/analyse';

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
    analyse(this.ast)
    console.log('this.ast', this.ast)
  }
  expandAllStatements() {

  }
}