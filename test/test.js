import babelrc from '..';
import { deepEqual, strictEqual } from 'assert';

describe('babelrc-rollup', () => {
  it('configures presets without config with modules: false', () => {
    deepEqual(
      babelrc({
        config: {
          presets: [
            'es2015'
          ]
        }
      }).presets,
      [
        ['es2015', { modules: false }]
      ]
    );
  });

  it('configures presets with config with modules: false', () => {
    deepEqual(
      babelrc({
        config: {
          presets: [
            ['es2015', { loose: true }]
          ]
        }
      }).presets,
      [
        ['es2015', { loose: true, modules: false }]
      ]
    );
  });

  it('configures plugins to add external-helpers', () => {
    deepEqual(
      babelrc({
        config: {
          plugins: []
        }
      }).plugins,
      ['external-helpers']
    );
  });

  it('prevents reading from a babelrc file', () => {
    strictEqual(
      babelrc({
        config: {}
      }).babelrc,
      false
    );
  });

  it('allows searching for rollup-compatible alternatives for presets', () => {
    deepEqual(
      babelrc({
        config: {
          presets: ['foo', 'bar']
        },
        findRollupPresets: true,
        // provide a mock version of the resolve method
        resolve(path) {
          if (path === 'babel-preset-foo-rollup') {
            return path;
          } else {
            throw new Error(`intentionally failing to resolve: ${path}`);
          }
        }
      }).presets,
      [
        ['foo-rollup', {}],
        ['bar', { modules: false }]
      ]
    )
  });

  it('allows disabling setting the `modules` option', () => {
    deepEqual(
      babelrc({
        config: {
          presets: ['foo', 'bar']
        },
        addModuleOptions: false
      }).presets,
      [ 'foo', 'bar' ]
    )
  });

  it('allows disabling adding the `external-helpers` plugin', () => {
    deepEqual(
      babelrc({
        config: {
          plugins: []
        },
        addExternalHelpersPlugin: false
      }).plugins,
      []
    );
  });
});
