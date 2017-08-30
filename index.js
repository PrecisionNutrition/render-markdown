/* eslint-env node */
'use strict';

const path = require('path');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'render-markdown',

  included(app) {
    this._super.apply(this, arguments);

    app.import('vendor/markdown-it.min.js');
    app.import('vendor/shims/markdown-it.js');
    app.import('vendor/markdown-it-attrs.browser.js');
    app.import('vendor/shims/markdown-it-attrs.js');
  },

  treeForVendor(vendorTree) {
    let markdownItTree = new Funnel(path.join(this.project.root, 'node_modules', 'markdown-it', 'dist'), {
      files: ['markdown-it.min.js'],
    });

    let markdownItAttrsTree = new Funnel(path.join(this.project.root, 'node_modules', 'markdown-it-attrs'), {
      files: ['markdown-it-attrs.browser.js'],
    });

    return new MergeTrees([
      vendorTree,
      markdownItTree,
      markdownItAttrsTree,
    ]);
  },
};
