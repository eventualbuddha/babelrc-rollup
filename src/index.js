/* @flow */

import { readFileSync } from 'fs';

function startsWith(string: string, prefix: string): boolean {
  return string.lastIndexOf(prefix, 0) === 0;
}

type BabelConfig = {
  filename?: string,
  filenameRelative?: string,
  presets?: Array<string>,
  plugins?: Array<string>,
  highlightCode?: boolean,
  only?: ?(RegExp | string | Array<RegExp | string>),
  ignore?: ?(RegExp | string | Array<RegExp | string>),
  auxiliaryCommentBefore?: ?string,
  auxiliaryCommentAfter?: ?string,
  sourceMaps?: boolean,
  inputSourceMap?: ?Object,
  sourceMapTarget?: string,
  sourceFileName?: string,
  sourceRoot?: string,
  moduleRoot?: string,
  moduleIds?: boolean,
  moduleId?: string,
  getModuleId?: (moduleName: string) => ?string,
  resolveModuleSource?: (source: string, filename: string) => ?string,
  code?: boolean,
  babelrc?: boolean,
  ast?: boolean,
  compact?: boolean | 'auto',
  comments?: boolean,
  shouldPrintComment?: (commentContents: string) => boolean,
  env?: {[key: string]: BabelConfig},
  retainLines?: boolean,
  extends?: ?string,
};

export default function babelrc(path: string='.babelrc'): BabelConfig {
  return configWithoutModules(JSON.parse(readFileSync(path, { encoding: 'utf8' })));
}

export function configWithoutModules(config: BabelConfig): BabelConfig {
  let result = {};

  for (let key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      if (key === 'presets' && config.presets) {
        // Replace the es2015 preset with the es2015-rollup preset.
        result.presets = config.presets.map(
          preset => preset === 'es2015' ? 'es2015-rollup' : preset
        );
      } else if (key === 'plugins' && config.plugins) {
        // Remove any explicit module plugins, e.g. es2015-modules-commonjs.
        result.plugins = config.plugins.filter(
          plugin => !startsWith(plugin, 'es2015-modules-')
        );
      } else {
        result[key] = config[key];
      }
    }
  }

  // Make sure babel does not look for the babelrc file.
  result.babelrc = false;

  return result;
}
