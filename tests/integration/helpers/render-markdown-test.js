
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import {
  find,
} from 'ember-native-dom-helpers';

moduleForComponent('render-markdown', 'helper:render-markdown', {
  integration: true
});

test('renders markdown', function(assert) {
  this.set('raw', '# foo');

  this.render(hbs`{{render-markdown raw}}`);

  let ret = find('*');

  assert.equal(
    ret.innerHTML.trim(),
    '<h1>foo</h1>'
  );
});

test('more complicated markdown', function(assert) {
  this.set('raw', `#  Hey guy
How are you doing?

Hopefully all is well.

This is a list:

* Foo

* [*bar*](http://example.com)

Be cool,

J.`);

  let expectedRet = `<h1>Hey guy</h1>
<p>How are you doing?</p>
<p>Hopefully all is well.</p>
<p>This is a list:</p>
<ul>
<li>
<p>Foo</p>
</li>
<li>
<p><a href="http://example.com" target="_blank" rel="noopener noreferrer"><em>bar</em></a></p>
</li>
</ul>
<p>Be cool,</p>
<p>J.</p>`;

  this.render(hbs`{{render-markdown raw}}`);

  let ret = find('*');

  let innerHTML = ret.innerHTML.trim();

  assert.equal(
    innerHTML,
    expectedRet
  );
});

test('works with an empty param', function(assert) {
  this.render(hbs`{{render-mardown}}`);

  let ret = find('*');

  let innerHTML = ret.innerHTML;

  if (innerHTML === '<!---->') {
    assert.ok(true, 'Ember 2.8 has comments as inner HTML, this is okay');
  } else {
    assert.equal(
      ret.innerHTML,
      ''
    );
  }
});

test('it supports attributes on elements', function(assert) {
  let expectedHtml = '<p><a href="example.com" target="new">a link</a></p>';

  this.set('raw', '[a link](example.com){target=new}');

  this.render(hbs`{{render-markdown raw}}`);

  let ret = find('*');

  let retHTML = ret.innerHTML.trim();

  assert.equal(
    retHTML,
    expectedHtml,
    'markdown-it-attrs plugin is not working'
  );
});

test('it assigns a target attribute to links', function(assert) {
  this.set('raw', '[Hey](http://example.com)');

  this.render(hbs`{{render-markdown raw}}`);

  let anchor = find('a');

  assert.equal(
    anchor.getAttribute('target'),
    '_blank'
  );

  this.set('raw', '[Hey](mailto:joe@example.com)');

  this.render(hbs`{{render-markdown raw}}`);

  anchor = find('a');

  assert.equal(
    anchor.getAttribute('target'),
    '_blank'
  );

  assert.equal(
    anchor.getAttribute('rel'),
    'noopener noreferrer'
  );
});
