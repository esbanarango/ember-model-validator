import EmberObject from '@ember/object';
import ObjectValidator from 'ember-model-validator/decorators/object-validator';
import Messages from 'ember-model-validator/messages/pt-br';

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | object-validator', function (hooks) {
  setupTest(hooks);

  test('Validator on Simple Object', function (assert) {
    assert.expect(2);
    @ObjectValidator
    class ValidatorObjectClass extends EmberObject {
      name = null;
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
});
