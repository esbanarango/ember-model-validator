import { A } from '@ember/array';
import { set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Validator from 'ember-model-validator/decorators/core-validator';

function objectValidator(Class) {
  @Validator
  class ObjectValidator extends Class {
    @tracked
    errors = {
      _errors: A(),

      errorsFor(attribute) {
        return A(this._errors.filter((error) => error.attribute === attribute));
      },
    };

    clearErrors() {
      set(this, 'errors', { errorsFor: this.errors.errorsFor, _errors: A() });
      set(this, 'validationErrors', {});
      set(this, 'isValidNow', true);
    }

    pushErrors(errors) {
      let errorsObj = {};
      for (let attribute in errors) {
        let messages = errors[attribute];
        if (!errorsObj[attribute]) {
          errorsObj[attribute] = A([]);
        }
        errorsObj[attribute].push({ message: messages.flat() });
        set(this, 'errors', {
          ...this.errors,
          ...errorsObj,
          _errors: [...this.errors._errors, { attribute, message: messages.flat() }],
        });
      }
    }

    errorsFor(attribute) {
      return this.errors.errorsFor(attribute);
    }

    _modelRelations() {}
  }
  return ObjectValidator;
}

export default objectValidator;
