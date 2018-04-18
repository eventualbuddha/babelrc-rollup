/* @flow */

import { readFileSync } from 'fs';
import { sync as resolve } from 'resolve';

function startsWith(string: string, prefix: string): boolean {
  return string.lastIndexOf(prefix, 0) === 0;
}

function includes<T>(array: Array<T>, value: T): boolean {
  return array.indexOf(value) > -1;
}

type Preset = any;

type BabelConfig = {
  filename?: string;
  filenameRelative?: string;
  presets?: Array<Preset>;
  plugins?: Array<string>;
  highlightCode?: boolean;
  only?: ?(RegExp | string | Array<RegExp | string>);
  ignore?: ?(RegExp | string | Array<RegExp | string>);
  auxiliaryCommentBefore?: ?string;
  auxiliaryCommentAfter?: ?string;
  sourceMaps?: boolean;
  inputSourceMap?: ?Object;
  sourceMapTarget?: string;
  sourceFileName?: string;
  sourceRoot?: string;
  moduleRoot?: string;
  moduleIds?: boolean;
  moduleId?: string;
  getModuleId?: (moduleName: string) => ?string;
  resolveModuleSource?: (source: string, filename: string) => ?string;
  code?: boolean;
  babelrc?: boolean;
  ast?: boolean;
  compact?: boolean | 'auto';
  comments?: boolean;
  shouldPrintComment?: (commentContents: string) => boolean;
  env?: {[key: string]: BabelConfig};
  retainLines?: boolean;
  extends?: ?string;
};

type Options = {
  path?: string;
  config?: BabelConfig;
  findRollupPresets?: boolean;
  addModuleOptions?: boolean;
  addExternalHelpersPlugin?: boolean;
  presetsToAddModuleOptions?: Array<string>,
  resolve?: (path: string) => string;
};

const DEFAULT_OPTIONS = {
  path: '.babelrc',
  findRollupPresets: false,
  addModuleOptions: true,
  addExternalHelpersPlugin: true,
  presetsToAddModuleOptions: ['env', 'es2015'],
  resolve
};

export default function babelrc(options: Options|string={}): BabelConfig {
  if (typeof options === 'string') {
    options = { path: options };
  }

  let resolvedOptions = { ...DEFAULT_OPTIONS, ...options };

  if (!resolvedOptions.config && typeof resolvedOptions.path === 'string') {
    resolvedOptions.config = JSON.parse(readFileSync(resolvedOptions.path, { encoding: 'utf8' }));
  }

  return configWithoutModules(resolvedOptions.config, resolvedOptions);
}

export function configWithoutModules(config: BabelConfig, options: Options): BabelConfig {
  let result = {};

  for (let key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      if (key === 'presets' && config.presets) {
        // Replace the es2015 preset with the es2015-rollup preset.
        result.presets = config.presets.map(preset => mapPreset(preset, options));
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

  if (options.addExternalHelpersPlugin) {
    if (!result.plugins) {
      result.plugins = ['external-helpers'];
    } else {
      result.plugins = [...result.plugins, 'external-helpers'];
    }
  }

  // Make sure babel does not look for the babelrc file.
  result.babelrc = false;

  return result;
}

function mapPreset(preset: any, options: Options): any {
  let info = getPresetInfo(preset);

  if (!info) {
    return preset;
  }

  const {presetsToAddModuleOptions} = options;
  if (!presetsToAddModuleOptions) {
    throw new Error('Option "presetsToAddModuleOptions" should have default option');
  }

  if (options.findRollupPresets && hasRollupVersionOfPreset(info.name, options.resolve || resolve)) {
    return [`${info.name}-rollup`, info.options];
  } else if (options.addModuleOptions && includes(presetsToAddModuleOptions, info.name)) {
    return [info.name, { ...info.options, modules: false }];
  } else {
    return preset;
  }
}

function getPresetInfo(preset: any): ?{ name: string, options: Object } {
  if (typeof preset === 'string') {
    return { name: preset, options: {} };
  } else if (Array.isArray(preset)) {
    let name = preset[0];
    let options = preset[1] || {};

    if (typeof name === 'string' && typeof options === 'object') {
      return { name, options };
    }
  }

  return null;
}

function hasRollupVersionOfPreset(preset: string, resolve: (path: string) => string): boolean {
  try {
    // this will throw if it can't resolve it
    resolve(`babel-preset-${preset}-rollup`);
    return true;
  } catch (err) {
    return false;
  }
}
