import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | smoke test');

test('smoke test', function(assert) {
  visit('/');

  andThen(function() {
    let simple = find('[data-test-selector="simple"]').get(0);

    assert.equal(
      simple.innerHTML.trim(),
      '<p><em>hello</em></p>'
    );

    let blank = find('[data-test-selector="blank"]').get(0);

    assert.ok(blank);

    let withAttr = find('[data-test-selector="with-attr"] a').get(0);

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

    let withoutMarkdown = find('[data-test-selector="strip-markdown"]').get(0);

    assert.equal(
      withoutMarkdown.textContent.trim(),
      'hello'
    );
  });
});
