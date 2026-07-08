import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Messages from 'ember-model-validator/messages/en';

module('Unit | Model | async-model', function (hooks) {
  setupTest(hooks);

  test('exists', function (assert) {
    assert.expect(1);
    const model = this.owner.lookup('service:store').createRecord('async-model');

    assert.ok(model);
  });

  module('Presence validator', function () {
    module('When is a sync (async: false) relation', function () {
      test('it validates the presence of sync relations when not set', function (assert) {
        assert.expect(2);
        const model = this.owner.lookup('service:store').createRecord('async-model');

        assert.false(model.validate({ only: ['fakeModel'] }));
        assert.strictEqual(
          model.get('errors').errorsFor('fakeModel').mapBy('message')[0][0],
          Messages.presenceMessage
        );
      });

      test('it passes validation when sync relation is set', function (assert) {
        assert.expect(1);
        const store = this.owner.lookup('service:store');
        const model = store.createRecord('async-model');

        model.set(
          'fakeModel',
          store.createRecord('fake-model', { email: 'test@example.com', name: 'Jose Rene' })
        );

        assert.true(model.validate({ only: ['fakeModel'] }));
      });

      test('it passes validation when sync relation is set to an unsaved record', function (assert) {
        assert.expect(1);
        const store = this.owner.lookup('service:store');
        const model = store.createRecord('async-model');

        model.set('fakeModel', store.createRecord('fake-model'));

        assert.true(model.validate({ only: ['fakeModel'] }));
      });
    });
  });
});
