import Controller from '@ember/controller';

export default Controller.extend({
  myMarkdownAttr: '*hello*',

  anotherMarkdownAttr: '[link](http://example.com){data-foo=bar}',
});
