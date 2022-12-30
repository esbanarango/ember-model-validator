import Model, { attr } from '@ember-data/model';

import Validator from 'ember-model-validator/decorators/model-validator';

@Validator
class OtherModel extends Model {
  @attr('string') name;
  @attr('string') email;

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
