import Ember from 'ember';
import markdownit from 'markdown-it';
import jquery from 'jquery';

const {
  isEmpty,
} = Ember;

export function stripMarkdown([markdown]/*, hash*/) {
  if (isEmpty(markdown)) {
    markdown = '';
  }

  let renderer = markdownit({
    html: true,
  });

  let rendered = renderer.render(markdown).replace(/<(?:.|\n)*?>/gm, '');
  let stripped = jquery(`<p>${rendered}</p>`).text();

  return stripped;
}

export default Ember.Helper.helper(stripMarkdown);
