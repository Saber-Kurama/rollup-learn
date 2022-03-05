import common, {fn1} from './common'
// @ts-ignore 
import debug from 'debug';
import { sleep } from './time'

const log = debug('app:log');
const yuo = 'you'
let foo = () => {
  console.log('foo 函数')
  function saber () {

  }
  console.log('foo 函数222') 
}
console.log('index----', foo)
log('index');
export default {
  common,
   fn1,
   sleep
}