/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import ValidatorMixin from '../../../mixins/validator';

describe('ValidatorMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    var ValidatorObject = Ember.Object.extend(ValidatorMixin);
    var subject = ValidatorObject.create();
    expect(subject).to.be.ok;
  });
});
