import Model, { attr } from '@ember-data/model';

import { modelValidator, type ValidationsConfig, type ValidatedModel } from 'ember-model-validator';

interface OtherModel extends ValidatedModel, Model {}

@modelValidator
class OtherModel extends Model {
  @attr('string') declare name: string;

  validations: ValidationsConfig = {
    name: {
      presence: true,
    },
    email: {
      presence: true,
      email: true,
    },
  };
}

export default OtherModel;

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'other-model': OtherModel;
  }
}
