import Model, { belongsTo } from '@ember-data/model';
import { modelValidator, type ValidationsConfig, type ValidatedModel } from 'ember-model-validator';
import type FakeModel from './fake-model';

interface AsyncModel extends ValidatedModel, Model {}

@modelValidator
class AsyncModel extends Model {
  @belongsTo('fake-model', { async: false, inverse: 'asyncModel' })
  declare fakeModel: FakeModel;

  validations: ValidationsConfig = {
    fakeModel: {
      presence: true,
    },
  };
}

export default AsyncModel;

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'async-model': AsyncModel;
  }
}
