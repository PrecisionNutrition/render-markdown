import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('helper:render-markdown', function (hooks) {
  setupRenderingTest(hooks);

  test('renders markdown', async function (assert) {
    this.set('raw', '# foo');

    await render(hbs`{{render-markdown this.raw}}`);

    assert.equal(this.element.innerHTML.trim(), '<h1>foo</h1>');
  });

  test('more complicated markdown', async function (assert) {
    this.set(
      'raw',
      `#  Hey guy
  How are you doing?

  Hopefully all is well.

  This is a list:

  * Foo

  * [*bar*](http://example.com)

  Be cool,

  J.`
    );

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

    await render(hbs`{{render-markdown this.raw}}`);

    let innerHTML = this.element.innerHTML.trim();

    assert.equal(innerHTML, expectedRet);
  });

  test('works with an empty param', async function (assert) {
    await render(hbs`{{render-mardown}}`);

    assert.equal(this.element.innerHTML, '');
  });

  test('it supports attributes on elements', async function (assert) {
    let expectedHtml =
      '<p><a href="example.com" target="new" rel="noopener noreferrer">a link</a></p>';

    this.set('raw', '[a link](example.com){target=new}');

    await render(hbs`{{render-markdown this.raw}}`);

    let retHTML = this.element.innerHTML.trim();

    assert.equal(retHTML, expectedHtml, 'markdown-it-attrs plugin is not working');
  });

  test('it assigns a target attribute to regular links', async function (assert) {
    this.set('raw', '[Hey](http://example.com)');

    await render(hbs`{{render-markdown this.raw}}`);

    let anchor = find('a');

    assert.equal(anchor.getAttribute('target'), '_blank');
  });

  test('redirect links without explicit target attribute', async function (assert) {
    this.set('raw', '[Hey](#/redirect/activity/123)');

    await render(hbs`{{render-markdown this.raw}}`);

    let anchor = find('a');

    assert.equal(anchor.getAttribute('target'), undefined, 'does not add target attribute');
    assert.equal(anchor.getAttribute('rel'), undefined, 'does not add rel attribute');
  });

  test('redirect link with explicit target attribute', async function (assert) {
    this.set('raw', '[Hey again](#/redirect/activity/123){target="_blank"}');

    await render(hbs`{{render-markdown this.raw}}`);

    let anchor = find('a');

    assert.equal(anchor.getAttribute('rel'), 'noopener noreferrer', 'does add rel attribute');
  });

  test('it assigns a target to mailto links', async function (assert) {
    this.set('raw', '[Hey](mailto:joe@example.com)');

    await render(hbs`{{render-markdown this.raw}}`);

    let anchor = find('a');

    assert.equal(anchor.getAttribute('target'), '_blank');

    assert.equal(anchor.getAttribute('rel'), 'noopener noreferrer');
  });

  test('it parses definitions', async function (assert) {
    this.set(
      'raw',
      `This is a [definition: a statement of the exact meaning of a word, especially in a dictionary]definition[/definition]`
    );

    let expectedRet = `<p>This is a <span class="Definition" data-term="definition" data-definition="a statement of the exact meaning of a word, especially in a dictionary">
        definition
      </span></p>`;

    await render(hbs`{{render-markdown this.raw}}`);

    let innerHTML = this.element.innerHTML.trim();

    assert.equal(innerHTML, expectedRet);
  });

  test('it escapes definitions', async function (assert) {
    this.set(
      'raw',
      `This is a [definition: a statement of the exact " meaning of a word, especially in a dictionary]definition[/definition]`
    );

    let expectedRet = `<p>This is a <span class="Definition" data-term="definition" data-definition="a statement of the exact &amp;quot; meaning of a word, especially in a dictionary">
        definition
      </span></p>`;

    await render(hbs`{{render-markdown this.raw}}`);

    let innerHTML = this.element.innerHTML.trim();

    assert.equal(innerHTML, expectedRet);
  });

  test('it does not replace improperly formatted definitions', async function (assert) {
    this.set(
      'raw',
      `This is a [definition a statement of the exact " meaning of a word, especially in a dictionary]definition[/definition]`
    );

    let expectedRet = `<p>This is a [definition a statement of the exact " meaning of a word, especially in a dictionary]definition[/definition]</p>`;

    await render(hbs`{{render-markdown this.raw}}`);

    let innerHTML = this.element.innerHTML.trim();

    assert.equal(innerHTML, expectedRet);
  });
});
