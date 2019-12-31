'use strict';

module.exports = {
  extends: 'octane',

  rules: {
    'no-curly-component-invocation': {
      allow: [
        'render-markdown',
        'strip-markdown',
      ],
    },

    'no-implicit-this': {
      allow: [
        'render-markdown',
      ],
    },
  },
};
