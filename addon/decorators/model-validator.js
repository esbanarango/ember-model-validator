import { set } from '@ember/object';
import Validator from 'ember-model-validator/decorators/core-validator';

function modelValidator(Class) {
  @Validator
  class ModelValidator extends Class {
    clearErrors() {
      let errors = this.errors;
      errors.clear();
      set(this, 'validationErrors', {});
      set(this, 'isValidNow', true);
    }
    pushErrors(errors) {
      const modelErrors = this.errors;
      Object.keys(errors).forEach(function (error) {
        modelErrors.add(error, errors[error]);
      });
    }
  }
  return ModelValidator;
}

export default modelValidator;
