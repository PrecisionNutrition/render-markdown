(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['markdownItAttrs'] };
  }

  define('markdown-it-attrs', [], vendorModule);
})();
