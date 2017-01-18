/* jshint expr:true */
import { expect } from 'chai';
import { describeModel } from 'ember-mocha';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import ObjectValidatorMixin from 'ember-model-validator/mixins/object-validator';
import Messages from 'ember-model-validator/messages/en';

describe('ObjectValidatorMixin', function() {
  it('Validator on Simple Object', function() {
    var ValidatorObject = Ember.Object.extend(ObjectValidatorMixin, {  
      name: null,

      validations: {
        name: {
          presence: true
        }
      }
    });
    var subject = ValidatorObject.create({name: ''});
    expect(subject.validate()).to.equal(false);
    expect(subject.get('errors').errorsFor('name').mapBy('message')[0][0]).to.equal(Messages.presenceMessage);
  });
});
