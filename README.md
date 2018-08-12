# eslint-plugin-transform-runtime-aliasing
ESLint plugin for checking functions that is aliased/polyfilled to `core-js`
by `babel-plugin-transform-runtime`, which may be expensive and sometimes not needed.

Requires `babel-plugin-transform-runtime` (Babel 6) or
`@babel/plugin-transform-runtime` (Babel 7).

See `index.test.js` for examples.

## Installation
```bash
yarn add --dev eslint-plugin-transform-runtime-aliasing
# or npm install --save-dev eslint-plugin-transform-runtime-aliasing
```

## Configuration
```json
{
  "plugins": [
    "transform-runtime-aliasing"
  ],
  "rules": {
    "transform-runtime-aliasing/no-transform-runtime-aliasing": "warn"
  }
}
```

## Options
* `babelVersion`: `6 | 7`, the version of `babel-plugin-transform-runtime` to use.
If not set, the plugin will try to auto-detect.
* `transformEnabled`: `boolean`, whether `babel-plugin-transform-runtime` is enabled.
If `true` (default), the message will be "'{{ name }}' will be aliased/polyfilled to
core-js by Babel, which may be expensive. To prevent aliasing, use '{{ alt }}'.".
If `false`, the message will be "'{{ name }}' will not be aliased/polyfilled to
core-js by Babel. To alias it, enable 'babel-plugin-transform-runtime'.".

## License
MIT License
