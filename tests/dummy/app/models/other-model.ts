import Model, { attr } from '@ember-data/model';

import Validator, { validateOptions } from 'ember-model-validator/decorators/model-validator';

interface OtherModel extends Model {
  validate(options?: validateOptions): boolean;
}

@Validator
class OtherModel extends Model {
  @attr('string') declare name: string;

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
