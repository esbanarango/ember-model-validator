import Model, { attr } from '@ember-data/model';

import Validator, {
  type validationsConfig,
  type ValidatedModel,
} from 'ember-model-validator/decorators/model-validator';

interface OtherModel extends ValidatedModel, Model {}

@Validator
class OtherModel extends Model {
  @attr('string') declare name: string;

  validations: validationsConfig = {
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
