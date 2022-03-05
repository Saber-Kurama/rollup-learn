import common, {fn1} from './common' 
import debug from 'debug';
import { sleep } from './time'

const log = debug('app:log');

console.log('index----')
log('index');
export default {
  common,
   fn1,
   sleep
}