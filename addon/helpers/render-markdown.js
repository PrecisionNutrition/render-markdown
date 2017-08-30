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
  let [content] = parseHTML(html);

  let nodes = content.querySelectorAll(`a[href^='mailto'], a[href^='http']:not([href^='${origin}'])`);

  nodes.forEach(function(node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  });

  return content.outerHTML;
}

export function renderMarkdown([raw]) {
  const renderer = markdownit({
    html: true
  });

  renderer.use(markdownItAttrs);

  let markdown = isEmpty(raw) ? '' : raw;
  let html = renderer.render(markdown);

  html = targetLinks(html);

  return htmlSafe(html);
}

export default helper(renderMarkdown);
