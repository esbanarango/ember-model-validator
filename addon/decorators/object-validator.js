import { A } from '@ember/array';
import { set } from '@ember/object';
import Validator from 'ember-model-validator/decorators/core-validator';

function objectValidator(Class) {
  @Validator
  class ObjectValidator extends Class {
    errors = {
      _errors: A(),

      addObject(error) {
        this._errors.pushObject(error);
      },
      errorsFor(attribute) {
        return A(this._errors.filterBy('attribute', attribute));
      },
    };

    clearErrors() {
      set(this, 'errors._errors', A());
      set(this, 'validationErrors', {});
      set(this, 'isValidNow', true);
    }

    pushErrors(errors) {
      for (let attribute in errors) {
        let messages = errors[attribute];
        this.errors.addObject({ attribute, message: messages.flat() });
      }
    }

    errorsFor(attribute) {
      return this.errors.filterBy('attribute', attribute);
    }

    _modelRelations() {}
  }
  return ObjectValidator;
}

export default objectValidator;
