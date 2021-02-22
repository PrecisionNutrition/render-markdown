import { helper as buildHelper } from '@ember/component/helper';

import { isEmpty } from '@ember/utils';

import markdownit from 'markdown-it';

export function stripMarkdown([markdown] /*, hash*/) {
  if (isEmpty(markdown)) {
    markdown = '';
  }

  let renderer = markdownit({
    html: true,
  });

  let rendered = renderer.render(markdown).replace(/<(?:.|\n)*?>/gm, '');

  let node = document.createElement('p');
  node.innerHTML = rendered;

  return node.textContent;
}

export default buildHelper(stripMarkdown);
