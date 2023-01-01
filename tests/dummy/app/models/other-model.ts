import Model, { attr } from '@ember-data/model';

import Validator from 'ember-model-validator/decorators/model-validator';

class ModelValidator extends Model {
  validate!: (options?: []) => boolean;
}

@Validator
class OtherModel extends ModelValidator {
  @attr('string') declare name: string;
  @attr('string') declare email: string;

  validations = {
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
