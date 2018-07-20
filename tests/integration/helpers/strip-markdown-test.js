import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('helper:strip-markdown', function(hooks) {
  setupRenderingTest(hooks);

  test('it strips markdown and renders plain text', async function(assert) {
    this.set('markdown', `*hey*

  * Yo
  * Dawg`);

    let expected = `hey

Yo
Dawg`;

    await render(hbs`{{strip-markdown markdown}}`);

    assert.dom('*').hasText(expected);
  });
});
