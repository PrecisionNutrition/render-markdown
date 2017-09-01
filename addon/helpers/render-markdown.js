import Ember from 'ember';
import markdownit from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';

const {
  isEmpty,
  Helper: {
    helper,
  },
  String: {
    htmlSafe,
  },
} = Ember;

function parseHTML(str) {
  let tmp = document.implementation.createHTMLDocument();

  tmp.body.innerHTML = str;

  return tmp.body.children;
}

function targetLinks(html) {
  let origin = window.location.origin;
  let nodes = parseHTML(html);
  let finishedHTML = '';

  for (let i = 0; i < nodes.length; i++) {
    let node = nodes.item(i);
    let links = node.querySelectorAll(`a[href^='mailto'], a[href^='http']:not([href^='${origin}'])`);

    links.forEach(function(node) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    });

    finishedHTML += node.outerHTML;
  }

  return finishedHTML;
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
