import babel from 'rollup-plugin-babel';
import babelrc from './dist/babelrc-rollup.mjs';

let pkg = require('./package.json');

export default {
  entry: 'src/index.js',
  plugins: [babel(babelrc())],
  external: Object.keys(pkg['dependencies']).concat(['fs']),
  targets: [
    {
      dest: pkg['jsnext:main'],
      exports: 'named',
      format: 'es'
    },
    {
      dest: pkg['main'],
      exports: 'named',
      format: 'cjs'
    }
  ]
};
