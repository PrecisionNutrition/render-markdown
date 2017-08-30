import Ember from 'ember';
import markdownit from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';

const {
  $,
  isEmpty,
  Helper: {
    helper,
  },
  String: {
    htmlSafe,
  },
} = Ember;

// This is a hacktastic solution. You create a container that can
// receive a bunch of elements, append those elements to the
// container, and return the HTML for the whole thing.
//
// @see http://stackoverflow.com/questions/3311744/jquery-array-of-elements-to-raw-html
function defuckifyHTML(html) {
  if (!html) {
    return '';
  } else {
    let container = $('<span />');

    $.each(html, function(i, val) {
      container.append(val);
    });

    return container.html();
  }
}

// Use jQuery to parse the html, give target to links and return string again
// I know modifying the markdown lib would be faster, but a lot more work
// And this seems fast enough given it uses the browsers native parser
function targetLinks(html) {
  let origin = window.location.origin;
  let content = $.parseHTML(html);

  $(`a[href^='mailto'], a[href^='http']:not([href^='${origin}'])`, content)
    .attr('target', '_blank')
    .attr('rel', 'noopener noreferrer');

  // TODO: Make a better solution for this. jQuery has given us an array
  // of elements. We need to turn that into HTML. You would think you could
  // do that with elements.html(), but that only converts the first element
  // to HTML. So we defuckify it.
  return defuckifyHTML(content);
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
