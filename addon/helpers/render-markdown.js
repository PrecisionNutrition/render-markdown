import Ember from 'ember';

import { isEmpty } from '@ember/utils';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

import markdownit from 'markdown-it';
import attrs from 'markdown-it-attrs';

const {
  Handlebars: {
    Utils: { escapeExpression },
  },
} = Ember;

// SEE: https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer

const md = markdownit({ html: true }).use(attrs);

const REDIRECT_PATTERN = /#\/redirect\/activity\/([^/]+)\/?/;

function isRedirectLinkWithoutTarget(token) {
  return REDIRECT_PATTERN.test(token.attrGet('href')) && token.attrGet('target') === null;
}

// Remember old renderer, if overridden, or proxy to default renderer
const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

// Add target and rel to links when anchor tag is opened
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx];

  if (!isRedirectLinkWithoutTarget(token)) {
    token.attrPush(['target', '_blank']);
    token.attrPush(['rel', 'noopener noreferrer']);
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};

/**
 * Look for definition "short-codes" and replace them with markup for a definition.
 * The markup is then used to create Tippy tooltips in es-certification.
 *
 * Shortcode syntax:
 *
 *   [definition: <definition>]<term>[/definition]
 *
 * Example of shortcode:
 *
 *   [definition: used to express a greeting]hello[/definition]
 *
 * For more examples and a regexp explanation, see https://regex101.com/r/3Dpban/4
 */
export function parseDefinitions(html) {
  const DEFINITIONS_EXPR = /\[definition:[\s+]?(?<definition>.*?)\](?<term>.*?)\[\/definition\]/g;

  let match;

  while ((match = DEFINITIONS_EXPR.exec(html))) {
    let { definition, term } = match.groups;
    let replacement = `
      <span class="Definition" data-term="${escapeExpression(
        term
      )}" data-definition="${escapeExpression(definition)}">
        ${term}
      </span>
    `.trim();
    html = html.replace(match[0], replacement);
  }

  return html;
}

export function renderMarkdown([raw]) {
  if (isEmpty(raw)) {
    return '';
  } else {
    let html = md.render(raw);

    html = parseDefinitions(html);

    return htmlSafe(html);
  }
}

export default helper(renderMarkdown);
