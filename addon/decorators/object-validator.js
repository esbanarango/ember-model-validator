import DS from 'ember-data';
import { set } from '@ember/object';
import Validator from 'ember-model-validator/decorators/core-validator';

function objectValidator(Class) {
  @Validator
  class ObjectValidator extends Class {
    errors = DS.Errors.create();
    clearErrors() {
      set(this, 'errors', DS.Errors.create());
      set(this, 'validationErrors', {});
      set(this, 'isValidNow', true);
    }

    pushErrors(errors) {
      for (let attribute in errors) {
        let messages = errors[attribute];
        this.errors.add(attribute, messages);
      }
    }

    _modelRelations() {}
  }
  return ObjectValidator;
}

export default objectValidator;
