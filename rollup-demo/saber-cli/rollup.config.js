
// import babel from '@rollup/plugin-babel';
// import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import typescript from '@rollup/plugin-typescript'

export default () => {
  return {
    // input: './src/index.js',
    input: './src/index.ts',
    output: {
      // dir: './dist', // 
      file: './dist/saber-cli-cjs.js',
      format: 'cjs', // amd, cjs, esm , iife, umd, system. 常用的是 esm 和 cjs
      exports: 'auto'
    },
    plugins: [
      typescript(), 
      resolve(), 
      commonjs(),
      babel({
        exclude: 'node_modules/**' // 排除 node_modules
      })
    ],
    external:['debug'] //告诉rollup那些作为外部依赖
  }
}