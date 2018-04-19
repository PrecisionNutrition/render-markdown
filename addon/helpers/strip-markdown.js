import { helper as buildHelper } from '@ember/component/helper';
import { isEmpty } from '@ember/utils';
import markdownit from 'markdown-it';
import jquery from 'jquery';

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

export default buildHelper(stripMarkdown);
