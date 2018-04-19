import { find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | smoke test', function(hooks) {
  setupApplicationTest(hooks);

  test('smoke test', async function(assert) {
    await visit('/');

    let simple = find('[data-test-selector="simple"]');

    assert.equal(
      simple.innerHTML.trim(),
      '<p><em>hello</em></p>'
    );

    let blank = find('[data-test-selector="blank"]');

    assert.ok(blank);

    let withAttr = find('[data-test-selector="with-attr"] a');

    assert.equal(
      withAttr.dataset.foo,
      'bar'
    );

    assert.equal(
      withAttr.target,
      '_blank'
    );

    assert.equal(
      withAttr.rel,
      'noopener noreferrer'
    );

    let withoutMarkdown = find('[data-test-selector="strip-markdown"]');

    assert.equal(
      withoutMarkdown.textContent.trim(),
      'hello'
    );
  });
});
