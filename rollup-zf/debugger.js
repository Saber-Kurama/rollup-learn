import fs from 'fs'
import path from 'path'
import { rollup } from './src/rollup' 
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Object.defineProperty({}, "__dirname", __dirname)
// console.log('global', global)
console.log(path.resolve(__dirname, 'demo/demo1/main.js'))
//
const entry = path.resolve(__dirname, 'demo/demo1/main.js') 
const r = rollup(entry, 'bundle.js')
r.build()