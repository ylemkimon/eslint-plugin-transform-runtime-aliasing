module.exports = {
  rules: {
    'no-transform-runtime-aliasing': {
      meta: {
        docs: {
          description: 'disallow functions that is aliased/polyfilled by babel-plugin-transform-runtime',
        },
        schema: [{
          type: 'object',
          properties: {
            babelVersion: {
              enum: [6, 7],
            },
            transformEnabled: {
              type: 'boolean',
            },
            ignore: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
          additionalProperties: false,
        }],
        messages: {
          aliased: "'{{ name }}' will be aliased/polyfilled to core-js by Babel, which may be expensive. To prevent aliasing, use '{{ alt }}'.",
          noAliased: "'{{ name }}' will not be aliased/polyfilled to core-js by Babel. To polyfill it, use 'core-js@2/library/fn/{{ corejs }}'.",
        },
      },

      create(context) {
        const options = context.options[0] || {};
        const babelVersion = options.babelVersion;
        const transformEnabled = options.transformEnabled != null ? options.transformEnabled : true;
        const ignore = options.ignore || [];
        const messageId = transformEnabled ? 'aliased' : 'noAliased';

        let definitions;
        let error;
        if (!babelVersion || babelVersion === 7) {
          try {
            // eslint-disable-next-line global-require, import/no-extraneous-dependencies
            definitions = require('@babel/plugin-transform-runtime/lib/definitions').default;
          } catch (e) {
            error = e;
          }
        }
        if ((!babelVersion && !definitions) || babelVersion === 6) {
          try {
            // eslint-disable-next-line global-require, import/no-extraneous-dependencies
            definitions = require('babel-plugin-transform-runtime/lib/definitions');
          } catch (e) {
            error = e;
          }
        }
        if (!definitions) {
          throw error;
        }
        const methods = definitions.methods;
        const builtins = definitions.builtins;

        return {
          'Program:exit': () => {
            const globalScope = context.getScope();
            Object.keys(builtins).forEach((builtin) => {
              const variable = globalScope.set.get(builtin);
              if (variable && variable.defs.length === 0 && ignore.indexOf(builtin) === -1) {
                variable.references.forEach((ref) => {
                  context.report({
                    node: ref.identifier,
                    messageId,
                    data: {
                      name: builtin,
                      alt: `(global|window|self).${builtin}`,
                      corejs: builtins[builtin],
                    },
                  });
                });
              }
            });
          },

          MemberExpression(node) {
            const object = node.object.name;
            const property = node.property.name;
            if (node.computed
                || !Object.prototype.hasOwnProperty.call(methods, object)
                || !Object.prototype.hasOwnProperty.call(methods[object], property)
                || ignore.indexOf(`${object}.${property}`) !== -1) {
              return;
            }

            context.report({
              node,
              messageId,
              data: {
                name: `${object}.${property}`,
                alt: `${object}["${property}"]`,
                corejs: methods[object][property],
              },
            });
          },
        };
      },
    },
  },
};
