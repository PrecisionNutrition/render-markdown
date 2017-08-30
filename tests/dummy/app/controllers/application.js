import Ember from 'ember';

export default Ember.Controller.extend({
  myMarkdownAttr: '*hello*',

  anotherMarkdownAttr: '[link](http://example.com){data-foo=bar}',
});
