import { set } from '@ember/object';
import coreValidator from './core-validator.js';
import { c } from 'decorator-transforms/runtime-esm';

function modelValidator(constructor) {
  const ModelValidator = c(class ModelValidator extends constructor {
    clearErrors() {
      let errors = this.errors;
      errors.clear();
      set(this, 'validationErrors', {});
      set(this, 'isValidNow', true);
    }
    pushErrors(errors) {
      // This is a hack to support Ember Data 3.28
      if (this._internalModel?.transitionTo) {
        const stateToTransition = this.isNew ? 'created.uncommitted' : 'updated.uncommitted';
        this._internalModel.transitionTo(stateToTransition);
        const recordModel = this.adapterDidInvalidate ? this : this._internalModel;
        this.store.recordWasInvalid(recordModel, errors, 'error');
      } else {
        const modelErrors = this.errors;
        Object.keys(errors).forEach(function (error) {
          modelErrors.add(error, errors[error]);
        });
      }
    }
  }, [coreValidator]);
  return ModelValidator;
}

export { modelValidator as default };
//# sourceMappingURL=model-validator.js.map
