# babelrc-rollup

Builds a babel configuration for rollup-plugin-babel by reading .babelrc.

## Install

```
$ npm install --save-dev babelrc-rollup
```

## Usage

Create a `.babelrc` file at the root of your project as normal:

```json
{
  "presets": ["es2015"]
}
```

Inside your `rollup.config.js`, do this:

```js
import babelrc from 'babelrc-rollup';
import babel from 'rollup-plugin-babel';

export default {
  …
  plugins: [
    babel(babelrc())
  ]
  …
};
```

If you use the `es2015` preset, make sure you install `es2015-rollup` too. See
this project's own [`rollup.config.js`][rollup-config] for an example.

For any presets you use in `.babelrc`, this module will look for one with the
same name but with a `-rollup` suffix.

[rollup-config]: https://github.com/eventualbuddha/babelrc-rollup/blob/master/rollup.config.js
