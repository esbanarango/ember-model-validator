import EmberObject from '@ember/object';
import { objectValidator, type ValidatedObject } from 'ember-model-validator';
import Messages from 'ember-model-validator/messages/pt-br';

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | object-validator', function (hooks) {
  setupTest(hooks);

  test('Validator on Simple Object', function (assert) {
    assert.expect(2);

    interface ValidatorObjectClass extends ValidatedObject, EmberObject {}

    @objectValidator
    class ValidatorObjectClass extends EmberObject {
      name = '';
      _locale = 'pt-br';
      validations = {
        name: {
          presence: true,
        },
      };
    }
    const subject = ValidatorObjectClass.create();
    subject.name = '';

    assert.false(subject.validate());
    assert.strictEqual(subject.get('errors').errorsFor('name').mapBy('message')[0][0], Messages.presenceMessage);
  });

  test('Re computed errors', function (assert) {
    assert.expect(4);

    interface ValidatorObjectClass extends ValidatedObject, EmberObject {}

    @objectValidator
    class ValidatorObjectClass extends EmberObject {
      name = '';
      _locale = 'pt-br';
      validations = {
        name: {
          presence: true,
        },
      };
    }
    const subject = ValidatorObjectClass.create();
    subject.name = '';

    assert.false(subject.validate());
    assert.strictEqual(subject.get('errors').errorsFor('name').mapBy('message')[0][0], Messages.presenceMessage);

    subject.name = 'test';
    assert.true(subject.validate());
    assert.strictEqual(subject.get('errors').errorsFor('name').length, 0);
  });
});
