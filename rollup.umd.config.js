import config from './rollup.config.js';

config.dest = 'dist/babelrc-rollup.js';
config.format = 'umd';
config.moduleName = 'babelrcRollup';

export default config;
