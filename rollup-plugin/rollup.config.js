
import myExample from './rollup-plugin-my-example.js';
import rollupSaber from './rollup-plugin-saber'
export default ({
  input: './src/index.js',
  plugins: [rollupSaber(), myExample()],
  output: [{
    file: './dist/index.js',
    format: 'es'
  }]
})