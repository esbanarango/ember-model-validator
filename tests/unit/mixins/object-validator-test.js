/* jshint expr:true */
import EmberObject from '@ember/object';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import ObjectValidator from 'ember-model-validator/decorators/object-validator';
import Messages from 'ember-model-validator/messages/pt-br';

describe('ObjectValidator', function () {
  it('Validator on Simple Object', function () {
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
    var subject = ValidatorObjectClass.create();
    subject.name = '';
    expect(subject.validate()).to.equal(false);
    expect(subject.get('errors').errorsFor('name').mapBy('message')[0][0]).to.equal(Messages.presenceMessage);
  });
});
