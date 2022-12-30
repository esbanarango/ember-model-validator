import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import Messages from 'ember-model-validator/messages/en';
import MessageFormater from '../../helpers/message-formater';

const formater = MessageFormater.create();

module('Unit | Model | fake-model', function (hooks) {
  setupTest(hooks);

  test('exists', function (assert) {
    assert.expect(1);
    const model = run(() => this.owner.lookup('service:store').createRecord('fake-model'));

    assert.ok(model);
  });

  module('allowBlank option', function () {
    test('it skips other validations when optional field is blank', function (assert) {
      assert.expect(1);
      const model = run(() =>
        this.owner.lookup('service:store').createRecord('fake-model', { anOptionalNumber: null })
      );

      model.validate();

      assert.strictEqual(model.get('errors').errorsFor('anOptionalNumber').length, 0);
    });
    test('it runs remaining validations when optional field is not blank', function (assert) {
      assert.expect(4);
      const model = run(() =>
        this.owner.lookup('service:store').createRecord('fake-model', { anOptionalNumber: 'abc' })
      );

      assert.false(model.validate());

      assert.strictEqual(model.get('errors').errorsFor('anOptionalNumber').length, 2);

      assert.strictEqual(
        model.get('errors').errorsFor('anOptionalNumber').mapBy('message')[0][0],
        Messages.numericalityMessage
      );

      assert.strictEqual(
        model.get('errors').errorsFor('anOptionalNumber').mapBy('message')[1][0],
        Messages.numericalityOnlyIntegerMessage
      );
    });
  });

  module('conditional option', function () {
    test('it validates only if `if function` returns true', function (assert) {
      assert.expect(2);

      const model = run(() => this.owner.lookup('service:store').createRecord('fake-model', { condType: 'gallery' }));

      model.validate();

      assert.strictEqual(model.get('errors').errorsFor('images').length, 1);
      assert.strictEqual(model.get('errors').errorsFor('images').mapBy('message')[0][0], Messages.presenceMessage);
    });

    test('skips validation if `if function` returns false', function (assert) {
      assert.expect(1);

      const model = run(() =>
        this.owner.lookup('service:store').createRecord('fake-model', { condType: 'chancuncha' })
      );

      model.validate();

      assert.strictEqual(model.get('errors').errorsFor('images').length, 0);
    });
  });

  module('message with interpolated values', function () {
    test('interpolates the value whitn the message', function (assert) {
      assert.expect(2);
      const model = run(() =>
        this.owner.lookup('service:store').createRecord('fake-model', { theMinimunmInterpolatedTenNumber: '1' })
      );

      assert.false(model.validate({ only: ['theMinimunmInterpolatedTenNumber'] }));

      assert.strictEqual(
        model.get('errors').errorsFor('theMinimunmInterpolatedTenNumber').mapBy('message')[0][0],
        'eeeche 10'
      );
    });
  });

  module('Presence validator', function () {
    test('it validates the presence of the attributes set on `validations.presence`', function (assert) {
      assert.expect(3);
      const model = run(() => this.owner.lookup('service:store').createRecord('fake-model'));
      const errorAs = model.validations.name.presence.errorAs;
      delete model.validations.name.presence.errorAs;

      assert.false(model.validate());
      assert.strictEqual(model.get('errors').errorsFor('email').mapBy('message')[0][0], Messages.presenceMessage);
      assert.strictEqual(model.get('errors').errorsFor('name').mapBy('message')[0][0], Messages.presenceMessage);
      model.validations.name.presence['errorAs'] = errorAs;
    });
    module('When is a relation', function () {
      test('it validates the presence of the attributes set on `validations.presence` for Async relations', function (assert) {
        assert.expect(2);
        const model = run(() => this.owner.lookup('service:store').createRecord('fake-model'));

        assert.false(model.validate());
        assert.strictEqual(
          model.get('errors').errorsFor('asyncModel').mapBy('message')[0][0],
          Messages.presenceMessage
        );
      });

      test('it validates the presence of the attributes set on `validations.presence` for embedded relations', function (assert) {
        assert.expect(2);
        const model = run(() => this.owner.lookup('service:store').createRecord('fake-model'));

        assert.false(model.validate());

        assert.strictEqual(model.get('errors').errorsFor('otherFake').mapBy('message')[0][0], Messages.presenceMessage);
      });
    });
  });

  test('it validates the format of the attributes set on `validations.format`', function (assert) {
    assert.expect(2);
    const model = run(() => this.owner.lookup('service:store').createRecord('fake-model', { legacyCode: 3123123 }));

    assert.false(model.validate());

    assert.strictEqual(model.get('errors').errorsFor('legacyCode').mapBy('message')[0][0], Messages.formatMessage);
  });

  test('it validates the acceptance of the attributes set on `validations.acceptance`', function (assert) {
    assert.expect(2);
    const model = run(() => this.owner.lookup('service:store').createRecord('fake-model', { acceptConditions: 0 }));

    assert.false(model.validate());
    assert.strictEqual(
      model.get('errors').errorsFor('acceptConditions').mapBy('message')[0][0],
      Messages.acceptanceMessage
    );
  });

  test('it validates the matching of the attributes set on `validations.password`', function (assert) {
    assert.expect(2);
    const model = run(() =>
      this.owner
        .lookup('service:store')
        .createRecord('fake-model', { password: 'k$1hkjGd', passwordConfirmation: 'uuuu' })
    );

    assert.false(model.validate());

    const context = { match: model._unCamelCase('passwordConfirmation') };

    assert.strictEqual(
      model.get('errors').errorsFor('password').mapBy('message')[0][0],
      formater.formatMessage(Messages.matchMessage, context)
    );
  });

  test('it validates the absence of the attributes set on `validations.absence`', function (assert) {
    assert.expect(2);
    const model = run(() => this.owner.lookup('service:store').createRecord('fake-model', { login: 'asdasd' }));

    assert.false(model.validate());
    assert.strictEqual(model.get('errors').errorsFor('login').mapBy('message')[0][0], Messages.absenceMessage);
  });

  module('Postalcode validation', function () {
    test('it validates the zip code being invalid in the US', function (assert) {
      assert.expect(2);
      const model = run(() =>
        this.owner.lookup('service:store').createRecord('fake-model', { postalCodeUS: 'dfasdfsad' })
      );

      assert.false(model.validate());
      assert.strictEqual(model.get('errors').errorsFor('postalCodeUS').mapBy('message')[0][0], Messages.zipCodeMessage);
    });

    test('it validates postal codes from outside US - UK', function (assert) {
      assert.expect(2);
      const model = run(() => this.owner.lookup('service:store').createRecord('fake-model', { postalCodeUK: '09011' }));

      assert.false(model.validate());
      assert.strictEqual(model.get('errors').errorsFor('postalCodeUK').mapBy('message')[0][0], Messages.zipCodeMessage);
    });

    test('it validates postal codes from outside US - CA', function (assert) {
      assert.expect(2);
      const model = run(() => this.owner.lookup('service:store').createRecord('fake-model', { postalCodeCA: '09011' }));

      assert.false(model.validate());
      assert.strictEqual(model.get('errors').errorsFor('postalCodeCA').mapBy('message')[0][0], Messages.zipCodeMessage);
    });

    test('it validates that non-existing country codes default to US behavior', function (assert) {
      assert.expect(2);
      const model = run(() =>
        this.owner.lookup('service:store').createRecord('fake-model', { postalCodeZZ: 'dfasdfsad' })
      );

      assert.false(model.validate());
      assert.strictEqual(model.get('errors').errorsFor('postalCodeZZ').mapBy('message')[0][0], Messages.zipCodeMessage);
    });
  });

  test('it validates the truthyness of the user custom validation function on `validations.custom`', function (assert) {
    assert.expect(2);
    const model = run(() => this.owner.lookup('service:store').createRecord('fake-model', { password: 12345 }));

    assert.false(model.validate());

    assert.strictEqual(
      model.get('errors').errorsFor('password').mapBy('message')[0][0],
      Messages.customValidationMessage
    );
  });

  test('it validates the an array of custom validations', function (assert) {
    assert.expect(2);
    const model = run(() => this.owner.lookup('service:store').createRecord('fake-model', { thing: 'fail' }));

    assert.false(model.validate());
    assert.strictEqual(model.get('errors').errorsFor('thing').mapBy('message')[0][0], Messages.customValidationMessage);
  });

  test('it validates the email format of the attributes set on `validations.email`', function (assert) {
    assert.expect(2);
    const model = run(() => this.owner.lookup('service:store').createRecord('fake-model', { email: 'adsfasdf$' }));

    assert.false(model.validate());
    assert.strictEqual(model.get('errors').errorsFor('email').mapBy('message')[0][0], Messages.mailMessage);
  });

  test('it validates the url format of the attributes set on `validations.url`', function (assert) {
    assert.expect(2);
    const model = run(() =>
      this.owner.lookup('service:store').createRecord('fake-model', { myBlog: '//www.hola.com' })
    );

    assert.false(model.validate());
    assert.strictEqual(model.get('errors').errorsFor('myBlog').mapBy('message')[0][0], Messages.URLMessage);
  });

  test('it validates the color format of the attributes set on `validations.color`', function (assert) {
    assert.expect(2);
    const model = run(() => this.owner.lookup('service:store').createRecord('fake-model', { favoriteColor: '000XXX' }));

    const message = model.validations.favoriteColor.color.message;
    delete model.validations.favoriteColor.color.message;

    assert.false(model.validate());
    assert.strictEqual(model.get('errors').errorsFor('favoriteColor').mapBy('message')[0][0], Messages.colorMessage);

    model.validations.favoriteColor.color['message'] = message;
  });

  test('it validates the numericality of the attributes set on `validations.numericality`', function (assert) {
    assert.expect(2);
    const model = run(() =>
      this.owner.lookup('service:store').createRecord('fake-model', { lotteryNumber: 'adsfasdf$' })
    );

    assert.false(model.validate());
    assert.strictEqual(
      model.get('errors').errorsFor('lotteryNumber').mapBy('message')[0][0],
      Messages.numericalityMessage
    );
  });
});
