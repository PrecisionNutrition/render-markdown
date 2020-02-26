import { isEmpty } from '@ember/utils';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import markdownit from 'markdown-it';
import attrs from 'markdown-it-attrs';
import underline from 'markdown-it-underline';

function targetLinks(html) {
  let origin = window.location.origin;

  let parser = new DOMParser();
  let doc = parser.parseFromString(html, 'text/html');
  let nodes = doc.querySelectorAll(`a[href^='mailto'], a[href^='http']:not([href^='${origin}'])`);

  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];

    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }

  // IE 11 returns NULL on empty string :/
  return doc.body ? doc.body.innerHTML : '';
}

export function renderMarkdown([raw]) {
  const renderer = markdownit({ html: true })
    .use(attrs)
    .use(underline);

  if (isEmpty(raw)) {
    return '';
  } else {
    let html = renderer.render(raw);

    html = targetLinks(html);

    return htmlSafe(html);
  }
}

export default helper(renderMarkdown);
