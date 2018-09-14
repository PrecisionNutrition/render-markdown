import { isEmpty } from '@ember/utils';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import markdownit from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';

function targetLinks(html) {
  let origin = window.location.origin;

  let parser = new DOMParser();
  let doc = parser.parseFromString(html, 'text/html');
  let nodes = doc.querySelectorAll(`a[href^='mailto'], a[href^='http']:not([href^='${origin}'])`);

  nodes.forEach(function(node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  });

  let newHTML = doc.body.innerHTML;

  return newHTML;
}

export function renderMarkdown([raw]) {
  const renderer = markdownit({
    html: true
  });

  renderer.use(markdownItAttrs);

  if (isEmpty(raw)) {
    return '';
  } else {
    let html = renderer.render(raw);

    html = targetLinks(html);

    return htmlSafe(html);
  }
}

export default helper(renderMarkdown);
