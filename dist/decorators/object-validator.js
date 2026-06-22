import { A } from '@ember/array';
import { set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import coreValidator from './core-validator.js';
import { c, g, i } from 'decorator-transforms/runtime-esm';

function objectValidator(Class) {
  const ObjectValidator = c(class ObjectValidator extends Class {
    static {
      g(this.prototype, "errors", [tracked], function () {
        return {
          _errors: A(),
          errorsFor(attribute) {
            return A(this._errors.filter(error => error.attribute === attribute));
          }
        };
      });
    }
    #errors = (i(this, "errors"), void 0);
    clearErrors() {
      set(this, 'errors', {
        errorsFor: this.errors.errorsFor,
        _errors: A()
      });
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
        errorsObj[attribute].push({
          message: messages.flat()
        });
        set(this, 'errors', {
          ...this.errors,
          ...errorsObj,
          _errors: [...this.errors._errors, {
            attribute,
            message: messages.flat()
          }]
        });
      }
    }
    errorsFor(attribute) {
      return this.errors.errorsFor(attribute);
    }
    _modelRelations() {}
  }, [coreValidator]);
  return ObjectValidator;
}

export { objectValidator as default };
//# sourceMappingURL=object-validator.js.map
