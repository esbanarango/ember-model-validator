import Model, { attr } from '@ember-data/model';

import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class OtherModel extends Model {
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
