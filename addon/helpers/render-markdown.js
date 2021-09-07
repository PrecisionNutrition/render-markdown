import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import __renderMarkdown__ from '@precision-nutrition/canadian-goose';

export function renderMarkdown([raw]) {
  const html = __renderMarkdown__(raw)
  return htmlSafe(html);
}

export default helper(renderMarkdown);
