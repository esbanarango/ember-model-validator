import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Messages from 'ember-model-validator/messages/en';
import MessageFormater from '../../helpers/message-formater';

const formater = MessageFormater.create();

module('Unit | Model | fake-model', function (hooks) {
  setupTest(hooks);

  test('exists', function (assert) {
    assert.expect(1);
    const model = this.owner.lookup('service:store').createRecord('fake-model');

    assert.ok(model);
  });

  module('allowBlank option', function () {
    test('it skips other validations when optional field is blank', function (assert) {
      assert.expect(1);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { anOptionalNumber: null });

      model.validate();
      assert.strictEqual(model.get('errors').errorsFor('anOptionalNumber').length, 0);
    });
    test('it runs remaining validations when optional field is not blank', function (assert) {
      assert.expect(4);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { anOptionalNumber: 'abc' });

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

      const model = this.owner.lookup('service:store').createRecord('fake-model', { condType: 'gallery' });

      model.validate();

      assert.strictEqual(model.get('errors').errorsFor('images').length, 1);
      assert.strictEqual(model.get('errors').errorsFor('images').mapBy('message')[0][0], Messages.presenceMessage);
    });

    test('skips validation if `if function` returns false', function (assert) {
      assert.expect(1);

      const model = this.owner.lookup('service:store').createRecord('fake-model', { condType: 'chancuncha' });

      model.validate();

      assert.strictEqual(model.get('errors').errorsFor('images').length, 0);
    });
  });

  module('message with interpolated values', function () {
    test('interpolates the value whitn the message', function (assert) {
      assert.expect(2);
      const model = this.owner
        .lookup('service:store')
        .createRecord('fake-model', { theMinimunmInterpolatedTenNumber: '1' });

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
      const model = this.owner.lookup('service:store').createRecord('fake-model');
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
        const model = this.owner.lookup('service:store').createRecord('fake-model');

        assert.false(model.validate());
        assert.strictEqual(
          model.get('errors').errorsFor('asyncModel').mapBy('message')[0][0],
          Messages.presenceMessage
        );
      });

      test('it validates the presence of the attributes set on `validations.presence` for embedded relations', function (assert) {
        assert.expect(2);
        const model = this.owner.lookup('service:store').createRecord('fake-model');

        assert.false(model.validate());

        assert.strictEqual(model.get('errors').errorsFor('otherFake').mapBy('message')[0][0], Messages.presenceMessage);
      });
    });
  });

  test('it validates the format of the attributes set on `validations.format`', function (assert) {
    assert.expect(2);
    const model = this.owner.lookup('service:store').createRecord('fake-model', { legacyCode: 3123123 });

    assert.false(model.validate());

    assert.strictEqual(model.get('errors').errorsFor('legacyCode').mapBy('message')[0][0], Messages.formatMessage);
  });

  test('it validates the acceptance of the attributes set on `validations.acceptance`', function (assert) {
    assert.expect(2);
    const model = this.owner.lookup('service:store').createRecord('fake-model', { acceptConditions: 0 });

    assert.false(model.validate());
    assert.strictEqual(
      model.get('errors').errorsFor('acceptConditions').mapBy('message')[0][0],
      Messages.acceptanceMessage
    );
  });

  test('it validates the matching of the attributes set on `validations.password`', function (assert) {
    assert.expect(2);
    const model = this.owner
      .lookup('service:store')
      .createRecord('fake-model', { password: 'k$1hkjGd', passwordConfirmation: 'uuuu' });

    assert.false(model.validate());

    const context = { match: model._unCamelCase('passwordConfirmation') };

    assert.strictEqual(
      model.get('errors').errorsFor('password').mapBy('message')[0][0],
      formater.formatMessage(Messages.matchMessage, context)
    );
  });

  test('it validates the absence of the attributes set on `validations.absence`', function (assert) {
    assert.expect(2);
    const model = this.owner.lookup('service:store').createRecord('fake-model', { login: 'asdasd' });

    assert.false(model.validate());
    assert.strictEqual(model.get('errors').errorsFor('login').mapBy('message')[0][0], Messages.absenceMessage);
  });

  module('Postalcode validation', function () {
    test('it validates the zip code being invalid in the US', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { postalCodeUS: 'dfasdfsad' });

      assert.false(model.validate());
      assert.strictEqual(model.get('errors').errorsFor('postalCodeUS').mapBy('message')[0][0], Messages.zipCodeMessage);
    });

    test('it validates postal codes from outside US - UK', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { postalCodeUK: '09011' });

      assert.false(model.validate());
      assert.strictEqual(model.get('errors').errorsFor('postalCodeUK').mapBy('message')[0][0], Messages.zipCodeMessage);
    });

    test('it validates postal codes from outside US - CA', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { postalCodeCA: '09011' });

      assert.false(model.validate());
      assert.strictEqual(model.get('errors').errorsFor('postalCodeCA').mapBy('message')[0][0], Messages.zipCodeMessage);
    });

    test('it validates that non-existing country codes default to US behavior', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { postalCodeZZ: 'dfasdfsad' });

      assert.false(model.validate());
      assert.strictEqual(model.get('errors').errorsFor('postalCodeZZ').mapBy('message')[0][0], Messages.zipCodeMessage);
    });
  });

  test('it validates the truthyness of the user custom validation function on `validations.custom`', function (assert) {
    assert.expect(2);
    const model = this.owner.lookup('service:store').createRecord('fake-model', { password: 12345 });

    assert.false(model.validate());

    assert.strictEqual(
      model.get('errors').errorsFor('password').mapBy('message')[0][0],
      Messages.customValidationMessage
    );
  });

  test('it validates the an array of custom validations', function (assert) {
    assert.expect(2);
    const model = this.owner.lookup('service:store').createRecord('fake-model', { thing: 'fail' });

    assert.false(model.validate());
    assert.strictEqual(model.get('errors').errorsFor('thing').mapBy('message')[0][0], Messages.customValidationMessage);
  });

  test('it validates the email format of the attributes set on `validations.email`', function (assert) {
    assert.expect(2);
    const model = this.owner.lookup('service:store').createRecord('fake-model', { email: 'adsfasdf$' });

    assert.false(model.validate());
    assert.strictEqual(model.get('errors').errorsFor('email').mapBy('message')[0][0], Messages.mailMessage);
  });

  test('it validates the url format of the attributes set on `validations.url`', function (assert) {
    assert.expect(2);
    const model = this.owner.lookup('service:store').createRecord('fake-model', { myBlog: '//www.hola.com' });

    assert.false(model.validate());
    assert.strictEqual(model.get('errors').errorsFor('myBlog').mapBy('message')[0][0], Messages.URLMessage);
  });

  test('it validates the color format of the attributes set on `validations.color`', function (assert) {
    assert.expect(2);
    const model = this.owner.lookup('service:store').createRecord('fake-model', { favoriteColor: '000XXX' });

    const message = model.validations.favoriteColor.color.message;
    delete model.validations.favoriteColor.color.message;

    assert.false(model.validate());
    assert.strictEqual(model.get('errors').errorsFor('favoriteColor').mapBy('message')[0][0], Messages.colorMessage);

    model.validations.favoriteColor.color['message'] = message;
  });

  test('it validates the numericality of the attributes set on `validations.numericality`', function (assert) {
    assert.expect(2);
    const model = this.owner.lookup('service:store').createRecord('fake-model', { lotteryNumber: 'adsfasdf$' });

    assert.false(model.validate());
    assert.strictEqual(
      model.get('errors').errorsFor('lotteryNumber').mapBy('message')[0][0],
      Messages.numericalityMessage
    );
  });

  test('it validates the subdomain format of the attributes set on `validations.subdomain`', function (assert) {
    assert.expect(2);
    const model = this.owner.lookup('service:store').createRecord('fake-model', { mySubdomain: 'with space' });

    const message = model.validations.mySubdomain.subdomain.message;
    delete model.validations.mySubdomain.subdomain.message;

    assert.false(model.validate());
    assert.strictEqual(model.get('errors').errorsFor('mySubdomain').mapBy('message')[0][0], Messages.subdomainMessage);

    model.validations.mySubdomain.subdomain['message'] = message;
  });

  test('it validates the inclusion of the attributes set on `validations.inclusion`', function (assert) {
    assert.expect(2);
    const model = this.owner.lookup('service:store').createRecord('fake-model', { name: 'adsfasdf$' });
    const message = model.validations.name.inclusion.message;
    delete model.validations.name.inclusion.message;

    assert.false(model.validate());
    assert.strictEqual(model.get('errors').errorsFor('name').mapBy('message')[0][0], Messages.inclusionMessage);

    model.validations.name.inclusion['message'] = message;
  });

  test('it validates the exclusion of the attributes set on `validations.exclusion`', function (assert) {
    assert.expect(2);
    const model = this.owner.lookup('service:store').createRecord('fake-model', { secondName: 'Wilder Medina' });

    const message = model.validations.secondName.exclusion.message;
    delete model.validations.secondName.exclusion.message;

    assert.false(model.validate());
    assert.strictEqual(model.get('errors').errorsFor('secondName').mapBy('message')[0][0], Messages.exclusionMessage);

    model.validations.secondName.exclusion['message'] = message;
  });

  // Numericality validator
  module('Numericality validator', function () {
    module('`onlyInteger` option', function () {
      test('it validates the number for only being an integer', function (assert) {
        assert.expect(2);
        const model = this.owner.lookup('service:store').createRecord('fake-model', { anInteger: 1.3 });

        assert.false(model.validate({ only: ['anInteger'] }));
        assert.strictEqual(
          model.get('errors').errorsFor('anInteger').mapBy('message')[0][0],
          Messages.numericalityOnlyIntegerMessage
        );
      });
    });

    module('`greaterThan` option', function () {
      test('it validates that the number is `greater than` the specified value', function (assert) {
        assert.expect(2);
        const model = this.owner.lookup('service:store').createRecord('fake-model', { anIntegerGreaterThan4: 2 });

        assert.false(model.validate({ only: ['anIntegerGreaterThan4'] }));

        const context = { count: 4 };
        assert.strictEqual(
          model.get('errors').errorsFor('anIntegerGreaterThan4').mapBy('message')[0][0],
          formater.formatMessage(Messages.numericalityGreaterThanMessage, context)
        );
      });
    });

    module('`greaterThanOrEqualTo` option', function () {
      test('it validates that the number is `greater than or equal` to the specified value', function (assert) {
        assert.expect(2);
        const model = this.owner
          .lookup('service:store')
          .createRecord('fake-model', { anIntegerGreaterThanOrEqual7: 2 });

        assert.false(model.validate({ only: ['anIntegerGreaterThanOrEqual7'] }));

        const context = { count: 7 };
        assert.strictEqual(
          model.get('errors').errorsFor('anIntegerGreaterThanOrEqual7').mapBy('message')[0][0],
          formater.formatMessage(Messages.numericalityGreaterThanOrEqualToMessage, context)
        );
      });
    });

    module('`equalTo` option', function () {
      test('it validates that the number is `greater than or equal` to the specified value', function (assert) {
        assert.expect(2);
        const model = this.owner.lookup('service:store').createRecord('fake-model', { aTenNumber: 2 });

        assert.false(model.validate({ only: ['aTenNumber'] }));
        const context = { count: 10 };

        assert.strictEqual(
          model.get('errors').errorsFor('aTenNumber').mapBy('message')[0][0],
          formater.formatMessage(Messages.numericalityEqualToMessage, context)
        );
      });
    });

    module('`lessThan` option', function () {
      test('validates that the number is `less than` the specified value', function (assert) {
        assert.expect(2);
        const model = this.owner.lookup('service:store').createRecord('fake-model', { anIntegerLessThan4: 5 });

        assert.false(model.validate({ only: ['anIntegerLessThan4'] }));

        const context = { count: 4 };
        assert.strictEqual(
          model.get('errors').errorsFor('anIntegerLessThan4').mapBy('message')[0][0],
          formater.formatMessage(Messages.numericalityLessThanMessage, context)
        );
      });
    });

    module('`lessThanOrEqualTo` option', function () {
      test('it validates that the number is `less than or equal` to the specified value', function (assert) {
        assert.expect(2);
        const model = this.owner.lookup('service:store').createRecord('fake-model', { anIntegerLessThanOrEqual6: 8 });

        assert.false(model.validate({ only: ['anIntegerLessThanOrEqual6'] }));

        const context = { count: 6 };
        assert.strictEqual(
          model.get('errors').errorsFor('anIntegerLessThanOrEqual6').mapBy('message')[0][0],
          formater.formatMessage(Messages.numericalityLessThanOrEqualToMessage, context)
        );
      });
    });

    module('`odd` option', function () {
      test('it validates that the number is `odd`', function (assert) {
        assert.expect(2);
        const model = this.owner.lookup('service:store').createRecord('fake-model', { anOddNumber: 2 });

        assert.false(model.validate({ only: ['anOddNumber'] }));

        assert.strictEqual(
          model.get('errors').errorsFor('anOddNumber').mapBy('message')[0][0],
          Messages.numericalityOddMessage
        );
      });
    });

    module('`even` option', function () {
      test('validates that the number is `even`', function (assert) {
        assert.expect(2);
        const model = this.owner.lookup('service:store').createRecord('fake-model', { anEvenNumber: 3 });

        assert.false(model.validate({ only: ['anEvenNumber'] }));

        assert.strictEqual(
          model.get('errors').errorsFor('anEvenNumber').mapBy('message')[0][0],
          Messages.numericalityEvenMessage
        );
      });
    });
  });

  module('Date Validator', function () {
    test('validates a date object', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { date: new Date('a') });

      assert.false(model.validate({ only: ['date'] }));
      assert.strictEqual(model.get('errors').errorsFor('date').mapBy('message')[0][0], Messages.dateMessage);
    });
    test('validates a date string', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { stringDate: '2015-13-1' });

      assert.false(model.validate({ only: ['stringDate'] }));
      assert.strictEqual(model.get('errors').errorsFor('stringDate').mapBy('message')[0][0], Messages.dateMessage);
    });
    test('validates that the date is `before` the specified value', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { dateBefore2015: '2015-10-31' });

      assert.false(model.validate({ only: ['dateBefore2015'] }));

      const context = { date: new Date(2015, 1, 1) };
      assert.strictEqual(
        model.get('errors').errorsFor('dateBefore2015').mapBy('message')[0][0],
        formater.formatMessage(Messages.dateBeforeMessage, context)
      );
    });
    test('validates that the date is `after` the specified value', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { dateAfter2014: '2015-01-01' });

      assert.false(model.validate({ only: ['dateAfter2014'] }));

      const context = { date: new Date(2014, 12, 31) };
      assert.strictEqual(
        model.get('errors').errorsFor('dateAfter2014').mapBy('message')[0][0],
        formater.formatMessage(Messages.dateAfterMessage, context)
      );
    });
  });

  module('Length validator', function () {
    module('exact Length', function () {
      module('when is set to a number', function () {
        test('it validates the length of the attributes set on `validations.length`', function (assert) {
          assert.expect(2);
          const model = this.owner.lookup('service:store').createRecord('fake-model', { socialSecurity: 123 });

          assert.false(model.validate({ only: ['socialSecurity'] }));

          const context = { count: 5 };

          assert.strictEqual(
            model.get('errors').errorsFor('socialSecurity').mapBy('message')[0][0],
            formater.formatMessage(Messages.wrongLengthMessage, context)
          );
        });
      });

      module('when `is` is used to set the number', function () {
        test('it validates the length of the attributes set on `validations.length`', function (assert) {
          assert.expect(2);
          const model = this.owner.lookup('service:store').createRecord('fake-model', { chuncaluchoNumber: 123 });

          assert.false(model.validate({ only: ['chuncaluchoNumber'] }));

          assert.strictEqual(
            model.get('errors').errorsFor('chuncaluchoNumber').mapBy('message')[0][0],
            'this is not the length of a chuncalucho'
          );
        });
      });

      module('when `message` is set for `minimum` or `maximum` option', function () {
        test('it validates the length of the attributes set on `validations.length`', function (assert) {
          assert.expect(2);
          const model = this.owner.lookup('service:store').createRecord('fake-model', { theMinimunmTwoNumber: '1' });

          assert.false(model.validate({ only: ['theMinimunmTwoNumber'] }));
          assert.strictEqual(
            model.get('errors').errorsFor('theMinimunmTwoNumber').mapBy('message')[0][0],
            'please it has to be minimum 2 come on man!!'
          );
        });
      });
    });

    module('range Length', function () {
      module('when is set to an array', function () {
        test('validates the length of the attributes set on `validations.length`', function (assert) {
          assert.expect(2);
          const model = this.owner.lookup('service:store').createRecord('fake-model', { nsaNumber: 12 });

          assert.false(model.validate({ only: ['nsaNumber'] }));

          const context = { count: 3 };
          assert.strictEqual(
            model.get('errors').errorsFor('nsaNumber').mapBy('message')[0][0],
            formater.formatMessage(Messages.tooShortMessage, context)
          );
        });
      });

      module('when is set using `minimum` and `maximum` keys', function () {
        test('validates the length of the attributes set on `validations.length`', function (assert) {
          assert.expect(2);
          const model = this.owner.lookup('service:store').createRecord('fake-model', { hugeName: 123456 });

          assert.false(model.validate({ only: ['hugeName'] }));

          const context = { count: 5 };
          assert.strictEqual(
            model.get('errors').errorsFor('hugeName').mapBy('message')[0][0],
            formater.formatMessage(Messages.tooLongMessage, context)
          );
        });
      });
    });
  });

  // Length validation testing is handled above
  module('Password validations', function () {
    test('it accepts a string that meets all validation requirements', function (assert) {
      assert.expect(1);
      const model = this.owner
        .lookup('service:store')
        .createRecord('fake-model', { password: 'k$1hkjGd', passwordConfirmation: 'k$1hkjGd' });

      assert.true(model.validate({ only: ['password'] }));
    });

    module('capital character validation', function () {
      test('it rejects a string that does not contain a capital character', function (assert) {
        assert.expect(2);
        const model = this.owner
          .lookup('service:store')
          .createRecord('fake-model', { password: 'k$1hkjgd', passwordConfirmation: 'k$1hkjgd' });

        assert.false(model.validate({ only: ['password'] }));
        assert.strictEqual(
          model.get('errors').errorsFor('password').mapBy('message')[0][0],
          'must include an upper case character'
        );
      });
    });

    module('lower case character validation', function () {
      test('it rejects a string that does not contain a lower case character', function (assert) {
        assert.expect(2);
        const model = this.owner
          .lookup('service:store')
          .createRecord('fake-model', { password: 'K$1HKJGD', passwordConfirmation: 'K$1HKJGD' });

        assert.false(model.validate({ only: ['password'] }));
        assert.strictEqual(
          model.get('errors').errorsFor('password').mapBy('message')[0][0],
          'must include a lower case character'
        );
      });
    });

    module('special character validation', function () {
      test('it rejects a string that does not contain a special character', function (assert) {
        assert.expect(2);
        const model = this.owner
          .lookup('service:store')
          .createRecord('fake-model', { password: 'kW1hkjgd', passwordConfirmation: 'kW1hkjgd' });

        assert.false(model.validate({ only: ['password'] }));
        assert.strictEqual(
          model.get('errors').errorsFor('password').mapBy('message')[0][0],
          'must include one of these special characters: -+_!@#$%^&*.,?()'
        );
      });
    });

    module('number validation', function () {
      test('it rejects a string that does not contain a number', function (assert) {
        assert.expect(2);
        const model = this.owner
          .lookup('service:store')
          .createRecord('fake-model', { password: 'k$Whkjgd', passwordConfirmation: 'k$Whkjgd' });

        assert.false(model.validate({ only: ['password'] }));
        assert.strictEqual(model.get('errors').errorsFor('password').mapBy('message')[0][0], 'must include a number');
      });
    });
  });

  module('Relations validations', function () {
    module('`hasMany` relations', function () {
      test('it validates the relations specified on `validations.relations`', async function (assert) {
        assert.expect(1);
        const store = this.owner.lookup('service:store');
        const model = store.createRecord('fake-model', { email: 'thiisagoo@email.con', name: 'Jose Rene Higuita' });

        let otherFakes = await model.otherFakes;
        const otherFake = store.createRecord('other-model');
        if (otherFakes.push) {
          otherFakes.push(otherFake);
        } else {
          otherFakes.pushObject(otherFake);
        }

        assert.false(model.validate({ only: ['otherFakes'] }));
      });
    });

    module('`belongsTo` relations', function () {
      test('it validates the relations specified on `validations.relations`', function (assert) {
        assert.expect(2);
        const store = this.owner.lookup('service:store');
        const model = store.createRecord('fake-model', { email: 'thiisagoo@email.con', name: 'Jose Rene Higuita' });

        model.set('otherFake', store.createRecord('other-model'));
        assert.false(model.validate({ only: ['otherFake'] }));

        assert.strictEqual(
          model.get('otherFake.errors').errorsFor('name').mapBy('message')[0][0],
          Messages.presenceMessage
        );
      });
    });
  });

  module('Acceptance validator', function () {
    test('it returns false when the attribute value is not in the list of acceptable values', function (assert) {
      assert.expect(1);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { acceptConditions: 10 });

      assert.false(model.validate({ only: ['acceptConditions'] }));
    });
  });

  module('when custom message is set', function () {
    test('it validates the presence of the attributes set on `validations.presence` and use the correct message', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { bussinessEmail: '' });

      assert.false(model.validate());

      assert.strictEqual(
        model.get('errors').errorsFor('bussinessEmail').mapBy('message')[0][0],
        model.validations.bussinessEmail.presence.message
      );
    });

    test('it validates the truthyness of user func for `validations.custom` and use the correct message', function (assert) {
      assert.expect(2);
      const model = this.owner
        .lookup('service:store')
        .createRecord('fake-model', { lotteryNumber: 777, favoriteColor: null });

      assert.false(model.validate());

      assert.strictEqual(
        model.get('errors').errorsFor('lotteryNumber').mapBy('message')[0][0],
        model.validations.lotteryNumber.custom.message
      );
    });

    test('it validates the email format of the attributes set on `validations.email` and use the correct message', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { bussinessEmail: 'adsfasdf$' });

      assert.false(model.validate());
      assert.strictEqual(
        model.get('errors').errorsFor('bussinessEmail').mapBy('message')[0][0],
        model.validations.bussinessEmail.email.message
      );
    });

    test('it validates the color format of the attributes set on `validations.color` and use the correct message', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { favoriteColor: 'adsfasdf$' });

      assert.false(model.validate());
      assert.strictEqual(
        model.get('errors').errorsFor('favoriteColor').mapBy('message')[0][0],
        model.validations.favoriteColor.color.message
      );
    });

    test('it validates the subdomain format of the attributes set on `validations.subdomain` and use the correct message', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { mySubdomain: 'with space' });

      assert.false(model.validate());
      assert.strictEqual(
        model.get('errors').errorsFor('mySubdomain').mapBy('message')[0][0],
        model.validations.mySubdomain.subdomain.message
      );
    });

    test('it validates the subdomain reserved words of the attributes set on `validations.subdomain` and use the correct message', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { mySubdomain: 'admin' });

      assert.false(model.validate());
      assert.strictEqual(
        model.get('errors').errorsFor('mySubdomain').mapBy('message')[0][0],
        model.validations.mySubdomain.subdomain.message
      );
    });

    test('it validates the format of the attributes set on `validations.format` and use the correct message', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { mainstreamCode: 3123123 });

      assert.false(model.validate());
      assert.strictEqual(
        model.get('errors').errorsFor('mainstreamCode').mapBy('message')[0][0],
        model.validations.mainstreamCode.format.message
      );
    });

    test('it validates the inclusion of the attributes set on `validations.inclusion` and use the correct message', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { name: 'adsfasdf$' });

      assert.false(model.validate());
      assert.strictEqual(
        model.get('errors').errorsFor('name').mapBy('message')[0][0],
        model.validations.name.inclusion.message
      );
    });

    test('it validates the exclusion of the attributes set on `validations.exclusion` and use the correct message', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { secondName: 'Wilder Medina' });

      assert.false(model.validate());
      assert.strictEqual(
        model.get('errors').errorsFor('secondName').mapBy('message')[0][0],
        model.validations.secondName.exclusion.message
      );
    });

    test('it validates the numericality of the attributes set on `validations.numericality`', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model', { alibabaNumber: 'adsfasdf$' });

      assert.false(model.validate());
      assert.strictEqual(
        model.get('errors').errorsFor('alibabaNumber').mapBy('message')[0][0],
        model.validations.alibabaNumber.numericality.message
      );
    });

    module('When custom message is a function', function () {
      module('and function returns a string', function () {
        test('it set error message using the function return', function (assert) {
          assert.expect(2);
          const model = this.owner
            .lookup('service:store')
            .createRecord('fake-model', { otherCustomValidation: 123456 });

          assert.false(model.validate());
          assert.strictEqual(
            model.get('errors').errorsFor('otherCustomValidation').mapBy('message')[0][0],
            `otherCustomValidation must have exactly 5 digits, value ${model.get('otherCustomValidation')} does not`
          );
        });
      });

      module('and function does not return a string', function () {
        test('it set error message to default message', function (assert) {
          assert.expect(2);
          const model = this.owner
            .lookup('service:store')
            .createRecord('fake-model', { otherCustomValidationBadMessageFunction: 123456 });

          assert.false(model.validate());
          assert.strictEqual(
            model.get('errors').errorsFor('otherCustomValidationBadMessageFunction').mapBy('message')[0][0],
            Messages.customValidationMessage
          );
        });
      });
    });
  });

  module('when errorAs is set', function () {
    test('it validates the presence of the attributes set on `validations.presence` and add errors to `errorAs`', function (assert) {
      assert.expect(2);
      const model = this.owner.lookup('service:store').createRecord('fake-model');
      const errorAs = model.validations.name.presence.errorAs;

      assert.false(model.validate());
      assert.strictEqual(model.get('errors').errorsFor(errorAs).mapBy('message')[0][0], Messages.presenceMessage);
    });
  });

  module('when data is corrected after validation', function () {
    test('it clean the errors', function (assert) {
      assert.expect(2);
      const store = this.owner.lookup('service:store');
      const model = store.createRecord('fake-model', {
        email: 'adsfasdf$',
        name: 'Jose Rene',
        lotteryNumber: 124,
        alibabaNumber: 33,
        legacyCode: 'abc',
        acceptConditions: 1,
        password: 'k$1hkjGd',
        favoriteColor: 'FFFFFF',
        socialSecurity: 12312,
      });

      assert.false(model.validate());
      const asyncModel = store.createRecord('async-model');
      const otherFake = store.createRecord('other-model', { name: 'aaa', email: 'aaa@aa.com' });
      model.set('password', 'k$1hkjGd');
      model.set('passwordConfirmation', 'k$1hkjGd');
      model.set('email', 'rene@higuita.com');
      model.set('images', 'las images');
      model.set('asyncModel', asyncModel);
      model.set('otherFake', otherFake);

      assert.true(model.validate());
    });
  });

  module('when `addErrors` is passed to `validate`', function () {
    test('it it validates all the attributes but does not add errors', function (assert) {
      assert.expect(4);
      const model = this.owner.lookup('service:store').createRecord('fake-model', {
        email: 'adsfasdf$',
        name: 'Jose Rene',
        lotteryNumber: 124,
        alibabaNumber: 33,
        legacyCode: 'abc',
        acceptConditions: 1,
        password: 'k$1hkjGd',
        favoriteColor: 'FFFFFF',
        socialSecurity: 12312,
      });
      model.set('password', 'k$1hkjGd');
      model.set('passwordConfirmation', 'k$1hkjGd');

      assert.false(model.validate({ addErrors: false }));
      assert.strictEqual(model.get('errors').errorsFor('email').mapBy('message').length, 0);
      assert.false(model.validate());
      assert.strictEqual(model.get('errors').errorsFor('email').mapBy('message').length, 1);
    });
  });

  module('when `except` is passed to `validate`', function () {
    test('it it validates all the attributes except the ones specifed', function (assert) {
      assert.expect(3);
      const model = this.owner.lookup('service:store').createRecord('fake-model', {
        email: 'adsfasdf$',
        name: 'Jose Rene',
        lotteryNumber: 124,
        alibabaNumber: 33,
        legacyCode: 'abc',
        acceptConditions: 1,
        password: 'k$1hkjGd',
        favoriteColor: 'FFFFFF',
        socialSecurity: 12312,
      });

      model.set('password', 'k$1hkjGd');
      model.set('passwordConfirmation', 'k$1hkjGd');
      model.set('images', 'las images');
      model.set('mainstreamCode', '');

      assert.false(model.validate());
      assert.false(model.validate({ except: ['asyncModel', 'otherFake'] }));
      assert.true(model.validate({ except: ['asyncModel', 'otherFake', 'email:email'] }));
    });
  });

  module('when `only` is passed to `validate`', function () {
    test('it it validates only the attributes specifed', function (assert) {
      assert.expect(3);
      const model = this.owner.lookup('service:store').createRecord('fake-model', {
        email: 'adsfasdf$',
        name: 'Jose Rene',
        lotteryNumber: 124,
        alibabaNumber: 33,
        legacyCode: 'abc',
      });

      assert.false(model.validate());
      model.set('email', 'user.name+1');

      assert.false(model.validate({ only: ['email'] }));
      assert.true(model.validate({ only: ['email:presence'] }));
    });
  });
});
