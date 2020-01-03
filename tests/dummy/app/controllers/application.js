import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  myMarkdownAttr = '*hello*';

  anotherMarkdownAttr = '[link](http://example.com){data-foo=bar}';
}
