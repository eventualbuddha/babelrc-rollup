import babel from 'rollup-plugin-babel';
import babelrc from './dist/babelrc-rollup.mjs';

export default {
  entry: 'src/index.js',
  plugins: [babel(babelrc())],
  external: ['fs'],
  targets: [
    {
      dest: 'dist/babelrc-rollup.mjs',
      exports: 'named',
      format: 'es6'
    },
    {
      dest: 'dist/babelrc-rollup.js',
      exports: 'named',
      format: 'cjs'
    }
  ]
};
