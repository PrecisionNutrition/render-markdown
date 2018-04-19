'use strict';

const path = require('path');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: '@precision-nutrition/render-markdown',

  included() {
    this._super.apply(this, arguments);

    this.import('vendor/markdown-it.js');
    this.import('vendor/shims/markdown-it.js');
    this.import('vendor/markdown-it-attrs.browser.js');
    this.import('vendor/shims/markdown-it-attrs.js');
  },

  treeForVendor(vendorTree) {
    let markdownItTree = new Funnel(path.dirname(require.resolve('markdown-it/dist/markdown-it.js')), {
      files: ['markdown-it.js'],
    });

    let markdownItAttrsTree = new Funnel(path.dirname(require.resolve('markdown-it-attrs')), {
      files: ['markdown-it-attrs.browser.js'],
    });

    return new MergeTrees([
      vendorTree,
      markdownItTree,
      markdownItAttrsTree,
    ]);
  },
};
