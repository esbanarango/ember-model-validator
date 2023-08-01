import EmberObject from '@ember/object';
import { objectValidator, type ValidatedObject } from 'ember-model-validator';
import Messages from 'ember-model-validator/messages/pt-br';

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { tracked } from '@glimmer/tracking';

module('Unit | object-validator', function (hooks) {
  setupTest(hooks);

  test('Validator on Simple POJO', function (assert) {
    assert.expect(2);

    @objectValidator
    class ValidatorObjectPojo {
      @tracked name = '';
      _locale = 'pt-br';
      validations = {
        name: {
          presence: true,
        },
      };
    }

    interface ValidatorObjectPojo extends ValidatedObject, EmberObject {}

    const subject = new ValidatorObjectPojo();
    subject.name = '';

    assert.false(subject.validate());
    assert.strictEqual(subject.errors.errorsFor('name').mapBy('message')[0][0], Messages.presenceMessage);
  });

  test('Validator on Simple EmberObject', function (assert) {
    assert.expect(2);

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

    interface ValidatorObjectClass extends ValidatedObject, EmberObject {}

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

  test('Access objects as a hash', function (assert) {
    assert.expect(5);

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
    assert.strictEqual(subject.errors['name'].mapBy('message')[0][0], Messages.presenceMessage);

    subject.name = 'test';
    assert.true(subject.validate());
    assert.strictEqual(subject.errors['name'], undefined);
    assert.strictEqual(subject.get('errors').errorsFor('name').length, 0);
  });
});
