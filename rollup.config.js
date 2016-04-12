import babel from 'rollup-plugin-babel';
import babelrc from './dist/babelrc-rollup.m.js';

export default {
  entry: 'src/index.js',
  plugins: [babel(babelrc())],
  external: ['fs'],
  globals: { fs: 'fs' }
};
