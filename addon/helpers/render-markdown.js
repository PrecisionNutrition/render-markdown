import { isEmpty } from '@ember/utils';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import jquery from 'jquery';
import markdownit from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';

function defuckifyHTML(domNodes) {
  if (!domNodes) {
    return '';
  } else {
    let container = jquery('<span>');

    jquery.each(domNodes, function(_, val) {
      container.append(val);
    });

    return container.html();
  }
}

function targetLinks(html) {
  let origin = window.location.origin;
  let nodes = jquery.parseHTML(html);

  jquery(`a[href^='mailto'], a[href^='http']:not([href^='${origin}'])`, nodes)
    .attr('target', '_blank')
    .attr('rel', 'noopener noreferrer');

  return defuckifyHTML(nodes);
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
