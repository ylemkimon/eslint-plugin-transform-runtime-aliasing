const { RuleTester } = require('eslint');
const rule = require('./').rules['no-transform-runtime-aliasing'];

RuleTester.setDefaultConfig({
  env: {
    es6: true,
  },
});

const ruleTester = new RuleTester();

ruleTester.run('no-transform-runtime-corejs', rule, {
  valid: [
    'var object = Object["assign"]({});',
    'var symbol = global.Symbol();',
    'var map = new global["Map"]();',
    'var object = require("core-js/library/fn/object/assign")({});',
    {
      code: 'var object = Object["assign"]({});',
      options: [{ babelVersion: 6 }],
    },
    {
      code: 'var symbol = global.Symbol();',
      options: [{ babelVersion: 6 }],
    },
    {
      code: 'map = new global["Map"]();',
      options: [{ babelVersion: 6 }],
    },
    {
      code: 'var object = Object["assign"]({});',
      options: [{ babelVersion: 7 }],
    },
    {
      code: 'var symbol = global.Symbol();',
      options: [{ babelVersion: 7 }],
    },
    {
      code: 'map = new global["Map"]();',
      options: [{ babelVersion: 7 }],
    },
  ],
  invalid: [
    {
      code: 'var object = Object.assign({});',
      errors: [{
        messageId: 'aliased',
        data: {
          name: 'Object.assign',
          alt: 'Object["assign"]',
          corejs: 'object/assign',
        },
      }],
    },
    {
      code: 'var symbol = Symbol();',
      errors: [{
        messageId: 'aliased',
        data: {
          name: 'Symbol',
          alt: '(global|window|self).Symbol',
          corejs: 'symbol',
        },
      }],
    },
    {
      code: 'var object = Object.assign({});',
      options: [{ babelVersion: 6 }],
      errors: [{
        messageId: 'aliased',
        data: {
          name: 'Object.assign',
          alt: 'Object["assign"]',
          corejs: 'object/assign',
        },
      }],
    },
    {
      code: 'var symbol = Symbol();',
      options: [{ babelVersion: 6 }],
      errors: [{
        messageId: 'aliased',
        data: {
          name: 'Symbol',
          alt: '(global|window|self).Symbol',
          corejs: 'symbol',
        },
      }],
    },
    {
      code: 'var object = Object.assign({});',
      options: [{ babelVersion: 7 }],
      errors: [{
        messageId: 'aliased',
        data: {
          name: 'Object.assign',
          alt: 'Object["assign"]',
          corejs: 'object/assign',
        },
      }],
    },
    {
      code: 'var symbol = Symbol();',
      options: [{ babelVersion: 7 }],
      errors: [{
        messageId: 'aliased',
        data: {
          name: 'Symbol',
          alt: '(global|window|self).Symbol',
          corejs: 'symbol',
        },
      }],
    },
    {
      code: 'var object = Object.assign({});',
      options: [{ transformEnabled: false }],
      errors: [{
        messageId: 'noAliased',
        data: {
          name: 'Object.assign',
          alt: 'Object["assign"]',
          corejs: 'object/assign',
        },
      }],
    },
    {
      code: 'var symbol = Symbol();',
      options: [{ transformEnabled: false }],
      errors: [{
        messageId: 'noAliased',
        data: {
          name: 'Symbol',
          alt: '(global|window|self).Symbol',
          corejs: 'symbol',
        },
      }],
    },
  ],
});
