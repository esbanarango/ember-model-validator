/* jshint expr:true */
import EmberObject from '@ember/object';
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import ObjectValidatorMixin from 'ember-model-validator/mixins/object-validator';
import Messages from 'ember-model-validator/messages/pt-br';

describe('ObjectValidatorMixin', function() {
  it('Validator on Simple Object', function() {
    var ValidatorObject = EmberObject.extend(ObjectValidatorMixin, {
      name: null,
      _locale: 'pt-br',

      init() {
        this._super(...arguments);
        this.validations = {
          name: {
            presence: true
          }
        };
      }
    });
    var subject = ValidatorObject.create({name: ''});
    expect(subject.validate()).to.equal(false);
    expect(subject.get('errors').errorsFor('name').mapBy('message')[0][0]).to.equal(Messages.presenceMessage);
  });
});
