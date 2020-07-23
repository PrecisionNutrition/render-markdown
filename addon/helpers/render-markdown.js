import { isEmpty } from '@ember/utils';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import markdownit from 'markdown-it';
import attrs from 'markdown-it-attrs';


// FIXME: use renderer override
// SEE: https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md
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

// TODO: this could be very slow!
// change to markdown-it plugin and include interpolations?
export function parseDefinitions(html) {
  // SEE: https://regex101.com/r/3Dpban/4
  const DEFINITIONS_EXPR = /\[definition:[\s+]?(?<definition>.*?)\](?<term>.*?)\[\/definition\]/g

  let match;

  while ((match = DEFINITIONS_EXPR.exec(html))) {
    let { definition, term } = match.groups;
    // FIXME: escape content
    let replacement = `
      <span class="Definition" data-tippy-title="${term}" data-tippy-content="${definition}">
        ${term}
      </span>
    `;
    html = html.replace(match[0], replacement);
  }

  return html;
}

export function renderMarkdown([raw]) {
  const renderer = markdownit({ html: true }).use(attrs);

  if (isEmpty(raw)) {
    return '';
  } else {
    let html = renderer.render(raw);

    html = targetLinks(parseDefinitions(html));

    return htmlSafe(html);
  }
}

export default helper(renderMarkdown);
