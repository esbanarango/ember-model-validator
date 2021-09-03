import { set } from '@ember/object';
import Validator from 'ember-model-validator/decorators/core-validator';

function modelValidator(Class) {
  @Validator
  class ModelValidator extends Class {
    clearErrors() {
      this._internalModel.getRecord().errors._clear();
      set(this, 'validationErrors', {});
      set(this, 'isValidNow', true);
    }
    pushErrors(errors) {
      let store = this.store;
      let stateToTransition = this.isNew ? 'created.uncommitted' : 'updated.uncommitted';
      this.transitionTo(stateToTransition);
      let recordModel = this.adapterDidInvalidate ? this : this._internalModel;
      store.recordWasInvalid(recordModel, errors);
    }
  }
  return ModelValidator;
}

export default modelValidator;
