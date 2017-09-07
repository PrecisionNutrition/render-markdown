
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import {
  find,
} from 'ember-native-dom-helpers';

moduleForComponent('strip-markdown', 'helper:strip-markdown', {
  integration: true
});

test('it strips markdown and renders plain text', function(assert) {
  this.set('markdown', `*hey*

* Yo
* Dawg`);

  let expected = `hey

Yo
Dawg`;

  this.render(hbs`{{strip-markdown markdown}}`);

  assert.equal(
    find('*').textContent.trim(),
    expected
  );
});

